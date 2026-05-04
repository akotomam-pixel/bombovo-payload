import type { CollectionConfig } from 'payload'

export const TeacherReviews: CollectionConfig = {
  slug: 'teacher-reviews',
  labels: {
    singular: 'Recenzia učiteľa',
    plural: 'Recenzie učiteľov',
  },
  admin: {
    group: 'Školy v Prírode',
    useAsTitle: 'schoolName',
    defaultColumns: ['teacherName', 'schoolName', 'stars', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  timestamps: true,
  fields: [
    {
      name: 'teacherName',
      type: 'text',
      label: 'Meno učiteľa / učiteľky',
      required: true,
    },
    {
      name: 'schoolName',
      type: 'text',
      label: 'Názov školy',
      required: true,
    },
    {
      name: 'stars',
      type: 'number',
      label: 'Hodnotenie (1–5 hviezdičiek)',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'reviewText',
      type: 'textarea',
      label: 'Recenzia',
      required: true,
    },
    {
      name: 'stredisko',
      type: 'text',
      label: 'Stredisko (nepovinné)',
    },
    {
      name: 'kidCount',
      type: 'number',
      label: 'Počet detí (nepovinné)',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stav',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Čaká na schválenie', value: 'pending' },
        { label: 'Schválená', value: 'approved' },
        { label: 'Zamietnutá', value: 'rejected' },
      ],
    },
  ],
}
