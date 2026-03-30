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
      name: 'photo1',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka 1 (karusel)',
    },
    {
      name: 'photo2',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka 2 (karusel)',
    },
    {
      name: 'photo3',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka 3 (karusel)',
    },
  ],
}
