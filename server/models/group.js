const mongoose = require('mongoose')
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
module.exports =mongoose.model('Group', groupSchema);
