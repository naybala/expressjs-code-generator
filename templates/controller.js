export default function controllerTemplate(name, type) {
  const pascal = capitalize(name); // e.g. User
  const camel = name.toLowerCase(); // e.g. user

  return `import { Request, Response } from "express";
import * as baseResponse from "@${type}/base/response";
import * as ${camel}Service from "../services";
import { dd } from '../../../../utils/dd';
import { matchedData } from "express-validator";

/**
 * @route GET /api/${type}/${camel}s    
 * @description Get a paginated list of ${camel}s
 * @access Authenticated
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${camel}s = await ${camel}Service.get(req);
    baseResponse.successResponse(res, ${camel}s, 200);
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to fetch ${camel}s");
  }
};

/**
 * @route POST /api/${type}/${camel}s
 * @description Create a new ${camel}
 * @access Authenticated 
 */
export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    const new${pascal} = await ${camel}Service.store(validated);
    baseResponse.successResponse(res, new${pascal}, 201, "${pascal} created");
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to create ${camel}");
  }
};

/**
 * @route GET /api/${type}/${camel}s/:id
 * @description Get a specific ${camel} by ID
 * @access Authenticated
 */
export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${camel} = await ${camel}Service.show(Number(req.params.id));
    if (!${camel}) {
      baseResponse.errorResponse(res, 404, {}, "${pascal} not found");
      return;
    }
    baseResponse.successResponse(res, ${camel}, 200);
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to fetch ${camel}");
  }
};

/**
 * @route PUT /api/${type}/${camel}s
 * @description Update an existing ${camel}
 * @access Authenticated
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    const updated${pascal} = await ${camel}Service.update(validated);
    if (!updated${pascal}) {
      baseResponse.errorResponse(res, 404, {}, "${pascal} not found");
      return;
    }
    baseResponse.successResponse(res, updated${pascal}, 200, "${pascal} updated");
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to update ${camel}");
  }
};

/**
 * @route DELETE /api/${type}/${camel}s/:id
 * @description Soft delete a ${camel} by ID
 * @access Authenticated
 */
export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ${camel}Service.softDelete(Number(req.params.id));
    if (!deleted) {
      baseResponse.errorResponse(res, 404, {}, "${pascal} not found");
      return;
    }
    baseResponse.successResponse(res, null, 204, "${pascal} deleted");
  } catch (error) {
    baseResponse.errorResponse(res, 500, error, "Failed to delete ${camel}");
  }
};
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
