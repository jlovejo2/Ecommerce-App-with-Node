const fs = require('fs').promises
const path = require('path')

// this is a model module
// this is on the inside of our api
// and is only responsible for getting and storing data (in this case locally)
// it is important to break the models out separately because it simplifies testing

const productsFile = path.join(__dirname, './products.json');

module.exports = {
    list,
    getById
}

async function list(opts = {}) {
    const { offset, limit, tag } = opts;

    const data = await fs.readFile(productsFile);
    return JSON.parse(data)
        .filter((p, i) => !tag || p.tags.indexOf(tag) >= 0)
        .slice(offset, offset + limit);  
};

async function getById(id) {
    const products = JSON.parse(await fs.readFile(productsFile));

    for (let i = 0; i < products.length; i++) {
        if (products[i]._id === id) return products[i];
    }
    return null;
}