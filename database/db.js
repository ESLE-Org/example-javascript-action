const core = require("@actions/core")
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = require("./config")
const dbContext = require("./dbContext")

const { endpoint, key, databaseId } = config;

const client = new CosmosClient({ endpoint, key });

async function itemManager(containerId) {

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await dbContext.create(client, databaseId, containerId);

    return container

}

async function basicRepoDetailsProcess(basicRepoDetailsData) {
    try {
        // Get container
        const container = await itemManager("BasicRepoDetails")
        // Check item exists in container
        const { resource } = await container.item(basicRepoDetailsData.id, basicRepoDetailsData.orgId).read()
        if (resource) {
            // Item exists
            basicRepoDetailsData.tag = resource.tag
            basicRepoDetailsData.repoWatchStatus = resource.repoWatchStatus
            await container.item(basicRepoDetailsData.id, basicRepoDetailsData.orgId).replace(basicRepoDetailsData)
        }
        else {
            // Item not exists
            basicRepoDetailsData.tag = "Not Specified"
            basicRepoDetailsData.repoWatchStatus = 0
            await container.items.create(basicRepoDetailsData)
        }

        return true



    }
    catch (error) {
        core.setFailed("basicRepoDetailsProcess :: " + error.message)
    }


}

async function languagesProcess(languagesData) {
    try {
        const container = await itemManager("Languages")
        const orgId = languagesData[0].orgId
        // query to return all items
        const querySpec = {
            query: "SELECT * FROM Languages l WHERE  l.orgId = @orgId",
            parameters: [
                {
                    name: "@orgId",
                    value: orgId
                }
            ]
        };

        // read all items in the Items container
        const { resources: results } = await container.items
            .query(querySpec)
            .fetchAll();
        // No language found for organization

        if (results.length === 0) {

            const operations = languagesData.map(n => {
                n.testingTools = []
                return {
                    operationType: "Create",

                    resourceBody: n
                }
            })
            if (operations.length !== 0) {
                await container.items.batch(operations, orgId)

            }
        }
        else {
            // Langugaes exists
            // Get non-existing items
            const new_languagesData = languagesData.filter(new_obj => {
                return !results.some(ex_obj => {
                    return new_obj.id === ex_obj.id
                })
            })
            const operations = new_languagesData.map(n => {
                n.testingTools = []
                return {
                    operationType: "Create",
                    resourceBody: n
                }
            })
            if (operations.length !== 0) {
                await container.items.batch(operations, orgId)

            }

        }

    }
    catch (error) {
        core.setFailed("langugaeProcess :: " + error.message)
    }
}

async function repositoriesProcess(repositoriesData) {
    try {
        const container = await itemManager("Repositories")
        const { resource } = await container.item(repositoriesData.id, repositoriesData.orgId).read()
        if (resource) {
            // Update neccessary fields
            await container.item(repositoriesData.id, repositoriesData.orgId).replace(repositoriesData)

        }
        else {
            // Create new item
            await container.items.create(repositoriesData)
        }
    }
    catch (error) {
        core.setFailed("repositoriesProcess :: " + error.message)
    }
}


module.exports = {
    basicRepoDetailsProcess,
    languagesProcess,
    repositoriesProcess,
}