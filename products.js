const fs = require('fs').promises
const path = require('path')

// this is a model module
// this is on the inside of our api
// and is only responsible for getting and storing data (in this case locally)
// it is important to break the models out separately because it simplifies testing

const productsFile = path.join(__dirname, './products.json');

module.exports = {
    list
}

async function list(opts = {}) {
    const { offset, limit, tag } = opts;

    const data = await fs.readFile(productsFile);
    return JSON.parse(data)
        .filter((p, i) => !tag || p.tags.indexOf(tag) >= 0)
        .slice(offset, offset + limit);  
};