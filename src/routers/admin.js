const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const isAuth = require('../middleware/isAuth')
const Product = require('../models/product')
const Order = require('../models/order')
const Subs = require('../models/subscriber')


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

module.exports = router