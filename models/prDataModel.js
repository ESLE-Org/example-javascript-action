const core = require("@actions/core")

const prDataModel = (graphql_result) => {
    try {

        if (graphql_result.pullRequests.edges) {
            return graphql_result.pullRequests.edges.map(ele => {
                return {
                    prNumber: ele.node.number,
                    prUrl: ele.node.url,
                    lastCommit: ele.node.commits.nodes[0].commit
                }
            })
        }
        else {
            return []
        }
    }
    catch (error) {
        core.setFailed(error)
    }
}


module.exports = {
    prDataModel
}