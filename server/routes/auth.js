const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
const dayjs = require("dayjs");

dotenv.config();


router.post("/login", async (req, res) => {
  // Checking whether user id exists or not
  const emailOrUid = req.body.id;
  const user = await User.findOne({ $or:[ {'email':emailOrUid}, {'userId':emailOrUid} ]});
  console.log(user);
  if (!user)
    return res.status(400).json({
      message: "Email or userid Does not exist!",
    });

   // Checking whether password is correct or not
    if(user.password !== req.body.password)
        return res
          .status(400)
          .json({ message: "Wrong Password", error: true });
   
    const payload = {
      id: user._id,
      groups: user.group
    };
    
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    res
    .status(200)
      .cookie("auth-token", token, {
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
      })
      .json({
        message: user.name+" Login success",
      });
  
});

router.post("/signup", async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({
        message: "Email already exists",
      });
    try {
      // Create a new User
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userId: req.body.user_id
        
      });
      await user.save();
      res.status(201).json({message: "user created successfully!! Login to continue"});
      
    } catch(err) {
        res.send(500).json({message: "Something went wrong!! Retry again"});
    }
})

router.get("/logout", async (req, res) => {
    res.status(200).clearCookie("auth-token").json({message: "Logout successfully!!"});
  });
  


router.get("/status", async (req, res) => {
  const token = req.cookies["auth-token"];
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(verified._id);
    console.log(verified);
    res.json({ loginStatus: true, isAdmin: verified.isAdmin });
  } catch (error) {
    res.json({ loginStatus: false });
  }
});




module.exports = router;