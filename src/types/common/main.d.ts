export {inputsReturned, scopeInput, SecretScanningAlert, RateLimitOptions, Owner, RepoModel}

type inputsReturned = {
  frequency: number
  scope: scopeInput
  api_token: string
  apiURL: string
  repo: string
  owner: string
  enterprise: string
  new_alerts_filepath: string
  closed_alerts_filepath: string
}

type scopeInput = 'organisation' | 'repository' | 'enterprise' | 'members' | 'colaborators'

type SecretScanningAlert = {
  number: number
  created_at: string
  updated_at: string
  resolved_at: string | null
  url: string
  html_url: string
  state: string
  secret_type: string
  repository:RepoModel
  login:string,
  orgName: string,
  orgOwner: string
}
type RepoModel = {
  node_id: string
  name: string
  owner: Owner
}
type Owner = {
  login: string
  node_id: string
}


type RateLimitOptions = {
  request: {
    retryCount: number
  }
}



