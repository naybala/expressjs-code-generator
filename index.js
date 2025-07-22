#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

// Template imports
import controllerTemplate from "./templates/controller.js";
import resourceIndexTemplate from "./templates/resourceIndex.js";
import resourceShowTemplate from "./templates/resourceShow.js";
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
      message: "Name of the feature to generate:",
    },
  ]);

  const type = answers.type; // e.g. Web
  const name = answers.name.toLowerCase(); // e.g. user
  const pascalName = capitalize(name); // e.g. User
  const camelName = name.toLowerCase(); // e.g. user

  // === DOMAIN FILES ===
  const domainPath = path.join(projectRoot, "modules", "domain", name);
  await fs.ensureDir(domainPath);

  await fs.writeFile(
    path.join(domainPath, `${name}.repository.ts`),
    repositoryTemplate(name)
  );
  await fs.writeFile(
    path.join(domainPath, `${name}Repository.interface.ts`),
    repositoryInterfaceTemplate(name)
  );

  // === MODULE FILES ===
  const basePath = path.join(projectRoot, "modules", type, `${camelName}s`);
  const files = {
    "controllers/index.ts": controllerTemplate(name, type),
    "resources/index.ts": resourceIndexTemplate(name),
    "resources/show.ts": resourceShowTemplate(name),
    "routes/index.ts": routeTemplate(name, type),
    "services/index.ts": serviceTemplate(name, type),
    "validations/index.ts": validationTemplate(name),
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
