import fs from "fs";
import chalk from "chalk";
import path from "path";
import crlf from "crlf";
import readlineSync from "readline-sync";
import { ethers, Contract, BigNumber, utils } from "ethers";
import { gql } from "graphql-request";
import { JSToYaml } from "./tools.js";
import { CreateDappProps, Operation, UpdateDappProps } from "./types.js";
import { Composite } from "@composedb/devtools";
import { client } from "@meteor-web3/dapp-table-client";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { getResolver } from "key-did-resolver";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { fromString } from "uint8arrays/from-string";

export async function getMutateDappProps(
  operation: Operation,
): Promise<CreateDappProps | UpdateDappProps> {
  const privateKey = readlineSync.question(
    chalk.yellow("🔑 Please input your private-key: "),
    {
      hideEchoBack: true,
    },
  );

  const address = validatePrivateKey(privateKey);
  console.log(
    `👤 ${
      operation === Operation.Create ? "Deploy" : "Update"
    } with account ${chalk.blue(address)}`,
  );

  console.log("🚌 Reading custom meteor models...");
  let models: Record<string, string>;
  try {
    models = await getCustomModels();
  } catch (error) {
    console.log(
      chalk.red(`🚨 Can not read models, please check your models directory.`),
    );
    throw error;
  }
  console.log("🚄 Reading meteor config...");
  const configPath = process.cwd() + "/meteor.config.ts";
  const params = {} as any;

  try {
    const data = fs.readFileSync(configPath);
    const dataStr = data.toString();
    eval(
      `${dataStr
        .substring(dataStr.indexOf("export") + "export".length)
        .trim()} Object.assign(params, config)`,
    );
  } catch (err) {
    console.log(chalk.red(`🚨 Can not read ${configPath}`));
    throw err;
  }

  if (!params.name) {
    console.log(chalk.red(`🚨 The name cannot be empty in meteor config.`));
    throw new Error("Invalid app name");
  }

  // Object.keys(models).map(key => {
  //   try {
  //     createAbstractCompositeDefinition(models[key]);
  //   } catch (error) {
  //     console.log(
  //       chalk.red(
  //         `🚨 Error in ${key}: ${(error as Error).toString().split("\n")[0]}`,
  //       ),
  //     );
  //     throw error;
  //   }
  // });

  console.log("🛫 Reading file system models...");
  let fileSystemModels: any;
  try {
    fileSystemModels = await getFileSystemModels();
  } catch (error) {
    console.log(chalk.red(`🚨 Get file system models failed.`));
    throw error;
  }

  params.models = params.models.map((model: any) => {
    return {
      isPublicDomain: model.isPublicDomain,
      schema: models[model.schemaName],
      encryptable: model.encryptable,
      feePoint:
        params.feeRatio || params.feeRatio === 0
          ? parseFloat(params.feeRatio) * 10000
          : null,
    };
  });

  const resolver = getResolver();
  const did = new DID({
    resolver: resolver,
    provider: new Ed25519Provider(fromString(privateKey, "base16")),
  });
  await did.authenticate();

  const ceramic = new CeramicClient(
    params.ceramicUrl ?? "https://testnet.dataverseceramicdaemon.com/",
  );
  ceramic.did = did;

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.blockpi.network/v1/rpc/public",
  );
  const signer = new ethers.Wallet(privateKey, provider);
  const abi = [
    {
      type: "function",
      name: "getDeployerBalance",
      inputs: [{ name: "deployer", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getRegisterFee",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
  ];
  const contractAddress = "0x0Fa654E438163c899549acaB863178205607A88F";
  const tokenUnit = "Matic";
  const contract = new Contract(contractAddress, abi, signer);

  const fee = await contract.getRegisterFee();
  const balance = await contract.getDeployerBalance(address);

  if (fee.gt(BigNumber.from("0")) && balance.lt(fee)) {
    const walletBalance = await signer.getBalance();
    console.log();
    console.log(
      chalk.blue(
        `   Register fee: ${utils.formatEther(fee)} ${tokenUnit}
   Contract Deployer balance: ${utils.formatEther(balance)} ${tokenUnit}`,
      ),
    );
    console.log(chalk.red("🚨 Insufficient deployer balance"));
    console.log();
    console.log(
      chalk.blue(
        `   Wallet balance: ${utils.formatEther(walletBalance)} ${tokenUnit}`,
      ),
    );
    if (walletBalance.lt(fee.sub(balance))) {
      console.log(
        chalk.red(
          `🚨 Insufficient wallet balance to transfer ${utils.formatEther(
            fee.sub(balance),
          )} ${tokenUnit} to the dapp table registry contract to complete application deployment`,
        ),
      );
      process.exit(0);
    }

    const res = readlineSync.question(
      chalk.yellow(
        `   This operation will transfer ${utils.formatEther(
          fee.sub(balance),
        )} ${tokenUnit} to the dapp table registry contract to complete application deployment. Enter (yes) and press enter to continue, enter another key to cancel: `,
      ),
    );

    if (res === "yes") {
      await signer.sendTransaction({
        to: contractAddress,
        value: fee.sub(balance),
      });
    } else {
      process.exit(0);
    }
  } else {
    console.log(
      chalk.blue(
        `   Register fee: ${utils.formatEther(fee)} ${tokenUnit}
   Contract Deployer balance: ${utils.formatEther(balance)} ${tokenUnit}`,
      ),
    );
    const res = readlineSync.question(
      chalk.yellow(
        `   This operation will deduct ${utils.formatEther(
          fee,
        )} ${tokenUnit} from your contract deployer balance of the dapp table registry contract to complete application deployment. Enter (yes) and press enter to continue, enter another key to cancel: `,
      ),
    );
    if (res !== "yes") {
      process.exit(0);
    }
  }

  const schemaModelIdRecord = Object.fromEntries(
    await Promise.all(
      params.models
        .map((model: { schema: string }) => model.schema)
        .concat(fileSystemModels)
        .map(async (schema: string) => {
          const composite = await Composite.create({
            ceramic,
            schema,
            index: false,
          });
          return [
            schema,
            Object.keys(
              composite.toJSON()["models" as keyof typeof composite],
            )[0],
          ];
        }),
    ),
  );
  // const composite = await Composite.create({
  //   ceramic,
  //   schema: jointSchema,
  //   index: false,
  // });
  // console.log(JSON.stringify(composite.toJSON()));

  console.log("🚀 Generating dapp mutation params...");

  const input = {
    defaultFolderName: params.defaultFolderName,
    description: params.description,
    logo: params.logo,
    feePoint:
      params.feeRatio || params.feeRatio === 0
        ? parseFloat(params.feeRatio) * 10000
        : null,
    environment: null,
    models: params.models
      .map((model: { schema: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          ...model,
          modelId: schemaModelIdRecord[model.schema],
        };
      })
      .concat(
        fileSystemModels.map((model: string) => {
          return {
            isPublicDomain: false,
            schema: model,
            encryptable: [],
            feePoint: null,
            modelId: schemaModelIdRecord[model],
          };
        }),
      ),
    name: params.name,
    website: params.website,
    ceramicUrl: params.ceramicUrl,
  };

  const origin = convertToYaml(input)!;

  const signature = await signMessage(origin, privateKey);

  if (operation === Operation.Create) {
    return {
      input,
      message: {
        did: did.id,
        origin,
        signature,
      },
    } as CreateDappProps;
  } else {
    const outputPath = process.cwd() + "/output/app.json";
    let appJson: any;
    try {
      const data = fs.readFileSync(outputPath);
      appJson = JSON.parse(data.toString());
    } catch (err) {
      console.log(chalk.red(`🚨 Can not read ${outputPath}`));
      throw err;
    }

    return {
      dappId: appJson.id,
      input,
      message: {
        origin,
        signature,
      },
    } as UpdateDappProps;
  }
}

const validatePrivateKey = (privateKey: string) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
  } catch (error) {
    console.log(
      chalk.red("🚨 Invalid private key, please check and try again."),
    );
    process.exit(0);
  }
};

const convertToYaml = (obj: object) => {
  const str = JSToYaml.stringify(obj).value;
  return str;
};

const signMessage = async (msg: string, privateKey: string) => {
  const provider = ethers.getDefaultProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  return await signer.signMessage(msg);
};

const getCustomModels = async () => {
  const schemas: Record<string, string> = {};

  const __rootModelsDirname = `${process.cwd()}/models`;
  await _readModels(schemas, __rootModelsDirname);
  return schemas;
};

const getFileSystemModels = async () => {
  const query = gql`
    query RootQuery() {
      getFileSystemModels()
    }
  `;
  try {
    const res: any = await client.request(query);
    return res.getFileSystemModels;
  } catch (error: any) {
    throw error?.response?.errors?.[0] ?? error;
  }
};

const _readModels = async (
  schemas: Record<string, string>,
  basePath: string,
) => {
  const models = fs.readdirSync(basePath);
  await Promise.all(
    models.map(async targetName => {
      if (targetName === "fs") {
        return;
      }

      const targetPath = path.resolve(basePath, targetName);

      if (fs.statSync(targetPath).isFile()) {
        const endingType = await new Promise(resolve => {
          crlf.get(
            `${basePath}/${targetName}`,
            null,
            function (_: any, endingType: any) {
              resolve(endingType);
            },
          );
        });

        if (endingType === "CRLF") {
          await new Promise(resolve => {
            crlf.set(`${basePath}/${targetName}`, "LF", function () {
              resolve("");
            });
          });
        }

        schemas[targetName] = fs
          .readFileSync(targetPath, { encoding: "utf8" })
          .replaceAll("\n", "");
      }

      if (fs.statSync(targetPath).isDirectory()) {
        await _readModels(schemas, targetPath);
      }
    }),
  );
};
