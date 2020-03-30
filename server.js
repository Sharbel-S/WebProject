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


// GET methodes

app.get('/' ,(req,res) => {
    res.render('index');
});


app.get('/signInChoice' ,(req,res) =>{
  res.render('signInChoice');

});

app.get('/loginStudent' ,(req,res)=> {
  res.render('loginStudent');
});

app.get('/loginError', (req,res) => {
  res.render('loginError');
});

app.get('/loginTeacher',(req,res)=>{
  res.render('loginTeacher');
});

app.get('/loginErrorT',(req,res)=> {
  res.render('loginErrorT');
});

app.get('/signUpchoice', (req,res)=>{
  res.render('signUpchoice');
});

app.get('/new_student_user',(req,res)=> {
  res.render('new_student_user')
});

app.get('/new_teacher_user',(req,res) =>{
  res.render('new_teacher_user');
});

app.get('/test' , is_authenticated,(req,res)=> {
  res.render('test');
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.get('/t', is_authenticated ,(req,res) =>{
  res.render('t');
});

app.get('/about',(req,res) => {
  res.render('about');

});

app.get('/courses_list',is_authenticated, (req,res) => {
  var results = model.courses_list();
  res.render('courses_list',  {list:results} );
});



//POST methodes

app.post('/loginStudent',(req,res)=> {
  var id = model.login_student(req.body.name, req.body.password);
  if (id === -1){
 res.redirect('/loginError');
  }
  else {
    req.session.student_user = id;
    res.redirect('/t');
  } 
});

app.post('/loginTeacher' , (req, res)=> {
  var id = model.login_teacher(req.body.name, req.body.password);
  if (id === -1){
    res.redirect('/loginErrorT');
  }
  else{
    req.session.teacher_user = id;
    res.redirect('/t');
  }

});

app.post('/new_student_user',(req,res)=> {
  req.session.student_user = model.new_student_user(req.body.name, req.body.password);
  res.redirect('/test');
});


app.post('/new_teacher_user',(req,res)=> {
  req.session.teacher_user = model.new_teacher_user(req.body.name, req.body.password);
  res.redirect('/test');
});




// Functions

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