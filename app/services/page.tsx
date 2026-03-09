import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { client } from '@/lib/sanity/client'
import { servicesQuery } from '@/lib/sanity/queries'
import type { Service } from '@/lib/sanity/types'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Video editing services for long-form content, short-form reels, podcasts, and corporate projects. Clear pricing, clean edits, honest communication.',
}

export default async function ServicesPage() {
  const services = await client.fetch<Service[]>(servicesQuery).catch(() => [])

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
            Services
          </p>
          <h1 className="font-seasons text-5xl md:text-6xl text-text-primary mb-6">
            What I offer.
          </h1>
          <p className="text-text-secondary max-w-xl leading-relaxed mb-6">
            I specialise in editing long-form and short-form video content for creators, podcasters,
            and brands. Below is what I typically work on — if your project doesn&apos;t fit neatly
            into a category, get in touch anyway.
          </p>

          {/* Pricing note */}
          <div className="bg-bg-secondary border border-border-color rounded-lg p-5 inline-block">
            <p className="font-mono text-sm text-text-primary">
              My standard rate is{' '}
              <strong className="text-accent">$20/hr</strong> for ongoing and retainer work, and{' '}
              <strong className="text-accent">$25/hr</strong> for one-off or more complex projects.
            </p>
            <p className="font-mono text-sm text-text-secondary mt-1">
              All projects begin with a short conversation so I understand what you need before we
              agree on anything.
            </p>
          </div>
        </div>

        {/* Services list */}
        <div className="mt-14 divide-y divide-border-color">
          {services.map((service) => (
            <article key={service._id} className="py-12">
              <h2 className="font-seasons text-3xl text-text-primary mb-3">{service.title}</h2>

              <p className="text-text-secondary leading-relaxed mb-6">{service.description}</p>

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <dt className="font-mono text-xs text-text-secondary mb-1">Starting from</dt>
                  <dd className="font-mono text-accent font-medium">
                    {formatPrice(service.startingPrice, service.currency)}/hr
                  </dd>
                </div>
                {service.turnaround && (
                  <div>
                    <dt className="font-mono text-xs text-text-secondary mb-1">Turnaround</dt>
                    <dd className="text-text-primary">{service.turnaround}</dd>
                  </div>
                )}
                {service.revisionsPolicy && (
                  <div>
                    <dt className="font-mono text-xs text-text-secondary mb-1">Revisions</dt>
                    <dd className="text-text-primary">{service.revisionsPolicy}</dd>
                  </div>
                )}
              </dl>

              <Button variant="ghost" href="/contact">
                Get in Touch
              </Button>
            </article>
          ))}

          {services.length === 0 && (
            <p className="py-12 text-text-secondary font-mono text-sm">
              Services coming soon.
            </p>
          )}
        </div>

        {/* Revisions policy note */}
        <div className="mt-8 p-5 bg-bg-secondary border border-border-color rounded-lg">
          <p className="font-mono text-xs text-text-secondary">
            All services include the number of revision rounds listed above. Additional revision
            rounds can be requested and are billed at the standard hourly rate. I&apos;ll always let
            you know before going over.
          </p>
        </div>

        {/* Tools section */}
        <div className="mt-16">
          <h2 className="font-seasons text-2xl text-text-primary mb-4">Tools I work with</h2>
          <div className="flex flex-wrap gap-3">
            <Tag label="Adobe Premiere Pro" className="text-sm px-3 py-1" />
            <Tag label="DaVinci Resolve" className="text-sm px-3 py-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
