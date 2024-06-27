'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default TanstackProvider