const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.get("/", async (req, res) => {
  const cookie = req.cookies["auth-token"]; // token

  try {
    const userId = jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET).id;
    console.log(userId);
    const user = await User.findOne({ userId });
    const contacts = user.contact;
    const groups = user.group;

    const conversation_history = { contacts, groups };
    res.status(200).json(conversation_history);
  } catch (error) {
    res.status(400).json({});
  }
});

module.exports = router;
