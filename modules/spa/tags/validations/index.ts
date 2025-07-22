import { body, ValidationChain } from "express-validator";

    export const storeTagValidator: ValidationChain[] = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ];

    export const updateTagValidator: ValidationChain[] = [
    body("id")
        .isInt()
        .withMessage("Main id must be an integer"),
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ];