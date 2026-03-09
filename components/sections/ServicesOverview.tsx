'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { Service } from '@/lib/sanity/types'

interface ServicesOverviewProps {
  services: Service[]
}

export function ServicesOverview({ services }: ServicesOverviewProps) {
  return (
    <section className="py-20 px-6 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
            What I Do
          </p>
          <h2 className="font-seasons text-4xl md:text-5xl text-text-primary mb-4">
            How I can help.
          </h2>
          <p className="text-text-secondary mb-12">
            From raw footage to finished edit — clean, considered, and delivered on time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            >
              <Card as="article" className="p-6">
                <h3 className="font-seasons text-xl text-text-primary mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>
                <p className="font-mono text-xs text-accent">
                  Starting from {formatPrice(service.startingPrice, service.currency)}/hr
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="link" href="/services">
            See Full Services →
          </Button>
        </div>
      </div>
    </section>
  )
}
