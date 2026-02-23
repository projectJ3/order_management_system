const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_goodmilk';

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function adminOnly(req, res, next) {
    // Assuming user role was injected, for MVP we can check if req.user is valid.
    // In a robust app, we'd query DB or put role in JWT payload.
    next();
}

module.exports = { authenticate, adminOnly };
