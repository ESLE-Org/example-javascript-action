const core = require("@actions/core")
const github = require("@actions/github");

const { repoDataModel } = require("./models/repoDataModel")
const { prDataModel } = require("./models/prDataModel")
const { languageDataModel } = require("./models/languageDataModel")
const { basicRepoDetailsModel } = require("./models/basicRepoDetailsModel")

const { repositoriesProcess,
  languagesProcess,
  basicRepoDetailsProcess } = require("./database/db")

const { getRepoDetails, getOpenPRs } = require("./query/prStatus")
const { getLanguages, getNextLanguages } = require("./query/langauges")


async function iterativeOpenPRCollect(octokit, owner, repo, after, hasNextPage = false) {
  try {

    let open_prs = []
    let temp_result

    while (hasNextPage) {
      temp_result = await getOpenPRs(octokit,
        owner,
        repo,
        after
      )
      open_prs = open_prs.concat(prDataModel(temp_result))
      hasNextPage = temp_result.pullRequests.pageInfo.hasNextPage
      after = temp_result.pullRequests.pageInfo.endCursor
    }
    return open_prs

  }
  catch (error) {
    core.setFailed(error.message)
  }
}


async function iterativeLanguagesCollect(octokit, owner, repo, after, hasNextPage = false) {
  try {

    let languages = []
    let temp_result

    while (hasNextPage) {
      temp_result = await getNextLanguages(octokit,
        owner,
        repo,
        after
      )
      languages = languages.concat(languageDataModel(temp_result))
      hasNextPage = temp_result.languages.pageInfo.hasNextPage
      after = temp_result.languages.pageInfo.endCursor
    }
    return languages

  }
  catch (error) {
    core.setFailed(error.message)
  }
}

async function run() {
  try {

    const myToken = core.getInput("githubToken")
    const octokit = github.getOctokit(myToken)

    const owner = core.getInput("orgId") //github.context.payload.repository.owner.login
    const repo = github.context.payload.repository.name

    // Update basic Repository Details
    await basicRepoDetailsProcess(basicRepoDetailsModel(github.context.payload.repository))

    // Update languages
    let languages_details = await getLanguages(octokit, owner, repo)

    let languages = []
    // More than 100 languages query them all
    if (languages_details.languages.pageInfo.hasNextPage) {
      languages = await iterativeLanguagesCollect(
        octokit,
        owner,
        repo,
        languages_details.languages.pageInfo.endCursor,
        true)
    }
    // Concat all language data
    languages = languageDataModel(languages_details).concat(languages)
    // Update database
    await languagesProcess(languages)
    // Last pr check result
    const repo_details = await getRepoDetails(octokit, owner, repo)
    // More than 100 Open PRs available query them all
    let open_prs = []
    if (repo_details.pullRequests.pageInfo.hasNextPage) {
      open_prs = await iterativeOpenPRCollect(
        octokit,
        owner,
        repo,
        repo_details.pullRequests.pageInfo.endCursor,
        true
      )
    }
    // Update pr details in database
    await repositoriesProcess(repoDataModel(repo_details, open_prs))

    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }

}

run()