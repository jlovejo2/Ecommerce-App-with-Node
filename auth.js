const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const sessionsSecret = process.env.SESSION_SECRET || 'mark it zero';
// article that discusses the concept of a complex secret in production
// https://martinfowler.com/articles/session-secret.html
const adminPassword = process.env.ADMIN_PASSWORD || 'mystical_narwhal';

passport.use(adminStrategy())
passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))
const authenticate = passport.authenticate('local')

module.exports = {
    setMiddleware,
    authenticate,
    login, 
    ensureAdmin
}

function setMiddleware(app) {
    app.use(session())
    app.use(passport.initialize())
    app.use(passport.session())
}

function session() {
    return expressSession({
        secret: sessionsSecret,
        resave: false,
        saveUninitialized: false
    })
}

function login (req, res, next) {
    res.json({ successful: true })
}

function ensureAdmin(req, res ,next) {
    const isAdmin = req.user && req.user.username === 'admin';
    if (isAdmin) return next();

    const err = new Error('tsk tsk.  You are Unauthorized to perform this action')
    err.statusCode = 401;
    next(err);
}

function adminStrategy() {
    return new Strategy(function (username, password, cb) {
        const isAdmin = ( username === 'admin') && (password === adminPassword)
        if (isAdmin) cb(null, { username: 'admin'})
        else cb(null, false)
    })
}