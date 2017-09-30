'use strict';
const GitHubApi = require('github');

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

function convertToDTO(issue) {
    return {
        title: issue.title,
        status: convertIssueState(issue.state),
        url: issue.html_url,
        github_id: issue.number,
        creator: issue.user.login,
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
    const client = new GitHubApi({debug: false});
    return client.issues.getForRepo({owner: organization, repo: repo}).then(response => {
        return convertResponseToDTO(response)
        });
}

module.exports.convertToDTO = convertToDTO;
module.exports.findAll = findAll;
module.exports.convertResponseToDTO = convertResponseToDTO;
module.exports.convertIssueState = convertIssueState;