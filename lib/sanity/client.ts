import { createClient } from '@sanity/client'

// Fallback to 'unconfigured' prevents a throw during build when env vars are not yet set.
// At runtime (dev/production with real env vars), this is replaced by the actual project ID.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'unconfigured',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
