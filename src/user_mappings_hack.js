'use strict';

const fsExtra = require('fs-extra');

function insertHardcodedMappings(database) {
    const userMappings = fsExtra.readJSONSync('./accounts.json');
    for (const userMapping in userMappings) {
        database.user.add(userMapping);
    }
}

module.exports = {
    insertHardcodedMappings: insertHardcodedMappings,
}