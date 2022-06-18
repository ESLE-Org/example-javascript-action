
const core = require("@actions/core")

/**
 * @desc repo data model
 * @param {Object} graphql_result graphql result from getLastPRStatus
 * @returns {Object} mapped repo data
 */
const repoDataModel = (graphql_result, open_prs = []) => {

    try {

        const blob = {
            description: graphql_result.description,
            dbUpdatedAt: (new Date()).toISOString(),
            monitorStatus: 1,
            languages: [],
            orgId: graphql_result.owner.id,
            repoName: graphql_result.name,
            repoUrl: graphql_result.url,
            updateAt: graphql_result.updateAt,
            id: graphql_result.id,
            openPRs: []

        }
        // if langauges exists
        if (graphql_result.languages.edges) {

            blob.languages = graphql_result.languages.edges.map(e => {
                return e.node
            })
        }
        if (graphql_result.pullRequests.edges) {
            blob.openPRs = graphql_result.pullRequests.edges.map(ele => {
                return {
                    prNumber: ele.node.number,
                    prUrl: ele.node.url,
                    lastCommit: ele.node.commits.nodes[0].commit
                }
            })
        }
        if (open_prs.length !== 0) {
            blob.openPRs = blob.openPRs.concat(open_prs)
        }



        return blob
    }
    catch (error) {
        core.setFailed(error.message)

    }
}



module.exports = {
    repoDataModel
}