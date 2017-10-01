'use strict';

// Integration test that hits rate limits on Travis.
it.skip('Pulls any issues', () => {
    expect.assertions(1);
    return responseProcessor.findAll(testConsts.TEST_ORGANIZATION, testConsts.TEST_REPO).then(result => {
        expect(result).toContainEqual({
            title: "Flamingos sollten grün sein!",
            status: responseProcessor.convertIssueState('open'),
            url: 'https://github.com/PapageienTeam/integration-test/issues/1',
            github_id: 1,
            assignee: 'mpt0',
            creator: 'mpt0'
        });
    })
})

it.skip('Finds all repos in an organization', () => {
    expect.assertions(1);
    return responseProcessor.findReposInOrganization(testConsts.TEST_ORGANIZATION).then( result => {
        expect(result).toContain('integration-test');
    });
})

it.skip('Finds all issues in an organization', () => {
    expect.assertions(1);
    return responseProcessor.findAllIssuesInOrganization(testConsts.TEST_ORGANIZATION).then(result => {
        expect(result[0]).toContainEqual({
            title: "Flamingos sollten grün sein!",
            status: responseProcessor.convertIssueState('open'),
            url: 'https://github.com/PapageienTeam/integration-test/issues/1',
            github_id: 1,
            assignee: "mpt0",
            creator: "mpt0",
        });
    });
})