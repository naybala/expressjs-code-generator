#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import pluralize from "pluralize";
import _ from "lodash";
import { fileURLToPath } from "url";

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
  // OwnLicense
  // Convert to lower case for general base name
  const name = answers.name.toLowerCase(); // 'ownlicense'

  // Pluralize the base name
  const pluralName = pluralize(name); // 'ownlicenses'

  // Convert to PascalCase
  const pascalName = _.upperFirst(_.camelCase(answers.name)); // 'OwnLicense'

  // Convert to camelCase
  const camelName = _.camelCase(answers.name); // 'ownLicense'

  const repoName = pluralize(camelName);

  // Output all
  console.log("name:", name);
  console.log("pluralName:", pluralName);
  console.log("pascalName:", pascalName);
  console.log("camelName:", camelName);
  console.log("repoName:", repoName);

  // === DOMAIN FILES ===
  const domainPath = path.join(projectRoot, "modules", "domain", repoName);
  await fs.ensureDir(domainPath);

  await fs.writeFile(
    path.join(domainPath, `${camelName}.repository.ts`),
    repositoryTemplate(name, pluralName, pascalName, camelName, repoName)
  );
  await fs.writeFile(
    path.join(domainPath, `${camelName}Repository.interface.ts`),
    repositoryInterfaceTemplate(
      name,
      pluralName,
      pascalName,
      camelName,
      repoName
    )
  );

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

  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const fullPath = path.join(basePath, relativePath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content.trim());
    }
  } catch (err) {
    console.error("Failed to create module files:", err);
  }

  console.log(
    `"${pascalName}" feature generated under "modules/${type.toLowerCase()}/${camelName}s"`
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

main().catch((err) => console.error("Error:", err));
