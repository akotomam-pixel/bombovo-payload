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
    defaultColumns: ['reviewerName', 'campName', 'stars', 'status', 'createdAt'],
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
        { label: 'Dieťa z tábora', value: 'tabornik' },
        { label: 'Rodič dieťaťa', value: 'rodic' },
      ],
    },
    {
      name: 'campName',
      type: 'text',
      label: 'Tábor (nepovinné)',
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
      // Optional: a Google rating can be stars only. The public form still requires text.
    },
    {
      name: 'source',
      type: 'text',
      label: 'Zdroj (web / google / stranka)',
      defaultValue: 'web',
      admin: { description: 'web = formulár na stránke, google = recenzia z Google, stranka = stará recenzia zo stránky tábora' },
    },
    {
      name: 'reviewDate',
      type: 'date',
      label: 'Dátum recenzie',
      admin: { description: 'Deň, keď bola recenzia napísaná. Ak je prázdny, použije sa dátum vytvorenia.' },
    },
    {
      name: 'secondCampName',
      type: 'text',
      label: 'Druhý tábor (nepovinné)',
      admin: { description: 'Recenzia sa ukáže aj pri tomto tábore, v strede zoznamu.' },
    },
    {
      name: 'midList',
      type: 'checkbox',
      label: 'Ukázať v strede zoznamu',
      defaultValue: false,
      admin: { description: 'Recenzia sa nikdy neukáže medzi prvými.' },
    },
    {
      name: 'externalId',
      type: 'text',
      label: 'ID pri importe',
      admin: { readOnly: true },
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
      defaultValue: 'approved',
      options: [
        { label: 'Čaká na schválenie', value: 'pending' },
        { label: 'Schválená', value: 'approved' },
        { label: 'Zamietnutá', value: 'rejected' },
      ],
    },
  ],
}
