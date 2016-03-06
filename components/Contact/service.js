var {isReady, dbPromise, getDb, executeSql, insertAndGetId} = require("../DB");

let isServiceReady = false;

var emitter = require('../event');
emitter.addListener('db.ready', (db) => {
    console.log('contact service is ready');
    isServiceReady = true;
    emitter.emit('contact.service.ready');
});

async function createContact(contact, tagIds) {
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
    let db = await getDb();

    // Get contact id after insert
    let contactId;
    if (contact.contact_id) {
      // Update
      contactId = contact.contact_id;

      await executeSql(sql, params);
    } else {
      // Get inserted id
      contactId = insertAndGetId(sql, params, "contact", "contact_id");
    }

    // Update tags
    console.log('get current tag ids of this contact', tagIds);
    let currentTagIds = [];
    let removeTagIds = [];
    if (contact.contact_id) {
      currentTags = await executeSql("SELECT tag_id FROM contact_tag WHERE contact_id = ?", [contactId]);

      // Find the tag need to be removed
      console.log("Find the tag need to be removed", currentTagIds)
      for (let currentTag of currentTags) {
        let currentTagId = currentTag.tag_id
        console.log('current tag id', currentTag, currentTagId, tagIds.indexOf(currentTagId))
        currentTagIds.push(currentTagId)
        if (tagIds.indexOf(currentTagId) < 0) {
          // This tag is removed
          removeTagIds.push(currentTagId);
        }
      }
    }

    // Remove tags
    console.log('remove tags', removeTagIds)
    if (removeTagIds.length > 0) {
      let removeTagParams = [contact.contact_id];

      let tmp = [];
      for (let tagId of removeTagIds) {
        removeTagParams.push(tagId);
        tmp.push("?");
      }

      let removeTagSQL = "DELETE FROM contact_tag WHERE contact_id = ? AND tag_id IN (" + tmp.join(",") + ")";

      await executeSql(removeTagSQL, removeTagParams);
    }

    // Add tags
    console.log("add tag")
    console.log("current tagIds", currentTagIds)
    let addTagIds = [];
    for (let tagId of tagIds) {
      console.log(tagId)
      if (currentTagIds.indexOf(tagId) < 0) {
        // This tag is new
        addTagIds.push(tagId);
      }
    }

    if (addTagIds.length > 0) {
      for (let tagId of addTagIds) {
        await executeSql("INSERT INTO contact_tag (contact_id, tag_id) VALUES (?, ?)", [contactId, tagId]);
      }
    }

    return contact;
}

async function list() {
  if (!isServiceReady) {
    return [];
  }

  var sql = "SELECT * FROM contact";
  return await executeSql(sql);
}

async function getTagIds(contact_id) {
    if (!isServiceReady) {
      return [];
    }

    var sql = "SELECT tag_id FROM contact_tag WHERE contact_id = ?";
    let result = await executeSql(sql, [contact_id]);

    let ret = [];
    for (let item of result) {
      ret.push(item.tag_id);
    }

    ret.sort();

    return ret;
}

async function getContactType() {
  let sql = "SELECT tag_id as id, name FROM tag";

  return await executeSql(sql);
}

async function getByPhones(phones) {
    if (!isServiceReady) {
        return {};
    }

    var tmp = [];
    for (let i in phones) {
        tmp.push("?")
    }

    var sql = "SELECT * FROM contact WHERE phone IN ("+tmp.join(",")+")";

    let results = await executeSql(sql, phones)

    let ret = {};
    for (let contact of results) {
      ret[contact.phone] = contact;
    }

    return ret;
}

module.exports = {
    isReady: () => isServiceReady,
    create: createContact,
    list: list,
    getByPhones: getByPhones,
    getContactType: getContactType,
    getTagIds: getTagIds
};
