const cuid = require ('cuid');
const db = require('../db');
const bcrypt = require('bcrypt');
const { emailSchema, isAlphanumeric } = require('../lib/schema-helpers');

const SALT_ROUNDS = 10;

const User = db.model('User', {
    _id: { type: String, default: cuid },
    username: usernameSchema(),
    password: { type: String, maxLength: 120, required: true },
    email: emailSchema({ required: true }),
})

module.exports = {
    create,
    edit,
    get,
    list,
    remove
}

async function create (fields) {
    // first create product in memory and then save() persists it to database
    const user = await new User(fields)
    await hasPassword(user)
    await user.save()
    return user;
}

async function edit ( username, change ) {
    const user = await get(username);
    Object.keys(change).forEach(key => { user[key] = change[key] })
    if (change.password) await hasPassword(user)
    await user.save()
    return user;
}

async function get (username) {
    const user = await User.findOne({ username });
    return user;
}

async function list (opts = {}) {
    const { offset = 0, limit = 25 } = opts;
    const users = await User.find()
        .sort({ _id: 1})
        .skip(offset)
        .limit(limit)
    
    return users;
}

async function remove (username) {
    await User.deleteOne({ username })
}

async function hasPassword(user) {
    if (!user.password) throw user.invalidate('password', 'password is required');
    if (user.password.length < 15) throw user.invalidate('password', 'password must be at lest 15 characters');

    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
}

async function isUsernameUnique(doc, username) {
    const existing = await get(username);
    return !existing || doc._id === existing._id;
}

// unique: true in mongoose schema creates a unique index in MongoDB. So when a duplicate username is created its MongoDB that throws the error
// this is the purpose for the isUnique function in the validate.  This will allow mongoose to throw the error so the error is formatted similarly to other errors
function usernameSchema () {
    return {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 20,
        validate: [
            {
                validator: isAlphanumeric,
                message: props => `${props.value} contains special characters`
            },
            {
                validator: str => !str.match(/^admin$/i),
                message: props => 'Invalid username'
            },
            {
                validator: function(username) { return isUsernameUnique (this, username )},
                message: props => 'Username is taken'
            }
        ]
    }
}
