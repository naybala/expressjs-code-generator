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

// __dirname workaround for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const waitingTime = 2000;

const projectRoot = process.cwd();

const collectFields = async () => {
  const fields = [];

  let addMore = true;

  while (addMore) {
    const { fieldName, fieldType } = await inquirer.prompt([
      {
        type: "input",
        name: "fieldName",
        message: "Enter the field name (e.g. 'email'):",
        validate: (input) => !!input || "Field name cannot be empty.",
      },
      {
        type: "list",
        name: "fieldType",
        message: "Choose the field type:",
        choices: ["string", "number", "boolean"],
      },
    ]);

    fields.push({ name: fieldName, type: fieldType });

    const { continueAdding } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continueAdding",
        message: "Do you want to add another field?",
      },
    ]);
    addMore = continueAdding;
  }

  return fields;
};

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
      message: "Name of the feature to generate (e.g. 'User'):",
    },
    {
      type: "confirm",
      name: "addMoreFields",
      message: "Do you want to add more fields except id for this feature?",
      default: false,
    },
  ]);

  let extraFields = [];

  if (answers.addMoreFields) {
    extraFields = await collectFields();
  }

  const type = answers.type;
  const name = answers.name.toLowerCase();
  const pluralName = pluralize(name);
  const pascalName = _.upperFirst(_.camelCase(answers.name));
  const camelName = _.camelCase(answers.name);
  const repoName = pluralize(camelName);

  // Paths
  const domainPath = path.join(projectRoot, "modules", "domain", repoName);
  const modulePath = path.join(projectRoot, "modules", type, `${camelName}s`);

  // Check if feature already exists
  if (fs.existsSync(domainPath) || fs.existsSync(modulePath)) {
    console.log(`Feature "${pascalName}" already exists:`);
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

  const spinner = ora(`Generating "${pascalName}" feature...`).start();

  try {
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
        type,
        extraFields
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
        type,
        extraFields
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
