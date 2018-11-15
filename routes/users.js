const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './public/files/' });
const db = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
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

                return res.json(userData);
            })
        })
        .put(async (req, res) => {
            try { 
                const user = await db.user.findOne({
                    where: {
                        [Op.and]: [{ email: req.body.email },
                        { id: { [Op.not]: req.user.id } }]
                    }
                })
                
                if (user) {
                    return res.status(400).json({ message: 'Invalid email' })
                }
                await db.user.update({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    age: req.body.age
                },
                    { where: { id: req.user.id } })
                    .then(() => {
                        console.log('upd');
                    });
                return res.json("ok")

            } catch (err) {
                return res.status(500).json({ message: err.message })
            }

        })
}