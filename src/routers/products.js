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
    const products = await Product.find({ soldOut: false })
    res.send(products)
})
router.get('/product/:id', async (req, res) => {
    const product = await Product.find({_id:req.params.id,soldOut:false})
    res.send(product)
})
router.get('/products/:category', async (req, res) => {
    var category
    switch (req.params.category) {
        case 'cilciraq':
            category = 'Çilçıraq'
            break;
        case 'bosqab-altligi':
            category = 'Boşqab altlığı'
            break;
        case 'qazan-desti':
            category = 'Qazan dəsti'
            break;
        case 'hediyyelik-qab':
            category = 'Hədiyyəlik qab'
            break;
        case 'elektrik-aletleri':
            category = 'Elektrikli alətlər'
            break;
        case 'qasiq-cengel-bicaq-desti':
            category = 'Qaşıq-Çəngəl-Bıçaq dəsti'
            break;
        case 'bakal-qrafin-desti':
            category = 'Bakal-Qrafin dəsti'
            break;
        case 'sufre-desti':
            category = 'Süfrə dəsti'
            break;

        default:
            category = 'Does not exist'
            break;
    }
    const products = await Product.find({ soldOut: false, category })
    res.send(products)
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
        var PCS = [];
        if (pcs) {
            PCS = pcs.split(',')
            for (var i = 0; i < PCS.length; i++) {
                PCS[i] = { text: PCS[i].trim() }
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
            name, pcs: PCS, code, ingredients, specs, image: buffer, category, subCates
        })
        await product.save()
        res.status(200).redirect('/panel')
    } catch (e) {
        res.send(e.message)
    }
})

module.exports = router