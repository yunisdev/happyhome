const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload jpg,jpeg,png or gif'))
        }
        cb(undefined, true)
    }
})
router.get('/data/products', auth, async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 })
    res.send(products)
})
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        if (!product) {
            throw new Error()
        }
        if (product.soldOut) {
            var soldOut = 'true'
        }
        var Basket = req.cookies.basket || ''
        var basket = Basket.trim().split(' ')
        var addedToBasket = basket.find(el => el == req.params.id)
        res.render('productPage', { product, soldOut, addedToBasket, subscribed: req.cookies.subscribed })
    } catch (e) {
        console.log(e.message)
        res.render('404', { subscribed: req.cookies.subscribed })
    }
})
router.get('/products/:category', async (req, res) => {
    var category
    switch (req.params.category) {
        case 'cilciraq':
            category = 'Çilçıraqlar'
            break;
        case 'bosqab-altligi':
            category = 'Boşqab altlıqları'
            break;
        case 'qazan-desti':
            category = 'Qazan dəstləri'
            break;
        case 'hediyyelik-qab':
            category = 'Hədiyyəlik qablar'
            break;
        case 'elektrikli-alet':
            category = 'Elektrikli alətlər'
            break;
        case 'qasiq-cengel-bicaq-desti':
            category = 'Qaşıq-Çəngəl-Bıçaq dəstləri'
            break;
        case 'bakal-qrafin-desti':
            category = 'Bakal-Qrafin dəstləri'
            break;
        case 'servis':
            category = 'Servislər'
            break;

        default:
            category = 'Belə bir kateqoriya yoxdur'
            break;
    }
    const products = await Product.find({ category }).sort({ createdAt: -1 })
    res.render('productsByCategory', { products, category, subscribed: req.cookies.subscribed })
})
router.get('/data/pic/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.set('Content-Type', 'image/png')
    res.send(product.image)
})
router.post('/data/product', upload.single('img'), async (req, res) => {
    try {
        const { name, code, category, ingredientList, specList, subcate, pcs } = req.body
        var subCates = [];
        if (subcate) {
            subCates = subcate.split(',')
            for (var i = 0; i < subCates.length; i++) {
                subCates[i] = { text: subCates[i].trim() }
            }
        }

        var specs = []
        if (specList) {
            let spc = specList.split(',')
            for (var i = 0; i < spc.length; i++) {
                spc[i] = spc[i].trim()
                specs.push({ text: spc[i] })
            }
        }
        const buffer = await sharp(req.file.buffer).resize({
            width: 500, height: 500
        }).png().toBuffer()

        let ingredients = []
        let ing = ingredientList.split(',')
        for (var i = 0; i < ing.length; i++) {
            ing[i] = ing[i].trim()
            ingredients.push({ text: ing[i] })
        }
        const product = new Product({
            name, pcs, code, ingredients, specs, image: buffer, category, subCates
        })
        await product.save()
        res.status(200).redirect('/panel')
    } catch (e) {
        res.send(e.message)
    }
})
router.get('/product/soldout/:id', auth, async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product.soldOut == true) {
        await Product.findByIdAndUpdate(req.params.id, {
            soldOut: false
        })
    } else {
        await Product.findByIdAndUpdate(req.params.id, {
            soldOut: true
        })
    }
    res.redirect('/panel')
})
router.get('/product/delete/:id', auth, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id)
    res.redirect('/panel')
})
router.post('/update/product/:id', upload.single('image'), auth, async (req, res) => {
    const { name } = req.body
    if (req.file) {
        const buffer = await sharp(req.file.buffer).resize({
            width: 500, height: 500
        }).png().toBuffer()
        await Product.findByIdAndUpdate(req.params.id, {
            name,
            image: buffer
        })
    }
    else {
        await Product.findByIdAndUpdate(req.params.id, {
            name
        })
    }


    res.redirect('/panel')
})
module.exports = router