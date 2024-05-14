const mongoose = require('mongoose')

mongoose.connect(
    process.nextTick.MONGO_URI || 'mongodb://localHost:27017/ecommerce-app',
    { useNewUrlParser: true, useCreateIndex: true }
    // these two parameters are not required but will help prevent deprecation warnings when using current versions
)

module.exports = mongoose