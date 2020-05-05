const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const cookieParser = require('cookie-parser')
const partialsPath = path.join(__dirname, '../views/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT
const fs = require('fs')
const http = require('http')
const wildcardSubdomains = require('wildcard-subdomains')
const https = require('https')
const requestIP = require('request-ip')
require('./db/db')

app.use(wildcardSubdomains())
app.use(requestIP.mw())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(publicDirectoryPath, { dotfiles: 'allow' }))
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)



const mainRouter = require('./routers/main')
app.use(mainRouter)
const productRouter = require('./routers/products')
app.use(productRouter)
const adminRouter = require('./routers/admin')
app.use(adminRouter)

app.get('/_sub/help', (req, res) => {
	res.send('Happy Help')
})

app.get('*', (req, res) => {
	res.render('404', { subscribed: req.cookies.subscribed })
})

// Starting both http & https servers

if (process.env.NODE_ENV == 'development') {
	app.listen(port, () => {
		console.log('Development server running on ' + port)
	})
} else if (process.env.NODE_ENV == 'production') {
	// Certificate
	const privateKey = fs.readFileSync('/etc/letsencrypt/live/happyhome.tc/privkey.pem', 'utf8');
	const certificate = fs.readFileSync('/etc/letsencrypt/live/happyhome.tc/cert.pem', 'utf8');
	const ca = fs.readFileSync('/etc/letsencrypt/live/happyhome.tc/chain.pem', 'utf8');

	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};

	const httpServer = http.createServer(app);
	const httpsServer = https.createServer(credentials, app);
	httpServer.listen(80, () => {
		console.log('HTTP Server running on port 80');
	});

	httpsServer.listen(443, () => {
		console.log('HTTPS Server running on port 443');
	});
}

