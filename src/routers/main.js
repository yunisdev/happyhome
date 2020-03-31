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
        oldOrders += " " + req.params.id
        oldOrders = oldOrders.trim()
        res.redirect('/products/' + req.params.id)
    } else {
        res.status(404).redirect('/')
    }

})

router.get('/basket', (req, res) => {
    if(req.cookies.basket){
        var orders = req.cookies.basket.trim().split(' ')
        orders = orders.filter((el)=>{
            return (el != '' && el != null)
        })
        console.log(orders)
    }
    
    res.render('basket',orders)
})

router.post('/order', async (req, res) => {
    try {
        const { name, phoneNum, email, address, notes } = req.body
        var orderStr = req.cookies.basket.trim()
        var orderArr = orderStr.split(' ')
        var orders = []
        for (var i = 0; i < orderArr.length; i++) {
            orders.push({ itemID: new mongoose.Types.ObjectId(orderArr[i]) })
        }
        const order = new Order({ name, phoneNum, email, address, notes, orders })
        await order.save()
        res.clearCookie('basket').render('orderSuccess', { id: order._id })
    } catch (e) {
        console.log(e.message)
        res.send()
    }
})

module.exports = router