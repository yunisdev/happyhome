const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pcs:{
        type:Number,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    image:{
        type:Buffer
    },
    specs:[{
        text:{
            type:String,
            required:true
        }
    }],
    ingredients:[{
        text:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

const Products = mongoose.model('Products',productsSchema)

module.exports = Products