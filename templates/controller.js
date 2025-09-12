export default function controllerTemplate(name, type, pluralName) {
  const pascal = capitalize(name); // e.g. User
  const camel = name.toLowerCase(); // e.g. user

  return `import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as ${camel}Service from "../services";

/**
 * @route GET /api/${type}/${pluralName}    
 * @description Get a paginated list of ${pluralName}
 * @access Authenticated
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${pluralName} = await ${camel}Service.index(req);
    res.successResponse(res, ${pluralName}, 200);
  } catch (error) {
    res.failResponse(error);
  }
};

/**
 * @route POST /api/${type}/${pluralName}
 * @description Create a new ${pluralName}
 * @access Authenticated 
 */
export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    if(!req.user?.id) throw new Error('User not found');
    const new${pascal} = await ${camel}Service.store(validated, req.user.id);
    res.successResponse(res, new${pascal}, 201, "${pascal} created");
  } catch (error) {
    res.failResponse(error);
  }
};

/**
 * @route GET /api/${type}/${pluralName}/:id
 * @description Get a specific ${pluralName} by ID
 * @access Authenticated
 */
export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${camel} = await ${camel}Service.show(Number(req.params.id));
    res.successResponse(res, ${camel}, 200);
  } catch (error) {
    res.failResponse(error);
  }
};

/**
 * @route PUT /api/${type}/${pluralName}
 * @description Update an existing ${pluralName}
 * @access Authenticated
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    if(!req.user?.id) throw new Error('User not found');
    const updated${pascal} = await ${camel}Service.update(validated, req.user.id);
    res.successResponse(res, updated${pascal}, 200, "${pascal} updated");
  } catch (error) {
    res.failResponse(error);
  }
};

/**
 * @route DELETE /api/${type}/${pluralName}/:id
 * @description Soft delete a ${pluralName} by ID
 * @access Authenticated
 */
export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ${camel}Service.softDelete(Number(req.params.id));
    res.successResponse(res, null, 204, "${pascal} deleted");
  } catch (error) {
    res.failResponse(error);
  }
};
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
