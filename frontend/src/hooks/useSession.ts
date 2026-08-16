import { useQuery } from '@tanstack/react-query'
import { getSession } from '../api/sessions'

export function useSession(sessionId: number) {
  return useQuery({
    queryKey: ['sessions', sessionId] as const,
    queryFn: () => getSession(sessionId),
  })
}
