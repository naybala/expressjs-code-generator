export default function resourceIndexTemplate(name) {
  const pascal = capitalize(name);
  const camel = name.toLowerCase();
  return `import { ${pascal} } from "@prisma/client";

    export interface Index${pascal}Interface {
    id: number,
    name: string,
    }

    export function index${pascal}Resource(${camel}: ${pascal}): Index${pascal}Interface {
    return {
        id: ${camel}.id,
        name: ${camel}.name ?? '',
    };
    }
`;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
