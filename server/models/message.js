const mongoose = require('mongoose')
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

module.exports = mongoose.model('Message', messageSchema);