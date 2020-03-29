const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.auth
        console.log(token)
        if(token!=process.env.AUTH_SECRET){
            throw new Error()
        }
        next()

    } catch (e) {
        res.status(400).redirect('/')
    }
}

module.exports = auth