'use strict';
const GitHubApi = require('github');
const fsExtra = require('fs-extra');

function getGithubApiContext() {
    const client = new GitHubApi({debug: false});
    const config = fsExtra.readJsonSync('./authentication.json');
    client.authenticate({type: 'oauth', token: config.token});
    return client;
}

function convertIssueState(githubFormattedState) {
    switch(githubFormattedState) {
        case 'open':
            return 0;
        case 'closed':
            return 1;
        default:
            throw new RangeError("The given state was not valid.")
    }
}

function findAssignee(issue) {
    const assigneeResponse = issue.assignee;
    if (issue.assignee) {
        return issue.assignee.login || null;
    }
    else {
        return null;
    }
}

function convertToDTO(issue) {
    return {
        title: issue.title,
        status: convertIssueState(issue.state),
        url: issue.html_url,
        github_id: parseInt(issue.number),
        creator: issue.user.login,
        assignee: findAssignee(issue),
    }
}

function convertResponseToDTO(response) {
    const dtos = []
    for (const issueResponse of response.data) {
        dtos.push(convertToDTO(issueResponse))
    }

    return dtos;
}

function findAll (organization, repo) {
    const client = getGithubApiContext();
    return client.issues.getForRepo({owner: organization, repo: repo}).then(response => {
        return convertResponseToDTO(response)
        });
}

function findReposInOrganizationResponse(githubResponse) {
    const foundRepos = []
    for (const repository of githubResponse) {
        foundRepos.push(repository.name);
    }
    return foundRepos;
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

function appendToArray(originalArray, newArray) {
    for (const newItem of newArray) {
        originalArray.push(newItem);
    }
}

module.exports.convertToDTO = convertToDTO;
module.exports.findAll = findAll;
module.exports.convertResponseToDTO = convertResponseToDTO;
module.exports.convertIssueState = convertIssueState;
module.exports.findReposInOrganizationResponse = findReposInOrganizationResponse;
module.exports.findReposInOrganization = findReposInOrganization;
module.exports.findAllIssuesInOrganization = findAllIssuesInOrganization;