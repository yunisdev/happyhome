const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')
const Order = require('../models/order')

router.get('/', (req, res) => {
    res.render('index', {
        pageName: 'Ana Səhifə'
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
    res.render('basket', { orders })
})
router.get('/clear-basket', (req, res) => [
    res.clearCookie('basket').redirect('/basket')
])

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
router.get('/order-success', (req, res) => {
    const orderID = req.cookies.orderID
    res.clearCookie('orderID').render('orderSuccess', { orderID })
})

module.exports = router