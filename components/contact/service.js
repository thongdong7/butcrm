var {dbPromise, getDb} = require("../db/index.js");

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
    // return Promise.resolve([{contact_id: 1, name: "A", phone: "123"}, {contact_id: 2, name: "b", phone: "123"}, {contact_id: 3, name: "c", phone: "123"}]);
    var sql = "SELECT * FROM contact";
    return ready().then(() => {
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
    });
}

function getByPhones(phones) {
    // return Promise.resolve([{contact_id: 1, name: "A", phone: "123"}, {contact_id: 2, name: "b", phone: "123"}, {contact_id: 3, name: "c", phone: "123"}]);
    var tmp = [];
    for (let i in phones) {
        tmp.push("?")
    }

    var sql = "SELECT * FROM contact WHERE phone IN ("+tmp.join(",")+")";
    return ready().then(() => {
        return getDb().executeSql(sql, phones).then(([results]) => {
            if (results.rows == undefined) {
                return {};
            }

            let ret = {};
            for (let i=0;i<results.rows.length; i++) {
                let contact = results.rows.item(i);
                ret[contact.contact_id] = contact;
            }

            return ret;
        });
    });
}

let isReady = false;

function ready() {
    if (isReady) {
        return Promise.resolve();
    } else {
        return dbPromise.then(()=>{
            console.log('contact service ready');
            isReady = true;
        });
    }
}

module.exports = {
    ready: ready,
    create: createContact,
    list: list,
    getByPhones: getByPhones
};
