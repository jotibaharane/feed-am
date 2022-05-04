const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  image: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: String,
  },
  mobile: {
    type: String,
  },
  username: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
