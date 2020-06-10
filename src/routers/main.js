const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Product = require('../models/product')
const Order = require('../models/order')
const Subs = require('../models/subscriber')
const mail = require('../utils/mail')
const fs = require('fs')

router.get('/', async (req, res) => {
    const data = require('../utils/indexVars')
    var keys = ['bestSellersOfWeek', 'newProducts', 'selectedForYou']
    var trending = {
        bestSellersOfWeek: [

        ],
        newProducts: [

        ],
        selectedForYou: [

        ]
    }
    for(var j = 0;j<keys.length;j++){
        for (var i = 0; i < data[keys[j]].length; i++) {
            var p = await Product.findById(data[keys[j]][i])
            trending[keys[j]].push(p)
        }
    }
    res.render('index', {
        subscribed: req.cookies.subscribed,
        data,
        trending
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

        for (var i = 0; i < orders.length; i++) {
            orders[i] = await Product.findById(orders[i].itemID)
        }
        const mailOrder = { id: order._id, name, phoneNum, email, address, notes, orders }
        var body = mail.generateOrderBody(mailOrder)
        mail.sendMail(process.env.EMAIL_ORDER_RECEIVER, 'Sifariş ' + order._id.toString(), body)
        res.clearCookie('basket').cookie('orderID', order._id).redirect('/order-success')
    } catch (e) {
        res.send('Error ' + e.message)
    }
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
    res.render('articles/' + req.params.name)
})

router.post('/offer', (req, res) => {
    var body = mail.generateOfferBody(req.body)
    mail.sendMail(process.env.EMAIL_OFFER_RECEIVER, 'Şikayət və Təkliflər', body)
    res.redirect('/article/şikayət_və_təkliflər')
})

router.post('/stats', (req, res) => {
    var statsFile = './utils/stats.json'
    var stats = JSON.parse(fs.readFileSync(statsFile).toString())
    req.body['ip'] = req.clientIp
    stats.visitors.push(req.body)
    fs.writeFileSync(statsFile, JSON.stringify(stats))
    res.status(200).send()
})
router.post('/contact-form', (req, res) => {
    console.log(process.env.EMAIL_CONTACT_RECEIVER)
    var body = mail.generateContactBody(req.body)
    mail.sendMail(process.env.EMAIL_CONTACT_RECEIVER, 'Əlaqə', body)
    res.redirect('/contact')
})
module.exports = router