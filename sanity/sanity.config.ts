import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schema'

// NOTE: visionTool removed due to version incompatibility — add back once Sanity project is initialized with npx sanity@latest init

export default defineConfig({
  name: 'julie-christensen-portfolio',
  title: 'Julie Christensen Portfolio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
