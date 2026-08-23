import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '../styles.css'
import type { QueryClient } from '@tanstack/react-query'
import { Navbar } from '#/components/layout/NavBar'
import type { AuthContextType } from '#/context/AuthContext'

export interface AppRouterContext {
  auth: AuthContextType,
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <Outlet />
      </div>

      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
