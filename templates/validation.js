export default function validationTemplate(name) {
  const pascal = capitalize(name); // User

  return `import { body, ValidationChain } from "express-validator";

    export const store${pascal}Validator: ValidationChain[] = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ];

    export const update${pascal}Validator: ValidationChain[] = [
    body("id")
        .isInt()
        .withMessage("Main id must be an integer"),
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ];
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
