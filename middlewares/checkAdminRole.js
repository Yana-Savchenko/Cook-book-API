const db = require('../models')

function checkAdminRole(req, res, next) {
    db.user.findOne({ where: { id: req.user.id } }).then((user) => {

        req.admin = (user.role === "admin")
        next();
    });
}

module.exports = checkAdminRole;