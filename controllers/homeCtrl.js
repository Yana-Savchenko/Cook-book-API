const _ = require('lodash');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');

const helpers = require('../helpers');

const home = async (req, res) => {
    try {
      const limit = 6;
      const direction = 'DESC';
      const queryParams = {
        limit,
        order: [["createdAt", direction]]
      }
      let recipes = await db.recipe.findAll(queryParams)
      const token = req.get('Authorization');
      if (token) {
        const decoded = jwt.verify(token, config.secretJWT);
        const user = await db.user.findById(decoded.id);
        userFavor = await user.getRecipes();
        userFavor = await _.groupBy(userFavor, el => el.dataValues.id);

        recipes = helpers.setFavorites(recipes, userFavor);
        return res.json(recipes);
      }
      return res.json(recipes);

    }
    catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  module.exports = {
    home,
}