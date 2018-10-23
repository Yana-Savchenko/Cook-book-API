const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();
const checkAuth = require('../middlewares/authFunc');
const db = require('../models');

module.exports = (app) => {
    Object.keys(routes).forEach((routeName) => {
        const router = express.Router();

        // eslint-disable-next-line global-require, import/no-dynamic-require
        require(`./${routeName}`)(router);

        app.use(`/${changeCase.paramCase(routeName)}`, router);
    });
    app.get('/', (req, res) => {
        res.send("Hello!");
    })

};