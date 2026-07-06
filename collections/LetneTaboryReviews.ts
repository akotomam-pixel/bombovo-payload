import type { CollectionConfig } from 'payload'

export const LetneTaboryReviews: CollectionConfig = {
  slug: 'letne-tabory-reviews',
  labels: {
    singular: 'Recenzia letného tábora',
    plural: 'Recenzie letných táborov',
  },
  admin: {
    group: 'Letné Tábory',
    useAsTitle: 'reviewerName',
    defaultColumns: ['reviewerName', 'reviewerType', 'stars', 'status', 'createdAt'],
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
      name: 'reviewerName',
      type: 'text',
      label: 'Meno',
      required: true,
    },
    {
      name: 'reviewerType',
      type: 'select',
      label: 'Typ recenzenta',
      required: true,
      options: [
        { label: 'Taborník', value: 'tabornik' },
        { label: 'Rodič taborníka', value: 'rodic' },
      ],
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
      label: 'Text recenzie',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka (nepovinné)',
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
