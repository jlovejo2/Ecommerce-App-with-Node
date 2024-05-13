const express = require('express')
const api = require('./api');

// purpose of server module
// connects external URL endpoints to internal route handler functions
// creates web server object, sets up middleware, and connects routes to route handler functions 

const port = process.env.PORT || 1337

const app = express()

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProductById)
app.listen(port, () => console.log(`Server listening on PORT: ${port}`))



// Stopped at Modularize in creating complete node server