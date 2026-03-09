// All GROQ queries live here — never inline GROQ strings in components or pages

export const projectsQuery = `*[_type == "project" && published == true] | order(order asc) {
  _id, title, slug, category, year, clientName, role,
  description, videoUrl, aspectRatio, thumbnail, testimonial
}`

export const featuredProjectsQuery = `*[_type == "project" && published == true] | order(order asc)[0...3] {
  _id, title, slug, category, year, clientName, role,
  description, videoUrl, aspectRatio, thumbnail, testimonial
}`

export const servicesQuery = `*[_type == "service"] | order(order asc) {
  _id, title, description, turnaround, revisionsPolicy, startingPrice, currency
}`

export const featuredTestimonialQuery = `*[_type == "testimonial" && featured == true][0] {
  _id, quote, author, platform
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  tagline, bio, profilePhoto, email, socialLinks
}`
