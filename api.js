const autoCatch = require('./lib/auto-catch');
const Products = require('./products')

// this module is a collection of all the route handlers
// main purpose of api is to convert data from the express request object into the appropriate format for use with our data models

module.exports = autoCatch({
    listProducts,
    getProductById
});

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

async function getProductById(req, res, next) {
    const { id } = req.params;

    const product = await Products.getById(id);
    // next() is a callback provided by express that indicates the next available handler should run
    if (!product) return next();

    res.json(product);
}