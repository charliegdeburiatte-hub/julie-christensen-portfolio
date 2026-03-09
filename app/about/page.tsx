import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { siteSettingsQuery } from '@/lib/sanity/queries'
import type { SiteSettings } from '@/lib/sanity/types'
import { urlFor } from '@/lib/sanity/image'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Freelance video editor based in Norway. Three years of experience working with creators, brands, and podcasters who care about authentic storytelling.',
}

export default async function AboutPage() {
  const settings = await client.fetch<SiteSettings | null>(siteSettingsQuery).catch(() => null)

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
              About
            </p>
            <h1 className="font-seasons text-5xl md:text-6xl text-text-primary">
              Hello, I&apos;m Julie.
            </h1>
          </div>

          {/* Photo */}
          <div className="flex justify-center">
            {settings?.profilePhoto ? (
              <div className="w-56 h-56 md:w-72 md:h-72 relative rounded-full overflow-hidden">
                <Image
                  src={urlFor(settings.profilePhoto).width(288).height(288).url()}
                  alt="Julie Christensen"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className="w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--border), var(--accent))',
                }}
                aria-hidden="true"
              >
                <span className="font-seasons text-4xl text-bg-primary select-none">JC</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 1 — Story */}
        <section className="mb-12">
          <p className="text-text-secondary leading-relaxed mb-4">
            I&apos;ve been editing video for three years, and I still find it one of the most
            satisfying things I know how to do. There&apos;s something about taking hours of raw
            footage — rambling interviews, shaky b-roll, a speaker finding their words — and
            turning it into something that actually lands. That process never gets old.
          </p>
          <p className="text-text-secondary leading-relaxed">
            I&apos;m based in Vestfold, Norway, but I work with clients internationally. My
            background is in self-help, personal development, and psychology content — I spend a
            lot of my working life inside conversations that matter, which means I&apos;ve learned
            to listen closely and edit with care.
          </p>
        </section>

        <hr className="border-border-color mb-12" />

        {/* Section 2 — Approach */}
        <section className="mb-12">
          <h2 className="font-seasons text-3xl text-text-primary mb-6">The approach.</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            I work best with creators and brands who have something real to say. Not just content
            for content&apos;s sake — but people who are transparent about their message and trust
            me to help shape it. My approach is collaborative, calm, and straightforward. You
            bring the vision; I bring the craft.
          </p>
          <p className="text-text-secondary leading-relaxed">
            I&apos;m not the editor for you if you want heavy motion graphics or high-octane
            transitions. I&apos;m the editor for you if you want your audience to finish watching
            and feel like they&apos;ve actually learned something — or felt something — or heard
            themselves in what you&apos;ve said.
          </p>
        </section>

        <hr className="border-border-color mb-12" />

        {/* Section 3 — Tools */}
        <section className="mb-12">
          <h2 className="font-seasons text-3xl text-text-primary mb-6">Tools I work with.</h2>
          <div className="flex flex-wrap gap-3">
            <Tag label="Adobe Premiere Pro" className="text-sm px-3 py-1" />
            <Tag label="DaVinci Resolve" className="text-sm px-3 py-1" />
          </div>
        </section>

        <hr className="border-border-color mb-12" />

        {/* Section 4 — Personal */}
        <section className="mb-16">
          <p className="text-text-secondary leading-relaxed">
            When I&apos;m not editing, I&apos;m probably watching something worth dissecting,
            reading something worth sharing, or looking for the most scenic walk in Vestfold. I
            care about good storytelling in all its forms — it&apos;s just that video happens to
            be where I do it best.
          </p>
        </section>

        <div className="flex gap-4 flex-wrap">
          <Button variant="primary" href="/contact">
            Work with me
          </Button>
          <Button variant="ghost" href="/services">
            See my services
          </Button>
        </div>
      </div>
    </div>
  )
}
