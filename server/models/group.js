const mongoose = require("mongoose");
const groupSchema = mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  members: {
    type: [String],
  },
  admins: {
    type: [String],
  },
});
module.exports = mongoose.model("Group", groupSchema);
