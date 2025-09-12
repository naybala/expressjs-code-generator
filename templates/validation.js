export default function validationTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName,
  type
) {
  return `import { body, ValidationChain } from "express-validator";

    export const store${pascalName}Validator: ValidationChain[] = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ];

    export const update${pascalName}Validator: ValidationChain[] = [
    body("id")
        .isInt()
        .withMessage("Main id must be an integer"),
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ];
`;
}
