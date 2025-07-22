import { Request } from "express";
    import { tagRepository } from "@spa/domain/tag/tag.repository";
    import { indexTagResource, IndexTagInterface } from "../resources";
    import { showTagResource, ShowTagInterface } from "../resources/show";
    import { Tag } from "@prisma/client";

type TagQueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

// GET ALL with pagination
export const get = async (
  req: Request<any, any, any, TagQueryParams>
): Promise<{
  data: IndexTagInterface[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const search = req.query.search || "";

  const tags = await tagRepository
    .with("role:id,name")
    .order("id", "asc")
    .getWithPaginate(page, limit, search);

  return {
    data: tags.data.map(indexTagResource),
    page: tags.page,
    limit: tags.limit,
    total: tags.total,
    totalPages: tags.totalPages,
  };
};

// GET SINGLE
export const show = async (id: number): Promise<ShowTagInterface | null> => {
  const tag: Tag | null = await tagRepository.find(id);
  return tag ? showTagResource(tag) : null;
};

// CREATE
export const store = async (
  data: Partial<Tag>
): Promise<Tag> => {
  return tagRepository.create(data);
};

// UPDATE
export const update = async (
  data: Partial<Tag>
): Promise<Tag | null> => {
  const existing = await tagRepository.find(Number(data.id));
  if (!existing) return null;
  return tagRepository.update(Number(data.id), data);
};

// SOFT DELETE
export const softDelete = async (
  id: number,
  deletedBy?: number
): Promise<Tag | null> => {
  const existing = await tagRepository.find(id);
  if (!existing) return null;
  return tagRepository.softDelete(id, deletedBy);
};

// HARD DELETE
export const hardDelete = async (
  id: number
): Promise<Tag | null> => {
  const existing = await tagRepository.find(id);
  if (!existing) return null;
  return tagRepository.delete(id);
};