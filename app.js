const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const router = require('./routes')

// set hbs engine
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors());
app.use(express.static(`${__dirname}/public`));

router(app);


app.listen(3000, () => {
    console.log('Server started on 3000');
    
});




