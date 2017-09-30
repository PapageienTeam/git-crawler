'use strict';

const fsExtra = require('fs-extra');

async function insertHardcodedMappings(database) {
    const userMappings = fsExtra.readJSONSync('./accounts.json');
    for (const userMapping of userMappings) {
        await database.user.add(userMapping);
    }
}

module.exports = {
    insertHardcodedMappings: insertHardcodedMappings,
}