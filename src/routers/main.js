const express = require('express')
const router = express.Router()
const Product = require('../models/product')

router.get('/', (req, res) => {
    res.render('index', {
        pageName: 'Ana Səhifə'
    })
})
router.get('/places', (req, res) => {
    res.render('places', {
        pageName: 'Mağazalar'
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        pageName: 'Əlaqə'
    })
})
router.get('/products', (req, res) => {
    res.render('products', {
        pageName: 'Məhsullar'
    })
})

router.get('/add-to-basket/:id', async (req, res) => {
    const oldOrders = req.cookies.basket
    const prod = await Product.findById(req.params.id)
    if (prod) {
        oldOrders+=" "+req.params.id
        oldOrders = oldOrders.trim()
        res.redirect('/products/'+req.params.id)
    }else{
        res.status(404).redirect('/')
    }

})

router.get('/basket', (req, res) => {
    res.send(req.cookies.basket)
})

module.exports = router