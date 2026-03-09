import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'turnaround',
      title: 'Turnaround Time',
      type: 'string',
      description: '[PLACEHOLDER — Julie to confirm typical turnaround]',
    }),
    defineField({
      name: 'revisionsPolicy',
      title: 'Revisions Policy',
      type: 'string',
      description: 'e.g. "Two rounds of revisions included"',
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price (per hour)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
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
    select: { title: 'title', subtitle: 'startingPrice' },
    prepare(selection: Record<string, string | number>) {
      const price = selection.subtitle as number | undefined
      return {
        title: selection.title as string,
        subtitle: price ? `From $${price}/hr` : '',
      }
    },
  },
})
