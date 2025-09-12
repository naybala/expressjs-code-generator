export default function resourceIndexTemplate(name) {
  const pascal = capitalize(name);
  const camel = name.toLowerCase();
  return `
  import { PaginationResourceType } from '@web/base/types/paginate';
  import { buildPaginatedResource } from '@web/base/buildPaginatedResource';
  import { ${pascal} } from "@prisma/client";

  type Paginate${pascal}Type = {
  data: ${camel}[];
  } & PaginationResourceType;

  const transform${pascal} = (data: ${camel}) => {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
    }
  }

  export const index${pascal}Resource = (data: Paginate${pascal}Type) => {
    return buildPaginatedResource(data,transform${pascal});
  };

  export const getAll${pascal} = (data: ${camel}[]) => {
    return data.map(transform${pascal});
  };

  export const show${pascal}Resource = (data: ${camel}) => ({
    ...transform${pascal}(data),
  })
`;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
