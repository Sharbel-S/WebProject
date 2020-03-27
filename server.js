var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');


var model = require('./model');
var app = express();


app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cookieSession({
    secret: 'mot-de-passe-du-cookie'
  }));

app.listen(3000, () => console.log('listening on http://localhost:3000'));