'use strict';

//TODO: CONVERT "OPEN" TO 0

const github = require('github')
const pullIssues = require('../src/pull_issues')
const testConsts = require('./test_consts')

test('Converts open issue state correctly', () => {
    expect(pullIssues.convertIssueState('open')).toBe(0);
})

test('Converts closed issue state correctly', () => {
    expect(pullIssues.convertIssueState('closed')).toBe(1);
})

test('Throws exception on invalid issue state', () => {
    expect(() => pullIssues.convertIssueState('INVALID')).toThrow();
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
        status: pullIssues.convertIssueState(githubState), 
        url: url, 
        github_id: idNumber, 
        creator: issueCreator,
        assignee: null,
    };
    expect(pullIssues.convertToDTO(githubApiResponse)).toEqual(dto);
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
        status: pullIssues.convertIssueState(githubState),
        url: url,
        github_id: idNumber,
        creator: issueCreator,
        assignee: issueAssignee,
    }
    expect(pullIssues.convertToDTO(githubApiResponse)).toEqual(dto);
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
            status: pullIssues.convertIssueState(firstIssueState),
            url: firstUrl,
            github_id: firstIssueNumber,
            creator: firstCreator,
            assignee: null,
        },
        {
            title: secondTitle,
            status: pullIssues.convertIssueState(secondIssueState),
            url: secondUrl,
            github_id: secondIssueNumber,
            creator: secondCreator,
            assignee: null,
        }
    ]

    expect(pullIssues.convertResponseToDTO(githubApiResponse)).toEqual(expectDTOs)
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

    expect(pullIssues.findReposInOrganizationResponse(githubApiResponse)).toEqual([
        firstRepoName,
        secondRepoName,
        thirdRepoName,
    ]);
})

// Integration test that hits rate limits on Travis.
it.skip('Pulls any issues', () => {
    expect.assertions(1);
    return pullIssues.findAll(testConsts.TEST_ORGANIZATION, testConsts.TEST_REPO).then(result => {
        expect(result).toContainEqual({
            title: "Flamingos sollten grün sein!",
            status: pullIssues.convertIssueState('open'),
            url: 'https://github.com/PapageienTeam/integration-test/issues/1',
            github_id: 1,
        });
    })
})

it.skip('Finds all repos in an organization', () => {
    expect.assertions(1);
    return pullIssues.findReposInOrganization(testConsts.TEST_ORGANIZATION).then( result => {
        expect(result).toContain('integration-test');
    });
})

it.skip('Finds all issues in an organization', () => {
    expect.assertions(1);
    return pullIssues.findAllIssuesInOrganization(testConsts.TEST_ORGANIZATION).then(result => {
        expect(result[0]).toContainEqual({
            title: "Flamingos sollten grün sein!",
            status: pullIssues.convertIssueState('open'),
            url: 'https://github.com/PapageienTeam/integration-test/issues/1',
            github_id: 1,
            assignee: "mtp0",
            creator: "mtp0",
        });
    });
})