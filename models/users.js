const cuid = require ('cuid');
const db = require('../db');
const bcrypt = require('bcrypt');
const { emailSchema, usernameSchema } = require('../lib/schema-helpers');

const SALT_ROUNDS = 10;

const User = db.model('User', {
    _id: { type: String, default: cuid },
    username: usernameSchema(),
    password: { type: String, maxLength: 120, required: true },
    email: emailSchema({ required: true }),
})

module.exports = {
    create,
    isUsernameUnique
}

async function create (fields) {
    // first create product in memory and then save() persists it to database
    const user = await new User(fields).save();
    return user;
}

async function isUsernameUnique(doc, username) {
    const existing = await get(username);
    return !existing || doc._id === existing._id
}
