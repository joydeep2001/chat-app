const router = require('express').Router();
const Group = require('../models/group.js')

router.post("/",async(req,res)=>{
    // const group_id = req.body.group_id;
    // const group_name = req.body.group_name
    // const members = req.body.members
    // const admin = req.body.admin

    try {
        const savedGroup = new Group({
            id:req.body.id,
            name:req.body.name,
            members:req.body.members,
            admin:req.body.admin
        });
        await savedGroup.save()
        res.status(201).json({message: "Group created Successfully !!"});
    } catch (err) {
        console.log(err);
        res.status(400).json({message: "Can't Create The Group !!"});
        
    }
    
})

module.exports = router;