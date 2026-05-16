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
      label: 'Recenzia (starý formát / fallback)',
    },
    {
      name: 'q1',
      type: 'textarea',
      label: 'Q1: Ubytovanie a stredisko',
      admin: { description: 'Ako ste boli spokojní s vybavením, čistotou a ubytovaním strediska?' },
    },
    {
      name: 'q2',
      type: 'textarea',
      label: 'Q2: Animačný tím a program',
      admin: { description: 'Ako ste boli spokojní s naším animačným tímom a programom?' },
    },
    {
      name: 'q3',
      type: 'textarea',
      label: 'Q3: Čo sa vám páčilo',
      admin: { description: 'Čo sa vám na škole v prírode najviac páčilo?' },
    },
    {
      name: 'q4',
      type: 'textarea',
      label: 'Q4: Doplnok (nepovinné)',
      admin: { description: 'Chceli by ste niečo dodať?' },
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
      defaultValue: 'approved',
      options: [
        { label: 'Čaká na schválenie', value: 'pending' },
        { label: 'Schválená', value: 'approved' },
        { label: 'Zamietnutá', value: 'rejected' },
      ],
    },
  ],
}
