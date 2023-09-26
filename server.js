const fs = require('fs').promises
const path = require('path')
const express = require('express')

const port = process.env.PORT || 1337

const app = express()

app.get('/products', listProducts)
app.listen(port, () => console.log(`Server listening on PORT: ${port}`))

async function listProducts(req, res) {
    const productsFile = path.join(__dirname, './products.json');

    try {
        const data = await fs.readFile(productsFile);
        //this tells the browser that our server will accept data no matter which origin the html is loaded from.
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}