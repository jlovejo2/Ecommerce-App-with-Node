const { isURL } = require("validator");

module.exports = {
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