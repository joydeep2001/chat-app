const router = require('express').Router();
const User = require('../models/user')
const Message = require('../models/message')
const jwt = require('jsonwebtoken')

router.get('/',async(req,res)=>{
    const userId_id = req.body.userId // token 
    
    try {
        const record = message.find(userId_id)

        const oldmessage=[{}] // content: stores the message or url , type: 1 if media 0 otherwise
        for(let  i= 0;i<record.size();i++)
        {
            if(record.message_type==="media"){
                oldmessage+= {content:record[i].url,type:1}
            }else{
                oldmessage+= {content:record[i].content,type:0}
            }
        }
        res.status(200).json(oldmessage)
    } catch (error) {
        res.status(400).json({})
    }
})

router.post("/",async(req,res)=>{
    const receiver_id = req.body.receiver_id;
    try {
        const content = req.body.content;
        const type = req.body.type;
        const cookie = req.cookies["auth-token"]
        const sender_id = jwt.verify(cookie,process.env.ACCESS_TOKEN_SECRET).id;
        let url=null, message=null;
        let m_type=null;
        if(type==="text"){
            message = content;
            m_type=type
        }else{
            url = content;
            m_type=type
        }
        const message_entry = new Message({
            sender:sender_id,
            message_type:m_type,
            content:content,
            url:url,
            group_id:null,
            receiver_id:receiver_id
        })
        const savedMessage = await message_entry.save()

        const reciever = User.findOne(receiver_id).members
        res.status(200).json({"message":"Sent Successfully"});

    } catch (err) {
        console.log(err);
        res.status(400).json({"message":"Something went wrong !"})
    }
})

module.exports=router