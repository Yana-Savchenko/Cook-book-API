const authCtrl = require('../controllers/authCtrl')

module.exports = (router) => {

  router.route('/register')
    .post(authCtrl.register)

  router.route('/login')
    .post(authCtrl.login);
}