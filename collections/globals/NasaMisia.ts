import type { GlobalConfig } from 'payload'

export const NasaMisiaGlobal: GlobalConfig = {
  slug: 'nasa-misia',
  label: 'Naša Misia',
  admin: {
    group: 'Stránky',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Section 1: Mission ───────────────────────────────────────────────────
    {
      name: 'missionHeadline',
      type: 'text',
      label: 'Nadpis stránky H1 (napr. "Prečo deti milujú Bombovo?")',
    },
    {
      name: 'missionText1',
      type: 'textarea',
      label: 'Text misie — odstavec 1',
    },
    {
      name: 'missionText2',
      type: 'textarea',
      label: 'Text misie — odstavec 2',
    },
    {
      name: 'missionImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka v misii (vpravo)',
    },
    {
      name: 'testimonialQuote',
      type: 'textarea',
      label: 'Recenzia — text (bez úvodzoviek)',
    },
    {
      name: 'testimonialAuthor',
      type: 'text',
      label: 'Recenzia — autor (napr. "V. Marčeková")',
    },

    // ─── Section B: Summer ───────────────────────────────────────────────────
    {
      name: 'summerHeadline',
      type: 'text',
      label: 'Nadpis sekcie Leto (napr. "Leto, Aké Ste Mali Vy")',
    },
    {
      name: 'summerText1',
      type: 'textarea',
      label: 'Text Leto — odstavec 1',
    },
    {
      name: 'summerText2',
      type: 'textarea',
      label: 'Text Leto — odstavec 2',
    },
    {
      name: 'summerImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka v sekcii Leto (vľavo)',
    },

    // ─── Section 2: Kvalita ──────────────────────────────────────────────────
    {
      name: 'kvalitaHeadline',
      type: 'text',
      label: 'Nadpis sekcie Kvalita (napr. "Bombovo = Kvalita pred Kvantitou")',
    },
    {
      name: 'kvalitaIntroText',
      type: 'textarea',
      label: 'Intro text pod nadpisom Kvalita',
    },
    {
      name: 'kvalitaPoints',
      type: 'array',
      label: 'Body kvality (číslovane)',
      admin: {
        description: 'Každý bod sa zobrazí s číslom a farebným krúžkom. Prvý = modrý, druhý = červený, tretí = žltý, a potom sa farby opakujú.',
      },
      fields: [
        {
          name: 'pointHeadline',
          type: 'text',
          label: 'Nadpis bodu',
        },
        {
          name: 'pointText',
          type: 'textarea',
          label: 'Text bodu',
        },
      ],
    },

    // ─── Section 5: Team ─────────────────────────────────────────────────────
    {
      name: 'teamHeadline',
      type: 'text',
      label: 'Nadpis tímu animátorov',
    },
    {
      name: 'teamMembers',
      type: 'array',
      label: 'Animátori',
      admin: {
        description: 'Pridaj, uprav alebo odstráň animátorov. Na jednom riadku sa zobrazí 5. Poradie môžeš meniť potiahnutím.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Meno animátora',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Popis / rola',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Fotka animátora',
        },
      ],
    },
  ],
}
