const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


var load = function() {
    db.prepare('DROP TABLE IF EXISTS studentusers').run();
    db.prepare('DROP TABLE IF EXISTS teacherusers').run();
    db.prepare('DROP TABLE IF EXISTS courses').run();

    db.prepare('CREATE TABLE studentusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)').run();
    db.prepare('CREATE TABLE teacherusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)').run();
    db.prepare('CREATE TABLE courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, teacher TEXT NOT NULL, description TEXT NOT NULL)').run();

    db.prepare('INSERT INTO studentusers (name, password) VALUES (@name, @password)').run(  {name: "Sharbel", password: "password"});
    db.prepare('INSERT INTO teacherusers (name, password) VALUES (@name, @password)').run(  {name: "Marc", password: "password"});
    db.prepare('INSERT INTO courses (title, teacher, description ) VALUES (@title, @teacher, @description)').run(  {title: "Web", teacher: "Sharbel", description: "blablablabalbabalbalbalba"});

}
 load();