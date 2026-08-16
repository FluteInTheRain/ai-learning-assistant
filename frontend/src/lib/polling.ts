import type { DocumentResponse } from '../api/types'

/** Poll a single document while it's still being ingested. */
export function documentPollInterval(doc?: DocumentResponse): number | false {
  return doc?.status === 'PENDING' ? 2000 : false
}

/** Poll a document list while any document in it is still PENDING. */
export function documentsPollInterval(
  docs?: DocumentResponse[],
): number | false {
  return docs?.some((d) => d.status === 'PENDING') ? 2000 : false
}
