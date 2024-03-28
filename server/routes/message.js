const router = require("express").Router();
const group = require("../models/group");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.get("/", async (req, res) => {
  let jwtPayload;
  try {
    const authToken = req.cookies["auth-token"];
    jwtPayload = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("from message ep: ");
    console.log(jwtPayload);
  } catch (err) {
    console.log("Invalid token Provided");
    res.status(400).json({ message: "Invalid Token provided!" });
  }

  try {
    const user = await User.findOne({ userId: jwtPayload.id });
    console.log(user);
    
    let old_messages = await Message.find({
      $or: [
        { sender_id: jwtPayload.id },
        { receiver_id: jwtPayload.id },
        { group_id: { $in: user.group } },
      ],
    });

    // Fetch messages for all groups using $in operator
    // let old_messages_group = await Message.find({  });
    // old_messages_all.push(old_messages_group);
    res.status(200).json([old_messages]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
