const core = require("@actions/core")

const languageDataModel = (graphql_result) => {
    try {

        const orgId = core.getInput("orgId")
        if (graphql_result.languages.nodes) {
            return graphql_result.languages.nodes.map(ele => {
                return {
                    name: ele.name,
                    id: ele.id,
                    orgId: orgId
                }
            })
        }

    }
    catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = {
    languageDataModel
}