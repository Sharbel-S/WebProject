var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');


var flash = require('express-flash');

var student_model = require('./models/student_model');
var teacher_model = require('./models/teacher_model');
var favorite_model = require('./models/favorite_model');
var liker_model = require('./models/liker_model');
var courses_model = require('./models/courses_model');


var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');



app.use(cookieSession({
    secret: 'mot-de-passe-du-cookie'
  }));


/*
* This POST method verify the name and password entered by the user,
* if name or the password are incorrect, the method will show a flash explaining
* else it will redirect the user to the principal page
*/
app.post('/loginStudent',(req,res)=> {
  var id = student_model.login_student(req.body.name, req.body.password);
  if (id === -1){
    req.flash('info', 'Incorect username or password');
    res.redirect('/loginStudent');
  }
  else {
    req.session.student_user = id;
    req.session.student_name = req.body.name;
    res.redirect('/principal_page');
  } 
});
 
/*
* Same method above but with the teachers
*/
app.post('/loginTeacher' , (req, res)=> {
  var id = teacher_model.login_teacher(req.body.name, req.body.password);
  if (id === -1){
    req.flash('info', 'Incorect username or password');
    res.redirect('/loginTeacher');
  }
  else{
    req.session.teacher_user = id;
    req.session.teacher_name = req.body.name;
    res.redirect('/principal_page');
  }
});

/*
* This POST method will verify that the name the user is trying to 
* sign up with isn't already used by someone else, if this happen,
* a flash message will apear explaining the problem,
* if the name isn't used yet, the user will be redirected
* to the principal page
*/
app.post('/new_student_user',(req,res)=> {
  var name = student_model.test_if_name_already_exist_for_student(req.body.name);
  if(name === -1){
    req.flash('info', 'The name you chosen is already used');
    res.redirect('/new_student_user');
  }
  else{
    req.session.student_user = student_model.new_student_user(req.body.name, req.body.password);
    req.session.student_name = req.body.name;
    res.redirect('/principal_page');  
  }
});
  
/*
* Same method above but with the teachers
*/
app.post('/new_teacher_user',(req,res)=> {
  var name  = teacher_model.test_if_name_already_exist_for_teacher(req.body.name);
  if(name === -1){
    req.flash('info', 'The name you chosen is already used');
    res.redirect('/new_teacher_user');
  }
    else{
    req.session.teacher_user = teacher_model.new_teacher_user(req.body.name, req.body.password);
    req.session.teacher_name = req.body.name;
    res.redirect('/principal_page');
  }
});


// GET methodes

app.get('/'  ,(req,res) => {
    res.render('index');
});

app.get('/signInChoice', (req,res) =>{
  res.render('signInChoice');
});

app.get('/loginStudent' ,(req,res)=> {
  res.render('loginStudent');
});

app.get('/loginTeacher',(req,res)=>{
  res.render('loginTeacher');
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

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});


// Applying the middleware to the routes that needs authentication
app.use(is_authenticated);


app.get('/principal_page' ,(req,res) =>{
  if(req.session.student_name === undefined ) {
    res.render('principal_page', {name: req.session.teacher_name});
  }
  else {
    res.render('principal_page' , {name: req.session.student_name} );
  }
});

app.get('/courses_list' ,(req,res) => {
  var results = courses_model.courses_list();
  res.render('courses_list',  {list:results} );
});

app.get('/edit/:id' ,(req,res)=> {
  var courses_info = courses_model.get_course_information_from_id(req.params.id);
  res.render('edit-course-form', courses_info )
});

app.get('/delete/:id' ,(req,res) => {
  var courses_info = courses_model.get_course_information_from_id(req.params.id);
  res.render('delete', courses_info)
});

app.get('/read/:id', (req,res) => {
  var courses_info = courses_model.get_course_information_from_id(req.params.id);  
  var likers = liker_model.likers_number(req.params.id);
  var result = finalResults(courses_info, likers);
  res.render('read', result );
});

app.get('/add',(req,res) => {
  res.render('add');
 })


 app.get('/search', (req,res) => {
  var results = courses_model.search_course(req.query.query);
  res.render('search',  {list:results} );
});

app.get('/like/:id' , (req, res) => {
    liker_model.add_like(get_data_likers(req));
    res.redirect('/courses_list');
});

app.get('/unlike/:id', (req,res) => {
  liker_model.remove_like(get_data_likers(req));
  res.redirect('/courses_list');
});

app.get('/likers/:id' , (req, res) => {
  var likers_list = liker_model.get_likers_list(req.params.id);
  var course_name = courses_model.get_course_name(req.params.id);
  res.render('likers' , { likers_list:likers_list, course_name})

});

app.get('/favorite/:id' , (req,res) => {
  var courses_info = courses_model.get_course_information_from_id(req.params.id);
  favorite_model.add_to_favorite(get_data_favorites(req, courses_info));
  res.redirect('/courses_list' );
})

app.get('/favorite_list' ,(req,res) => {
  var favorite_list = favorite_model.get_favorite_list(req.session.student_name);
  res.render('favorite_list', {list: favorite_list})
});

app.get('/my_courses'  , (req, res ) => {
  var my_courses = courses_model.get_my_courses(req.session.teacher_name)
  res.render('my_courses' , {list: my_courses });
});


app.get('/remove_favorite/:id' , (req, res) => {
  favorite_model.remove_from_favorite(req.params.id);
  res.redirect('/courses_list')
});

app.get('/my_profile' , (req,res) => {
  res.render('my_profile');
})

app.get('/help', (req,res ) => {
  res.render('help');
});

app.get('/change_name', (req,res) => {
  res.render('change_name');
});

app.get('/delete_account', (req, res) => {
  res.render('delete_account');
});

app.get('/change_password', (req,res) => {
  res.render('change_password');
});


app.get('/teachers_list', (req,res) => {
  var teachers_list = teacher_model.get_teachers_list();
  res.render('teachers_list', {list:teachers_list});
});


app.get('/teacher_courses/:name', (req,res) => {
  var courses = courses_model.get_all_teacher_courses(req.params.name);
  var number_of_courses_per_teacher = courses_model.get_number_of_courses_per_teacher(req.params.name);
  res.render('teacher_courses', {list:courses, number_of_courses_per_teacher});
});

//POST methodes



/*
* This method will check using the session if the user that want to delete his account
* is a teacher or a studnet 
* and then it will delte the used account
*/
app.post('/delete_account', (req,res) => {
  if(req.session.student_name === undefined) {
    teacher_model.delete_teacher_account(req.session.teacher_name);
    req.session.teacher_name = undefined;
    res.redirect('/')
  }
  else{
    student_model.delete_student_account(req.session.student_name);
    req.session.student_name = undefined;
    res.redirect('/')
  }
});


/*
* The first thing this method do is check if the user is a teacher or a student using the session,
* then it will test if the name and password entered by the user are valides,
* if not, it will send a flash message expailing the error and will redirect to change password view
* if the name and password are valide,it will test if the password and the password confirmation 
* entered by the user are the same, if not a flash message will apear,
* and last if everthing is correct a flash message will confirme the changes
* Note: this method is used for both teachers and students
*/
app.post('/change_password', is_authenticated, (req, res) => {
  if(req.session.student_name === undefined) {
    var valide_name_password = teacher_model.login_teacher(req.body.name, req.body.password);
    if (valide_name_password === -1 ){
      req.flash('info', 'Incorect username or password');
      res.redirect('/change_password');
    } 
    else if(!isSamePassword(req.body.new_password, req.body.new_password_conf)){
      req.flash('info', 'The new password and the confirmation password dont match');
      res.redirect('/change_password');

       }
      else {
          teacher_model.change_teacher_password(req.body.name, req.body.password, req.body.new_password);
          req.flash('info', 'The password has been changed successfully');          
          res.redirect('/principal_page');
         }

       } 
  else{
    var valide_name_password = student_model.login_student(req.body.name, req.body.password);
    if (valide_name_password === -1) {
      req.flash('info', 'Incorect username or password');
      res.redirect('/change_password');

    }
    else if(!isSamePassword(req.body.new_password, req.body.new_password_conf)){
      req.flash('info', 'The new password and the confirmation password dont match');
      res.redirect('/change_password');
       }
       else {
        student_model.change_student_password(req.body.name, req.body.password, req.body.new_password);
         req.flash('info', 'The password has been changed successfully');          
         res.redirect('/principal_page');
       } 
  }
});



/*
* This method is very similar to the POST method of change name (above)
* the difference is instead of testing the new password, it will test if
* the name is already used by someone else, if so, it will show a flash message
* else, a flash message will confirme the changes
*/
app.post('/change_name', (req,res) => {
  // if the name of student is undefined, it means that the user is a teacher
  if(req.session.student_name === undefined) {
    var valide_name_password = teacher_model.login_teacher(req.body.name, req.body.password);
    var new_name = teacher_model.test_if_name_already_exist_for_teacher(req.body.new_name);
    if (valide_name_password === -1) {
      req.flash('info', 'Incorect username or password');
      res.redirect('/change_name');
    } 
    else if (new_name === -1){
      req.flash('info', 'The name is already used');
      res.redirect('/change_name');
      }

    else {
         teacher_model.change_teacher_name(req.body.name, req.body.password, req.body.new_name);
         req.session.teacher_name = req.body.name;
         req.flash('info_name', 'The name has been changed successfully');          
         res.redirect('/principal_page');
       } 
  }
  else{
    var valide_name_password = student_model.login_student(req.body.name, req.body.password);
    var new_name = student_model.test_if_name_already_exist_for_student(req.body.new_name);
    if (valide_name_password === -1){
      req.flash('info', 'Incorect username or password');
      res.redirect('/change_name');
    } 
    else if (new_name === -1) {
      req.flash('info', 'The name is already used');
      res.redirect('/change_name');
    }
    else {
      student_model.change_student_name(req.body.name, req.body.password, req.body.new_name);
         req.session.student_name = req.body.name;
         req.flash('info_name', 'The name has been changed successfully');
         res.redirect('/principal_page');
       } 
  }
});

app.post('/edit/:id', (req,res) => {
  const id = req.params.id;
  var data = post_data_to_course(req);
  courses_model.update_course(id, data);
  req.flash('info_edit', 'The course has been modified succesfuly');
  res.redirect('/my_courses');
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  courses_model.delete_course(id);
  req.flash('info_delete', 'The course has been removed succesfuly');
  res.redirect('/my_courses');
});

app.post('/add',(req,res) => {
  courses_model.create_course(post_data_to_course(req));
  req.flash('info_add', 'The course has been added succesfuly');
  res.redirect('/my_courses');
});



// Functions

/*
* This is a midlwear function that test if the user is connected when he want to
* access pages that requires an authentification.
* it works for both teachers and students
*/
function is_authenticated(req, res, next) {
  if(req.session.student_name !== undefined) {
    res.locals.authen_student = true;
    res.locals.authenticated = true;
    return next();
  }
  if(req.session.teacher_name !== undefined) {
    res.locals.authen_teacher = true;
    res.locals.authenticated = true;
    return next();
  }
  res.status(401).send('Authentication required');
}

/*
* This function help us create a javascript object to use it for
*  adding and modifying a course 
*/
function post_data_to_course(req) {
  return {
    subject: req.body.subject,
    title: req.body.title, 
    teacher: req.session.teacher_name,
    description: req.body.description,
  };
}

function get_data_likers(req) {
  return {
    name: req.session.student_name,
    course_id: req.params.id,
  }; 
}

function get_data_favorites(req ,results){
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
/*
* This boolean function test if the password and confirmation password entered 
* by the user are the same, if not, it will return false
*/

function isSamePassword( new_password, password_confirmation){
  if(new_password === password_confirmation){
    return true;
  } 
  else{
    return false;
  }
}



app.listen(3000, () => console.log('listening on http://localhost:3000'));