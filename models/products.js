const cuid = require ('cuid');
const db = require('../db');
const { urlSchema } = require('../lib/schema-helpers');

// this is a model module
// this is on the inside of our api
// and is only responsible for getting and storing data (in this case locally)
// it is important to break the models out separately because it simplifies testing


// By default, mongoose will prevent us from persisting any properties absent from the schema object.
// default can also be useful in other cases such as automatically providing a timestamp (e.g. { timestamp: { type: Number, default: Date.now } })
// required property create validation in mongoose that makes that field required when editing or creating an object with the model
const Product = db.model('Product', {
    _id: { type: String, default: cuid },
    description: { type: String, required: true },
    imgThumb: urlSchema({ type: String, required: true }),
    img: urlSchema({ required: true }),
    link: urlSchema(),
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userLink: urlSchema(),
    tags: { type: [String], index: true}
})

module.exports = {
    create,
    edit,
    getById,
    list,
    remove,
}

// queries

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

// manipulate database

async function create (fields) {
    // first create product in memory and then save() persists it to database
    const product = await new Product(fields).save();
    return product;
}

async function remove(_id) {
    await Product.deleteOne({_id});
}


// could use findByIdAndUpdate() to acheive this without the getById() call
// however it limits the use of hooks and validation so it isn't recommended with mongoose
async function edit(_id, change) {
    const product = await getById(_id);
    Object.keys(change).forEach(function (key) {
        product[key] = change[key];
    })

    await product.save();
    return product;
}