'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

// Note: metadata cannot be exported from a Client Component — noindex is handled via robots.ts
export default function StudioPage() {
  return <NextStudio config={config} />
}
