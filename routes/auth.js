const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const db = require('../models')
const config = require('../config');

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.route('/register')
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
                        const payload = {
                            id: user.dataValues.id,
                            email: user.dataValues.email
                        };
                        const token = jwt.sign(payload, config.secretJWT);
                        return res.json({ message: "ok", token: token })
                    }
                })
        })

    router.route('/login')
        .post((req, res) => {
            db.user.findOne({ where: { email: req.body.email } }).then((user) => {
                if (user) {
                    if (bcrypt.compareSync(req.body.pass, user.dataValues.password)) {
                        const payload = {
                            id: user.dataValues.id,
                            email: user.dataValues.email
                        }
                        const token = jwt.sign(payload, config.secretJWT);
                        return res.json({ message: "ok", token: token });
                    } else {
                        return res.status(401).send('Incorrect password');
                    }
                }
                return res.send("Incorrect email");

            });
        });
    router.route('/')
        .get((req, res) => {
            let token = req.get('Authorization');
            jwt.verify(token, config.secretJWT, (err, decoded) => {
                if (err) {
                    res.status(401);
                    res.end();
                }
                if (decoded) {

                    db.user.findOne({ where: { id: decoded.id } }).then((user) => {
                        if (user) {
                            return res.json({ id: user.id, email: user.email });
                        } else {
                            res.status(401);
                            res.end();
                        }
                    });
                }
            });
        });
}