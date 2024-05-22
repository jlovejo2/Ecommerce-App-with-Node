const express = require('express');
const cookieParser = require('cookie-parser');
// this is needed to parse the data in the request body because express does not do it automatically
// without it would need to read data from the request stream manually and parse it after it finishes
const bodyParser = require('body-parser');

const api = require('./api');
const auth = require('./auth');
const middleware = require('./middleware');

// purpose of server module
// connects external URL endpoints to internal route handler functions
// creates web server object, sets up middleware, and connects routes to route handler functions 

const port = process.env.PORT || 1337

const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())

// responds success only if the middleware passport.authenticate is successful
app.post('/login', auth.authenticate, auth.login)

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProductById)

app.post('/products', auth.ensureAdmin, api.createProduct)
app.put('/products/:id', auth.ensureAdmin, api.editProduct)
app.delete('/products/:id', auth.ensureAdmin, api.deleteProduct)

app.get('/orders', auth.ensureAdmin, api.listOrders)
app.post('/orders', auth.ensureAdmin, api.createOrder)

app.post('/users', api.createUser)

app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`))