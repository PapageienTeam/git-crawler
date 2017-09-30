'use strict';

const userMappingsHack = require('./user_mappings_hack');
const pullIssues = require('./pull_issues'); 

function nukeDatabase(database) {
    database.clearAll();
}

function insertIssuesIntoCleanDatabase(database) {
    for (const issue in pullIssues.findAllIssuesInOrganization(process.env.GIT_ORGANIZATION)) {
        database.issue.add(issue);
    }
}

function nukeDatabaseAndWriteEverything(database) {
    nukeDatabase(database);
    insertIssuesIntoCleanDatabase(database);
}

module.exports = {
    nukeDatabaseAndWriteEverything,
}