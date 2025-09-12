export default function repositoryInterfaceTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName
) {
  return `import { ${camelName} } from "@prisma/client";
    import { BaseRepositoryInterface } from "../base/baseRepository.interface";
    export interface ${pascalName}RepositoryInterface extends BaseRepositoryInterface<${camelName}> {
    }
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
