# Security Status Monitoring Action

This action update CosmosDB with latest repo details.

## Prerequisite
  - You need to have [Security Status Monitoring App](https://github.com/ESLE-Org/security-status-monitoring-app-using-github-actions) setup in order to view the results.
  - You can find [Demo Dashboard](https://security-monitor-app-using-github-actions.azurewebsites.net/) here

## Inputs

## `githubToken`

**Required** Github Token provide by workflow `${{secrets.GITHUB_TOKEN}}.

## `db_endpoint`

**Required** CosmosDB endpoint url

## `db_key`

**Required** CosmosDB key

## Outputs

## `time`

The time process end.

## Example usage
```
  uses: actions/security-status-monitoring-action@v1.0.0
  with:
    githubToken: ${{secrets.GITHUB_TOKEN}}
    db_endpoint: ${{secrets.DB_ENDPOINT}}
    db_key: ${{sectets.DB_KEY}}
```