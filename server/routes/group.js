const router = require("express").Router();
const { request } = require("http");
const Group = require("../models/group.js");
const User = require("../models/user.js");
const message = require("../models/message.js");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const groupName = req.body.group_name;
  
  //we are assuming all member ids are correct for now
  //TODO: validate the member ids
  const member = req.body.members;

  let payload;
  try {
    const token = req.cookies["auth-token"];
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch(err) {
    res.send(401).json({message: "Invalid token provided!!"});
  }

  console.log(payload);
  
  const group = Group({
    name: groupName,
    members: [...member, payload.id],
    admins: [payload.id]
  });

  const dbRes = await group.save();
  console.log(dbRes);

  const user = await User.updateMany(
    {userId:{ $in:[...member, payload.id]}},
    {$push: {group: groupName}}
  )

  console.log("group name updated in user: ");
  console.log(user);

  res.status(201).json({
    message: "Group created successfully!",
    data: dbRes
  })

});

module.exports = router;
