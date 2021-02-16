# Get Milestone Issues

GitHub Action to get milestone issues

## Pre-requisites

Create a workflow .yml file in your .github/workflows directory. An example workflow is available below. For more information, reference the GitHub Help Documentation for Creating a workflow file.

## Inputs

`repository`: Github repository. Add the Github context value: `github.repository`. (**required**)

`milestone`: A string to uniquely identify the milestone. Needs to be part of the title and only one open milestone should match this string. (**required**)

`classifierLabels`: A comma-separated list of labels. Only issues with one of these labels will be returned. Also, these labels are used for grouping the issues in the response. (**required**)

## Outputs

`milestoneNumber`: Milestone number which matched the 'milestone' parameter.

`milestoneTitle`: Milestone title which matched the 'milestone' parameter.

`issues`: Stringified object with classifierLabels as the attributes.

`issuesText`: Stringified object with classifierLabels as the attributes. 

## Example

```yaml
- name: Get milestone issues
  uses: bsdeducation/gha-get-milestone-issues@v0.0.1
  id: milestone-issues
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    repository: ${{ github.repository }}
    milestone: ${{ github.event.inputs.milestone }}
    classifierLabels: new-feature,enhancement,bug

- name: Debug milestone title value
  run: |
    echo "Milestone: ${{ steps.milestone-issues.outputs.milestoneTitle }}
    echo "Issues: ${{ steps.milestone-issues.outputs.issuesText }}"
```
