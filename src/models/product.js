const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pcs: {
        type: String
    },
    category: {
        type: String
    },
    subCates: [{
        text: {
            type: String,
        }
    }],
    code: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer
    },
    specs: [{
        text: {
            type: String,
        }
    }],
    ingredients: [{
        text: {
            type: String,
            required: true
        }
    }],
    soldOut: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

productsSchema.methods.toJSON = function () {
    const prod = this
    const prodObj = prod.toObject()

    delete prodObj.image

    return prodObj
}

const Products = mongoose.model('Products', productsSchema)

module.exports = Products