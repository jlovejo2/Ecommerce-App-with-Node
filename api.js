const Products = require('./products')

// this module is a collection of all the route handlers

module.exports = {
    listProducts
}

async function listProducts(req, res) {

    //this tells the browser that our server will accept data no matter which origin the html is loaded from.
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {

        res.json(Products.list());
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}