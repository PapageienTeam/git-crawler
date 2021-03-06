'use strict';

const userMappingsHack = require('./user_mappings_hack');
const githubIntegration = require('./github_api/github_integration'); 

async function nukeDatabase(database) {
    await database.clearAll();
}

async function insertIssuesIntoCleanDatabase(database) {
    const issues = await githubIntegration.findAllIssuesInOrganization(process.env.GIT_ORGANIZATION)
    for (const issue of issues) {
        await database.issue.add(issue);
    }
}

async function nukeDatabaseAndWriteEverything(database) {
    await nukeDatabase(database);
    await userMappingsHack.insertHardcodedMappings(database);
    await insertIssuesIntoCleanDatabase(database);
}

module.exports = {
    nukeDatabaseAndWriteEverything,
}