const Joi = require("joi");

const createContactsValidationSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

const updateContactsValidationSchema = Joi.object()
  .keys({
    name: createContactsValidationSchema.extract("name").optional(),
    email: createContactsValidationSchema.extract("email").optional(),
    phone: createContactsValidationSchema.extract("phone").optional(),
    favorite: createContactsValidationSchema.extract("favorite").optional(),
  })
  .or("name", "phone", "email", "favorite");

module.exports = {
  createContactsValidationSchema,
  updateContactsValidationSchema,
};
