"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

/*
* This method will verify if the name and password exist in the datbase of students and return his id
*/
exports.login_student = (name, password) => {
    var id = db.prepare('SELECT id FROM studentusers WHERE name=? AND password=?').get([name, password]);
    if (id == null) return -1;
    return id;
  }

/*
* Same method above but with the database of teachers
*/
exports.login_teacher = (name, password) => {
  var id = db.prepare('SELECT id FROM teacherusers WHERE name=? AND password=?').get([name, password]);
  if (id == null) return -1;
  return id;
}

/*
* This method will create a studentt acocunt in the database of students and return his id
*/
exports.new_student_user = function(name, password) {
    var insertUser = db.prepare('INSERT INTO studentusers (name, password) VALUES (?, ?)');
    var id = insertUser.run([name, password]).lastInsertRowid;
    return id;
  }

/*
* Same method above but with the database of teachers
*/
exports.new_teacher_user = function(name, password) {
  var insertUser = db.prepare('INSERT INTO teacherusers (name, password) VALUES (?, ?)');
  var id = insertUser.run([name, password]).lastInsertRowid;
  return id;
}

/*
* This method send the list of courses in the database of courses
*/
exports.courses_list = function(){
  var courses_list = db.prepare('SELECT id, subject,title, teacher FROM courses ').all();
  return courses_list;
}

/*
* This method send the informations of a course from his id, it return -1 if the course dosent exsict
*/
exports.get_course_information_from_id = function(id){
  var course_information = db.prepare('SELECT * FROM courses WHERE id = ?').get([id]);
  if (course_information == null) return -1;
  return course_information;
}

exports.get_course_name = function(id){
  var course_name = db.prepare('SELECT title FROM courses WHERE id = ?').get([id]);
  return course_name;
}

/*
* This method update a course from his id
*/
exports.update_course = function(id ,courses){
  db.prepare("UPDATE courses SET subject = @subject, title = @title, teacher = @teacher, description = @description WHERE (id = ?)").run(courses, id);
}

/*
* This method remove a course from database 
*/
exports.delete_course = function(id) {
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);
}

/*
* This method create a course and add it to database 
*/
exports.create_course = function(courses){
  db.prepare('INSERT INTO courses (subject, title, teacher, description) VALUES (@subject, @title, @teacher, @description)').run(courses);
}

/*
* This method search for a course in title, subject and teacher 
*/
exports.search_course = function(query){
  query = query || "";
  var results = db.prepare('SELECT * FROM courses WHERE subject LIKE ? OR title LIKE ? OR teacher LIKE ?').all(['%'+ query+ '%','%' + query + '%','%'+  query +'%']);
  return results;
}


exports.add_like = function(results){
  db.prepare('INSERT INTO likers (name, course_id) VALUES (@name, @course_id)').run(results);
}

exports.remove_like = function(results){
  db.prepare(' DELETE FROM likers WHERE name = @name AND course_id = @course_id').run(results);

}

exports.likers_number = function(id){
  var likers_number =  db.prepare('SELECT COUNT(DISTINCT name) as likers FROM likers WHERE course_id = ?').get([id]);
  return likers_number;
}

exports.get_likers_list = function(id){
  var list = db.prepare('SELECT DISTINCT name FROM likers WHERE course_id = ?').all(id);
  return list;
}

exports.add_to_favorite = function(results){
  db.prepare('INSERT INTO favorite (name, course_id ,course_subject ,course_title,course_teacher ) VALUES (@name, @course_id, @course_subject, @course_title, @course_teacher)').run(results);
}

exports.get_favorite_list = function(student_name){
  var course_id = db.prepare('SELECt DISTINCT course_id, course_subject , course_title, course_teacher  FROM favorite WHERE name = ?').all(student_name);
  return course_id;
}


exports.get_my_courses = function(name) {
  var my_courses_list = db.prepare('SELECT * FROM courses WHERE teacher = ?').all(name);
  return my_courses_list;
}


exports.remove_from_favorite = function(id){
  db.prepare('DELETE FROM favorite WHERE course_id = ?').run(id);

}

exports.change_student_name = function(name, password, new_name){
  db.prepare("UPDATE studentusers SET name = ? WHERE name = ? AND password = ? ").run(new_name, name,password);
}

exports.change_teacher_name = function(name, password, new_name){
  db.prepare("UPDATE teacherusers SET name = ? WHERE name = ? AND password = ? ").run(new_name, name,password);
}

exports.delete_teacher_account = function(name){
  db.prepare('DELETE FROM teacherusers WHERE name = ?').run(name);
}

exports.delete_student_account = function(name){
  db.prepare('DELETE FROM studentusers WHERE name = ?').run(name);

}

exports.change_teacher_password = function(name, password, new_password){
  db.prepare("UPDATE teacherusers SET password = ? WHERE name = ? AND password = ?").run(new_password, name ,password);
}

exports.change_student_password = function(name, password, new_password){
  db.prepare("UPDATE studentusers SET password = ? WHERE name = ? AND password = ?").run(new_password, name ,password);
}

exports.test_if_name_already_exist_for_student = function(name){
  var name = db.prepare('SELECT name FROM studentusers WHERE name=?').get([name]);
  if (name != null) return -1;
}

exports.test_if_name_already_exist_for_teacher = function(name){
  var name = db.prepare('SELECT name FROM teacherusers WHERE name=?').get([name]);
  if (name != null) return -1;
}


exports.get_teachers_list = function(){
  var teachers = db.prepare('SELECT name FROM teacherusers').all();
  return teachers;
}

exports.get_all_teacher_courses = function(name){
  var courses = db.prepare('SELECT * FROM courses WHERE teacher = ?').get([name]);
  console.log(courses);
  return courses;
}


