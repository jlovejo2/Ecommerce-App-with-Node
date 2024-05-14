const fs = require('fs').promises
const path = require('path')
const cuid = require ('cuid');
const db = require('./db');
// this is a model module
// this is on the inside of our api
// and is only responsible for getting and storing data (in this case locally)
// it is important to break the models out separately because it simplifies testing


// By default, mongoose will prevent us from persisting any properties absent from the schema object.
// default can also be useful in other cases such as automatically providing a timestamp (e.g. { timestamp: { type: Number, default: Date.now } })
const Product = db.model('Product', {
    _id: { type: String, default: cuid },
    description: String,
    imgThumb: String,
    img: String,
    link: String,
    userId: String,
    userName: String,
    userLink: String,
    tags: { type: [String], index: true}
})

const productsFile = path.join(__dirname, './products.json');

module.exports = {
    list,
    getById
}

async function list(opts = {}) {
    const { offset, limit, tag } = opts;

    const data = JSON.parse(await fs.readFile(productsFile));
    return data
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