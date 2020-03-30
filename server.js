var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');

var model = require('./model');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');




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

app.get('/edit/:id',is_authenticated ,(req,res)=> {
  var id = model.course_id(req.params.id);
  res.render('edit-course-form', id )
});

app.get('/delete/:id',is_authenticated ,(req,res) => {
  var id = model.course_id(req.params.id);
  res.render('delete', id)
});

app.get('/read/:id', is_authenticated,(req,res) => {
  var id = model.course_id(req.params.id);
  res.render('read', id);
});

app.get('/add',is_authenticated,(req,res) => {
  res.render('add');
 })


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



app.post('/edit/:id', (req,res) => {
  const id = req.params.id;
  var test = post_data_to_course(req);
  model.update(id,test );
  res.redirect('/courses_list', );

});


app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  model.delete(id);
  res.redirect('/courses_list');
});

app.post('/add',(req,res) => {
  var id = model.create(post_data_to_course(req));
  res.redirect('/courses_list')

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


function post_data_to_course(req) {
  return {
    subject: req.body.subject,
    title: req.body.title, 
    teacher: req.body.teacher,
    description: req.body.description,
  };
}



app.listen(3000, () => console.log('listening on http://localhost:3000'));