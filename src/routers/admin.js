const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const isAuth = require('../middleware/isAuth')

router.get('/admin', isAuth, (req, res) => {
    if (req.isAuth) {
        return res.redirect('/panel')
    }
    res.render('admin')
})

router.post('/login', (req, res) => {
    if (req.body.password == process.env.ADMIN_PASS) {
        res.cookie('auth', process.env.AUTH_SECRET).redirect('/panel')
    }
})

router.get('/panel', auth, (req, res) => {
    res.render('panel')
})

router.get('/logout', auth, (req, res) => {
    res.clearCookie('auth').redirect('/admin')
})

module.exports = router