# Example javascript action

This action update CosmosDB with latest repo details.

## Inputs

## `githubToken`

**Required** Github Token provide by workflow `${{secrets.GITHUB_TOKEN}}.

## `db_endpoint`

**Required** CosmosDb endpoint url

## `db_key`

**Required** CosmosDB key

## Outputs

## `time`

The time process end.

## Example usage

uses: actions/example-javascript-action@v0.5
with:
  githubToken: ${{secrets.GITHUB_TOKEN}}
  db_endpoint: ${{secrets.DB_ENDPOINT}}
  db_key: ${{sectets.DB_KEY}}
