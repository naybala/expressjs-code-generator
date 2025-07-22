export default function resourceShowTemplate(name) {
  const pascal = capitalize(name);
  const camel = name.toLowerCase();
  return `import { ${pascal} } from "@prisma/client";

    export interface Show${pascal}Interface {
    id: number,
    name: string,
    }

    export function show${pascal}Resource(${camel}: ${pascal}): Show${pascal}Interface {
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
