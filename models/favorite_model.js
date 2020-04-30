"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


exports.add_to_favorite = function(results){
    db.prepare('INSERT INTO favorite (name, course_id ,course_subject ,course_title,course_teacher ) VALUES (@name, @course_id, @course_subject, @course_title, @course_teacher)').run(results);
}
  
exports.get_favorite_list = function(student_name){
    var course_id = db.prepare('SELECt DISTINCT course_id, course_subject , course_title, course_teacher  FROM favorite WHERE name = ?').all(student_name);
    return course_id;
}

exports.remove_from_favorite = function(id){
    db.prepare('DELETE FROM favorite WHERE course_id = ?').run(id);
}

exports.change_student_name = function(old_name, new_name){
    db.prepare('UPDATE favorite SET name = ? WHERE name = ?').run(new_name,old_name );
}
  
exports.change_teacher_name = function(old_name, new_name){
    db.prepare('UPDATE favorite SET course_teacher = ? WHERE course_teacher = ?').run(new_name,old_name );
}

exports.delete_student_account = function(name){
    db.prepare('DELETE FROM favorite WHERE name = ?').run(name);
}
  
exports.delete_teacher_account = function(name){
    db.prepare('DELETE FROM favorite WHERE course_teacher = ?').run(name);
}
  

