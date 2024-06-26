import * as core from '@actions/core'
import { SecretScanningAlert, inputsReturned, Owner, RepoModel } from '../types/common/main'
import { MyOctokit } from './myoctokit'

export async function fetchSecretScanningAlerts(input: inputsReturned) {
  let res: SecretScanningAlert[] = []

  const options = getOptions(input)
  const octokit = new MyOctokit(input)
  const iterator = await octokit.paginate(options.url, options)
  res = iterator as SecretScanningAlert[]
  let owners: string = "";
  if (input.scope == 'organisation') {
    console.log('entered org scope');
    let changedinput = input;
    changedinput.scope = "members";
    const options1 = getOptions(changedinput)
    const octokit1 = new MyOctokit(changedinput)
    const iterator1 = await octokit1.paginate(options1.url, options1)
    let res1: Owner[] = [];
    res1 = iterator1 as Owner[];
    console.log(res1);
    owners = res1.map(owner => owner.login).join(",").toString();
    console.log('list of owners', owners);

    // console.log("collaborator logic");
    // let changecolaborator = input;
    // changecolaborator.scope = "colaborators";
    // const options2 = getOptions(changecolaborator)
    // const octokit2 = new MyOctokit(changecolaborator)
    // const iterator2 = await octokit2.paginate(options2.url, options2)
    // console.log(iterator2);
    // let res2: Owner[] = [];
    // res2 = iterator2 as Owner[];
    // console.log(res2);
  }

  const addLoginString = async (alert: SecretScanningAlert, logins: string, owner: string) => {
    alert.orgName = logins;
    alert.orgOwner = owner;
    console.log('added', logins, owner); 
    let repoowners: string = "";
    console.log("collaborator logic");
    let changecolaborator = input;
    changecolaborator.scope = "colaborators";
    changecolaborator.repo = alert.repository.name;
    console.log("repo: ", changecolaborator.repo);
    console.log("owner: ", changecolaborator.owner);
    const options2 = getOptions(changecolaborator);
    // /collaborators?affiliation=direct
    const octokit2 = new MyOctokit(changecolaborator);
    const iterator2 = await octokit2.paginate(options2.url, options2);
    console.log(iterator2);
    let res2: RepoModel[] = [];
    res2 = iterator2 as RepoModel[];
    console.log(res2);
    // repoowners = res2.map(owner => owner.login).join(",").toString();
    // console.log('list of repo owners', owners);
    alert.repository.owner.login = repoowners;
    return alert;
  };

  const updatePromises = res.map(async alert => await addLoginString(alert, input.owner, owners));
  //console.log(updatedAlerts);
  //res = await updatedAlerts;
  const updatedAlerts = await Promise.all(updatePromises);
  res = updatedAlerts;
  return res
}

function getOptions(input: inputsReturned) {
  switch (input.scope) {
    case 'repository':
      return {
        method: 'GET',
        url: '/repos/{owner}/{repo}/secret-scanning/alerts',
        owner: input.owner,
        repo: input.repo,
        per_page: 100
      }
    case 'organisation':
      return {
        method: 'GET',
        url: '/orgs/{org}/secret-scanning/alerts',
        org: input.owner,
        per_page: 100
      }
    case 'enterprise':
      return {
        method: 'GET',
        url: '/enterprises/{enterprise}/secret-scanning/alerts',
        enterprise: input.enterprise,
        per_page: 100
      }
    case 'members':
      return {
        method: 'GET',
        url: '/orgs/{org_name}/members?role=admin',
        org_name: input.owner,
        per_page: 100
      }
    case 'colaborators':
      return {
        method: 'GET',
        url: '/repos/{owner}/{repo_name}',
        owner: input.owner,
        repo_name: input.repo,
        per_page: 100
      }

    default:
      core.info(`[❌] Invalid scope: ${input.scope}`)
      throw new Error('Invalid scope')
  }
}
