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

test('Converts a single issue correctly', () => {
    const title = "I'm a bug!";
    const url = "https://url.com";
    const githubState = "open";
    const idNumber = 5;
    const githubApiResponse = {number: idNumber, state: githubState, html_url: url, title: title}; 
    const dto = {title: title, status: pullIssues.convertIssueState(githubState), url: url, github_id: idNumber};
    expect(pullIssues.convertToDTO(githubApiResponse)).toEqual(dto);
})

test('Converts multiple issues correctly', () => {
    const firstIssueNumber = 5;
    const firstIssueState = "open";
    const firstUrl = "http://Url1.com";
    const firstTitle = "FunFlamingo";
    const firstApiResponse = {
        number: firstIssueNumber,
        state: firstIssueState,
        html_url: firstUrl,
        title: firstTitle,
    }

    const secondIssueNumber = 6;
    const secondIssueState = "open";
    const secondUrl = "http://Url2.com";
    const secondTitle = "SadFlamingo";
    const secondApiResponse = {
        number: secondIssueNumber,
        state: secondIssueState,
        html_url: secondUrl,
        title: secondTitle,
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
        },
        {
            title: secondTitle,
            status: pullIssues.convertIssueState(secondIssueState),
            url: secondUrl,
            github_id: secondIssueNumber,
        }
    ]

    expect(pullIssues.convertResponseToDTO(githubApiResponse)).toEqual(expectDTOs)
})

it('Pulls any issues', () => {
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