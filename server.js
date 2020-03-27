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

  
app.get('/',is_ided, (req,res) => {
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

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.get('/loginError', (req,res) => {
  res.render('loginError');

});

app.get('/signeUpchoice', (req,res)=>{
  res.render('signeUpchoice');
});

app.get('/signeInChoice' ,(req,res) =>{
  res.render('signeInChoice');

});

app.get('/loginTeacher',(req,res)=>{
  res.render('loginTeacher');

});



app.post('/loginStudent', (req,res)=> {
  var id = model.login_student(req.body.name, req.body.password);
  if (id === -1){
 res.redirect('/loginError');

  }
  else {
    req.session.user = id;
    res.redirect('/');
  } 
});

app.post('/new_student_user',(req,res)=> {
  //var newUser = model.new_user(req.body.name, req.body.password);
  //req.session.user = newUser;
  req.session.user = model.new_student_user(req.body.name, req.body.password);
  res.redirect('/');
});



function is_ided(req, res, next) {
  res.locals.authenticated = req.session.user !== undefined;
  return next();
}

app.use(is_ided);




app.listen(3000, () => console.log('listening on http://localhost:3000'));