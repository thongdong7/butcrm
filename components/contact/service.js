var {dbPromise, getDb} = require("../db/index.js");

function createContact(contact) {
    var sql = "INSERT INTO contact(name) VALUES(?)";
    return getDb().executeSql(sql, [contact.name]);
}

function list() {
    var sql = "SELECT * FROM contact";
    console.log(sql);
    // return Promise.resolve([{name: "A Hung"}, {"name": "Chi Ba"}]);

    return ready().then(() => {
        return getDb().executeSql(sql).then(([results]) => {
            console.log(results.rows);
            if (results.rows == undefined) {
                return [];
            }

            let ret = [];
            for (let i=0;i<results.rows.length; i++) {
                console.log('contact', results.rows.item(i));
                ret.push(results.rows.item(i));
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
};
