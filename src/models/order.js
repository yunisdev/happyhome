const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    phoneNum:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
    },
    notes:{
        type:String
    },
    orders:[{
        itemID:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
    }]
},{
    timestamps:true
})

const Order = mongoose.model('Order',orderSchema)

module.exports = Order