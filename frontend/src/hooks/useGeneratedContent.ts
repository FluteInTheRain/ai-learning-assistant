import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateContent, listGeneratedContent } from '../api/documents'
import type { GenerateAction } from '../api/types'

export function generatedContentQueryKey(documentId: number) {
  return ['documents', documentId, 'generated'] as const
}

export function useGeneratedContent(documentId: number) {
  return useQuery({
    queryKey: generatedContentQueryKey(documentId),
    queryFn: () => listGeneratedContent(documentId),
  })
}

export function useGenerateContent(documentId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (action: GenerateAction) => generateContent(documentId, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: generatedContentQueryKey(documentId),
      })
    },
  })
}
