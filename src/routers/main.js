const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index',{
        pageName:'Ana Səhifə'
    })
})
router.get('/places', (req, res) => {
    res.render('places',{
        pageName:'Mağazalar'
    })
})
router.get('/contact', (req, res) => {
    res.render('contact',{
        pageName:'Əlaqə'
    })
})
router.get('/products', (req, res) => {
    res.render('products',{
        pageName:'Məhsullar'
    })
})

module.exports = router