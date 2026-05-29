import { body } from "express-validator";

export const validateCategory = [
    body("name").notEmpty().isString().withMessage("Name is required"),
    body("type").notEmpty().isIn(["income", "expense"]).withMessage("Invalid category type.It should be either income or expense")
];

export const validateUpdateCategory = [
    body("name").optional().notEmpty().isString().withMessage("Name must be a string"),
    body("type").optional().isIn(["income", "expense"]).withMessage("Invalid category type.It should be either income or expense"),
    body().custom((value, { req }) => {
        if (!req.body.name && !req.body.type) {
            throw new Error("At least one field (name or type) is required for update");
        }
        return true;
    })
];