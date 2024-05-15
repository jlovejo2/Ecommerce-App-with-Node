const { isURL, isEmail } = require("validator");

module.exports = {
    emailSchema,
    urlSchema
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