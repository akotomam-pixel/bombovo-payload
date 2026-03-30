import type { GlobalConfig } from 'payload'

export const LetneTaboryHlavna: GlobalConfig = {
  slug: 'letne-tabory-hlavna',
  label: 'Letné tábory - hlavná',
  admin: {
    group: 'Stránky',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      label: 'Hlavný nadpis (H1)',
      admin: {
        description: 'Hlavný nadpis sekcie — zobrazí sa ako H1 na stránke letné tábory.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Text pod nadpisom',
      admin: {
        description: 'Paragraf textu zobrazený pod H1.',
      },
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Fotky karusela',
      admin: {
        description: 'Pridaj ľubovoľný počet fotiek do karusela. Odporúčame formát 4:3.',
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Fotka',
        },
      ],
    },
  ],
}
