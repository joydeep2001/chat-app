const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  id: {
    type: String,
  },
  sender_id: {
    type: String,
  },
  message_type: {
    type: String,
  },
  content: {
    type: String,
  },
  url: {
    type: String,
  },
  group_id: {
    type: String,
  },
  receiver_id: {
    type: String,
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
