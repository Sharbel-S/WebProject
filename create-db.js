const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


var load = function() {
    db.prepare('DROP TABLE IF EXISTS studentusers').run();
    db.prepare('DROP TABLE IF EXISTS teacherusers').run();
    db.prepare('DROP TABLE IF EXISTS courses').run();
    db.prepare('DROP TABLE IF EXISTS likers').run();


    db.prepare('CREATE TABLE studentusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)').run();
    db.prepare('CREATE TABLE teacherusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)').run();
    db.prepare('CREATE TABLE courses (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT NOT NULL, title TEXT NOT NULL, teacher TEXT NOT NULL, description TEXT NOT NULL)').run();
    db.prepare('CREATE TABLE likers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, course_id INTEGER UNIQUE)').run();

    db.prepare('INSERT INTO studentusers (name, password) VALUES (@name, @password)').run(  {name: "Sharbel", password: "password"});
    db.prepare('INSERT INTO teacherusers (name, password) VALUES (@name, @password)').run(  {name: "Marc", password: "password"});
    db.prepare('INSERT INTO courses (subject, title, teacher, description ) VALUES (@subject, @title, @teacher, @description)').run(  {subject:"WEB", title: "Express", teacher: "Sharbel", description: "blablablabalbabalbalbalba"});
    db.prepare('INSERT INTO courses (subject, title, teacher, description ) VALUES (@subject, @title, @teacher, @description)').run(  {subject:"Programation", title: "Abstrait classes", teacher: "Sharbel2", description: "blablablabalbabalbalbalba2"});
    db.prepare('INSERT INTO courses (subject, title, teacher, description ) VALUES (@subject, @title, @teacher, @description)').run(  {subject:"Programation", title: "Abstrait classes", teacher: "Sharbel2", description: "blablablabalbabalbalbalba2"});
    db.prepare('INSERT INTO likers (name, course_id) VALUES (@name, @course_id)').run(  {name: "Sharbel", course_id: 23});

    
}
 load();