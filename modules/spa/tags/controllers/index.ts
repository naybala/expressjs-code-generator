import { Request, Response } from "express";
import * as baseResponse from "@spa/base/response";
import * as tagService from "../services";
import { dd } from '../../../../utils/dd';
import { matchedData } from "express-validator";

/**
 * @route GET /api/spa/tags    
 * @description Get a paginated list of tags
 * @access Authenticated
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await tagService.get(req);
    baseResponse.successResponse(res, tags, 200);
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to fetch tags");
  }
};

/**
 * @route POST /api/spa/tags
 * @description Create a new tag
 * @access Authenticated 
 */
export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    const newTag = await tagService.store(validated);
    baseResponse.successResponse(res, newTag, 201, "Tag created");
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to create tag");
  }
};

/**
 * @route GET /api/spa/tags/:id
 * @description Get a specific tag by ID
 * @access Authenticated
 */
export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = await tagService.show(Number(req.params.id));
    if (!tag) {
      baseResponse.errorResponse(res, 404, {}, "Tag not found");
      return;
    }
    baseResponse.successResponse(res, tag, 200);
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to fetch tag");
  }
};

/**
 * @route PUT /api/spa/tags
 * @description Update an existing tag
 * @access Authenticated
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    const updatedTag = await tagService.update(validated);
    if (!updatedTag) {
      baseResponse.errorResponse(res, 404, {}, "Tag not found");
      return;
    }
    baseResponse.successResponse(res, updatedTag, 200, "Tag updated");
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to update tag");
  }
};

/**
 * @route DELETE /api/spa/tags/:id
 * @description Soft delete a tag by ID
 * @access Authenticated
 */
export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await tagService.softDelete(Number(req.params.id));
    if (!deleted) {
      baseResponse.errorResponse(res, 404, {}, "Tag not found");
      return;
    }
    baseResponse.successResponse(res, null, 204, "Tag deleted");
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to delete tag");
  }
};