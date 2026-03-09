import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type should exist.
  // Enforce via Studio structure builder when setting up the Sanity project.
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Your story, told with care.',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
      description: 'Used in the About snippet on the homepage',
    }),
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'juliechr2013@gmail.com',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'FUTURE: Social links — add URLs here and they will appear in the footer automatically',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform' },
            { name: 'url', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { subtitle: 'tagline' },
    prepare(selection: Record<string, string>) {
      return { title: 'Site Settings', subtitle: selection.subtitle }
    },
  },
})
