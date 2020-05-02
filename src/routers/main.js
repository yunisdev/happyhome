const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Product = require('../models/product')
const Order = require('../models/order')
const Subs = require('../models/subscriber')

router.get('/', (req, res) => {
    res.render('index', {
        subscribed: req.cookies.subscribed
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        subscribed: req.cookies.subscribed
    })
})
router.get('/products', (req, res) => {
    res.render('products', {
        subscribed: req.cookies.subscribed
    })
})

router.get('/add-to-basket/:id', async (req, res) => {
    var oldOrders = req.cookies.basket || ''
    const prod = await Product.findById(req.params.id)
    if (prod) {
        oldOrders += " " + req.params.id
        oldOrders = oldOrders.trim()
        res.cookie('basket', oldOrders).redirect('/product/' + req.params.id)
    } else {
        res.status(404).redirect('/')
    }

})
router.get('/buy/:id', async (req, res) => {
    var oldOrders = req.cookies.basket || ''
    const prod = await Product.findById(req.params.id)
    if (prod) {
        oldOrders += " " + req.params.id
        oldOrders = oldOrders.trim()
        res.cookie('basket', oldOrders).redirect('/basket#formAutoScroll')
    } else {
        res.status(404).redirect('/')
    }

})

router.get('/basket', async (req, res) => {
    if (req.cookies.basket) {
        var orders = req.cookies.basket.trim().split(' ')
        orders = orders.filter((el) => {
            return (el != '' && el != null)
        })
        for (var i = 0; i < orders.length; i++) {
            orders[i] = await Product.findById(orders[i])
        }
    }
    res.render('basket', {
        orders, subscribed: req.cookies.subscribed
    })
})
router.get('/clear-basket', (req, res) => [
    res.clearCookie('basket').redirect('/basket')
])
router.get('/data/orders', async (req, res) => {
    const orders = await Order.find({
        isDone: false
    }).sort({ createdAt: -1 })
    res.send(orders)
})
router.post('/order', async (req, res) => {
    try {
        const { name, phoneNum, email, address = '', notes = '' } = req.body
        if (req.cookies.basket) {
            var orders = req.cookies.basket.trim().split(' ')
            orders = orders.filter((el) => {
                return (el != '' && el != null)
            })
            for (var i = 0; i < orders.length; i++) {
                orders[i] = { itemID: new mongoose.Types.ObjectId(orders[i]) }
            }
        } else {
            throw new Error('Please add an item')
        }

        const order = new Order({ name, phoneNum, email, address, notes, orders })
        await order.save()
        res.clearCookie('basket').cookie('orderID', order._id).redirect('/order-success')
    } catch (e) {
        res.send('Error ' + e.message)
    }
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
router.get('/order-success', (req, res) => {
    const orderID = req.cookies.orderID
    res.clearCookie('orderID').render('orderSuccess', {
        orderID, subscribed: req.cookies.subscribed
    })
})

router.post('/subscribe', async (req, res) => {
    const { email } = req.body
    const sub = new Subs({ email })
    await sub.save()
    res.cookie('subscribed', 'yes').redirect('/')
})
router.get('/subscribe', (req, res) => {
    res.render('subscribe')
})

router.get('/article/:name', (req, res) => {
    res.render('articles/'+req.params.name)
})
module.exports = router