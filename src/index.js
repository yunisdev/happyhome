const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const partialsPath = path.join(__dirname, '../views/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT

app.use(express.urlencoded())
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)


const mainRouter = require('./routers/main')
app.use(mainRouter)


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})