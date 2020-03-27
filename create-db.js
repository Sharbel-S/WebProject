const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


var load = function() {
    db.prepare('DROP TABLE IF EXISTS studentusers').run();

    db.prepare('CREATE TABLE studentusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)').run();

    db.prepare('INSERT INTO studentusers (name, password) VALUES (@name, @password)').run(  {name: "Sharbel", password: "password"});
}
 load();