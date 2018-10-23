var jwt = require('jsonwebtoken');
const config = require('../config');
function checkAuth(req, res, next) {
    if(!req.get('cookie')){
        return res.redirect('/auth/sign-in');
    }
    console.log('JWT', config.secretJWT);
    
    let token = req.get('cookie').replace('token=', '');
    jwt.verify(token, config.secretJWT, (err, decoded) => {
        if (err) {
            return res.redirect('/auth/sign-in');
        }
        if (decoded) {
            req.user = decoded;
            next();
        }
    });
}
module.exports = checkAuth;