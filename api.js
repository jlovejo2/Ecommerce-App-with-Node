const autoCatch = require('./lib/auto-catch');
const Products = require('./models/products')
const Orders = require('./models/orders')

// this module is a collection of all the route handlers
// main purpose of api is to convert data from the express request object into the appropriate format for use with our data models

module.exports = autoCatch({
    createOrder,
    listOrders,
    createProduct,
    editProduct,
    deleteProduct,
    getProductById,
    listProducts,
});


// ORDERS

async function createOrder(req, res, next) {
    const order = await Orders.create(req.body)
    res.json(order)
}

async function listOrders(req, res, next) {
    const {offset = 0, limit = 25, productID, status} = req.query

    const orders = await Orders.list({
        offset: Number(offset),
        limit: Number(limit),
        productID,
        status
    })

    res.json(orders);
}



// PRODUCTS

async function createProduct( req, res, next) {
    console.log('create Product: ', req.body);
    const product = await Products.create(req.body);
    res.json(product)
}

async function deleteProduct(req, res , next) {
    console.log('delete Product: ', req.body);
    await Products.remove(req.params.id)
    res.json({ success: true})
}

async function editProduct(req, res, next) {
    console.log('edit Product: ', req.body)
    const product = await Products.edit(req.params.id, req.body);
    res.json(product)
}

async function getProductById(req, res, next) {
    const { id } = req.params;

    const product = await Products.getById(id);
    // next() is a callback provided by express that indicates the next available handler should run
    if (!product) return next();

    res.json(product);
}

async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;
    

    const products = await Products.list({
        // this is an example of coercing the the variables into numbers
        offset: Number(offset),
        limit: Number(limit),
        tag
    });

    res.json(products);
}





