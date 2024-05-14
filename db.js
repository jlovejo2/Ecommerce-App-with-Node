const mongoose = require('mongoose')

// mongoose 6 and above
// operates as these are always true useNewUrlParser, useUnifiedTopology, useCreateIndex 
// and useFindandModify is false

mongoose.connect(
    process.nextTick.MONGO_URI || 'mongodb://localHost:27017/ecommerce-app',
    // these two parameters are not required but will help prevent deprecation warnings when using current versions
)

module.exports = mongoose