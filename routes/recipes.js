const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const db = require('../models')
const config = require('../config');

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.route('/home')
        .get((req, res) => {
            const recipes = [
                'recipe1',
                'recipe2'
            ]
            return res.json(recipes);
        })
}