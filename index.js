const core = require("@actions/core");
const getMilestoneIssues = require('./getMilestoneIssues');

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
    core.setOutput('issues', issues);
  } catch (error) {
    console.log('Error => ', error);
    core.setFailed(error.message);
  }
};

run();
