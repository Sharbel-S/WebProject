"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


exports.login_student = (name, password) => {
    var id = db.prepare('SELECT id FROM studentusers WHERE name=? AND password=?').get([name, password]);
    console.log(name);
    if (id == null) return -1;
    return id;
  }

exports.new_student_user = function(name, password) {
    var insertUser = db.prepare('INSERT INTO studentusers (name, password) VALUES (?, ?)');
    var id = insertUser.run([name, password]).lastInsertRowid;
    return id;
  }