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

export const validateTransaction = [
   body("amount")
    .notEmpty().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number"),

body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Invalid transaction type"),

body("category")
    .notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Invalid category ID"),

body("note")
    .optional()
    .isString().withMessage("Note must be a string")

];

export const validateUpdateTransaction = [
   body("amount")
    .optional()
    .isNumeric().withMessage("Amount must be a number"),

body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Invalid transaction type"),

body("category")
    .optional()
    .isMongoId().withMessage("Invalid category ID"),

body("note")
    .optional()
    .isString().withMessage("Note must be a string"),

body().custom((value, { req }) => {
    if (
        req.body.amount === undefined &&
        req.body.type === undefined &&
        req.body.category === undefined &&
        req.body.note === undefined
    ) {
        throw new Error("At least one field is required for update");
    }
    return true;
})
];
