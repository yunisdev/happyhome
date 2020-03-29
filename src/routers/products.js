const express = require('express')
const router = express.Router()
const Product = require('../models/product')

router.get('/data/products', async (req, res) => {
    const products = await Product.find({})
    res.send(products)
})

router.post('/data/product', async (req, res) => {
    const { name, pcs, code, specList, ingredientList } = req.body
    var specs = []
    var ingredients = []
    var spc = specList.split(',')
    for (var i = 0; i < spc.length; i++) {
        spc[i] = spc[i].trim()
        specs.push({ text: spc[i] })
    }
    var ing = ingredientList.split(',')
    for (var i = 0; i < ing.length; i++) {
        ing[i] = ing[i].trim()
        ingredients.push({ text: ing[i] })
    }
    const product = new Product({
        name, pcs, code, ingredients, specs
    })
    await product.save()
})

module.exports = router