export default function routeTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName,
  type
) {
  return `import { Router } from "express";
  import { authenticate } from "../../base/auth";
  import * as ${camelName}Controller from "../controllers";
  import { store${pascalName}Validator, update${pascalName}Validator } from "../validations";
  import { validateRequest } from "../../base/validateRequest";

const router: Router = Router();
router.use(authenticate);

router.get("/", ${camelName}Controller.index);
router.get("/:id", ${camelName}Controller.show);
router.post(
  "/",
  store${pascalName}Validator,
  validateRequest,
  ${camelName}Controller.store
);
router.put(
  "/",
  update${pascalName}Validator,
  validateRequest,
  ${camelName}Controller.update
);
router.delete("/:id", ${camelName}Controller.destroy);

export default router;
`;
}
