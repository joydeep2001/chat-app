const mongoose = require('mongoose')
const contactSchema =  mongoose.Schema({
    userId:{
        type:String,
    },
    contacts:{
        type:[String]
    },
})
module.exports =mongoose.model('Contact', contactSchema);