const Joi = require("joi");

const listingJoiSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required"
  }),
  
  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required"
  }),

  image: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().uri().optional().allow("").default("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg")
  }).optional(),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required"
  }),

  location: Joi.string().required().messages({
    "string.empty": "Location is required"
  }),

  country: Joi.string().required().messages({
    "string.empty": "Country is required"
  })
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports = {
  listingJoiSchema,
  reviewSchema
};
