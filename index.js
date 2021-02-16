const core = require("@actions/core");
const getMilestoneIssues = require('./getMilestoneIssues');

const requiredOptions = { required: true };

async function run() {
  try {
    const repository = core.getInput("repository", requiredOptions);
    const milestone = core.getInput("milestone", requiredOptions);
    const classifierLabels = core.getInput("classifierLabels", requiredOptions);
    const githubToken = process.env.GITHUB_TOKEN;
    
    const {milestoneNumber,
      milestoneTitle,
      issues,
      issuesText
    } = await getMilestoneIssues({repository, milestone, classifierLabels, githubToken});

    console.log(issues);
    core.setOutput('milestoneNumber', milestoneNumber);
    core.setOutput('milestoneTitle', milestoneTitle);
    core.setOutput('issues', issues);
    core.setOutput('issuesText', issuesText);
  } catch (error) {
    console.log('Error => ', error);
    core.setFailed(error.message);
  }
};

run();
