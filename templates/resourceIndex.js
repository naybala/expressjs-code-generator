export default function resourceIndexTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName,
  type
) {
  return `
  import { PaginationResourceType } from '@web/base/types/paginate';
  import { buildPaginatedResource } from '@web/base/buildPaginatedResource';
  import { ${camelName} } from "@prisma/client";

  type Paginate${pascalName}Type = {
  data: ${camelName}[];
  } & PaginationResourceType;

  const transform${pascalName} = (data: ${camelName}) => {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
    }
  }

  export const index${pascalName}Resource = (data: Paginate${pascalName}Type) => {
    return buildPaginatedResource(data,transform${pascalName});
  };

  export const getAll${pascalName} = (data: ${camelName}[]) => {
    return data.map(transform${pascalName});
  };

  export const show${pascalName}Resource = (data: ${camelName}) => ({
    ...transform${pascalName}(data),
  })
`;
}
