import type { GlobalConfig } from 'payload'

export const SkolyVPrirode: GlobalConfig = {
  slug: 'skoly-v-prirode',
  admin: {
    group: 'Školy v Prírode',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Section 1: Hero ──────────────────────────────────────────────────────
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      admin: { description: 'e.g. "Školy v prírode"' },
    },
    {
      name: 'headlineHighlight',
      type: 'text',
      label: 'Headline highlight (red underlined)',
      admin: { description: 'e.g. "Ktoré učiteľky milujú"' },
    },
    {
      name: 'bodyText',
      type: 'textarea',
      label: 'Hero body text',
      admin: { description: 'Main paragraph shown beside the video' },
    },

    // ─── Section 2: Reviews ───────────────────────────────────────────────────
    {
      name: 'reviews',
      type: 'array',
      label: 'Reviews',
      admin: { description: 'School review quotes shown in the carousel' },
      fields: [
        {
          name: 'content',
          type: 'textarea',
          required: true,
          label: 'Review text',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Author (school name)',
          admin: { description: 'e.g. "ZŠ Odborárska, Bratislava"' },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Polaroid photo',
        },
      ],
    },

    // ─── Section 3: Why Teachers Love Bombovo ─────────────────────────────────
    {
      name: 'section3Headline',
      type: 'text',
      label: 'Block 1 headline',
      admin: { description: 'e.g. "Overené strediská, ktoré spĺňajú všetky hygienické normy"' },
    },
    {
      name: 'section3Body',
      type: 'textarea',
      label: 'Block 1 body text',
    },
    {
      name: 'section3Photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Block 1 photo',
    },

    {
      name: 'section3Block2Headline',
      type: 'text',
      label: 'Block 2 headline',
      admin: { description: 'e.g. "Profesionálny a zaškolený animačný tím"' },
    },
    {
      name: 'section3Block2Body',
      type: 'textarea',
      label: 'Block 2 body text',
    },
    {
      name: 'section3Block2Photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Block 2 photo',
    },

    {
      name: 'section3Block3Headline',
      type: 'text',
      label: 'Block 3 headline',
      admin: { description: 'e.g. "Unikátny program, ktorý nikde inde nenájdete"' },
    },
    {
      name: 'section3Block3Body',
      type: 'textarea',
      label: 'Block 3 body text',
    },
    {
      name: 'section3Block3Photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Block 3 photo',
    },

    // ─── Section 4: Strediska headline ───────────────────────────────────────
    {
      name: 'strediskaHeadline',
      type: 'text',
      label: 'Strediská section headline',
      defaultValue: 'Naše strediská na rok 2026',
    },
  ],
}
