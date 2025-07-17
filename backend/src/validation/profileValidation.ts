import Joi from "joi";

// Schema for creating/updating user profile
export const createProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 1 character long",
    "string.max": "First name must not exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 1 character long",
    "string.max": "Last name must not exceed 50 characters",
    "any.required": "Last name is required",
  }),
  avatar: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Avatar must not be empty if provided",
    "string.min": "Avatar must be at least 1 character long",
  }),
});
