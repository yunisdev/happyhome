const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    const token = req.cookies.auth
    if (!token || token != process.env.AUTH_SECRET) {
        req.isAuth = false
    } else {
        req.isAuth = true
    }
    next()
}

module.exports = isAuth