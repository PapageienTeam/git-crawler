'use strict';

const responseProcessor = require('../../src/github_api/response_processors')
const testConsts = require('../test_consts')

test('Converts open issue state correctly', () => {
    expect(responseProcessor.convertIssueState('open')).toBe(0);
})

test('Converts closed issue state correctly', () => {
    expect(responseProcessor.convertIssueState('closed')).toBe(1);
})

test('Throws exception on invalid issue state', () => {
    expect(() => responseProcessor.convertIssueState('INVALID')).toThrow();
})

function createUnassignedIssueResponse() {
    const title = "I'm a bug!";
    const url = "https://www.example.com";
    const githubState = "open";
    const idNumber = 5;
    const issueCreator = 'testUser1';
    const githubResponse = {
        number: idNumber, 
        state: githubState, 
        html_url: url, 
        title: title,
        user: {
            login: issueCreator,
        },
    };

    const expected = {
        title: title, 
        status: responseProcessor.convertIssueState(githubState), 
        url: url, 
        github_id: idNumber, 
        creator: issueCreator,
        assignee: null,
    };

    return {githubResponse, expected};
}

function createAssignedIssueResponse() {
    var githubResponse, expected;
    ({githubResponse, expected} = createUnassignedIssueResponse());

    const issueAssignee = 'testAssignee95';
    githubResponse.assignee = {
        login: issueAssignee,
    };
    expected.assignee = issueAssignee;

    return {githubResponse, expected};
}

function createMultipleIssueResponses() {
    var firstResponse = createAssignedIssueResponse();
    var secondResponse = createUnassignedIssueResponse();
    return {
        githubResponse: {
            data: [
                firstResponse.githubResponse,
                secondResponse.githubResponse,
            ]
        },
        expected: [
            firstResponse.expected,
            secondResponse.expected,
        ],
    };
}

function createFindRepoResponse() {
    const firstRepoName = "FirstRepo";
    const secondRepoName = "SecondRepoName";
    const thirdRepoName = "ThirdRepoName";
    const githubResponse = [
        {
            name: firstRepoName
        },
        {
            name: secondRepoName
        },
        {
            name: thirdRepoName
        },
    ];
    const expected = [
        firstRepoName,
        secondRepoName,
        thirdRepoName,
    ];
    return {githubResponse, expected};
}

test('Converts a single unassigned issue correctly', () => {
    var githubResponse, expected; 
    ({githubResponse, expected} = createUnassignedIssueResponse());
    expect(responseProcessor.convertToDTO(githubResponse)).toEqual(expected);
});

test('Converts a single assigned issue correctly', () => {
    var githubResponse, expected;
    ({githubResponse, expected} = createAssignedIssueResponse());
    expect(responseProcessor.convertToDTO(githubResponse)).toEqual(expected);
});

test('Converts multiple issues correctly', () => {
    var githubResponse, expected;
    ({githubResponse, expected} = createMultipleIssueResponses());
    expect(responseProcessor.convertResponseToDTO(githubResponse)).toEqual(expected);
})

test('Finds all repos in an organization', () => {
    var githubResponse, expected;
    ({githubResponse, expected} = createFindRepoResponse());
    expect(responseProcessor.findReposInOrganizationResponse(githubResponse)).toEqual(expected);
})
