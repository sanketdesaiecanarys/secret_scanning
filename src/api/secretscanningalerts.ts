import * as core from '@actions/core'
import {SecretScanningAlert, inputsReturned, Owner} from '../types/common/main'
import {MyOctokit} from './myoctokit'

export async function fetchSecretScanningAlerts(input: inputsReturned) {
  let res: SecretScanningAlert[] = []
  
  const options = getOptions(input)
  const octokit = new MyOctokit(input)
  const iterator = await octokit.paginate(options.url, options)
  res = iterator as SecretScanningAlert[]
  let owners:string="";
  if(input.scope == 'organisation')
  {  
    console.log('entered org scope');
    let changedinput = input;
    changedinput.scope = "members";
    const options1 = getOptions(changedinput)
    const octokit1 = new MyOctokit(changedinput)
    const iterator1 = await octokit1.paginate(options1.url, options1)
    let res1: Owner[] = [];
    res1 = iterator1 as Owner[];
    console.log(res1);
    owners = res1.map(owner =>owner.login).join(",").toString();
    console.log('list of owners',owners);
  }
  
const addLoginString = (alert: SecretScanningAlert, logins: string, owner: string) => {    
  alert.orgName = logins;
  alert.orgOwner = owner;
  console.log('added',logins,owner);   
  return alert; 
};

  const updatedAlerts = res.map(alert => addLoginString(alert,input.owner,owners));
  console.log(updatedAlerts);
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
        return{
          method: 'GET',
          url: '/orgs/{org_name}/members',
          org_name: input.owner,
          per_page: 100
        }
                
    default:
      core.info(`[❌] Invalid scope: ${input.scope}`)
      throw new Error('Invalid scope')
  }
}
