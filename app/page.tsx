import type { Metadata } from 'next'

// Dynamic rendering — Sanity data must be fetched at request time (projectId required at runtime)
export const dynamic = 'force-dynamic'

import { client } from '@/lib/sanity/client'
import {
  featuredProjectsQuery,
  siteSettingsQuery,
  featuredTestimonialQuery,
  servicesQuery,
} from '@/lib/sanity/queries'
import type { Project, Service, Testimonial, SiteSettings } from '@/lib/sanity/types'
import { InkDropSplash } from '@/components/sections/InkDropSplash'
import { Hero } from '@/components/sections/Hero'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { AboutSnippet } from '@/components/sections/AboutSnippet'
import { ServicesOverview } from '@/components/sections/ServicesOverview'
import { Testimonial as TestimonialSection } from '@/components/sections/Testimonial'
import { ContactCTA } from '@/components/sections/ContactCTA'

export const metadata: Metadata = {
  title: 'Julie Christensen — Freelance Video Editor',
  description:
    'Freelance video editor based in Vestfold, Norway. Specialising in long-form content, podcasts, and YouTube — working with creators and brands internationally.',
}

export default async function HomePage() {
  const [settings, projects, testimonial, services] = await Promise.all([
    client.fetch<SiteSettings | null>(siteSettingsQuery).catch(() => null),
    client.fetch<Project[]>(featuredProjectsQuery).catch(() => []),
    client.fetch<Testimonial | null>(featuredTestimonialQuery).catch(() => null),
    client.fetch<Service[]>(servicesQuery).catch(() => []),
  ])

  return (
    <>
      <InkDropSplash />
      <Hero settings={settings} />
      <FeaturedWork projects={projects ?? []} />
      <AboutSnippet />
      <ServicesOverview services={services ?? []} />
      <TestimonialSection testimonial={testimonial} />
      <ContactCTA />
    </>
  )
}
