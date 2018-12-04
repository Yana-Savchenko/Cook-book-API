const multer = require('multer');

const upload = multer({ dest: './public/files/' });
const checkAuth = require('../middlewares/authFunc');
const recipeCtrl = require('../controllers/recipeCtrl')



module.exports = (router) => {

  router.route('/')
    .post(checkAuth, upload.single('dish_photo'), recipeCtrl.newRecipe)
    .get(recipeCtrl.getRecipes)

  router.route('/my-recipes')
    .get(checkAuth, recipeCtrl.myRecipes)

  router.route('/recipe/:id')
    .get(recipeCtrl.getRecipe)
    .put(checkAuth, upload.single('dish_photo'), recipeCtrl.updRecipe)

  router.route('/favorite')
    .get(checkAuth, recipeCtrl.getFavorite)
    .post(checkAuth, recipeCtrl.addFavorite)
    .delete(checkAuth, recipeCtrl.removeFavorite)

  router.route('/search')
    .get(recipeCtrl.searchRecipes)
}