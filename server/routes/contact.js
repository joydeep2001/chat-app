const router = require("express").Router();
const Contact = require("../models/contact");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.patch("/", async (req, res) => {
  try {
    const authToken = req.cookies["auth-token"];
    const userId = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).id;
    const userConctact = await Contact.findOne({ userId: userId });
    userConctact.contacts.push(req.body.member_id);
    await userConctact.save();
  } catch (error) {}
});

router.get("/", async (req, res) => {
  try {
    const authToken = req.cookies["auth-token"];
    const userId = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).id;

    const contacts = await Contact.findOne({ userId });
    const contactsList = contacts.contacts;
    res.status(200).json({ message: contactsList });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went Wrong" });
  }
});

router.get("/:id", async (req, res) => {
  const authToken = req.cookies["auth-token"];

  try {
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).id;
  } catch (err) {
    return res.status(403).json({ message: "Invalid token!!" });
  }
  let user;
  try {
    user = await User.findOne({ userId: req.params.id });
    console.log(req.params);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong! Retry!" });
  }

  if (!user) return res.status(400).json({ message: "User Doesn't exists!" });

  res.status(200).json({ user, message: "User exists!" });
});

module.exports = router;
