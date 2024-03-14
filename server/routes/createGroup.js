const router = require('express').Router();
const { request } = require('http');
const Group = require('../models/group.js')
const User = require('../models/user.js');
const message = require('../models/message.js');

router.post("/",async(req,res)=>{
    // const group_id = req.body.group_id;
    // const group_name = req.body.group_name
    // const members = req.body.members
    // const admin = req.body.admin

    try {
        const member_id = req.body.member_id;
        const member = await User.findOne({userId:member_id});
        if(member){ // If Member Does not exist then Give Error
            const group_id = request.body.group_id;
            const group = await Group.findOne({id:group_id})
            if(group){ // if Group Already Exists then no need to create new one 
                let members = group.members
                if(members.includes(member_id)){// If member Already Exists The no need to add him/her
                    res.status(400).json({message:"Member Already Exists"})
                }else{
                    group.members.push(member_id);
                    await group.save()
                }
            }else{ // if group doesn't exist then create a new one 
                let members = []
                members.push(member_id);
                const savedGroup = new Group({
                    id:group_id,
                    name:req.body.name,
                    members:members,
                    admin:req.body.admin
                });
                await savedGroup.save()
            }

            
            await savedGroup.save()
            res.status(201).json({message: "Group created Successfully !!"});
        }else{
            res.status(400).json({message:"Member Does not exist"});
        }


        
    } catch (err) {
        console.log(err);
        res.status(400).json({message: "Can't Create The Group !!"});
        
    }
    
})

module.exports = router;