const router = require('express').Router();

const message = require('../models/message')

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
module.exports=router