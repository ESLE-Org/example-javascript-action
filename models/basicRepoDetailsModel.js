const core = require("@actions/core")

const basicRepoDetailsModel = (repository) => {

    return {
        createdAt: repository.created_at,
        monitorStatus: 1,
        orgId: repository.owner.node_id,
        repoName: repository.name,
        id: repository.node_id,
    }

}

module.exports = {
    basicRepoDetailsModel
}