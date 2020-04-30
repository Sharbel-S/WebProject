"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


exports.courses_list = function(){
    var courses_list = db.prepare('SELECT id, subject,title, teacher FROM courses ').all();
    return courses_list;
}


exports.get_course_information_from_id = function(id){
    var course_information = db.prepare('SELECT * FROM courses WHERE id = ?').get([id]);
    if (course_information == null) return -1;
    return course_information;
}


exports.get_course_name = function(id){
var course_name = db.prepare('SELECT title FROM courses WHERE id = ?').get([id]);
    return course_name;
}

  
exports.update_course = function(id ,courses){
    db.prepare("UPDATE courses SET subject = @subject, title = @title, teacher = @teacher, description = @description WHERE (id = ?)").run(courses, id);
}
  

exports.delete_course = function(id) {
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
}
  

exports.create_course = function(courses){
    db.prepare('INSERT INTO courses (subject, title, teacher, description) VALUES (@subject, @title, @teacher, @description)').run(courses);
}


exports.search_course = function(query){
    var results = db.prepare('SELECT * FROM courses WHERE subject LIKE ? OR title LIKE ? OR teacher LIKE ?').all(['%'+ query+ '%','%' + query + '%','%'+  query +'%']);
    return results;
}


exports.get_my_courses = function(name) {
    var my_courses_list = db.prepare('SELECT * FROM courses WHERE teacher = ?').all(name);
    return my_courses_list;
}

  
exports.get_all_teacher_courses = function(name){
    var courses = db.prepare('SELECT * FROM courses WHERE teacher = ?').all(name);
    return courses;
}


exports.get_number_of_courses_per_teacher = function(name){
    var number_of_courses = db.prepare('SELECT count(*) as nb FROM courses WHERE teacher = ?').get([name]);
    return number_of_courses;
}

exports.change_teacher_name = function(old_name, new_name){
    db.prepare('UPDATE courses SET teacher = ? WHERE teacher = ?').run(new_name,old_name );
}

exports.delete_teacher_account = function(name){
    db.prepare('DELETE FROM courses WHERE teacher = ?').run(name);
}
