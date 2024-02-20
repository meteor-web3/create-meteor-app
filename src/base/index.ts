import fs from "fs";
import chalk from "chalk";
import path from "path";
import crlf from "crlf";
import readlineSync from "readline-sync";
import { ethers } from "ethers";
import { gql } from "graphql-request";
import { JSToYaml } from "./tools.js";
import { CreateDappProps, Operation, UpdateDappProps } from "./types.js";
import { createAbstractCompositeDefinition } from "@composedb/devtools";
import { client } from "@meteor-web3/dapp-table-client";

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

  Object.keys(models).map(key => {
    try {
      createAbstractCompositeDefinition(models[key]);
    } catch (error) {
      console.log(
        chalk.red(
          `🚨 Error in ${key}: ${(error as Error).toString().split("\n")[0]}`,
        ),
      );
      throw error;
    }
  });

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

  console.log("🚀 Generating dapp mutation params...");

  const input = {
    defaultFolderName: params.defaultFolderName,
    description: params.description,
    logo: params.logo,
    feePoint:
      params.feeRatio || params.feeRatio === 0
        ? parseFloat(params.feeRatio) * 10000
        : null,
    environment: "",
    models: params.models.concat(
      fileSystemModels.map((model: string) => {
        return {
          isPublicDomain: false,
          schema: model,
          encryptable: [],
          feePoint: null,
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
