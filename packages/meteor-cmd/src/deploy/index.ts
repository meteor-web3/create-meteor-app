import chalk from "chalk/index.js";
import { writeToOutput } from "../base/tools.js";
import { createDapp } from "@meteor-web3/dapp-table-client";
import { getMutateDappProps } from "../base/index.js";
import { CreateDappProps, Operation } from "../base/types.js";

export const deploy = async () => {
  const createProps = (await getMutateDappProps(
    Operation.Create,
  )) as CreateDappProps;

  console.log(`📡 Creating ${chalk.blueBright(createProps.input.name)}...`);

  let createRes;
  try {
    createRes = await createDapp(createProps);
  } catch (error: any) {
    console.error(error?.response?.errors?.[0] ?? error);
    throw error;
  }

  if (createRes.feePoint || createRes.feePoint === 0) {
    (createRes as any).feeRatio = createRes.feePoint / 10000;
    delete (createRes as any).feePoint;
  }
  createRes.models.forEach(model => {
    if (model.feePoint || model.feePoint === 0) {
      (model as any).feeRatio = model.feePoint / 10000;
      delete (model as any).feePoint;
    }
  });

  console.log(
    chalk.green(
      `✅ Create successfully, dapp-id is ${chalk.blue(createRes.id)}`,
    ),
  );

  try {
    writeToOutput(createRes);
  } catch (error) {
    console.log("🚨 Failed to write to output directory.");
    throw error;
  }

  console.log(
    `✨ You can check the dapp info in ${chalk.green("output/app.json")}`,
  );
  console.log();
};
