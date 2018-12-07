const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const db = require('../models')
const config = require('../config');
const helpers = require('../helpers');

const Op = Sequelize.Op;

const myRecipes = async (req, res) => {
  try {
    const user = await db.user.findById(req.user.id);
    let userFavor = await user.getRecipes();
    userFavor = await _.groupBy(userFavor, el => el.dataValues.id);
    let recipes = await db.recipe.findAll({ where: { user_id: req.user.id } });
    recipes = helpers.setFavorites(recipes, userFavor);
    return res.json(recipes);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const getRecipes = async (req, res) => {
  try {
    const { query } = req;
    const filter = {
      where: {}
    }
    let userFavor = [];

    if ('category_id' in query) {
      filter.where.category_id = query.category_id
    }
    if ('user_id' in query) {
      filter.where.user_id = query.user_id
      filter.include = [{ model: db.user }]
    }
    const token = req.get('Authorization');
    if (token) {
      const decoded = jwt.verify(token, config.secretJWT);
      const user = await db.user.findById(decoded.id);
      userFavor = await user.getRecipes();
      userFavor = await _.groupBy(userFavor, el => el.dataValues.id);
    }
    let recipes = await db.recipe.findAll(filter)
    recipes = helpers.setFavorites(recipes, userFavor);
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const newRecipe = (req, res) => {
  const dish_photo = { path: `/files/${req.file.filename}`, name: req.file.originalname };
  const payload = req.body;
  db.recipe.create({ ...payload, dish_photo, user_id: req.user.id })
    .then((recipe) => {
      console.log('resipe', recipe.dataValues);
      return res.json({ message: "ok" });
    })
    .catch(err => res.status(500).json({ message: err.message }))
}

const getRecipe = (req, res) => {
  db.recipe.findOne({
    where: { id: req.params.id },
    include: [{ model: db.category }, { model: db.user }],
  })
    .then((recipe) => {
      const recipeData = {
        title: recipe.dataValues.title,
        content: recipe.dataValues.content,
        category: recipe.dataValues.category.dataValues.category_name,
        category_id: recipe.dataValues.category_id,
        complexity: recipe.dataValues.complexity,
        cookingTime: recipe.dataValues.cooking_time,
        dishPhoto: recipe.dataValues.dish_photo,
        userId: recipe.dataValues.user.dataValues.id,
        userName: {
          firstName: recipe.dataValues.user.dataValues.firstName,
          lastName: recipe.dataValues.user.dataValues.lastName,
        }
      }
      const token = req.get('Authorization');
      if (token) {
        const decoded = jwt.verify(token, config.secretJWT);
        recipeData.isEdit = recipe.dataValues.user_id === decoded.id;
        return db.favorite.findOne(
          { where: { user_id: decoded.id, recipe_id: req.params.id } }
        ).then((favor) => {
          recipeData.isLiked = !!favor;
          return res.json(recipeData);
        }).catch(err => {
          console.log('err is', err)
          return res.status(500).json({ error: err.message })
        });
      } else {
        recipeData.isEdit = false;
        recipeData.isLiked = false;
      }
      return res.json(recipeData);
    })
    .catch(err => res.status(500).json({ message: err.message }))
}

const updRecipe = (req, res) => {
  console.log(req.body);

  const payload = { ...req.body };
  db.recipe.update(payload,
    { where: { id: req.params.id } })
    .then(() => {
      console.log('upd');
      return res.json("ok");
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message })
    })
}

const getFavorite = async (req, res) => {
  try {
    const user = await db.user.findById(req.user.id);
    let favor = await user.getRecipes();
    favor = favor.map(recipe => {
      recipe.dataValues.isLiked = true;
      return recipe;
    })
    return res.json(favor);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const addFavorite = async (req, res) => {
  try {
    const payload = {
      user_id: req.user.id,
      recipe_id: req.body.recipe_id,
    }
    db.favorite.create(payload).then(() => {
      return res.json('ok');
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const removeFavorite = async (req, res) => {
  try {
    const user = await db.user.findById(req.user.id);
    await user.removeRecipe(req.query.recipe_id);
    return res.json('ok');
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const searchRecipes = async (req, res) => {
  try {
    const { query } = req;
    let queryParams = { where: {} };
    queryParams.where = {
      title: { [Op.iLike]: `%${query.search_data}%` },
    }
    if ('category_id' in query) {
      queryParams.where.category_id = query.category_id
    }

    if ('sort_complexity' in query) {
      const direction = (query.sort_complexity === 'down') ? 'ASC' : 'DESC';
      queryParams.order = [["complexity", direction]]
    }

    if ('sort_cooking_time' in query) {
      const direction = (query.sort_cooking_time === 'down') ? 'ASC' : 'DESC';
      queryParams.order = [["cooking_time", direction]];
    }

    if ('filter_complexity' in query) {
      queryParams.where.complexity = { $lte: +query.filter_complexity }
    }

    if ('filter_time' in query) {
      queryParams.where.cooking_time = { [Op.lte]: query.filter_time }
    }

    let recipes = await db.recipe.findAll(queryParams);

    const token = req.get('Authorization');
    if (token) {
      const decoded = jwt.verify(token, config.secretJWT);
      const user = await db.user.findById(decoded.id);
      let userFavor = await user.getRecipes();
      userFavor = await _.groupBy(userFavor, el => el.dataValues.id);

      recipes = helpers.setFavorites(recipes, userFavor);
    }

    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  myRecipes,
  getRecipes,
  newRecipe,
  getRecipe,
  updRecipe,
  getFavorite,
  addFavorite,
  removeFavorite,
  searchRecipes,
}