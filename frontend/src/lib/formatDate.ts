/** Format an ISO timestamp (as returned by the backend) for display. */
export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return isoString
  }
  return date.toLocaleString()
}
