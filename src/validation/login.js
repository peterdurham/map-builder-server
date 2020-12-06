const Validator = require("validator");
const isEmpty = require("./is-empty");
const { UserInputError } = require("apollo-server-express");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
    throw new UserInputError("Email field is required");
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
    throw new UserInputError("Email is invalid");
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
    throw new UserInputError("Password field is required");
  }

  return {
    errors,
    valid: isEmpty(errors),
  };
};
