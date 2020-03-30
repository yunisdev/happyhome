const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.auth
        if(!token || token!=process.env.AUTH_SECRET){
            throw new Error()
        }
        next()

    } catch (e) {
        res.redirect('/')
    }
}

module.exports = auth