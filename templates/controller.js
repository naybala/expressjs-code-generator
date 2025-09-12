export default function controllerTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName,
  type
) {
  return `import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as ${pascalName}Service from "../services";

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${repoName} = await ${pascalName}Service.index(req);
    res.successResponse(res, ${repoName}, 200);
  } catch (error) {
    res.failResponse(error);
  }
};

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    if(!req.user?.id) throw new Error('User not found');
    const ${repoName} = await ${pascalName}Service.store(validated, req.user.id);
    res.successResponse(res, ${repoName}, 201, "${pascalName} created");
  } catch (error) {
    res.failResponse(error);
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${repoName} = await ${pascalName}Service.show(req.params.id);
    res.successResponse(res, ${repoName}, 200);
  } catch (error) {
    res.failResponse(error);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    if(!req.user?.id) throw new Error('User not found');
    const ${repoName} = await ${pascalName}Service.update(validated, req.user.id);
    res.successResponse(res, ${repoName}, 200, "${pascalName} updated");
  } catch (error) {
    res.failResponse(error);
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ${pascalName}Service.destroy(req.params.id);
    res.successResponse(res, null, 204, "${pascalName} deleted");
  } catch (error) {
    res.failResponse(error);
  }
};
`;
}
