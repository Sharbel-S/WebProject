"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


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
  
  exports.change_student_name = function(old_name, new_name){
    db.prepare('UPDATE likers SET name = ? WHERE name = ?').run(new_name,old_name );
}
  