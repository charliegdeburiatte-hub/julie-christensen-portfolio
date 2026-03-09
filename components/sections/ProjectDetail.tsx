import { Tag } from '@/components/ui/Tag'
import { extractYouTubeId } from '@/lib/utils'
import type { Project } from '@/lib/sanity/types'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const youtubeId = extractYouTubeId(project.videoUrl)

  return (
    <div>
      {/* Video */}
      {youtubeId && (
        <div
          className={
            project.aspectRatio === '9:16'
              ? 'aspect-[9/16] max-w-xs mx-auto'
              : 'aspect-video'
          }
        >
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {/* Details */}
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-seasons text-2xl md:text-3xl text-text-primary">
            {project.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs text-text-secondary hover:text-text-primary transition-colors shrink-0 mt-1"
            aria-label="Close project"
          >
            Close
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Tag label={project.category} />
          {project.year && <Tag label={String(project.year)} />}
        </div>

        <dl className="grid grid-cols-2 gap-3 mb-6 text-sm">
          {project.clientName && (
            <>
              <dt className="font-mono text-text-secondary">Client</dt>
              <dd className="text-text-primary">{project.clientName}</dd>
            </>
          )}
          {project.role && (
            <>
              <dt className="font-mono text-text-secondary">Role</dt>
              <dd className="text-text-primary">{project.role}</dd>
            </>
          )}
          {project.year && (
            <>
              <dt className="font-mono text-text-secondary">Year</dt>
              <dd className="text-text-primary">{project.year}</dd>
            </>
          )}
        </dl>

        {project.description && (
          <p className="text-text-secondary leading-relaxed mb-6">{project.description}</p>
        )}

        {project.testimonial && (
          <blockquote className="border-l-2 border-border-color pl-4">
            <p className="font-seasons italic text-lg text-text-primary">
              &ldquo;{project.testimonial}&rdquo;
            </p>
          </blockquote>
        )}
      </div>
    </div>
  )
}
