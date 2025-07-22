export default function repositoryInterfaceTemplate(name) {
  const pascal = capitalize(name);
  return `import { ${pascal} } from "@prisma/client";
    import { BaseRepositoryInterface } from "../base/baseRepository.interface";

    export interface ${pascal}RepositoryInterface extends BaseRepositoryInterface<${pascal}> {
    }
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
