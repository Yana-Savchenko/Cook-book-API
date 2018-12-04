const homeCtrl = require('../controllers/homeCtrl')

module.exports = (router) => {

  router.route('/')
    .get(homeCtrl.home);
}