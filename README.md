# Security Status Monitoring Action

This action update CosmosDB with latest repo details.

## Prerequisite
  - You need to have [Security Status Monitoring App](https://github.com/ESLE-Org/security-status-monitoring-app-using-github-actions) setup in order to view the results.
  - You can find [Demo Dashboard](https://security-monitor-app-using-github-actions.azurewebsites.net/) here

## Inputs

## `githubToken`

**Required** Github Token provide by workflow `${{secrets.GITHUB_TOKEN}}.

## `db_endpoint`

**Required** CosmosDB Base URL

## `db_key`

**Required** CosmosDB Primary Key

## Outputs

## `time`

The time process end.

## Example usage
```
  name: Security Status Monitoring

  # Controls when the workflow will run
  on:
    # Trigger after workflow run
    workflow_run : 
      # workflow that need to be complete
      workflows : []
      # After above workflow completed run this workflow 
      types : [ completed]
    # Allows you to run this workflow manually from the Actions tab
    workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  Sync_db:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - uses: ESLE-Org/security-status-monitoring-action@v1.0.0
        with:
          # Github token
          githubToken: ${{secrets.GITHUB_TOKEN}}
          # CosmosDB Base URL
          db_endpoint: ${{secrets.COSMOS_DB_BASE_URL}}
          # CosmosDB Primary Key
          db_key: ${{secrets.COSMOS_DB_PRIMARY_KEY}}
```