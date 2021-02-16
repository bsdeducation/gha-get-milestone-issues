const {groupBy, mapValues, some} = require('lodash');
const github = require("@actions/github");
const { graphql } = require("@octokit/graphql");

async function getMilestoneIssues({
  repository: repoAndOwner,
  milestone: milestoneString,
  classifierLabels,
  githubToken,
}) {
  const [owner, repoName] = repoAndOwner.split('/');
  const octokit = github.getOctokit(githubToken);

  const allMilestones = await octokit.request(
    `GET /repos/${owner}/${repoName}/milestones`
  );
  if (allMilestones.data) {
    const matchingMilestones = allMilestones.data.filter(
      (milestone) =>
        milestone.state === "open" && milestone.title.includes(milestoneString)
    );
    if (matchingMilestones.length === 0) {
      throw new Error(
        `Failed to find an open milestone matching '${milestoneString}'.`
      );
    } else if (matchingMilestones.length > 1) {
      throw new Error(
        `Ambiguous milestone ID '${milestoneString}'. Found ${matchingMilestones.length} milestones.`
      );
    }
    const milestoneNumber = matchingMilestones[0].number;
    console.log(`Milestone ${milestoneNumber} matches '${milestoneString}'`);

    const { repository } = await graphql(`
    {
        repository(owner: "${owner}", name: "${repoName}") {
            milestone(number: ${milestoneNumber}) {
                issues(first: 1000) {
                    edges {
                      node {
                        number
                        title
                        labels(first: 10) {
                          nodes {
                            name
                          }
                        }
                      }
                    }
                }
            }
        }
    }
    `,
      {
        headers: {
          authorization: `token ${githubToken}`,
        },
      }
    );

    let issues = repository.milestone.issues.edges.map(
        ({node}) => {
            const {labels, ...rest} = node;
            return {labels: labels.nodes.map(({name}) => name), ...rest};
        }
    );
    issues = issues.filter(
        ({labels}) => some(labels, label => classifierLabels.includes(label))
    );
    issues = groupBy(issues, ({labels, ...rest}) => labels[0]);
    issues = mapValues(issues, (labelIssues) => labelIssues.map(({labels, ...rest}) => rest));
    return {
        milestoneNumber,
        milestoneTitle: matchingMilestones[0].title,
        issues,
        issuesText: mapValues(issues, (labelIssues) => labelIssues.map(({number, title}) => `#${number} ${title}`).join('\n')),
    }
  } else {
    return {};
  }
}

module.exports = getMilestoneIssues;
