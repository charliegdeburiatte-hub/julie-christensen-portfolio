'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { client } from '@/lib/sanity/client'
import { projectsQuery } from '@/lib/sanity/queries'
import type { Project } from '@/lib/sanity/types'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Modal } from '@/components/ui/Modal'
import { ProjectDetail } from '@/components/sections/ProjectDetail'
import { urlFor } from '@/lib/sanity/image'

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    client.fetch<Project[]>(projectsQuery).then(setProjects)
  }, [])

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
            Work
          </p>
          <h1 className="font-seasons text-5xl md:text-6xl text-text-primary mb-6">
            Selected Projects
          </h1>
          <p className="text-text-secondary max-w-xl leading-relaxed">
            A selection of editing work from the past three years. Long-form content, podcasts,
            and YouTube — always in service of the story.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            >
              <Card onClick={() => setSelectedProject(project)}>
                {/* Thumbnail */}
                <div className="aspect-video relative">
                  {project.thumbnail ? (
                    <Image
                      src={urlFor(project.thumbnail).width(800).height(450).url()}
                      alt={`Thumbnail for ${project.title}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--bg-secondary), var(--border))',
                      }}
                      aria-hidden="true"
                    >
                      <span className="font-seasons text-xl text-text-primary text-center px-6">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h2 className="font-seasons text-2xl text-text-primary mb-3">
                    {project.title}
                  </h2>
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

        {projects.length === 0 && (
          <p className="text-text-secondary font-mono text-sm text-center py-20">
            Projects coming soon.
          </p>
        )}
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
    </div>
  )
}
