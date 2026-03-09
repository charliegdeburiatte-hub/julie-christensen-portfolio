'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function AboutSnippet() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
            About
          </p>
          <h2 className="font-seasons text-4xl md:text-5xl text-text-primary mb-6">
            Editing with intention.
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            I&apos;m Julie — a freelance video editor based in Vestfold, Norway, with three years
            of experience working with creators and brands across the world. I specialise in
            long-form content: podcasts, YouTube videos, lectures, and streams — the kind of work
            where the message matters as much as the footage.
          </p>
          <p className="text-text-secondary leading-relaxed mb-8">
            I work best with people who are clear about what they stand for. If you have a vision,
            I&apos;ll help you deliver it in a way that feels true to you.
          </p>
          <Button variant="link" href="/about">
            More about me →
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
