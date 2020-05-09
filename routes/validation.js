const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(10).required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().min(6).required(),
    type: Joi.string().required()
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(10).required(),
    password: Joi.string().min(6).required(),
    type: Joi.string().required()
  });
  return schema.validate(data);
};

const recoverValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(10).required(),
    type: Joi.string().required()
  });
  return schema.validate(data);
};

const resetValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    // type: Joi.string().required()
  });
  return schema.validate(data);
};  


const addressValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().regex(/^\d{10}$/).required(),
    flat: Joi.string().required(),
    landmark: Joi.string().required()
  });
  return schema.validate(data);
};  

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.recoverValidation = recoverValidation;
module.exports.resetValidation = resetValidation;
module.exports.addressValidation = addressValidation;
