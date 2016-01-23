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
SQLite.DEBUG(false);
SQLite.enablePromise(true);
var database_name = "Test.db";
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
}).then(createDatabase);

var schema = [
    "CREATE TABLE contact("
        + "contact_id INTEGER PRIMARY KEY AUTOINCREMENT,"
        + "name VARCHAR(255) NOT NULL,"
        + "phone VARCHAR(255) NOT NULL,"
        + "note TEXT"
    + ");",

    "INSERT INTO contact(name, phone) VALUES('A Hung', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('C Mai', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quy', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan1', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
    "INSERT INTO contact(name, phone) VALUES('A Quan', '123456789');",
];

function executeSql(sqls) {
    var p;
    for (let i in sqls) {
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
    // Get the version
    var p = Promise.resolve().

    // executeSql([
    //     "DROP TABLE IF EXISTS version;",
    //     "DROP TABLE IF EXISTS contact;",
    // ]).

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
    console.log('abc');

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
