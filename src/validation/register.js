const Validator = require("validator");
const isEmpty = require("./is-empty");
const { UserInputError } = require("apollo-server-express");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
    throw new UserInputError("Email field is required");
  }

  if (!Validator.isLength(data.email, { min: 2, max: 30 })) {
    errors.email = "Email must be between 2 and 30 characters";
    throw new UserInputError("Email must be between 2 and 30 characters");
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid email";
    throw new UserInputError("Invalid email");
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
    throw new UserInputError("Password field is required");
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
    throw new UserInputError("Password must be at least 6 characters");
  }

  return {
    errors,
    valid: isEmpty(errors),
  };
};
