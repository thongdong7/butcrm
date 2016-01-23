var {isReady, dbPromise, getDb} = require("../db/index.js");

let isServiceReady = false;

var eventManager = require('../event/index.js');
eventManager.register('db.ready', (db) => {
    isServiceReady = true;
    eventManager.notify('contact.service.ready', true);
});

function createContact(contact) {
    // return Promise.resolve();
    let sql, params;
    if (contact && contact.contact_id) {
        // Update contact
        params = [];
        let paramSQL = [];
        for (let f in contact) {
            if (f == "contact_id") {
                continue;
            }

            params.push(contact[f]);
            paramSQL.push(f + " = ?");
        }
        params.push(contact.contact_id);

        sql = "UPDATE contact SET " + paramSQL.join(", ") +" WHERE contact_id = ?";
    } else {
        // INSERT contact
        params = [];
        let paramSQL = [];
        let paramSQL2 = [];
        for (let f in contact) {
            if (f == "contact_id") {
                continue;
            }

            params.push(contact[f]);
            paramSQL.push(f);
            paramSQL2.push('?');
        }


        sql = "INSERT INTO contact("+paramSQL.join(",") + ") VALUES("+paramSQL2.join(',')+")";
    }
    console.log(sql, params);
    return getDb().executeSql(sql, params);
}

function list() {
    if (!isServiceReady) {
        return Promise.resolve([]);
    }

    var sql = "SELECT * FROM contact";
    return getDb().executeSql(sql).then(([results]) => {
        if (results.rows == undefined) {
            return [];
        }

        let ret = [];
        for (let i=0;i<results.rows.length; i++) {
            ret.push(results.rows.item(i));
        }

        return ret;
    });
}

function getByPhones(phones) {
    if (!isServiceReady) {
        return Promise.resolve({});
    }

    var tmp = [];
    for (let i in phones) {
        tmp.push("?")
    }

    var sql = "SELECT * FROM contact WHERE phone IN ("+tmp.join(",")+")";
    console.log('ready now');
    return getDb().executeSql(sql, phones).then(([results]) => {
        if (results == undefined || results.rows == undefined) {
            return {};
        }

        let ret = {};
        for (let i=0;i<results.rows.length; i++) {
            let contact = results.rows.item(i);
            ret[contact.phone] = contact;
        }

        return ret;
    });
}

module.exports = {
    isReady: () => isServiceReady,
    create: createContact,
    list: list,
    getByPhones: getByPhones
};
