const mongoose = require("mongoose");

const usrSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  group: {
    type: [String],
  },
  contact: {
    type: [String],
  },
});

module.exports = mongoose.model("User", usrSchema);
