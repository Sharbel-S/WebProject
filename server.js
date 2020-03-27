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

  
app.get('/' ,(req,res) => {
    res.render('index');
});

app.get('/loginStudent' ,(req,res)=> {
  res.render('loginStudent');
});

app.get('/test' , is_authenticated,(req,res)=> {
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

app.get('/loginErrorT',(req,res)=> {
  res.render('loginErrorT');

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



app.post('/loginStudent',(req,res)=> {
  var id = model.login_student(req.body.name, req.body.password);
  if (id === -1){
 res.redirect('/loginError');

  }
  else {
    req.session.student_user = id;
    res.redirect('/test');
  } 
});

app.post('/loginTeacher' , (req, res)=> {
  var id = model.login_teacher(req.body.name, req.body.password);
  if (id === -1){
    res.redirect('/loginErrorT');
  }
  else{
    req.session.teacher_user = id;
    res.redirect('/test');
  }

});

app.post('/new_student_user',(req,res)=> {
  //var newUser = model.new_user(req.body.name, req.body.password);
  //req.session.user = newUser;
  req.session.student_user = model.new_student_user(req.body.name, req.body.password);
  res.redirect('/');
});



function is_authenticated(req, res, next) {
  if(req.session.student_user !== undefined) {
    res.locals.authen_student = true;
    res.locals.authenticated = true;
    return next();
  }
  if(req.session.teacher_user !== undefined) {
    res.locals.authen_teacher = true;
    res.locals.authenticated = true;
    return next();
  }
  res.status(401).send('Authentication required');
}




app.listen(3000, () => console.log('listening on http://localhost:3000'));