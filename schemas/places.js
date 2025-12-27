const Joi = require("joi");

module.exports.placeShema = Joi.object({
  place: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
  }).required(),
});

// membuat validasi input di server side menggunakan package Joi
