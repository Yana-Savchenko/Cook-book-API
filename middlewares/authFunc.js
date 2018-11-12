var jwt = require('jsonwebtoken');
const config = require('../config');
function checkAuth(req, res, next) {
    const token = req.get('Authorization');
    if (!token) {
        res.status(401);
        return res.end();
    }

    jwt.verify(token, config.secretJWT, (err, decoded) => {
        if (err) {
            res.status(401);
            return res.end();
        }
        if (decoded) {
            req.user = decoded;
            next();
        }
    });
}
module.exports = checkAuth;