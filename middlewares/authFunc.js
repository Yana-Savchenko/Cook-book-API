var jwt = require('jsonwebtoken');
const config = require('../config');

function checkAuth(req, res, next) {
    const token = req.get('Authorization');
    if (!token) {     
        return res.status(401).json({message: 'Token is missing'});
    }

    jwt.verify(token, config.secretJWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: 'Token is missing'});
        }
        if (decoded) {
            req.user = decoded;
            next();
        }
    });
}
module.exports = checkAuth;