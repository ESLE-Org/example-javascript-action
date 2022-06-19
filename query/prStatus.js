const core = require("@actions/core")
const github = require("@actions/github");



// get pr status
const getRepoDetailsQuery = `query($owner:String!, $repo:String!){
    repository(owner: $owner, name: $repo) {
      name
      url
      id
      owner {
        id
      }
      primaryLanguage {
        name
      }
      description
      updatedAt
      languages(first: 100) {
        totalSize
        edges {
          size
          node {
            name
            color
            id
          }
        }
      }
      pullRequests(first:100, states: OPEN) {
        pageInfo{
            endCursor
            hasNextPage
        }
        edges {
          node {
            number
            url
            commits(last: 1) {
              nodes {
                commit {
                  commitUrl
                  oid
                  status {
                    state
                    contexts {
                      context
                      state
                      targetUrl
                      description
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`


const getOpenPRStatusQuery = `query($owner: String!, $repo: String!, $after: String!){
  repository(owner: $owner, name: $repo) {
    pullRequests(first: 100, states: OPEN, after: $after){
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          number
          url
          commits(last: 1) {
            nodes {
              commit {
                commitUrl
                oid
                status {
                  state
                  contexts {
                    context
                    state
                    targetUrl
                    description
                  }
                }
              }
            }
          }
        }

      }
    }
  }
}`

async function getRepoDetails(octokit, owner, repo) {
  try {
    return await octokit.graphql({
      query: getRepoDetailsQuery,
      repo: repo,
      owner: owner
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

async function getOpenPRs(octokit, owner, repo, after) {
  try {
    return await octokit.graphql({
      query: getOpenPRStatusQuery,
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
  getRepoDetails,
  getOpenPRs
}