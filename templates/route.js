export default function routeTemplate(name, type) {
  const pascal = capitalize(name);
  const camel = name.toLowerCase();

  return `import { Router } from "express";
  import { authenticate } from "@${type}/base/auth";
import * as ${camel}Controller from "../controllers";
import { store${pascal}Validator, update${pascal}Validator } from "../validations";
import { validateRequest } from "@${type}/base/validateRequest";

const router: Router = Router();
router.use(authenticate);

router.get("/", ${camel}Controller.index);
router.get("/:id", ${camel}Controller.show);
router.post(
  "/",
  store${pascal}Validator,
  validateRequest,
  ${camel}Controller.store
);
router.put(
  "/",
  update${pascal}Validator,
  validateRequest,
  ${camel}Controller.update
);
router.delete("/:id", ${camel}Controller.destroy);

export default router;
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
