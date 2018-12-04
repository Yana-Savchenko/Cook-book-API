const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const db = require('../models')

const Op = Sequelize.Op

const getUserData = (req, res) => {
    db.user.findOne({ where: { id: req.user.id } }).then((user) => {
        const userData = {
            firstName: user.dataValues.firstName,
            lastName: user.dataValues.lastName,
            email: user.dataValues.email,
            age: user.dataValues.age,
            avatar: user.dataValues.avatar_path,
        }

        return res.json(userData);
    })
        .catch(err => res.status(500).json({ message: err.message }))
}

const updUserData = async (req, res) => {
    try {
      const user = await db.user.findOne({
        where: {
          [Op.and]: [{ email: req.body.email },
          { id: { [Op.not]: req.user.id } }]
        }
      })

      if (user) {
        return res.status(400).json({ message: 'This email alredy used' })
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
  }

  const updUserAvatar = (req, res) => {
    db.user.findOne({ where: { id: req.user.id } }).then((user) => {
      return db.user.update(
        {
          avatar_path: `/files/${req.file.filename}`,
          avatar_name: req.file.originalname,
        },
        { where: { id: req.user.id } }
      ).then((data) => {
        if (user.dataValues.avatar_path) {
          const oldPath = path.resolve(__dirname, '../') + '/public' + user.dataValues.avatar_path;
          console.log(oldPath);

          fs.unlinkSync(oldPath);
        }
        return res.json({ path: `/files/${req.file.filename}` })
      });
    })
      .catch(err => res.status(500).json({ message: err.message }))
  }

module.exports = {
    getUserData,
    updUserData,
    updUserAvatar,
}