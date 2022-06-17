
const core = require("@actions/core")

/**
 * @desc repo data model
 * @param {Object} graphql_result graphql result from getLastPRStatus
 * @returns {Object} mapped repo data
 */
const repoDataModel = (graphql_result) => {

    try {

        const blob = {
            description: graphql_result.description,
            dbUpdatedAt: "",
            languages: [],
            monitorStatus: 0,
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
            blob.openPRs = graphql_result.pullRequests.edges.map(node => {

                return {
                    prNumber: node.number,
                    prUrl: node.url,
                    lastCommit: node.commits.nodes[0].commit
                }
            })
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