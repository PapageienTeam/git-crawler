'use strict';

const GitHubApi = require('github');
const fsExtra = require('fs-extra');

function getGithubApiContext() {
    const client = new GitHubApi({debug: false});
    const config = fsExtra.readJsonSync('./authentication.json');
    client.authenticate({type: 'oauth', token: config.token});
    return client;
}

function findAll (organization, repo) {
    const client = getGithubApiContext();
    return client.issues.getForRepo({owner: organization, repo: repo}).then(response => {
        return convertResponseToDTO(response)
    });
}

function findReposInOrganization(organizationName) {
    const client = getGithubApiContext();
    return client.repos.getForOrg({org: organizationName}).then(response => {
        return findReposInOrganizationResponse(response.data);
    });
}

function findAllIssuesInOrganization(organizationName) {
    return findReposInOrganization(organizationName).then(async repos => {
        const issues = [];
        for (const repository of repos) {
            appendToArray(issues,await findAll(organizationName, repository));
        };
        return issues;
    });
}

module.exports = {
    getGithubApiContext,
    findAll,
    findReposInOrganization,
    findAllIssuesInOrganization,
}
