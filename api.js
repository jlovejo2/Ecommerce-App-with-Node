const Products = require('./products')

// this module is a collection of all the route handlers
// main purpose of api is to convert data from the express request object into the appropriate format for use with our data models

module.exports = {
    listProducts
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