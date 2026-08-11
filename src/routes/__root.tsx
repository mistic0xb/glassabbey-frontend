import { Outlet,createRootRouteWithContext } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '../styles.css'
import type { QueryClient } from '@tanstack/react-query'

export interface AppRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
      ></ReactQueryDevtools>

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
