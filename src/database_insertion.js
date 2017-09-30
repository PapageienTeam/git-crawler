'use strict';

const userMappingsHack = require('./user_mappings_hack');
const pullIssues = require('./pull_issues'); 

async function nukeDatabase(database) {
    await database.clearAll();
}

async function insertIssuesIntoCleanDatabase(database) {
    for (const issue in await pullIssues.findAllIssuesInOrganization(process.env.GIT_ORGANIZATION)) {
        await database.issue.add(issue);
    }
}

async function nukeDatabaseAndWriteEverything(database) {
    await nukeDatabase(database);
    await insertIssuesIntoCleanDatabase(database);
}

module.exports = {
    nukeDatabaseAndWriteEverything,
}