const autoCatch = require('./lib/auto-catch');
const Products = require('./products')

// this module is a collection of all the route handlers
// main purpose of api is to convert data from the express request object into the appropriate format for use with our data models

module.exports = autoCatch({
    listProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct
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

async function createProduct( req, res, next) {
    console.log('create Product: ', req.body);
    const product = await Products.create(req.body);
    res.json(product)
}

async function editProduct(req, res, next) {
    console.log('edit Product: ', req.body)
    const product = await Products.edit(req.params.id, req.body);
    res.json(product)
}

async function deleteProduct(req, res , next) {
    console.log('delete Product: ', req.body);
    await Products.remove(req.params.id)
    res.json({ success: true})
}