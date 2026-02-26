import type { GlobalConfig } from 'payload'

export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  label: 'Pätica — Dokumenty',
  admin: {
    group: 'Nastavenia',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'section1Title',
      type: 'text',
      label: 'Sekcia 1 — Názov',
      defaultValue: 'Dokumenty na stiahnutie',
    },
    {
      name: 'section1Docs',
      type: 'array',
      label: 'Sekcia 1 — Dokumenty',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Zobrazovaný názov',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'PDF súbor',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL (ak súbor nie je na Uploadthing)',
          admin: {
            description: 'Použite toto pole pre lokálne PDF súbory v /public/documents/',
          },
        },
      ],
    },
    {
      name: 'section2Title',
      type: 'text',
      label: 'Sekcia 2 — Názov',
      defaultValue: 'Poistenie účastníkov zájazdov',
    },
    {
      name: 'section2Docs',
      type: 'array',
      label: 'Sekcia 2 — Dokumenty',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Zobrazovaný názov',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'PDF súbor',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL (ak súbor nie je na Uploadthing)',
          admin: {
            description: 'Použite toto pole pre lokálne PDF súbory v /public/documents/',
          },
        },
      ],
    },
  ],
}
