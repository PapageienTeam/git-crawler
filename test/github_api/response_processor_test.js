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

test('Converts a single unassigned issue correctly', () => {
    const title = "I'm a bug!";
    const url = "https://url.com";
    const githubState = "open";
    const idNumber = 5;
    const issueCreator = 'testUser1';
    const githubApiResponse = {
        number: idNumber, 
        state: githubState, 
        html_url: url, 
        title: title,
        user: {
            login: issueCreator,
        },
    }; 
    const dto = {
        title: title, 
        status: responseProcessor.convertIssueState(githubState), 
        url: url, 
        github_id: idNumber, 
        creator: issueCreator,
        assignee: null,
    };
    expect(responseProcessor.convertToDTO(githubApiResponse)).toEqual(dto);
})

test('Converts a single assigned issue correctly', () => {
    const title = "Frog is red";
    const url = 'https://redfrogs.com';
    const githubState = 'open';
    const idNumber = 561;
    const issueCreator = 'testUser2';
    const issueAssignee = 'testAssignee95';
    const githubApiResponse = {
        number: idNumber,
        state: githubState,
        html_url: url,
        title: title,
        user: {
            login: issueCreator,
        },
        assignee: {
            login: issueAssignee,
        },
    };
    const dto = {
        title: title,
        status: responseProcessor.convertIssueState(githubState),
        url: url,
        github_id: idNumber,
        creator: issueCreator,
        assignee: issueAssignee,
    }
    expect(responseProcessor.convertToDTO(githubApiResponse)).toEqual(dto);
});

test('Converts multiple issues correctly', () => {
    const firstIssueNumber = 5;
    const firstIssueState = "open";
    const firstUrl = "http://Url1.com";
    const firstTitle = "FunFlamingo";
    const firstCreator = 'TestUser1';
    const firstApiResponse = {
        number: firstIssueNumber,
        state: firstIssueState,
        html_url: firstUrl,
        title: firstTitle,
        user: {
            login: firstCreator,
        },
    }

    const secondIssueNumber = 6;
    const secondIssueState = "open";
    const secondUrl = "http://Url2.com";
    const secondTitle = "SadFlamingo";
    const secondCreator = "SuperSadFlamingo99";
    const secondApiResponse = {
        number: secondIssueNumber,
        state: secondIssueState,
        html_url: secondUrl,
        title: secondTitle,
        user: {
            login: secondCreator,
        }
    }
    const githubApiResponse = {
        "data": [
            firstApiResponse,
            secondApiResponse,
        ]
    }

    const expectDTOs = [
        {
            title: firstTitle,
            status: responseProcessor.convertIssueState(firstIssueState),
            url: firstUrl,
            github_id: firstIssueNumber,
            creator: firstCreator,
            assignee: null,
        },
        {
            title: secondTitle,
            status: responseProcessor.convertIssueState(secondIssueState),
            url: secondUrl,
            github_id: secondIssueNumber,
            creator: secondCreator,
            assignee: null,
        }
    ]

    expect(responseProcessor.convertResponseToDTO(githubApiResponse)).toEqual(expectDTOs)
})

test('Finds all repos in an organization', () => {
    const firstRepoName = "FirstRepo";
    const secondRepoName = "SecondRepoName";
    const thirdRepoName = "ThirdRepoName";
    const githubApiResponse = [
        {
            name: firstRepoName
        },
        {
            name: secondRepoName
        },
        {
            name: thirdRepoName
        },
    ]

    expect(responseProcessor.findReposInOrganizationResponse(githubApiResponse)).toEqual([
        firstRepoName,
        secondRepoName,
        thirdRepoName,
    ]);
})
