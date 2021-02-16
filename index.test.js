const getMilestoneIssues = require('./getMilestoneIssues');
const process = require('process');

test('getMilestoneIssues', async () => {
  const res = await getMilestoneIssues({
    repository: 'bsdeducation/launchbox', 
    milestone: '107',
    githubToken: process.env.GITHUB_TOKEN,
    classifierLabels: ['new-feature', 'enhancement', 'bug:production', 'dev'],
  });
  console.log('res: ', res);
});