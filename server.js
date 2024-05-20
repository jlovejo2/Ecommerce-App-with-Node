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
// https://martinfowler.com/articles/session-secret.html

const adminPassword = process.env.ADMIN_PASSWORD || 'mystical_narwhal';
const port = process.env.PORT || 1337

passport.use(
    new Strategy(function (username, password, cb) {
        const isAdmin = ( username === 'admin') && (password === adminPassword)
        console.log('passport: ', username, password)
        if (isAdmin) cb(null, { username: 'admin'})
        else cb(null, false)
    })
)

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))

const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
    expressSession({
        secret: sessionsSecret,
        resave: false,
        saveUninitialized: false
    })
)
app.use(passport.initialize())
app.use(passport.session())

// responds success only if the middleware passport.authenticate is successful
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.json({ success: true});
})

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProductById)

app.post('/products', ensureAdmin, api.createProduct)
app.put('/products/:id', ensureAdmin, api.editProduct)
app.delete('/products/:id', ensureAdmin, api.deleteProduct)

app.get('/orders', ensureAdmin, api.listOrders)
app.post('/orders', ensureAdmin, api.createOrder)

app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`))

function ensureAdmin(req, res ,next) {
    const isAdmin = req.user && req.user.username === 'admin';
    if (isAdmin) return next();

    console.log('ensure admin ...')
    res.status(401).json({error: 'tsk tsk.  You are Unauthorized to perform this action'});
}