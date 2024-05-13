const express = require('express')
const api = require('./api');
const middleware = require('./middleware');

// purpose of server module
// connects external URL endpoints to internal route handler functions
// creates web server object, sets up middleware, and connects routes to route handler functions 

const port = process.env.PORT || 1337
const app = express()

app.use(middleware.cors);
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProductById)
app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`))