import Joi from "joi";

// Schema for creating a user activity
export const createUserActivitySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Activity name is required",
    "string.min": "Activity name must be at least 1 character long",
    "string.max": "Activity name must not exceed 100 characters",
    "any.required": "Activity name is required",
  }),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Color must be a valid hex color code (e.g., #FF5733)",
      "any.required": "Activity color is required",
    }),
  icon: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Activity icon is required",
    "string.min": "Activity icon must be at least 1 character long",
    "string.max": "Activity icon must not exceed 50 characters",
    "any.required": "Activity icon is required",
  }),
});

// Schema for updating a user activity (same as create for now)
export const updateUserActivitySchema = createUserActivitySchema;

// Schema for activity ID parameter
export const activityIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Activity ID must be a number",
    "number.integer": "Activity ID must be an integer",
    "number.positive": "Activity ID must be a positive number",
    "any.required": "Activity ID is required",
  }),
});
