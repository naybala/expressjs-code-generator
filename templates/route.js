export default function routeTemplate(name, type) {
  const pascal = capitalize(name);
  const camel = name.toLowerCase();

  return `import { Router } from "express";
import * as ${camel}Controller from "../controllers";
import { authenticate } from "@${type}/base/auth";
import { store${pascal}Validator, update${pascal}Validator } from "../validations";
import { validateRequest } from "@${type}/base/validateRequest";

const router: Router = Router();

router.get("/", authenticate, ${camel}Controller.index);
router.get("/:id", authenticate, ${camel}Controller.show);
router.post(
  "/",
  authenticate,
  store${pascal}Validator,
  validateRequest,
  ${camel}Controller.store
);
router.put(
  "/",
  authenticate,
  update${pascal}Validator,
  validateRequest,
  ${camel}Controller.update
);
router.delete("/:id", authenticate, ${camel}Controller.destroy);

export default router;
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
