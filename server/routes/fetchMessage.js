const router = require("express").Router();
const group = require("../models/group");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");


 

router.get("/", async (req, res) => {
    try {
        const authToken = req.cookies["auth-token"];
        const sender_id = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).id;
        const receiver_id = req.query.receiver_id;
        const groups_ids=  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).groups;
        //let group_ids = groups.map(group => group._id);
        let old_messages = await Message.find({$or: [{sender: sender_id}, {receiver: receiver_id},{group_id: { $in: group_ids }}]});
        // Fetch messages for all groups using $in operator
        // let old_messages_group = await Message.find({  });
        // old_messages_all.push(old_messages_group);
        res.status(200).json({message:old_messages})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;