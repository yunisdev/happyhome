const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const cookieParser = require('cookie-parser')
const partialsPath = path.join(__dirname, '../views/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT

require('./db/db')
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())
app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)


const mainRouter = require('./routers/main')
app.use(mainRouter)
const productRouter = require('./routers/products')
app.use(productRouter)
const adminRouter = require('./routers/admin')
app.use(adminRouter)

app.get('*', (req, res) => {
    res.render('404',{subscribed: req.cookies.subscribed})
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})