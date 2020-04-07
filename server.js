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

app.get('/principal_page', is_authenticated ,(req,res) =>{
  if(req.session.student_name === undefined) {
    res.render('principal_page', {name: req.session.teacher_name})
  }
  else{
    res.render('principal_page' , {name: req.session.student_name} );
  }
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
  var id = model.course_id(req.params.id);   //changer le nom de la fontion 
  var likers = model.likers_number(req.params.id);
  var result = finalResults(id, likers);
  res.render('read', result );
});

app.get('/add',is_authenticated,(req,res) => {
  res.render('add');
 })

 app.get('/add_confirmation', is_authenticated,(req,res) => {
   res.render('add_confirmation');
 });

 app.get('/search',is_authenticated, (req,res) => {
  var results = model.search(req.query.query);
  res.render('search',  {list:results} );
});

app.get('/like/:id',is_authenticated , (req, res) => {
    model.add_like(post_data_to_likers(req));
    res.redirect('/courses_list');
});

app.get('/unlike/:id', is_authenticated, (req,res) => {
  model.remove_like(post_data_to_likers(req));
  res.redirect('/courses_list');
});

app.get('/likers/:id' , is_authenticated, (req, res) => {
  var likers_list = model.get_likers_list(req.params.id);
  res.render('likers' , { likers_list:likers_list})

});

app.get('/favorite/:id' , is_authenticated, (req,res) => {
  console.log("id " + req.params.id);
  var results = model.course_id(req.params.id);
  model.add_to_favorite(post_data_to_favorite(req, results));
  res.redirect('/courses_list' );
})

app.get('/favorite_list', is_authenticated, (req,res) => {
  var favorite_list = model.get_favorite_list(req.session.student_name);
  res.render('favorite_list', {list: favorite_list})

});

app.get('/my_courses' , is_authenticated , (req, res ) => {
  var my_courses = model.get_my_courses(req.session.teacher_name)
  res.render('my_courses' , {list: my_courses });
});


app.get('/remove_favorite/:id' , is_authenticated, (req, res) => {
  model.remove_from_favorite(req.params.id);
  res.redirect('/courses_list')
});

app.get('/my_profile' , is_authenticated, (req,res) => {
  res.render('my_profile');
})

app.get('/change_name', is_authenticated, (req,res) => {
  res.render('change_name');
});

//POST methodes

app.post('/change_name', (req,res) => {
  if(req.session.student_name === undefined) {
    var valide_name_password = model.login_teacher(req.body.name, req.body.password);
    if (valide_name_password === -1){
      res.redirect('/loginError');
       }
       else {
         model.change_teacher_name(req.body.name, req.body.password, req.body.new_name);
         req.session.student_name = req.body.name;
         res.redirect('/principal_page');
       } 
  }
  else{
    var valide_name_password = model.login_student(req.body.name, req.body.password);
    if (valide_name_password === -1){
      res.redirect('/loginError');
       }
       else {
         model.change_student_name(req.body.name, req.body.password, req.body.new_name);
         req.session.student_name = req.body.name;
         res.redirect('/principal_page');
       } 
  }
});




app.post('/loginStudent',(req,res)=> {
  var id = model.login_student(req.body.name, req.body.password);
  if (id === -1){
 res.redirect('/loginError');
  }
  else {
    req.session.student_user = id;
    req.session.student_name = req.body.name;
    res.redirect('/principal_page');
  } 
});

app.post('/loginTeacher' , (req, res)=> {
  var id = model.login_teacher(req.body.name, req.body.password);
  if (id === -1){
    res.redirect('/loginErrorT');
  }
  else{
    req.session.teacher_user = id;
    req.session.teacher_name = req.body.name;
    res.redirect('/principal_page');
  }

});

app.post('/new_student_user',(req,res)=> {
  req.session.student_user = model.new_student_user(req.body.name, req.body.password);
  req.session.student_name = req.body.name;
  res.redirect('/principal_page');
});


app.post('/new_teacher_user',(req,res)=> {
  req.session.teacher_user = model.new_teacher_user(req.body.name, req.body.password);
  req.session.teacher_name = req.body.name;

  res.redirect('/principal_page');
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
  res.redirect('/add_confirmation');
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
    teacher: req.session.teacher_name,
    description: req.body.description,
  };
}


function post_data_to_likers(req) {
  return {
    name: req.session.student_name,
    course_id: req.params.id,
  };
  
}

function post_data_to_favorite(req ,results){
  return {
  name: req.session.student_name,
  course_id: results.id,
  course_subject: results.subject,
  course_title: results.title,
  course_teacher: results.teacher,
  }
}

function finalResults(id, likers) {
  return {
    id: id.id,
    subject: id.subject,
    title: id.title,
    teacher: id.teacher,
    description: id.description,
    likers: likers.likers,

  };
}

app.listen(3000, () => console.log('listening on http://localhost:3000'));