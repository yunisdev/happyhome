const mongoose = require('mongoose')

const subSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

const Subs = mongoose.model('Subscriber',subSchema)

module.exports = Subs