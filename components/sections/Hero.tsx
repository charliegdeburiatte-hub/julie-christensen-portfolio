'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { urlFor } from '@/lib/sanity/image'
import type { SiteSettings } from '@/lib/sanity/types'

interface HeroProps {
  settings: SiteSettings | null
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="min-h-[90vh] flex items-center px-6 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text content */}
          <div>
            <motion.h1
              className="font-seasons text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight"
              variants={itemVariants}
            >
              Your story, told with care.
            </motion.h1>

            <motion.p
              className="font-mono text-sm text-text-secondary mt-6"
              variants={itemVariants}
            >
              Freelance video editor — long-form content, podcasts &amp; YouTube.
            </motion.p>

            <motion.p
              className="text-text-secondary mt-4 max-w-md leading-relaxed"
              variants={itemVariants}
            >
              I work with creators and brands who know what they want to say. My job is to shape
              that into something that feels exactly like them — focused, authentic, and worth
              watching.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4 mt-8" variants={itemVariants}>
              <Button variant="primary" href="/portfolio">
                View My Work
              </Button>
              <Button variant="ghost" href="/contact">
                Get in Touch
              </Button>
            </motion.div>
          </div>

          {/* Profile photo or placeholder */}
          <motion.div
            className="flex justify-center md:justify-end"
            variants={itemVariants}
          >
            {settings?.profilePhoto ? (
              <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden">
                <Image
                  src={urlFor(settings.profilePhoto).width(320).height(320).url()}
                  alt="Julie Christensen"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--border), var(--accent))',
                }}
                aria-hidden="true"
              >
                <span className="font-seasons text-4xl text-bg-primary select-none">JC</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* SHOWREEL: hidden until reel is ready — uncomment section below */}
        {/*
        <div className="mt-16 aspect-video rounded-lg overflow-hidden bg-bg-secondary">
          <iframe
            src="https://www.youtube.com/embed/SHOWREEL_ID"
            title="Julie Christensen Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        */}
      </div>
    </section>
  )
}
