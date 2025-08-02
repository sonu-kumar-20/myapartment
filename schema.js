const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
<<<<<<< HEAD
    country: Joi.string().required(),
=======
    city: Joi.string().required(),
>>>>>>> faf72e3 (Initial commit to new repo)
    price: Joi.number().required().min(500),
    image: Joi.string().allow("",null),

  }).required(),

});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    Comment: Joi.string().required(),
   

  }).required(),

});