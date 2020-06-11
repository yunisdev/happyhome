const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const isAuth = require('../middleware/isAuth')
const Product = require('../models/product')
const Order = require('../models/order')
const Subs = require('../models/subscriber')
const fs = require('fs')

router.get('/admin', isAuth, (req, res) => {
    if (req.isAuth) {
        return res.redirect('/panel')
    }
    res.render('admin', {
        subscribed: req.cookies.subscribed
    })
})

router.post('/login', (req, res) => {
    if (req.body.password == process.env.ADMIN_PASS) {
        res.cookie('auth', process.env.AUTH_SECRET).redirect('/panel')
    }else{
        res.send('Parol səhvdir və ya sizin bura daxil olmaq üçün icazəniz yoxdur')
    }
})

router.get('/panel', auth, async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 })
    const products = await Product.find({}).sort({ createdAt: -1 })
    res.render('panel', {
        orders,products
    })
})

router.get('/logout', auth, (req, res) => {
    res.clearCookie('auth').redirect('/admin')
})
router.get('/order/:id', auth, async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        return res.render('orderPage', {
            order
        })
    }
    res.status(404).redirect('/404')
})
router.get('/order/isdone/:id', auth, async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order.isDone === true) {
        await Order.findByIdAndUpdate(req.params.id, {
            isDone: false
        })
    } else {
        await Order.findByIdAndUpdate(req.params.id, {
            isDone: true
        })
    }
    res.redirect('/panel')
})
router.get('/order/delete/:id', auth, async (req, res) => {
    await Order.findByIdAndDelete(req.params.id)
    res.redirect('/panel')
})
router.post('/order/comment/:id', auth, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, {
        comments: req.body.comment
    })
    res.redirect('/panel')
})
router.post('/data/index', auth, (req, res) => {
    var { slide1, slide2, slide3, slide4, bestSellersOfWeek, selectedForYou, newProducts } = req.body
    bestSellersOfWeek = bestSellersOfWeek.split(',')
    for (var i = 0; i < bestSellersOfWeek.length; i++) {
        bestSellersOfWeek[i] = bestSellersOfWeek[i].trim()
    }
    selectedForYou = selectedForYou.split(',')
    for (var i = 0; i < selectedForYou.length; i++) {
        selectedForYou[i] = selectedForYou[i].trim()
    }
    newProducts = newProducts.split(',')
    for (var i = 0; i < newProducts.length; i++) {
        newProducts[i] = newProducts[i].trim()
    }
    const data = JSON.parse(fs.readFileSync('./src/other/data.json').toString())
    data.bestSellersOfWeek = bestSellersOfWeek
    data.selectedForYou = selectedForYou
    data.newProducts = newProducts
    data.carousel = {
        slide1,
        slide2,
        slide3,
        slide4
    }
    fs.writeFileSync('./src/other/data.json', JSON.stringify(data))
    res.redirect('/panel')
})
router.get('/data/index', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./src/other/data.json').toString())
    res.send(data)
})
module.exports = router