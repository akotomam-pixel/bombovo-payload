import type { CollectionConfig } from 'payload'

export const Strediska: CollectionConfig = {
  slug: 'strediska',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'price'],
    group: 'Školy v Prírode',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Basic ────────────────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'URL slug, e.g. "stred-europy-krahule". Must be unique.' },
    },
    {
      name: 'price',
      type: 'text',
      label: 'Base price (display)',
      admin: { description: 'e.g. "od 165.00 €"' },
    },

    // ─── Sold-out toggle ─────────────────────────────────────────────────────
    {
      name: 'vypredane',
      type: 'checkbox',
      label: 'Vypredané (sold out)',
      defaultValue: false,
      admin: {
        description: 'Zaškrtnutím označíte stredisko ako vypredané – na stránke sa zobrazí červená páska "VYPREDANÉ" a karta bude sivá a neklikateľná.',
      },
    },

    // ─── Card image ───────────────────────────────────────────────────────────
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Card image',
      admin: { description: 'Thumbnail shown on the Školy v Prírode listing page.' },
    },

    // ─── Hero gallery ─────────────────────────────────────────────────────────
    {
      name: 'heroGallery',
      type: 'array',
      label: 'Hero gallery',
      admin: { description: 'Photos for the stredisko detail page gallery.' },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // ─── Animačný program gallery ────────────────────────────────────────────
    {
      name: 'programGallery',
      type: 'array',
      label: 'Animačný program – galéria',
      admin: {
        description:
          'Fotky animačného programu pre sekciu "Overený animačný program". Prvé tri sa zobrazia v sekcii, ostatné sú dostupné po kliknutí. Tieto fotky sú rovnaké naprieč strediskami – ukazujú program, nie stredisko.',
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Popis fotky',
          admin: { description: 'Čo je na fotke. Zobrazí sa v galérii a čítačkám obrazovky.' },
        },
      ],
    },

    // ─── Icon bullets ─────────────────────────────────────────────────────────
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Icon bullet points',
      admin: { description: 'Short highlights shown with icons on the detail page, e.g. "kapacita 220 lôžok".' },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },

    // ─── Section 2: Description ───────────────────────────────────────────────
    {
      name: 'section2Headline',
      type: 'text',
      label: 'Section 2 headline',
      admin: { description: 'e.g. "V čom je stredisko tak výnimočné?"' },
    },
    {
      name: 'section2Body',
      type: 'textarea',
      label: 'Section 2 body text',
    },
    {
      name: 'section2Photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Section 2 photo',
    },

    {
      name: 'mapLat',
      type: 'number',
      label: 'Mapa – zemepisná šírka (latitude)',
      admin: {
        description:
          'Súradnica pre Google mapu a vzdialenostnú kalkulačku. Formát: desatinné číslo, napr. 48.7133. Ak necháte prázdne, použijú sa predvolené súradnice z kódu.',
      },
    },
    {
      name: 'mapLng',
      type: 'number',
      label: 'Mapa – zemepisná dĺžka (longitude)',
      admin: {
        description:
          'Druhá súradnica k šírke. Spolu tvoria polohu strediska na mape (skopírujte ich z Google Maps).',
      },
    },

    // ─── Accordion: Details ───────────────────────────────────────────────────
    {
      name: 'ubytovanie',
      type: 'array',
      label: 'Ubytovanie',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'vybavenieStrediska',
      type: 'array',
      label: 'Vybavenie strediska',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'zaujimavostiVOkoli',
      type: 'array',
      label: 'Zaujímavosti v okolí',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'zlava',
      type: 'array',
      label: 'Zľava',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'doplnkoveSluzby',
      type: 'array',
      label: 'Doplnkové služby',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'vZakladnejCene',
      type: 'array',
      label: 'V základnej cene',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'vCeneZahrnute',
      type: 'array',
      label: 'V cene zahrnuté',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'vCeneAnimacnehoProgramu',
      type: 'array',
      label: 'V cene animačného programu',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'bombovyBalicek',
      type: 'array',
      label: 'Bombový balíček',
      fields: [{ name: 'item', type: 'text', required: true }],
    },

    // ─── Dates ────────────────────────────────────────────────────────────────
    {
      name: 'dates',
      type: 'array',
      label: 'Dostupné termíny',
      admin: { description: 'Add, remove or edit dates freely.' },
      fields: [
        {
          name: 'startDate',
          type: 'text',
          label: 'Start date',
          required: true,
          admin: { description: 'e.g. "13.04.2026"' },
        },
        {
          name: 'endDate',
          type: 'text',
          label: 'End date',
          required: true,
          admin: { description: 'e.g. "17.04.2026"' },
        },
        {
          name: 'days',
          type: 'number',
          label: 'Number of days',
          defaultValue: 5,
          admin: { description: 'Duration (usually 5)' },
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price',
          admin: { description: 'e.g. "185.00 €"' },
        },
        {
          name: 'capacity',
          type: 'number',
          label: 'Capacity (number of pupils)',
        },
        {
          name: 'available',
          type: 'checkbox',
          label: 'Available',
          defaultValue: true,
          admin: { description: 'Uncheck to show VYPREDANÉ on this date.' },
        },
        {
          name: 'profisTerminId',
          type: 'number',
          label: 'Profis Term ID (id_Termin)',
          admin: { description: 'id_Termin from ProfisXML. Use the lookup script to find it.' },
        },
        {
          name: 'id_ZajezdHotel',
          type: 'number',
          label: 'Profis Hotel ID (id_ZajezdHotel)',
          admin: { description: 'id_ZajezdHotel from ProfisXML for this stredisko.' },
        },
      ],
    },
  ],
}
