import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ErrorModal } from './components/layout/ErrorModal'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultErrorComponent: ({ error, reset }) => {
    <ErrorModal error={error} reset={reset} />
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerAppRouter() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerAppRouter />
      </AuthProvider>
    </QueryClientProvider>,
  )
}
