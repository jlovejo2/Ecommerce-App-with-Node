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
    create,
    list,
    getById
}

async function create (fields) {
    // first create product in memory and then save() persists it to database
    const product = await new Product(fields).save()
    return product
}

async function list(opts = {}) {
    const { offset = 0, limit = 25, tag } = opts;

    const query = tag ? {tags : tag} : {}
    // currently will return products in order they were created because of sort on _id
    const products = await Product.find(query)
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)
    
    return products;
};

async function getById(_id) {
    const product = await Product.findById(_id);
    return product;
}