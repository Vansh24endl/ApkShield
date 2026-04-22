const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'a_very_secure_fallback_secret_for_apk_shield';

module.exports = function (req, res, next) {
    // Authenticate using token in Authorization header, or query param for downloads
    const authHeader = req.header('Authorization');
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
