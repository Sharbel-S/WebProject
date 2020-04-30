"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');



exports.login_teacher = (name, password) => {
    var id = db.prepare('SELECT id FROM teacherusers WHERE name=? AND password=?').get([name, password]);
    if (id == null) return -1;
    return id;
}


exports.new_teacher_user = function(name, password) {
    var insertUser = db.prepare('INSERT INTO teacherusers (name, password) VALUES (?, ?)');
    var id = insertUser.run([name, password]).lastInsertRowid;
    return id;
}


exports.change_teacher_name = function(name, password, new_name){
    db.prepare("UPDATE teacherusers SET name = ? WHERE name = ? AND password = ? ").run(new_name, name,password);
}


exports.delete_teacher_account = function(name){
    db.prepare('DELETE FROM teacherusers WHERE name = ?').run(name);
}


exports.change_teacher_password = function(name, password, new_password){
    db.prepare("UPDATE teacherusers SET password = ? WHERE name = ? AND password = ?").run(new_password, name ,password);
}


exports.test_if_name_already_exist_for_teacher = function(name){
var name = db.prepare('SELECT name FROM teacherusers WHERE name=?').get([name]);
    if (name != null) return -1;
}



exports.get_teachers_list = function(){
    var teachers = db.prepare('SELECT name FROM teacherusers').all();
    return teachers;
}