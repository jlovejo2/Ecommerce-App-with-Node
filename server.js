const express = require('express')
// this is needed to parse the data in the request body because express does not do it automatically
// without it would need to read data from the request stream manually and parse it after it finishes
const bodyParser = require('body-parser');

const api = require('./api');
const middleware = require('./middleware');

// purpose of server module
// connects external URL endpoints to internal route handler functions
// creates web server object, sets up middleware, and connects routes to route handler functions 

const port = process.env.PORT || 1337
const app = express()

app.use(middleware.cors);
app.use(bodyParser.json());
app.get('/products', api.listProducts)
app.post('/products', api.createProduct)
app.get('/products/:id', api.getProductById)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`))