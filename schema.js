const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .trim()
            .min(1)
            .max(30)
            .required()
            .messages({
                "string.empty": "Title is required.",
                "string.max": "Title cannot be more than 30 characters.",
                "string.min": "Title is required."
            }),

        description: Joi.string()
            .trim()
            .required(),

        price: Joi.number()
            .positive()
            .required()
            .max(100000000)
            .messages({
                "number.base": "Price must be a valid number.",
                "number.positive": "Price must be greater than 0.",
                "number.base": "Price must be a valid number.",
                "number.integer": "Price must be a whole number.",
                "number.min": "Price must be greater than 0.",
                "number.max": "Price cannot exceed ₹100,000,000.",
                "any.required": "Price is required."
                // "any.required": "Price is required."
            }),


        location: Joi.string()
            .trim()
            .required(),

        country: Joi.string()
            .trim()
            .required(),

        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).allow(null)
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().required(),
    }).required()
});