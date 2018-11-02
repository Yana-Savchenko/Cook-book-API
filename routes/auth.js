const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const db = require('../models')
const config = require('../config');

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.route('/sign-up')
        .post((req, res) => {
            let hash = bcrypt.hashSync(req.body.pass, config.salt);
            db.user.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                age: req.body.age,
                password: hash,
                role: "user"
            })
                .then((user) => {
                    if (user) {
                        return res.redirect('/auth/sign-in');
                    }
                })
        })

    router.route('/sign-in')
        .post((req, res) => {
            db.user.findOne({ where: { email: req.body.email } }).then((user) => {
                if (user) {
                    if (bcrypt.compareSync(req.body.pass, user.dataValues.password)) {
                        const payload = {
                            id: user.dataValues.id,
                            email: user.dataValues.email
                        }
                        const token = jwt.sign(payload, config.secretJWT);
                        return res.json({ message: "ok", token: token, user: user.dataValues });
                    } else {
                        return res.status(401).send('Incorrect password');
                    }
                }
                return res.send("Incorrect email");

            });
        });
    router.route('/register')
        .post((req, res) => {
            console.log('ok');

            console.log(req.body);
            res.json({ name: req.body.firstName, age: req.body.age });

        });
    router.route('/login')
        .post((req, res) => {
            console.log(req.body);
            res.json({ email: req.body.email });

        });
}