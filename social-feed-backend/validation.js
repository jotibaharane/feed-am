// const { required } = require("@hapi/joi");
const Joi = require("@hapi/joi");

var regularExpression =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const stringPassswordError = new Error(
  "Password cannot be empty and  must contain atleast one number and one symbol with minimum 6 characters"
);
const registerValidation = (data) => {
  const schema = Joi.object({
    profile: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required().regex(regularExpression),
    // .error(stringPassswordError),
    bio: Joi.string().min(6),
    gender: Joi.string(),
    DOB: Joi.string(),
    mobile: Joi.string(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    bio: Joi.string(),
    gender: Joi.string().required(),
    DOB: Joi.string(),
    mobile: Joi.string(),
  });
  return schema.validate(data);
};

//let passRegEx = /^\/?(name|nickname)\/?$/i;

const updatePassValidation = (data) => {
  const schema = Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().required().regex(regularExpression),
    confirm_password: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateUserValidation = updateUserValidation;
module.exports.updatePassValidation = updatePassValidation;
