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
    const ${repoName}:any = await ${pascalName}Service.index(req);
    res.successResponse(${repoName}, "${pascalName} index success");
  } catch (error) {
    res.failResponse(error);
  }
};

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = matchedData(req, { locations: ["body"] });
    if(!req.user?.id) throw new Error('User not found');
    const ${repoName}:any = await ${pascalName}Service.store(validated, req.user.id);
    res.successResponse(${repoName}, "${pascalName} create success");
  } catch (error) {
    res.failResponse(error);
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const ${repoName}:any = await ${pascalName}Service.show(req.params.id);
    res.successResponse(${repoName}, "${pascalName} show success");
  } catch (error) {
    res.failResponse(error);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated:any = matchedData(req, { locations: ["body"] });
    if(!req.user?.id) throw new Error('User not found');
    const ${repoName}:any = await ${pascalName}Service.update(validated, req.user.id);
    res.successResponse(${repoName}, "${pascalName} update success");
  } catch (error) {
    res.failResponse(error);
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted:any = await ${pascalName}Service.destroy(req.params.id);
    res.successResponse(deleted, "${pascalName} delete success");
  } catch (error) {
    res.failResponse(error);
  }
};
`;
}
