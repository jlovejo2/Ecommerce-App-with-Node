const passport = require('passport');
const bcrypt = require('bcrypt');
const Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const autocatch = require('./lib/auto-catch');
const Users = require('./models/users');


// article that discusses the concept of a complex secret in production
// https://martinfowler.com/articles/session-secret.html
// jwt brute force article
// https://auth0.com/blog/brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts/
const sessionsSecret = process.env.SESSION_SECRET || 'mark it zero';
const adminPassword = process.env.ADMIN_PASSWORD || 'mystical_narwhal';
const jwtSecret = process.env.JWT_SECRET || 'this is my jwt secret woohoo';
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' };

passport.use(adminStrategy())
const authenticate = passport.authenticate('local', { session: false })

module.exports = {
    authenticate,
    login: autocatch(login), 
    ensureUser: autocatch(ensureUser)
}

async function login (req, res, next) {
    const token = await sign({ username: req.user.username });
    res.cookie('jwt', token, { httpOnly: true });
    res.json({ successful: true, token: token });
}

async function sign ( payload ) {
    const token = await jwt.sign(payload, jwtSecret, jwtOpts );
    return token;
}

async function verify ( jwtString = '' ) {
    jwtString = jwtString.replace(/^Bearer /i, '');

    try {
        const payload = await jwt.verify(jwtString, jwtSecret);
        return payload;
    } catch(err) {
        err.statusCode = 401;
        throw (err);
    }
}

async function ensureUser(req, res ,next) {
    const jwtString = req.headers.authorization || req.cookies.jwt;
    const payload = await verify(jwtString);

    if (payload.username) {
        req.user = payload;
        if (payload.username === 'admin') req.isAdmin = true;
        return next();
    } else {
        const err = new Error('tsk tsk.  You are Unauthorized to perform this action')
        err.statusCode = 401;
        next(err);
    }
}

function adminStrategy() {
    return new Strategy(async function (username, password, cb) {
        const isAdmin = ( username === 'admin') && (password === adminPassword)
        if (isAdmin) cb(null, { username: 'admin'})

        try {
            const user = await Users.get(username);
            if (!user) return cb(null, false);

            const isUser = await bcrypt.compare(password, user.password);
            if (isUser) return cb(null, { username: user.username})
        } catch(err) { 
            console.log(err)
        }
        
        cb(null, false)
    })
}