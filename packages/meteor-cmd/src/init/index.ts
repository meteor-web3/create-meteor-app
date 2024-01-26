import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs-extra";
import semver from "semver";
import validateProjectName from "validate-npm-package-name";
import path from "path";
import https from "https";

export async function init(projectName: string, packageJson: any) {
  // check node version
  if (!semver.satisfies(semver.coerce(process.version)!, ">=16")) {
    console.log(
      chalk.red(
        `🚨 Node version ${
          process.version
        } is too low. Please update to Node ${chalk.green(
          16,
        )} or higher for a better supported experience.`,
      ),
    );
    process.exit(1);
  }

  // check package version
  checkForLatestVersion(packageJson.name)
    .catch(() => {
      try {
        return execSync(`npm view ${packageJson.name} version`)
          .toString()
          .trim();
      } catch (e) {
        return null;
      }
    })
    .then((latest: any) => {
      console.log(
        `🚥 The latest version of ${chalk.blue(
          packageJson.name,
        )} is ${chalk.blue(latest)}.`,
      );

      if (latest && semver.lt(packageJson.version, latest)) {
        console.log(
          chalk.red(
            `🚨 You are running ${packageJson.name} ${packageJson.version}, which is behind the latest release (${latest}).`,
          ),
        );
        console.log();
        console.log(
          chalk.yellow(
            `💡 We recommend always using the latest version ${chalk.green(
              latest,
            )} if possible.`,
          ),
        );
        console.log();
        console.log(chalk.grey(`   pnpm update -g ${packageJson.name}`));
        console.log();
      } else {
        initApp(projectName);
      }
    });

  // check if git is installed
  if (checkIsGitInstalled() === "undefined") {
    console.log(
      chalk.red("🚨 Git is not installed. Please install git and try again."),
    );
    process.exit(1);
  }
}

function initApp(appName: string) {
  checkAppName(appName);

  let root = process.cwd();
  const currentFolerName = path.basename(root);
  if (currentFolerName !== appName) {
    root = path.resolve(appName);
    fs.ensureDirSync(appName);
  }
  process.chdir(root);

  console.log("🚎 Initing meteor app...");

  const cmdClone = `git clone --quiet https://github.com/meteor-web3/dapp-examples.git .`;
  try {
    execSync(`${cmdClone}`);
  } catch (error) {
    console.log(chalk.red("🚨 Fetch code failed."));
    if (currentFolerName !== appName) {
      fs.rmSync(`../${appName}`, { recursive: true });
    }
    throw error;
  }

  console.log("🛟 Preparing...");

  const selectedFoler: string = "base";
  reconstructExampleCode(selectedFoler);

  console.log(chalk.green("✅ Done!"));
  console.log("✨ To get started:");
  console.log();
  if (currentFolerName !== appName) {
    console.log(`📦 cd ${chalk.green(appName)}`);
  }
  console.log(`🔧 add your data models into ${chalk.green("./models")}`);
  console.log(`🔧 configure your dapp in ${chalk.green("meteor.config.ts")}`);
  console.log(chalk.grey("   meteor deploy"));
  console.log(chalk.grey("   pnpm install"));
  console.log(chalk.grey("   pnpm build"));
  console.log(chalk.grey("   pnpm dev"));
  console.log();
}

function checkForLatestVersion(packageName: string) {
  console.log("🚧 Checking package version...");
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://registry.npmjs.org/-/package/${packageName}/dist-tags`,
        (res: any) => {
          if (res.statusCode === 200) {
            let body = "";
            res.on("data", (data: string) => (body += data));
            res.on("end", () => {
              resolve(JSON.parse(body).latest);
            });
          } else {
            reject();
          }
        },
      )
      .on("error", () => {
        reject();
      });
  });
}

function checkAppName(appName: string) {
  console.log("🚔 Validating app name...");
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.log(
      chalk.red(
        `🚨 Cannot create a project named ${chalk.green(
          `"${appName}"`,
        )} because of npm naming restrictions:\n`,
      ),
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach(error => {
      console.log(chalk.red(`  * ${error}`));
    });
    console.log(chalk.red("\nPlease choose a different project name."));
    process.exit(1);
  }
}

function checkIsGitInstalled() {
  let gitVersion: string;
  try {
    gitVersion = execSync("git --version").toString().trim();
  } catch (err) {
    console.log(
      chalk.red("🚨 Git is not installed. Please install git and try again."),
    );
    process.exit(1);
  }
  return gitVersion;
}

function reconstructExampleCode(targetFolder: string) {
  fs.copySync(`./packages/${targetFolder}`, `./${targetFolder}`);

  fs.readdirSync(".", { withFileTypes: true }).forEach(entry => {
    const entryPath = entry.name;
    if (entryPath !== targetFolder) {
      if (entry.isDirectory()) {
        fs.rmSync(entryPath, { recursive: true });
      } else {
        fs.unlinkSync(entryPath);
      }
    }
  });

  fs.readdirSync(targetFolder, { withFileTypes: true }).forEach(entry => {
    const entryPath = path.join(targetFolder, entry.name);
    const newPath = path.join(".", entry.name);
    fs.renameSync(entryPath, newPath);
  });

  fs.rmSync(targetFolder, { recursive: true });
}
