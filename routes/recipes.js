const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './files/' });
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
                .then(recipe => console.log('resipe', recipe.dataValues))
                .catch(err => res.status(500).json({ message: err.message }))

            return res.json({ message: "ok" });
        })
        .get((req, res) => {
            db.recipe.findAll()
                .then((recipes) => {
                    return res.json(recipes);
                })
        })

    router.route('/home')
        .get((req, res) => {
            db.recipe.findAll()
                .then((recipes) => {
                    return res.json(recipes);
                })
        })
}