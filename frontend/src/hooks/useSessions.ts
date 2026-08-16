import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSession, listSessions } from '../api/sessions'
import type { SessionCreate } from '../api/types'

export const sessionsQueryKey = ['sessions'] as const

export function useSessions() {
  return useQuery({
    queryKey: sessionsQueryKey,
    queryFn: listSessions,
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SessionCreate) => createSession(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionsQueryKey })
    },
  })
}
