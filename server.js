const express = require('express');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
// this is needed to parse the data in the request body because express does not do it automatically
// without it would need to read data from the request stream manually and parse it after it finishes
const bodyParser = require('body-parser');

const api = require('./api');
const middleware = require('./middleware');

// purpose of server module
// connects external URL endpoints to internal route handler functions
// creates web server object, sets up middleware, and connects routes to route handler functions 

const sessionsSecret = process.env.SESSION_SECRET || 'mark it zero';
// article that discusses the concept of a complex secret in production
https://martinfowler.com/articles/session-secret.html

const adminPassword = process.env.ADMIN_PASSWORD || 'mystical_narwhal';
const port = process.env.PORT || 1337
const app = express()

passport.use(
    new Strategy(function (username, password, cb) {
        const isAdmin = ( username === 'admin') && (password === adminPassword)
        if (isAdmin) cb(null, { username: 'admin'})
        
        cb(null, false)
    })
)

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))

app.use(middleware.cors);
app.use(bodyParser.json());
app.get('/products', api.listProducts)
app.post('/products', api.createProduct)
app.get('/products/:id', api.getProductById)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.get('/orders', api.listOrders)
app.post('/orders', api.createOrder)
app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`))