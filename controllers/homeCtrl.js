const _ = require('lodash');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');

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

        recipes = recipes.map(recipe => {
          const id = recipe.dataValues.id;
          if (userFavor[id]) {
            recipe.dataValues.isLiked = true;
          }
          return recipe;
        })
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