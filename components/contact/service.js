var {isReady, dbPromise, getDb} = require("../db");

let isServiceReady = false;

var emitter = require('../event');
emitter.addListener('db.ready', (db) => {
    console.log('contact service is ready');
    isServiceReady = true;
    emitter.emit('contact.service.ready');
});

async function createContact(contact) {
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
    let db = await getDb();
    return await db.executeSql(sql, params);
}

async function list() {
    if (!isServiceReady) {
        return [];
    }

    var sql = "SELECT * FROM contact";
    let db = await getDb();
    let [results] = await db.executeSql(sql);

    if (results.rows == undefined) {
        return [];
    }

    let ret = [];
    for (let i=0;i<results.rows.length; i++) {
        ret.push(results.rows.item(i));
    }

    return ret;
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
    getByPhones: getByPhones,
};
