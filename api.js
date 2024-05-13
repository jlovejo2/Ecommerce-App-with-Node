const Products = require('./products')

// this module is a collection of all the route handlers
// main purpose of api is to convert data from the express request object into the appropriate format for use with our data models

module.exports = {
    listProducts,
    getProductById
}

async function listProducts(req, res) {

    //this tells the browser that our server will accept data no matter which origin the html is loaded from.
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { offset = 0, limit = 25, tag } = req.query;
    
    try {
        res.json(await Products.list({
            // this is an example of coercing the the variables into numbers
            offset: Number(offset),
            limit: Number(limit),
            tag
        }));
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getProductById(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { id } = req.params;

    try {
        const product = await Products.getById(id);
        // next() is a callback provided by express that indicates the next available handler should run
        if (!product){
            console.log('no product found by id')
            return next()
        };

        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}