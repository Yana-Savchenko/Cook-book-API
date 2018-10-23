const express = require("express");
const app = express();
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const router = require('./routes')

// set hbs engine
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use(express.static('views'));

router(app);


app.listen(3000);