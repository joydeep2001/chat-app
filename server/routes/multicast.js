const router = require('express').Router();

const User = require('../models/user');
const Group = require('../models/group')
const Message = require('../models/message')
const jwt = require('jsonwebtoken')

router.get('/:group_id',async(req,res)=>{
    const group_id = req.query.group_id // token 
    
    try {
        const record = message.find(group_id)

        const oldmessage=[{}] // content: stores the message or url , type: 1 if media 0 otherwise
        for(let  i= 0;i<record.size();i++)
        {
            if(record.message_type==="media"){
                oldmessage+= {content:record[i].url,type:1}
            }else{
                oldmessage+= {content:record[i].content,type:0}
            }
        }

        const members=[{}]
        const group = Group.findOne (group_id);
        const member_ids = group.members;
        for(let i = 0 ; i<member_ids.length;i++)
        {
            const user = User.findOne(member_ids[i]);
            member_ids+={user_id:user.email,user_name:user.name}
        }
        res.status(200).json({oldmessage,members})
    } catch (error) {
        res.status(400).json({})
    }
})

router.post("/:group_id",async(req,res)=>{
    const group_id=req.query.group_id;
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
            group_id:group_id,
            receiver_id:null
        })
        const savedMessage = await message_entry.save()

        const memeber = Group.findOne(group_id).members
        //

        //


    } catch (err) {
        
    }
})

module.exports=router