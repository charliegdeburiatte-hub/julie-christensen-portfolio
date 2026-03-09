'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function ContactCTA() {
  return (
    <section className="py-20 px-6 bg-bg-secondary text-center">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-seasons text-4xl md:text-5xl text-text-primary mb-4">
            Ready to work together?
          </h2>
          <p className="text-text-secondary mb-8">
            Get in touch and tell me about your project. I&apos;ll get back to you within 48 hours.
          </p>
          <Button variant="primary" href="/contact">
            Get in Touch
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
