const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp

const db = require('../models')
const config = require('../config');

const register = async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { email: req.body.email }
    })

    if (user) {
      return res.status(400).json({ message: 'This email alredy used' })
    }
    let hash = bcrypt.hashSync(req.body.pass, config.salt);
    await db.user.create({
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
      });

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const login = (req, res) => {
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
        return res.status(400).send({ message: 'Incorrect password' });
      }
    }
    return res.status(400).send({ message: "Incorrect email" });

  })
    .catch(err => res.status(500).json({ message: err.message }))
}

module.exports = {
  register,
  login
}