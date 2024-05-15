const cuid = require ('cuid');
const db = require('../db');
const { emailSchema, urlSchema } = require('../lib/schema-helpers');

// this ref option needs to match exactly the name passed to the Db.model in the model/products.js to work properly
const Order = db.model('Order', {
    _id: { type: String, default: cuid},
    buyerEmail: emailSchema({ required: true}),
    products: [
        {
            type: String,
            ref: 'Product',
            index: true,
            required: true
        }
    ],
    status: {
        type: String,
        index: true,
        default: 'CREATED',
        enum: ['CREATED', 'PENDING', 'COMPLETED']
    }
})

module.exports = {
    create,
    getById,
    list,
}

// queries

async function list(opts = {}) {
    const { offset = 0, limit = 25, productID, status } = opts;

    // currently will return products in order they were created because of sort on _id
    const orders = await Order.find()
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)
        .populate('products')
        .exec();
    
    return orders;
};

async function getById(_id) {
    // use of populate() and exec() here is how mongoose can populate the order modle using the ref: 'Product' specified in model
    const order = await Order.findById(_id)
        .populate('products')
        .exec()
    
        return order;
}

// data manipulation

async function create(fields) {
    const order = await new Order(fields).save();
    await order.populate('products');
    return order;
}

