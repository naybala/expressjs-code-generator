export default function serviceTemplate(name, type) {
  const pascal = capitalize(name); // User
  const camel = name.toLowerCase(); // user

  return `import { Request } from "express";
    import { ${camel}Repository } from "@${type}/domain/${camel}/${camel}.repository";
    import { index${pascal}Resource, Index${pascal}Interface } from "../resources";
    import { show${pascal}Resource, Show${pascal}Interface } from "../resources/show";
    import { ${pascal} } from "@prisma/client";

type ${pascal}QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

// GET ALL with pagination
export const get = async (
  req: Request<any, any, any, ${pascal}QueryParams>
): Promise<{
  data: Index${pascal}Interface[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const search = req.query.search || "";

  const ${camel}s = await ${camel}Repository
    .with("role:id,name")
    .order("id", "asc")
    .getWithPaginate(page, limit, search);

  return {
    data: ${camel}s.data.map(index${pascal}Resource),
    page: ${camel}s.page,
    limit: ${camel}s.limit,
    total: ${camel}s.total,
    totalPages: ${camel}s.totalPages,
  };
};

// GET SINGLE
export const show = async (id: number): Promise<Show${pascal}Interface | null> => {
  const ${camel}: ${pascal} | null = await ${camel}Repository.find(id);
  return ${camel} ? show${pascal}Resource(${camel}) : null;
};

// CREATE
export const store = async (
  data: Partial<${pascal}>
): Promise<${pascal}> => {
  return ${camel}Repository.create(data);
};

// UPDATE
export const update = async (
  data: Partial<${pascal}>
): Promise<${pascal} | null> => {
  const existing = await ${camel}Repository.find(Number(data.id));
  if (!existing) return null;
  return ${camel}Repository.update(Number(data.id), data);
};

// SOFT DELETE
export const softDelete = async (
  id: number,
  deletedBy?: number
): Promise<${pascal} | null> => {
  const existing = await ${camel}Repository.find(id);
  if (!existing) return null;
  return ${camel}Repository.softDelete(id, deletedBy);
};

// HARD DELETE
export const hardDelete = async (
  id: number
): Promise<${pascal} | null> => {
  const existing = await ${camel}Repository.find(id);
  if (!existing) return null;
  return ${camel}Repository.delete(id);
};
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
