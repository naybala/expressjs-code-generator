export default function serviceTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName,
  type
) {
  const space = "";

  return `import getPagination from '@util/request/get-pagination';
    import { ${camelName}Repository } from "@/modules/domain/${repoName}/${camelName}.repository";
    import { index${pascalName}Resource, show${pascalName}Resource } from "../resources";
    import { generateId } from '@/utils/id-generator';
    import { generatePresignedUrl,deleteS3Object } from  '@util/storage/s3-builder';

// GET ALL with pagination
    export const index = async (req: any) => {
      const { page, limit } = getPagination(req.query);
      const search = req.query.search?.toString()?.replace(/[.*+?^${space}()|[\]\\]/g, '\\$&') || '';

      const ${camelName} = await ${camelName}Repository()
        .select(['id','name'])
        .order('id')
        .orWhereLike('name',search)
        .getWithPaginate(page,limit);
      return index${pascalName}Resource(${camelName});
    };

    // CREATE
     export const store = async (data: any,createdUser: string) => {
      const id = generateId(17);
      data.id = id;
      data.createdUser = createdUser;
      const ${camelName}:any = await ${camelName}Repository().create(data);
      return ${camelName};
    };
    // GET SINGLE
    export const show = async (id: string) => {
      const ${camelName}:any = await ${camelName}Repository().find(id);
      return show${pascalName}Resource(${camelName});
    };

    

    // UPDATE
    export const update = async (id: string, data: any) => {
      const existing = await ${camelName}Repository().find(Number(data.id));
      if (!existing) return null;
      return ${camelName}Repository().update(Number(data.id), data);
    };

    // SOFT DELETE
   export const destroy = async (id: string) => {
      const existing = await ${camelName}Repository().find(id);
      if (!existing) return null;
      return ${camelName}Repository().delete(id);
    };

    // HARD DELETE
`;
}
