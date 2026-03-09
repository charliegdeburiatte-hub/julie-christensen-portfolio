'use client'

// Note: generateMetadata cannot be used in Client Components.
// This page uses the site-wide title template from app/layout.tsx for SEO.

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface FormData {
  name: string
  email: string
  phone: string
  projectType: string
  deadline: string
  description: string
  preferredContact: string
}

interface FormErrors {
  name?: string
  email?: string
  description?: string
  file?: string
}

const projectTypeOptions = [
  { value: '', label: 'Select a type…' },
  { value: 'long-form', label: 'Long-form content (YouTube, lectures, streams)' },
  { value: 'short-form', label: 'Short-form / Reels' },
  { value: 'podcast', label: 'Podcast editing' },
  { value: 'corporate', label: 'Corporate / internal comms' },
  { value: 'other', label: "Not sure yet — let's talk" },
]

const contactOptions = [
  { value: '', label: 'Select…' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp (placeholder — not active at launch)' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    deadline: '',
    description: '',
    preferredContact: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    if (!formData.name.trim()) errs.name = 'Please enter your name.'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.description.trim()) {
      errs.description = 'Please tell me a little about your project.'
    }
    return errs
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    if (selected && selected.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: 'That file is over 10MB — try compressing it or describing what you\'d like to share in the message field.',
      }))
      setFile(null)
      e.target.value = ''
      return
    }
    setErrors((prev) => ({ ...prev, file: undefined }))
    setFile(selected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setIsSubmitting(true)

    try {
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...formData, fileName: file?.name }),
      })
      if (res.ok) {
        setIsSuccess(true)
      } else {
        setErrors({ name: 'Something went wrong. Please try again or email me directly.' })
      }
    } catch {
      setErrors({ name: 'Something went wrong. Please try again or email me directly.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-bg-secondary border border-border-color rounded px-4 py-3 text-text-primary placeholder-text-secondary font-sans text-sm focus:outline-none focus:border-accent transition-colors'
  const labelClass = 'block font-mono text-xs text-text-secondary mb-2'
  const errorClass = 'font-mono text-xs text-red-600 mt-1'

  if (isSuccess) {
    return (
      <div className="min-h-screen py-20 px-6 flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-seasons text-4xl text-text-primary mb-4">Message received.</h1>
          <p className="text-text-secondary leading-relaxed mb-8">
            Thanks for getting in touch! I&apos;ve received your message and will get back to you
            within 48 hours. Check your inbox for a confirmation email.
          </p>
          <Button variant="ghost" href="/">
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
            Contact
          </p>
          <h1 className="font-seasons text-5xl md:text-6xl text-text-primary mb-4">
            Let&apos;s talk.
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Tell me about your project and I&apos;ll get back to you within 48 hours. There&apos;s
            no commitment in reaching out — just a conversation to see if we&apos;re a good fit.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Your name <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Julie Christensen"
              className={inputClass}
              aria-required="true"
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className={errorClass}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="hello@example.com"
              className={inputClass}
              aria-required="true"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className={errorClass}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone number (optional)
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+47 000 00 000"
              className={inputClass}
            />
          </div>

          {/* Project type */}
          <div>
            <label htmlFor="projectType" className={labelClass}>
              Type of project
            </label>
            <select
              id="projectType"
              value={formData.projectType}
              onChange={(e) => setFormData((p) => ({ ...p, projectType: e.target.value }))}
              className={inputClass}
            >
              {projectTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className={labelClass}>
              Deadline
            </label>
            <input
              id="deadline"
              type="text"
              value={formData.deadline}
              onChange={(e) => setFormData((p) => ({ ...p, deadline: e.target.value }))}
              placeholder="When do you need this?"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Tell me about your project <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="What are you working on? What does it need to feel like? The more you share, the better."
              rows={6}
              className={inputClass}
              aria-required="true"
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className={errorClass}>
                {errors.description}
              </p>
            )}
          </div>

          {/* File upload */}
          <div>
            <label htmlFor="file" className={labelClass}>
              Attach a file (optional)
            </label>
            <input
              id="file"
              type="file"
              accept="video/*,.pdf"
              onChange={handleFileChange}
              className="block w-full font-mono text-xs text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-border-color file:bg-bg-secondary file:font-mono file:text-xs file:text-text-primary hover:file:bg-accent hover:file:text-bg-primary file:transition-colors file:cursor-pointer"
            />
            <p className="font-mono text-xs text-text-secondary mt-1">
              Upload a brief, rough cut, or reference — video or PDF, max 10MB
            </p>
            {errors.file && <p className={errorClass}>{errors.file}</p>}
          </div>

          {/* Preferred contact */}
          <div>
            <label htmlFor="preferredContact" className={labelClass}>
              How should I reach you?
            </label>
            <select
              id="preferredContact"
              value={formData.preferredContact}
              onChange={(e) => setFormData((p) => ({ ...p, preferredContact: e.target.value }))}
              className={inputClass}
            >
              {contactOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="w-full justify-center"
          >
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  )
}
