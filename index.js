#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

// Template imports (always relative to this script)
import controllerTemplate from "./templates/controller.js";
import resourceIndexTemplate from "./templates/resourceIndex.js";
import resourceShowTemplate from "./templates/resourceShow.js";
import routeTemplate from "./templates/route.js";
import serviceTemplate from "./templates/service.js";
import validationTemplate from "./templates/validation.js";
import repositoryTemplate from "./templates/repository.js";
import repositoryInterfaceTemplate from "./templates/repositoryInterface.js";

// Use __dirname only to resolve template imports, NOT for output paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set projectRoot = where user called the CLI
const projectRoot = process.cwd();

async function main() {
  const { type, name: rawName } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What module should the feature be generated under?",
      choices: ["mobile", "spa", "web"],
    },
    {
      type: "input",
      name: "name",
      message: "Name of the feature to generate:",
    },
  ]);

  const typeFolder = type.toLowerCase(); // 'web', 'mobile', or 'spa'
  const featureName = rawName.trim().toLowerCase();
  const pascalName = capitalize(featureName);
  const camelName = featureName;

  // DOMAIN
  const domainDir = path.join(projectRoot, "modules", "domain", camelName);
  await fs.ensureDir(domainDir);
  await fs.writeFile(
    path.join(domainDir, `${camelName}.repository.ts`),
    repositoryTemplate(featureName)
  );
  await fs.writeFile(
    path.join(domainDir, `${camelName}Repository.interface.ts`),
    repositoryInterfaceTemplate(featureName)
  );

  // MODULE
  const featureDir = path.join(
    projectRoot,
    "modules",
    typeFolder,
    `${camelName}s`
  );
  const entries = {
    "controllers/index.ts": controllerTemplate(featureName, typeFolder),
    "resources/index.ts": resourceIndexTemplate(featureName),
    "resources/show.ts": resourceShowTemplate(featureName),
    "routes/index.ts": routeTemplate(featureName, typeFolder),
    "services/index.ts": serviceTemplate(featureName, typeFolder),
    "validations/index.ts": validationTemplate(featureName),
  };

  try {
    for (const [relPath, content] of Object.entries(entries)) {
      const outPath = path.join(featureDir, relPath);
      await fs.ensureDir(path.dirname(outPath));
      await fs.writeFile(outPath, content.trim());
    }
    console.log(`"${pascalName}" feature generated successfully!`);
    console.log(`Domain: modules/domain/${camelName}`);
    console.log(`Feature: modules/${typeFolder}/${camelName}s`);
  } catch (err) {
    console.error("Error creating files:", err);
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

main().catch((err) => console.error("Unexpected Error:", err));
