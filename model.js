"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


exports.login_student = (name, password) => {
    var id = db.prepare('SELECT id FROM studentusers WHERE name=? AND password=?').get([name, password]);
    if (id == null) return -1;
    return id;
  }

  exports.login_teacher = (name, password) => {
    var id = db.prepare('SELECT id FROM teacherusers WHERE name=? AND password=?').get([name, password]);
    if (id == null) return -1;
    return id;
  }


exports.new_student_user = function(name, password) {
    var insertUser = db.prepare('INSERT INTO studentusers (name, password) VALUES (?, ?)');
    var id = insertUser.run([name, password]).lastInsertRowid;
    return id;
  }

  exports.new_teacher_user = function(name, password) {
    var insertUser = db.prepare('INSERT INTO teacherusers (name, password) VALUES (?, ?)');
    var id = insertUser.run([name, password]).lastInsertRowid;
    return id;
  }

  exports.courses_list = function(){
    var title = db.prepare('SELECT id, subject,title, teacher FROM courses ').all();
    return title;
  }
    
  exports.course_id = function(id){
    var id = db.prepare('SELECT * FROM courses WHERE id = ?').get([id]);
    if (id == null) return -1;
    return id
  }

  exports.update = function(id ,courses){
    const result = db.prepare("UPDATE courses SET subject = @subject, title = @title, teacher = @teacher, description = @description WHERE (id = ?)").run(courses, id);
   // var result = db.prepare('UPDATE courses SET subject = @subject, title = @title, teacher = @teacher, description = @description WHERE id = ?').run(course, id);
    return result;
  }

  exports.delete = function(id) {
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  }

  exports.create = function(courses){
    var id = db.prepare('INSERT INTO courses (subject, title, teacher, description) VALUES (@subject, @title, @teacher, @description)').run(courses);
  }


