const multer = require('multer');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const upload = multer({ dest: './public/files/' });
const db = require('../models')
const checkAuth = require('../middlewares/authFunc');
const config = require('../config');

const Op = Sequelize.Op;

module.exports = (router) => {

  router.route('/')
    .post(checkAuth, upload.single('dish_photo'), (req, res) => {
      const dish_photo = { path: `/files/${req.file.filename}`, name: req.file.originalname };
      const payload = req.body;
      db.recipe.create({ ...payload, dish_photo, user_id: req.user.id })
        .then((recipe) => {
          console.log('resipe', recipe.dataValues);
          return res.json({ message: "ok" });
        })
        .catch(err => res.status(500).json({ message: err.message }))
    })
    .get(async (req, res) => {
      try {
        const { query } = req;
        const filter = {
          where: {}
        }
        let userFavor = [];

        if ('category_id' in query) {
          filter.where.category_id = query.category_id
        }
        const token = req.get('Authorization');
        if (token) {
          const decoded = jwt.verify(token, config.secretJWT);
          const user = await db.user.findById(decoded.id);
          userFavor = await user.getRecipes();
          userFavor = await _.groupBy(userFavor, el => el.dataValues.id);

        }
        let recipes = await db.recipe.findAll(filter)

        recipes = recipes.map(recipe => {
          const id = recipe.dataValues.id;
          if (userFavor[id]) {
            recipe.dataValues.isLiked = true;
          }
          return recipe
        })
        return res.json(recipes);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }


    })
  router.route('/my-recipes')
    .get(checkAuth, async (req, res) => {
      try {
        const user = await db.user.findById(req.user.id);
        userFavor = await user.getRecipes();
        userFavor = await _.groupBy(userFavor, el => el.dataValues.id);
        let recipes = await db.recipe.findAll({ where: { user_id: req.user.id } });
        recipes = recipes.map(recipe => {
          const id = recipe.dataValues.id;
          if (userFavor[id]) {
            recipe.dataValues.isLiked = true;
          }
          return recipe;
        })
        return res.json(recipes);
      }
      catch (err) {
        return res.status(500).json({ message: err.message });
      }
    })

  router.route('/recipe/:id')
    .get((req, res) => {
      db.recipe.findOne({
        where: { id: req.params.id },
        include: { model: db.category },
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
          }
          const token = req.get('Authorization');
          if (token) {
            const decoded = jwt.verify(token, config.secretJWT);
            if (recipe.dataValues.user_id === decoded.id) {
              recipeData.isEdit = true;
            } else {
              recipeData.isEdit = false;
            }
          } else {
            recipeData.isEdit = false;
          }
          return res.json(recipeData);
        })
        .catch(err => res.status(500).json({ message: err.message }))
    })
    .put(checkAuth, upload.single('dish_photo'), (req, res) => {
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
    })

  router.route('/home')
    .get((req, res) => {
      const limit = 6;
      const direction = 'DESC';
      const queryParams = {
        limit,
        order: [["createdAt", direction]]
      }
      db.recipe.findAll(queryParams)
        .then((recipes) => {
          return res.json(recipes);
        })
        .catch(err => res.status(500).json({ message: err.message }))
    })

  router.route('/favorite')
    .get(checkAuth, async (req, res) => {
      try {
        const user = await db.user.findById(req.user.id);
        let favor = await user.getRecipes();
        favor = favor.map(recipe => {
          recipe.dataValues.isLiked = true;
          return recipe
        })
        return res.json(favor);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    })
    .post(checkAuth, async (req, res) => {
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
    })
    .delete(checkAuth, async (req, res) => {
      try {
        const user = await db.user.findById(req.user.id);
        let favor = await user.removeRecipe(req.query.recipe_id);
        return res.json('ok');
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    })

  router.route('/search')
    .get(async (req, res) => {
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
          userFavor = await user.getRecipes();
          userFavor = await _.groupBy(userFavor, el => el.dataValues.id);

          recipes = recipes.map(recipe => {
            const id = recipe.dataValues.id;
            if (userFavor[id]) {
              recipe.dataValues.isLiked = true;
            }
            return recipe;
          })
        }

        return res.json(recipes);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    })
}