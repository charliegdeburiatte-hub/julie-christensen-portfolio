import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category: 'long-form' | 'short-form' | 'podcast' | 'corporate'
  year: number
  clientName: string
  role: string
  description: string
  videoUrl: string
  aspectRatio: '16:9' | '9:16'
  thumbnail: SanityImageSource | null
  testimonial?: string
  published: boolean
  order: number
}

export interface Service {
  _id: string
  title: string
  description: string
  turnaround: string
  revisionsPolicy: string
  startingPrice: number
  currency: string
  order: number
}

export interface Testimonial {
  _id: string
  quote: string
  author: string
  platform: string
  featured: boolean
}

export interface SiteSettings {
  tagline: string
  bio: string
  profilePhoto: SanityImageSource | null
  email: string
  socialLinks: Array<{ platform: string; url: string }>
}
