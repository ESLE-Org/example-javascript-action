const core = require("@actions/core")

const basicRepoDetailsModel = (repository) => {
    const orgId = core.getInput("orgId")

    return {
        createdAt: repository.created_at,
        monitorStatus: 1,
        orgId: orgId,
        repoName: repository.name,
        id: repository.node_id,
    }

}

module.exports = {
    basicRepoDetailsModel
}