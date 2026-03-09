'use client'

import { motion } from 'framer-motion'
import type { Testimonial as TestimonialType } from '@/lib/sanity/types'

interface TestimonialProps {
  testimonial: TestimonialType | null
}

export function Testimonial({ testimonial }: TestimonialProps) {
  if (!testimonial) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-10 text-center">
            Kind Words
          </p>

          <figure className="max-w-3xl mx-auto text-center">
            <blockquote>
              <p className="font-seasons italic text-2xl md:text-3xl text-text-primary leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-8">
              <p className="font-mono text-sm text-text-secondary">
                {testimonial.author}{' '}
                <span className="text-border-color">— via {testimonial.platform}</span>
              </p>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  )
}
