const env = process.env.NODE_ENV || 'development';
const configJsonDev = require(__dirname + '/../config/config.json')[env];

const defaultConfig = {
    'salt': '10',
    'secretJWT': 'mysecretkey',
    'usersQty': 3,
};

const config = Object.assign(defaultConfig, configJsonDev)

module.exports = config; 

// const { cfg } = require('../../config')