const { isURL, isEmail, isAlphanumeric, isUnique } = require("validator");
const { isUsernameUnique } = require("../models/users");

module.exports = {
    emailSchema,
    urlSchema,
    userSchema
}

function emailSchema( opts = {}) {
    const { required } = opts;
    return { 
        type: String,
        required: !!required,
        validate: {
            validator: isEmail,
            message: props => `${props.value} is not a valid email address.`
        }
    }
}

function urlSchema ( opts = {}) {
    const { required } = opts;
    return { 
        type: String,
        required: !!required,
        validate: {
            validator: isURL,
            message: props => `${props.value} is not a valid URL.`
        }
    }
}

// unique: true in mongoose schema creates a unique index in MongoDB. So when a duplicate username is created its MongoDB that throws the error
// this is the purpose for the isUnique function in the validate.  This will allow mongoose to throw the error so the error is formatted similarly to other errors
function userSchema () {
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