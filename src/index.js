const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const cookieParser = require('cookie-parser')
const partialsPath = path.join(__dirname, '../views/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT
const fs = require('fs')
const subdomain = require('./middleware/subdomain')
const http = require('http')
const https = require('https')
const requestIP = require('request-ip')
require('./db/db')

app.use(requestIP.mw())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(publicDirectoryPath, { dotfiles: 'allow' }))
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)

app.use(subdomain({
	admin: 'm/admin'
}))

const mainRouter = require('./routers/main')
app.use(mainRouter)
const productRouter = require('./routers/products')
app.use(productRouter)
const adminRouter = require('./routers/admin')
app.use(adminRouter)

app.get('*', (req, res) => {
	res.render('404', { subscribed: req.cookies.subscribed })
})

app.listen(port, () => {
	console.log('Development server running on ' + port)
})