const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './public/files/' });
const db = require('../models')
const checkAuth = require('../middlewares/authFunc');

module.exports = (router) => {

    router.use(checkAuth);

    router.route('/profile')
        .get((req, res) => {
            db.user.findOne({ where: { id: req.user.id } }).then((user) => {
                const userData = {
                    firstName: user.dataValues.firstName,
                    lastName: user.dataValues.lastName,
                    email: user.dataValues.email,
                    age: user.dataValues.age,
                }
                console.log(userData);
                
                return res.json(userData);
            })
        })
}