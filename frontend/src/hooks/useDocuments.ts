import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listDocuments, uploadDocument } from '../api/documents'
import { documentsPollInterval } from '../lib/polling'

export function documentsQueryKey(sessionId: number) {
  return ['sessions', sessionId, 'documents'] as const
}

export function useDocuments(sessionId: number) {
  return useQuery({
    queryKey: documentsQueryKey(sessionId),
    queryFn: () => listDocuments(sessionId),
    refetchInterval: (query) => documentsPollInterval(query.state.data),
  })
}

export function useUploadDocument(sessionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadDocument(sessionId, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: documentsQueryKey(sessionId),
      })
    },
  })
}
