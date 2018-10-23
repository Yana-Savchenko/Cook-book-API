const db = require('../models')

function checkAccess(req, res, next) {
    db.user.findOne({ where: { id: req.user.id } }).then((user) => {

        req.admin = (user.role === "admin")
        next();
    });
}

module.exports = checkAccess;