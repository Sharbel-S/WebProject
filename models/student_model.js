"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.login_student = (name, password) => {
    var id = db.prepare('SELECT id FROM studentusers WHERE name=? AND password=?').get([name, password]);
    if (id == null) return -1;
    return id;
  }

exports.new_student_user = function(name, password) {
    var insertUser = db.prepare('INSERT INTO studentusers (name, password) VALUES (?, ?)');
    var id = insertUser.run([name, password]).lastInsertRowid;
    return id;
}


exports.change_student_name = function(name, password, new_name){
  db.prepare("UPDATE studentusers SET name = ? WHERE name = ? AND password = ? ").run(new_name, name,password);
}


exports.delete_student_account = function(name){
  db.prepare('DELETE FROM studentusers WHERE name = ?').run(name);
}


exports.change_student_password = function(name, password, new_password){
  db.prepare("UPDATE studentusers SET password = ? WHERE name = ? AND password = ?").run(new_password, name ,password);
}

exports.test_if_name_already_exist_for_student = function(name){
  var name = db.prepare('SELECT name FROM studentusers WHERE name=?').get([name]);
  if (name != null) return -1;
}





