const router = require("express").Router();
const Contact = require("../models/contact")
const jwt = require("jsonwebtoken");
const user = require("../models/user");


router.patch("/",async(req,res)=>{
    try {
        const authToken = req.cookies["auth-token"]
        const userId =jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET).id
        const userConctact = await Contact.findOne({userId:userId});
        userConctact.contacts.push(req.body.member_id);
        await userConctact.save()
    } catch (error) {
        
    }
})

router.get("/",async(req,res)=>{
    try {
        const authToken = req.cookies["auth-token"]
        const userId =jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET).id

        const contacts = await Contact.findOne({userId})
        const contactsList = contacts.contacts
        res.status(200).json({message:contactsList}) 
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Something went Wrong"})
    }
    
})










module.exports = router;