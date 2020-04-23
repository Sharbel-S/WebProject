const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


var load = function() {
    db.prepare('DROP TABLE IF EXISTS studentusers').run();
    db.prepare('DROP TABLE IF EXISTS teacherusers').run();
    db.prepare('DROP TABLE IF EXISTS courses').run();
    db.prepare('DROP TABLE IF EXISTS likers').run();
    db.prepare('DROP TABLE IF EXISTS favorite').run();



    db.prepare('CREATE TABLE studentusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT , password TEXT)').run();
    db.prepare('CREATE TABLE teacherusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT , password TEXT)').run();
    db.prepare('CREATE TABLE courses (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT NOT NULL, title TEXT NOT NULL, teacher TEXT NOT NULL, description TEXT NOT NULL)').run();
    db.prepare('CREATE TABLE likers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, course_id INTEGER )').run();
    db.prepare('CREATE TABLE favorite (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, course_id INTEGER , course_subject TEXT, course_title TEXT, course_teacher TEXT)').run();


    db.prepare('INSERT INTO studentusers (name, password) VALUES (@name, @password)').run(  {name: "Sharbel", password: "password"});
    db.prepare('INSERT INTO teacherusers (name, password) VALUES (@name, @password)').run(  {name: "Marc", password: "password"});
    db.prepare('INSERT INTO courses (subject, title, teacher, description ) VALUES (@subject, @title, @teacher, @description)').run(  {subject:"WEB", title: "Express", teacher: "Nicolas", description: "blablablabalbabalbalbalba"});
    db.prepare('INSERT INTO courses (subject, title, teacher, description ) VALUES (@subject, @title, @teacher, @description)').run(  {subject:"Programation", title: "Java language", teacher: "Jean-marc",
     description: "Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible. It is intended to let application developers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation. Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture. The syntax of Java is similar to C and C++, but it has fewer low-level facilities than either of them. As of 2019, Java was one of the most popular programming languages in use according to GitHub, particularly for client-server web applications, with a reported 9 million developers Java was originally developed by James Gosling at Sun Microsystems (which has since been acquired by Oracle) and released in 1995 as a core component of Sun Microsystems' Java platform. The original and reference implementation Java compilers, virtual machines, and class libraries were originally released by Sun under proprietary licenses. As of May 2007, in compliance with the specifications of the Java Community Process, Sun had relicensed most of its Java technologies under the GNU General Public License. Meanwhile, others have developed alternative implementations of these Sun technologies, such as the GNU Compiler for Java (bytecode compiler), GNU Classpath (standard libraries), and IcedTea-Web (browser plugin for applets). The latest versions are Java 14, released in March 2020, and Java 11, a currently supported long-term support (LTS) version, released on September 25, 2018; Oracle released for the legacy Java 8 LTS the last free public update in January 2019 for commercial use, while it will otherwise still support Java 8 with public updates for personal use up to at least December 2020. Oracle (and others) highly recommend uninstalling older versions of Java because of serious risks due to unresolved security issues. Since Java 9, 10, 12 and 13 are no longer supported, Oracle advises its users to immediately transition to the latest version (currently Java 14) or an LTS release. "});
    db.prepare('INSERT INTO courses (subject, title, teacher, description ) VALUES (@subject, @title, @teacher, @description)').run(  {subject:"Programation", title: "Abstrait classes", teacher: "Sharbel", description: "blablablabalbabalbalbalba2"});
    db.prepare('INSERT INTO likers (name, course_id) VALUES (@name, @course_id)').run(  {name: "Sharbel", course_id: 23});

    
}
 load();