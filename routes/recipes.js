const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './public/files/' });
const db = require('../models')
const checkAuth = require('../middlewares/authFunc');

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.route('/')
        .post(checkAuth, upload.single('dish_photo'), (req, res) => {
            console.log('file', req.file);
            console.log(req.body);
            const dish_photo = { path: `/files/${req.file.filename}`, name: req.file.originalname };
            const payload = req.body;
            db.recipe.create({ ...payload, dish_photo, user_id: req.user.id })
                .then((recipe) => {
                    console.log('resipe', recipe.dataValues);
                    return res.json({ message: "ok" });
                })
                .catch(err => res.status(500).json({ message: err.message }))
        })
        .get((req, res) => {
            db.recipe.findAll()
                .then((recipes) => {
                    return res.json(recipes);
                })
        })
    router.route('/my-recipes')
        .get(checkAuth, (req, res) => {
            db.recipe.findAll({where: { user_id: req.user.id } })
            .then((recipes) => {
                return res.json(recipes);
            })
            .catch(err => res.status(500).json({ message: err.message }))
        })
    router.route('/home')
        .get((req, res) => {
            db.recipe.findAll()
                .then((recipes) => {
                    return res.json(recipes);
                })
        })
}