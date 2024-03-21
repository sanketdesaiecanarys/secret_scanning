export {inputsReturned, scopeInput, SecretScanningAlert, RateLimitOptions}

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

type scopeInput = 'organisation' | 'repository' | 'enterprise' | 'organization'

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
  login:login
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
type login= {
  type: string
  
}

type RateLimitOptions = {
  request: {
    retryCount: number
  }
}



