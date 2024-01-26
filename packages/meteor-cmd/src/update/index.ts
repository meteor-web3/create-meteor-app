import chalk from "chalk/index.js";
import { writeToOutput } from "../base/tools.js";
import { updateDapp } from "@meteor-web3/dapp-table-client";
import { getMutateDappProps } from "../base/index.js";
import { Operation, UpdateDappProps } from "../base/types.js";

export const update = async () => {
  const updateProps = (await getMutateDappProps(
    Operation.Update,
  )) as UpdateDappProps;

  console.log(`📡 Updating for dapp: ${chalk.blue(updateProps.dappId)}...`);

  let updateRes: any;
  try {
    updateRes = await updateDapp(updateProps);
  } catch (error: any) {
    console.error(error?.response?.errors?.[0] ?? error);
    throw error;
  }

  console.log(chalk.green("✅ Update dapp successfully."));

  try {
    writeToOutput(updateRes);
  } catch (error) {
    console.log("🚨 Failed to write to output directory.");
    throw error;
  }

  console.log(
    `✨ You can check the dapp info in ${chalk.green("output/app.json")}`,
  );
  console.log();
};
