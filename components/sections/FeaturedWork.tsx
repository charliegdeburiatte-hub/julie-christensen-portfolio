'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProjectDetail } from './ProjectDetail'
import { urlFor } from '@/lib/sanity/image'
import type { Project } from '@/lib/sanity/types'

interface FeaturedWorkProps {
  projects: Project[]
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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
            Selected Work
          </p>
          <h2 className="font-seasons text-4xl md:text-5xl text-text-primary mb-12">
            Recent Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            >
              <Card onClick={() => setSelectedProject(project)}>
                {/* Thumbnail */}
                <div className="aspect-video relative">
                  {project.thumbnail ? (
                    <Image
                      src={urlFor(project.thumbnail).width(600).height(338).url()}
                      alt={`Thumbnail for ${project.title}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--bg-secondary), var(--border))',
                      }}
                      aria-hidden="true"
                    >
                      <span className="font-seasons text-lg text-text-primary text-center px-4">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="p-4">
                  <h3 className="font-seasons text-xl text-text-primary mb-2">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <Tag label={project.category} />
                    {project.year && (
                      <span className="font-mono text-xs text-text-secondary">{project.year}</span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="link" href="/portfolio">
            View All Work →
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <Modal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        ariaLabel={selectedProject ? `View ${selectedProject.title}` : 'Project detail'}
      >
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </Modal>
    </section>
  )
}
