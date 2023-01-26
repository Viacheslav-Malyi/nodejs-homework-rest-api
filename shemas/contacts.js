const Joi = require("joi");

const addContactShema = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required(),
  phone: Joi.string().alphanum().min(10).max(12).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  favorite: Joi.boolean(),
});

const updateContactShema = Joi.object({
  name: Joi.string().alphanum().min(3).max(20),
  phone: Joi.string().alphanum().min(10).max(12),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  favorite: Joi.boolean(),
});

module.exports = {
  addContactShema,
  updateContactShema,
};
