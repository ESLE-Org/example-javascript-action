const core = require("@actions/core")

const languagesQuery = `query ($owner:String!, $repo:String!){
    repository(owner:$owner,name:$repo){
        owner {
            id
        }
        languages(first:100){
          pageInfo{
            hasNextPage,
            endCursor
          }
          nodes{
            name
            id
          }
        }
      }
}`

async function getLanguages(octokit, owner, repo) {
    try {
        return await octokit.graphql({
            query: languagesQuery,
            owner: owner,
            repo: repo
        })
            .then(result => {

                return result.repository
            })
            .catch(e => {
                throw e
            })
    }
    catch (error) {
        core.setFailed(error.message)
    }
}

const iterativeLanguageQuery = `query ($owner:String!, $repo:String!, $after:String!){
    repository(owner:$owner,name:$repo){
        owner {
            id
        }
        languages(first:100, after:$after){
          pageInfo{
            hasNextPage,
            endCursor
          }
          nodes{
            name
            id
          }
        }
      }
}`

async function getNextLanguages(octokit, owner, repo, after) {
    try {
        return await octokit.graphql({
            query: iterativeLanguageQuery,
            owner: owner,
            repo: repo,
            after: after
        })
            .then(result => {

                return result.repository
            })
            .catch(e => {
                throw e
            })

    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = {
    getLanguages,
    getNextLanguages
}