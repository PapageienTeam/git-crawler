'use strict';

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

function findReposInOrganizationResponse(githubResponse) {
    const foundRepos = []
    for (const repository of githubResponse) {
        foundRepos.push(repository.name);
    }
    return foundRepos;
}

function appendToArray(originalArray, newArray) {
    for (const newItem of newArray) {
        originalArray.push(newItem);
    }
}

module.exports = {
    convertToDTO,
    convertResponseToDTO,
    convertIssueState,
    findReposInOrganizationResponse,
}