import { authQueryOptions } from '#/queries/authQueries'
import {
  createFileRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'

export const Route = createFileRoute('/creator')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const user = await queryClient.ensureQueryData(authQueryOptions)

    if (!user) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      })
    }
  },
  component: () => <Outlet />,
})
