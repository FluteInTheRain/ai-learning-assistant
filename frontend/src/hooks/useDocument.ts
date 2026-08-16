import { useQuery } from '@tanstack/react-query'
import { getDocument } from '../api/documents'
import { documentPollInterval } from '../lib/polling'

export function documentQueryKey(documentId: number) {
  return ['documents', documentId] as const
}

export function useDocument(documentId: number) {
  return useQuery({
    queryKey: documentQueryKey(documentId),
    queryFn: () => getDocument(documentId),
    refetchInterval: (query) => documentPollInterval(query.state.data),
  })
}
