import type { GlobalConfig } from 'payload'

export const HomepageGlobal: GlobalConfig = {
  slug: 'homepage',
  label: 'Domovská stránka',
  admin: {
    group: 'Stránky',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Section 1: Hero ──────────────────────────────────────────────────────
    {
      name: 'subHeadline',
      type: 'text',
      label: 'Sub-nadpis (napr. BOMBOVO:)',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Hlavný nadpis (napr. Miesto kam sa vaše dieťa bude chcieť vrátiť)',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Ikonky so štatistikami',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Ikona',
        },
        {
          name: 'number',
          type: 'text',
          label: 'Číslo (napr. "86%", "50,000+", "20+")',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Popis (napr. "Návratnosť Detí")',
        },
      ],
    },

    // ─── Section 2: Reviews / Photos ──────────────────────────────────────────
    {
      name: 'reviews',
      type: 'array',
      label: 'Recenzie',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Fotka (polaroid)',
        },
        {
          name: 'badgeText',
          type: 'text',
          label: 'Text nad fotkou (napr. Letné Tábory 2025)',
        },
        {
          name: 'reviewText',
          type: 'textarea',
          label: 'Text recenzie',
        },
        {
          name: 'reviewAuthor',
          type: 'text',
          label: 'Autor (napr. "Rodič Andrea D.")',
        },
      ],
    },
    {
      name: 'reviewDisplaySeconds',
      type: 'number',
      label: 'Koľko sekúnd sa zobrazuje každá recenzia',
      defaultValue: 5,
    },

    // ─── Section 3: Najpredávanejšie Tábory ───────────────────────────────────
    {
      name: 'featuredCampsHeadline',
      type: 'text',
      label: 'Nadpis sekcie (napr. Naše Najpredávanejšie Tábory V Roku 2026)',
    },
    {
      name: 'featuredCamps',
      type: 'array',
      label: 'Vybrané tábory',
      maxRows: 3,
      admin: {
        description:
          'Vyberte max. 3 tábory. Fotka, názov a popis sa načítajú automaticky z tábora.',
      },
      fields: [
        {
          name: 'camp',
          type: 'relationship',
          relationTo: 'camps',
          label: 'Tábor',
        },
      ],
    },

    // ─── Section 4: 4 Dôvody Prečo ísť do Bombova ────────────────────────────
    {
      name: 'reasonsHeadline',
      type: 'text',
      label: 'Nadpis sekcie (napr. 4 Dôvody Prečo ísť do Bombova)',
    },
    {
      name: 'reasonsIntroHeadline',
      type: 'text',
      label: 'Intro headline (napr. 86% Návratnosť Detí)',
    },
    {
      name: 'reasonsIntroText',
      type: 'textarea',
      label: 'Intro text pod headline',
    },
    {
      name: 'reasons',
      type: 'array',
      label: 'Dôvody',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Fotka',
        },
        {
          name: 'headline',
          type: 'text',
          label: 'Nadpis dôvodu (napr. "Žiadne Skryté Platby")',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Text dôvodu',
        },
      ],
    },

    // ─── Section 5: Školy v Prírode ───────────────────────────────────────────
    {
      name: 'skolyHeadline',
      type: 'text',
      label: 'Nadpis sekcie (napr. Pozri Si Naše Školy V Prírode)',
    },
    {
      name: 'featuredSkoly',
      type: 'array',
      label: 'Vybrané školy v prírode',
      admin: {
        description:
          'Vyberte strediská, ktoré sa zobrazia na domovskej stránke. Fotka, názov a cena sa načítajú automaticky zo strediska.',
      },
      fields: [
        {
          name: 'skola',
          type: 'relationship',
          relationTo: 'strediska',
          label: 'Stredisko',
        },
      ],
    },

    // ─── Section 6: Giveaway ──────────────────────────────────────────────────
    {
      name: 'giveawayHeadline',
      type: 'text',
      label: 'Nadpis súťaže (napr. Vyhraj tábor zadarmo!)',
    },
    {
      name: 'giveawaySubHeadline',
      type: 'text',
      label: 'Podnadpis súťaže',
    },
    {
      name: 'giveawayCamps',
      type: 'array',
      label: 'Tábory v dropdownu súťaže',
      admin: {
        description:
          'Vyberte tábory, ktoré sa zobrazia v dropdownu súťažného formulára.',
      },
      fields: [
        {
          name: 'camp',
          type: 'relationship',
          relationTo: 'camps',
          label: 'Tábor',
        },
        {
          name: 'isVisible',
          type: 'checkbox',
          label: 'Zobraziť v súťaži',
          defaultValue: true,
        },
      ],
    },

    // ─── Section 7: FAQ ───────────────────────────────────────────────────────
    {
      name: 'faqHeadline',
      type: 'text',
      label: 'Nadpis FAQ sekcie',
    },
    {
      name: 'faqItems',
      type: 'array',
      label: 'Otázky a odpovede',
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Otázka',
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Odpoveď',
        },
      ],
    },
  ],
}
