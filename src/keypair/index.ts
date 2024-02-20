import chalk from "chalk";
import { ethers } from "ethers";

export function generateKeyPair() {
  console.log("🔐 Generating private key pair...");
  const privateKey = ethers.Wallet.createRandom().privateKey;
  const wallet = new ethers.Wallet(privateKey);
  const publickKey = wallet.publicKey;
  const address = wallet.address;
  console.log(chalk.green("✅ Done!"));
  console.log();
  console.log(`👤 Address: ${chalk.blue(address)}`);
  console.log(`🔑 Private Key: ${chalk.yellow(privateKey)}`);
  console.log(`🔑 Public Key: ${chalk.yellow(publickKey)}`);
  console.log();
}
