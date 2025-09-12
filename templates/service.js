export default function serviceTemplate(name, type, pluralName) {
  const pascal = capitalize(name); // User
  const camel = name.toLowerCase(); // user
  const space = "";

  return `import getPagination from '@util/request/get-pagination';
    import { ${camel}Repository } from ""@/modules/domain/${pluralName}/${camel}.repository";
    import { index${pascal}Resource, show${pascal}Resource } from "../resources";
    import { generateId } from '@/utils/id-generator';
    import { generatePresignedUrl,deleteS3Object } from  '@util/storage/s3-builder';

// GET ALL with pagination
    export const index = async (req: any) => {
      const { page, limit } = getPagination(req.query);
      const search = req.query.search?.toString()?.replace(/[.*+?^${space}()|[\]\\]/g, '\\$&') || '';

      const ${pluralName} = await ${camel}Repository()
        .select(['id','name'])
        .order('id')
        .orWhereLike('name',search)
        .getWithPaginate(page,limit);
      return index${pascal}Resource(${pluralName});
    };

    // CREATE
     export const store = async (data: any,createdUser: string) => {
      const id = generateId();
      data.id = id;
      data.createdUser = createdUser;
      const ${camel} = await ${camel}Repository.create(data);
      return ${camel};
    };

    // GET SINGLE
    export const show = async (id: string) => {
      const ${camel}: ${pascal} | null = await ${camel}Repository.find(id);
      return show${pascal}Resource(${camel});
    };

    

    // UPDATE
    export const update = async (id: string, data: any) => {
      const existing = await ${camel}Repository.find(Number(data.id));
      if (!existing) return null;
      return ${camel}Repository.update(Number(data.id), data);
    };

    // SOFT DELETE
   export const destroy = async (id: string) => {
      const existing = await ${camel}Repository.find(id);
      if (!existing) return null;
      return ${camel}Repository.softDelete(id, deletedBy);
    };

    // HARD DELETE
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
