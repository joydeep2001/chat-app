const mongoose = require('mongoose')

const usrSchema = mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    userId:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:email,
        required:true,
    },
    group:{
        type:[String],
    }
})

const messageSchema = mongoose.Schema({
    id:{
        type:String
    },
    sender: {
        type:String,
    },
    message_type: {
        type:String
    },
    content:{
        type:String
    }, 
    url: {
        type:String
    },
    group_id:{
        type:String
    },
    reciver_id:{
        type:String,
    }
})

const groupSchema =  mongoose.Schema({
    id:{
        type:String,
    },
    members:{
        type:[String]
    },
    admin:{
        type:[String]
    }
})



module.exports = mongoose.model('User', usrSchema);;