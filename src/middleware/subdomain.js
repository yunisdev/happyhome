const subdomainRedirect = (options = {}) => {
    return (req, res, next) => {
        var redirect = options[req.headers.host.split('.')[0]]
        if (redirect) {
            if (redirect.split('/')[0] === 'f') {
                return res.redirect('http://' + req.headers.host.split('.')[1]+ req.headers.host.split('.')[2] || '' + redirect.slice(1))
            }else if(redirect.split('/')[0] === 'm'){
                return res.send(`
                <head>
                    <style>
                    *{
                        padding:0;
                        margin:0;
                        border:none;
                    }
                    </style>
                </head>
                <body>
                    <iframe style="width:100%;height:100vh" src="${'http://' + req.headers.host.split('.')[1] + redirect.slice(1)}" ></iframe>
                </body>
                `)
            }
        }
        next()
    }
}

module.exports = subdomainRedirect