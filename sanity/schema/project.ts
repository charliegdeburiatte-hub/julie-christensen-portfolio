import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Long-form', value: 'long-form' },
          { title: 'Short-form', value: 'short-form' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Corporate', value: 'corporate' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: "Julie's Role",
      type: 'string',
      initialValue: 'Editor',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube)',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Landscape)', value: '16:9' },
          { title: '9:16 (Vertical / Reels)', value: '9:16' },
        ],
      },
      initialValue: '16:9',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial Snippet',
      type: 'text',
      rows: 3,
      description: 'Optional short quote from the client about this project',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'thumbnail' },
  },
})
