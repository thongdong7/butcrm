/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  ToolbarAndroid,
  View,
} = React;

var emitter = require('../event');

var SQLite = require('react-native-sqlite-storage');
SQLite.DEBUG(true);
SQLite.enablePromise(true);
var database_name = "Test1.db";
var database_version = "1.0";
var database_displayname = "SQLite Test Database";
var database_size = 200000;

function openCB() {
    console.log("DB Opened");
}

function errorCB(err) {
    console.error("error: ",err);
    return false;
}
var db;
var ready = false;

var p = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, openCB, errorCB).then((DB) => {
    db = DB;
    return db;
}).then(createDatabase);

var schema = [
    "CREATE TABLE contact("
        + "contact_id INTEGER PRIMARY KEY AUTOINCREMENT,"
        + "name VARCHAR(255) NOT NULL,"
        + "phone VARCHAR(255) NOT NULL UNIQUE,"
        + "note TEXT"
    + ");",
    "CREATE TABLE tag("
        + "tag_id INTEGER PRIMARY KEY AUTOINCREMENT,"
        + "name VARCHAR(255) NOT NULL UNIQUE"
    + ");",
     "CREATE TABLE contact_tag("
         + "contact_id INTEGER NOT NULL,"
         + "tag_id INTEGER NOT NULL,"
          + "FOREIGN KEY(contact_id) REFERENCES contact(contact_id),"
          + "FOREIGN KEY(tag_id) REFERENCES tag(tag_id)"
     + ");",
     "INSERT INTO tag(tag_id, name) VALUES(1, 'Mua o');",
     "INSERT INTO tag(tag_id, name) VALUES(2, 'Dau tu');",
     "INSERT INTO tag(tag_id, name) VALUES(3, 'Tiem nang');",
     "INSERT INTO tag(tag_id, name) VALUES(4, 'Dang quan tam');",

     "INSERT INTO contact(contact_id, name, phone) VALUES(1, 'A Hung', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('C Mai', '223456789');",
    "INSERT INTO contact(name, phone) VALUES('A Vu', '323456789');",
    "INSERT INTO contact(name, phone) VALUES('A Tuan', '423456789');",
    "INSERT INTO contact(name, phone) VALUES('A Vy', '523456789');",
    "INSERT INTO contact(name, phone) VALUES('A Truong', '623456789');",
    "INSERT INTO contact(name, phone) VALUES('A Giang', '723456789');",
    "INSERT INTO contact(name, phone) VALUES('A Trung', '823456789');",
    "INSERT INTO contact(name, phone) VALUES('A Phuong', '923456789');",
    "INSERT INTO contact(name, phone) VALUES('A Hoang Anh', '1123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Duy', '2123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Khoa', '3123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Vuong', '4123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Nguyen', '5123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Tuan', '6123456789');",

     "INSERT INTO contact_tag(contact_id, tag_id) VALUES(1, 1);",
     "INSERT INTO contact_tag(contact_id, tag_id) VALUES(1, 2);",
     "INSERT INTO contact_tag(contact_id, tag_id) VALUES(1, 3);",
     "INSERT INTO contact_tag(contact_id, tag_id) VALUES(1, 4);",

];

function executeSql(sqls) {
    var p;
    for (let i in sqls) {
        console.log(sqls[i]);
        let j = i;
        if (p == undefined) {
            p = db.executeSql(sqls[j]);
        } else {
            p = p.then(() => {
                return db.executeSql(sqls[j]);
            });
        }
    }

    return p;
}

function createDatabase() {
    console.log('createDatabase');
    // Get the version
    // var p = Promise.resolve().
    var p =

    executeSql([
        "DROP TABLE IF EXISTS version;",
        "DROP TABLE IF EXISTS contact_tag;",
        "DROP TABLE IF EXISTS contact;",
        "DROP TABLE IF EXISTS tag;",
    ]).

    then(getVersion).then((version) => {
        console.log("aha, a version", version);
        return migrate(version);
    }).then(() => {
        console.log('migrate completed');
        emitter.emit('db.ready', db);
        ready = true;
    });

    return p;
}

function isReady() {
    return ready;
}

function getVersion() {
    return new Promise(function(resolve, reject) {
        db.executeSql("SELECT version FROM version").then(([results]) => {
            if (results.rows.length == 0) {
                // No version row is inserted
                resolve(0);
            } else {
                resolve(results.rows.item(0).version);
            }
        }).catch((error) => {
            // Missed version table, create version table
            db.executeSql("CREATE TABLE version(version INTEGER NOT NULL)").then(() => {
                resolve(0);
            }).catch(reject);
        });
    });
}

function migrate(startVersion) {
    console.log("migrate from", startVersion);
    var sequence;
    for (let i=startVersion;i<schema.length;i++) {
        let j = i;
        if (sequence == undefined) {
            sequence = db.executeSql(schema[j]);
        } else {
            sequence = sequence.then(()=>{
                return db.executeSql(schema[j]);
            });
        }
    }

    if (sequence == undefined) {
        sequence = Promise.resolve();
    }

    return sequence.then(() => {
        console.log("Migrate completed. Know update the version");
        var query;
        if (startVersion == 0) {
            // There is no version in the db, insert
            query = "INSERT INTO version(version) VALUES("+schema.length+")";
        } else {
            // Update version
            query = "UPDATE version SET version = "+schema.length;
        }
        return db.executeSql(query);
    });
}

function getDb() {
    return db;
}

module.exports = {
    isReady: isReady,
    dbPromise: p,
    db: db,
    getDb: getDb
};
