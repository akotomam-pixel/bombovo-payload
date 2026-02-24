import type { CollectionConfig } from 'payload'

export const GiveawayEntries: CollectionConfig = {
  slug: 'giveaway-entries',
  labels: {
    singular: 'Giveaway Entry',
    plural: 'Giveaway Entries',
  },
  admin: {
    group: 'Marketing',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'selectedCamp', 'syncedToEcomail', 'createdAt'],
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
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      label: 'Meno',
      required: true,
    },
    {
      name: 'selectedCamp',
      type: 'text',
      label: 'Vybraný tábor',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Zdroj',
      defaultValue: 'popup',
      options: [
        { label: 'Popup', value: 'popup' },
        { label: 'Landing Page', value: 'landing-page' },
        { label: 'Iné', value: 'other' },
      ],
    },
    {
      name: 'syncedToEcomail',
      type: 'checkbox',
      label: 'Synchronizované s Ecomail',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Automaticky sa aktualizuje po úspešnom odoslaní do Ecomail.',
      },
    },
  ],
}
