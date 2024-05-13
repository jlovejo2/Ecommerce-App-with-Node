module.exports = {
    cors,
    handleError,
    notFound
}

function cors(req, res, next) {
    const origin = req.headers.origin;
    
    //this tells the browser that our server will accept data no matter which origin the html is loaded from.
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, XMODIFY');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    next();
}

function handleError(err, req, res, next) {
    console.error(err);
    // the best practice is to only respond if res.headersSent is false within a custom error handler.
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal Error' })
}

function notFound (req, res) {
    res.status(404).json({ error: 'Not Found' })
}