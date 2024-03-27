const router = require("express").Router();
const group = require("../models/group");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  let jwtPayload;
  try {
    const authToken = req.cookies["auth-token"];
    jwtPayload = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
  } catch(err) {
    console.log("Invalid token Provided");
    res.status(400).json({message: "Invalid Token provided!"})
  }

  try {
    
    
    //let group_ids = groups.map(group => group._id);
    let old_messages = await Message.find({
      $or: [
        { sender: jwtPayload.userId },
        { receiver: jwtPayload.userId },
        { group_id: { $in: jwtPayload.groups } },
      ],
    });
    // Fetch messages for all groups using $in operator
    // let old_messages_group = await Message.find({  });
    // old_messages_all.push(old_messages_group);
    res.status(200).json([old_messages ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
