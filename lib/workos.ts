import WorkOS from '@workos-inc/node'

// WorkOS client singleton
export const workos = new WorkOS(process.env.WORKOS_API_KEY!)

export const clientId = process.env.WORKOS_CLIENT_ID!
