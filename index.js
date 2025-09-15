#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import pluralize from "pluralize";
import _ from "lodash";
import { fileURLToPath } from "url";
import ora from "ora";

// Template imports
import controllerTemplate from "./templates/controller.js";
import resourceIndexTemplate from "./templates/resourceIndex.js";
import routeTemplate from "./templates/route.js";
import serviceTemplate from "./templates/service.js";
import validationTemplate from "./templates/validation.js";
import repositoryTemplate from "./templates/repository.js";
import repositoryInterfaceTemplate from "./templates/repositoryInterface.js";

// __dirname workaround for ESM (used for template imports only)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const waitingTime = 2000;

const projectRoot = process.cwd();

async function main() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want to generate?",
      choices: ["Mobile", "Spa", "Web"],
    },
    {
      type: "input",
      name: "name",
      message: "Name of the feature to generate for example 'User' : ",
    },
  ]);

  const type = answers.type; // e.g. Web
  const name = answers.name.toLowerCase(); // 'user'
  const pluralName = pluralize(name); // 'users'
  const pascalName = _.upperFirst(_.camelCase(answers.name)); // 'User'
  const camelName = _.camelCase(answers.name); // 'user'
  const repoName = pluralize(camelName);

  // Output all
  // console.log("name:", name);
  // console.log("pluralName:", pluralName);
  // console.log("pascalName:", pascalName);
  // console.log("camelName:", camelName);
  // console.log("repoName:", repoName);

  // Paths
  const domainPath = path.join(projectRoot, "modules", "domain", repoName);
  const modulePath = path.join(projectRoot, "modules", type, `${camelName}s`);

  // Check if feature already exists
  if (fs.existsSync(domainPath) || fs.existsSync(modulePath)) {
    console.log(
      `Feature "${pascalName}" already exists in one of the following paths:`
    );
    if (fs.existsSync(domainPath)) console.log(` - ${domainPath}`);
    if (fs.existsSync(modulePath)) console.log(` - ${modulePath}`);

    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Do you want to overwrite the existing feature?",
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log("Feature generation aborted.");
      return;
    } else {
      console.log("Overwriting existing feature...");
    }
  }

  // Spinner for generation
  const spinner = ora(`Generating "${pascalName}" feature...`).start();

  try {
    // Artificial delay to simulate loading
    await new Promise((resolve) => setTimeout(resolve, waitingTime));

    // === DOMAIN FILES ===
    await fs.ensureDir(domainPath);

    const domainFiles = [
      {
        filename: `${camelName}.repository.ts`,
        content: repositoryTemplate(
          name,
          pluralName,
          pascalName,
          camelName,
          repoName
        ),
      },
      {
        filename: `${camelName}Repository.interface.ts`,
        content: repositoryInterfaceTemplate(
          name,
          pluralName,
          pascalName,
          camelName,
          repoName
        ),
      },
    ];

    for (const file of domainFiles) {
      const fullPath = path.join(domainPath, file.filename);
      await fs.writeFile(fullPath, file.content);
      console.log(`\x1b[32m✓\x1b[0m Created ${fullPath}`);
    }

    // === MODULE FILES ===
    const basePath = path.join(projectRoot, "modules", type, `${camelName}s`);
    const files = {
      "controllers/index.ts": controllerTemplate(
        name,
        pluralName,
        pascalName,
        camelName,
        repoName,
        type
      ),
      "resources/index.ts": resourceIndexTemplate(
        name,
        pluralName,
        pascalName,
        camelName,
        repoName,
        type
      ),
      "routes/index.ts": routeTemplate(
        name,
        pluralName,
        pascalName,
        camelName,
        repoName,
        type
      ),
      "services/index.ts": serviceTemplate(
        name,
        pluralName,
        pascalName,
        camelName,
        repoName,
        type
      ),
      "validations/index.ts": validationTemplate(
        name,
        pluralName,
        pascalName,
        camelName,
        repoName,
        type
      ),
    };

    for (const [relativePath, content] of Object.entries(files)) {
      const fullPath = path.join(basePath, relativePath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content.trim());
      console.log(`\x1b[32m✓\x1b[0m Created ${fullPath}`);
    }

    spinner.succeed(`"${pascalName}" feature generated successfully!`);
    console.log(
      `"${pascalName}" feature generated under "modules/${type.toLowerCase()}/${camelName}s"`
    );
  } catch (err) {
    spinner.fail("Failed to generate feature.");
    console.error(err);
  }
}

main().catch((err) => console.error("Error:", err));
