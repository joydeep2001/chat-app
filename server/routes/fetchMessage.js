const router = require("express").Router();
const group = require("../models/group");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");


 

router.get("/", async (req, res) => {
    try {
        const authToken = req.cookies["auth-token"];
        const sender_id = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).id;
        const receiver_id = req.query.receiver_id;
        const groups=  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET).groups;
        
        let old_messages_all = []
        let old_messages_person = await Message.find({$or:[{sender:sender_id},{receiver: receiver_id }]})
        old_messages_all.push(old_messages_person)
        for(let i = 0 ; i<groups.len();i+=1)
        {
            let old_messages_group = await Message.find({group_id:groups[i]});
            old_messages_all.push(old_messages_group)
        }
        res.status(200).json({message:old_messages_all})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;