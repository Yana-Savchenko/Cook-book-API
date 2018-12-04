const multer = require('multer');

const checkAuth = require('../middlewares/authFunc');
const userCtrl = require('../controllers/userCtrl')

const upload = multer({ dest: './public/files/' });

module.exports = (router) => {

  router.use(checkAuth);

  router.route('/profile')
    .get(userCtrl.getUserData)
    .put(userCtrl.updUserData)

  router.route('/profile/avatar')
    .put(upload.single('avatar'), userCtrl.updUserAvatar)
}