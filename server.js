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

app.get('/', (req,res) => {
  res.render('index' ,{authenticated: res.locals.authenticated});
});

app.get('/loginStudent' ,(req,res)=> {
  res.render('loginStudent');
});

app.get('/test' ,(req,res)=> {
  res.render('test');
});

app.get('/new_student_user',(req,res)=> {
  res.render('new_student_user')
});


app.listen(3000, () => console.log('listening on http://localhost:3000'));