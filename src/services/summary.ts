import * as core from '@actions/core'
import {SummaryTableRow} from '@actions/core/lib/summary'
import {SecretScanningAlert} from '../types/common/main'

export function addToSummary(title: string, alerts: SecretScanningAlert[]) {
  const headers = ['Alert Number', 'Secret State', 'Secret Type', 'HTML URL','Repo Name','Repo Owner','Org Name','Org Owner']
  // Define the table rows
  console.log('now we entered Table generation');
  const rows = alerts.map(alert => [
    alert.number.toString(),
    alert.state,
    alert.secret_type,
    alert.html_url,
    alert.repository.name,
    alert.repository.owner.login,
    alert.orgName,
    alert.orgOwner 
  ])

  // Add the table to the Action summary
  core.summary
    .addHeading(title)
    .addTable([
      headers.map(header => ({data: header, header: true})),
      ...rows
    ] as SummaryTableRow[])
    .addBreak()
}

export function writeSummary() {
  core.summary.write()
  core.info(`[✅] Action summary written`)
}

export function getSummaryMarkdown() {
  return core.summary.stringify()
}
