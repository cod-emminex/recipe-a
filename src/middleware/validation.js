// src/middleware/validation.js
import { body, validationResult } from "express-validator";

export const recipeValidation = [
  body("title").trim().notEmpty().isLength({ max: 100 }),
  body("description").trim().notEmpty().isLength({ max: 500 }),
  body("ingredients").isArray().notEmpty(),
  body("instructions").isArray().notEmpty(),
  // Add more validation rules
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
