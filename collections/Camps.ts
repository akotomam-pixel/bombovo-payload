import type { CollectionConfig } from 'payload'

export const Camps: CollectionConfig = {
  slug: 'camps',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'price'],
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug, e.g. "olymp-kemp". Must be unique.',
      },
    },

    // ─── Display order on the listing page ───────────────────────────────────
    {
      name: 'order',
      type: 'number',
      label: 'Display order',
      admin: {
        description: 'Sort order on the Letné tábory listing page (1 = first).',
      },
    },

    // ─── Off-season (whole camp closed) ─────────────────────────────────────
    {
      name: 'poSezone',
      type: 'checkbox',
      label: 'Mimo sezóny (termíny na ďalšie leto ešte nie sú)',
      defaultValue: false,
      admin: {
        description:
          'Zaškrtnite, keď tábor práve nebeží a nové termíny ešte nie sú zverejnené. Na karte pribudne páska "LETO 2027", namiesto ceny sa zobrazí "Termíny na leto 2027 pripravujeme" a tlačidlo vedie na detail tábora. Tábor sa presunie na koniec zoznamu. Toto NIE je to isté ako "Vypredané" pri jednotlivom termíne — to nechajte tak, ako je.',
      },
    },

    // ─── Card image (thumbnail on the listing page) ───────────────────────────
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Card image',
      admin: {
        description: 'Thumbnail shown on the camp card on the Letné tábory listing page.',
      },
    },

    // ─── Camp types (icons on the card) ──────────────────────────────────────
    {
      name: 'campTypes',
      type: 'select',
      hasMany: true,
      label: 'Camp types',
      admin: {
        description: 'Select up to 2 types — these appear as icons on the camp card. Values must match exactly (with diacritics).',
      },
      options: [
        { value: 'Akčný',        label: 'Akčný' },
        { value: 'Dobrodružný',  label: 'Dobrodružný' },
        { value: 'Fantasy',      label: 'Fantasy' },
        { value: 'Náučný',       label: 'Náučný' },
        { value: 'Oddychový',    label: 'Oddychový' },
        { value: 'Športový',     label: 'Športový' },
        { value: 'Tínedžerský',  label: 'Tínedžerský' },
        { value: 'Umelecký',     label: 'Umelecký' },
        { value: 'Unikátny',     label: 'Unikátny' },
      ],
    },

    // ─── Section 1: Hero ──────────────────────────────────────────────────────
    {
      name: 'headline',
      type: 'text',
      admin: { description: 'Main headline, e.g. "Tábor gréckych hrdinov –"' },
    },
    {
      name: 'headlineHighlight',
      type: 'text',
      admin: { description: 'The red underlined part, e.g. "Olymp kemp"' },
    },
    {
      name: 'bulletPoints',
      type: 'array',
      admin: { description: 'Short bullet points shown under the headline' },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. "Horský hotel Lomy"' },
    },
    {
      name: 'age',
      type: 'text',
      admin: { description: 'e.g. "Pre deti vo veku 8-14 rokov"' },
    },
    {
      name: 'price',
      type: 'text',
      admin: { description: 'Display price, e.g. "359 €"' },
    },
    {
      name: 'heroGallery',
      type: 'array',
      admin: { description: 'Photos for the hero section gallery' },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // ─── Section 2: Ratings + Description ────────────────────────────────────
    {
      name: 'section2_headline',
      type: 'text',
      admin: { description: 'e.g. "O čom je Tábor Olymp Kemp?"' },
    },
    {
      name: 'section2_description',
      type: 'array',
      admin: { description: 'Paragraphs of the camp description' },
      fields: [
        {
          name: 'paragraph',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'ratings',
      type: 'group',
      admin: { description: 'Rating bars — each value 0 to 10' },
      fields: [
        { name: 'kreativita', type: 'number', min: 0, max: 10, defaultValue: 5 },
        { name: 'mystika', type: 'number', min: 0, max: 10, defaultValue: 5 },
        { name: 'sebarozvoj', type: 'number', min: 0, max: 10, defaultValue: 5 },
        { name: 'pohyb', type: 'number', min: 0, max: 10, defaultValue: 5 },
        { name: 'kritickeMyslenie', type: 'number', min: 0, max: 10, defaultValue: 5 },
      ],
    },

    // ─── Section 3: Video (optional) ─────────────────────────────────────────
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      admin: {
        description: 'Cloudflare R2 URL for the camp video (e.g. https://pub-xxx.r2.dev/video.mp4). If set, replaces the text in section 3 with a video player.',
      },
    },
    {
      name: 'videoThumbnailUrl',
      type: 'text',
      label: 'Video thumbnail URL',
      admin: {
        description: 'Cloudflare R2 URL for the video poster/thumbnail image.',
      },
    },

    // ─── Section 3: Reviews ───────────────────────────────────────────────────
    {
      name: 'section3_headline',
      type: 'text',
      admin: { description: 'e.g. "Ako Olymp Camp prežíva dieťa?"' },
    },
    {
      name: 'section3_text',
      type: 'array',
      admin: { description: 'Paragraphs below the section 3 headline' },
      fields: [
        {
          name: 'paragraph',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      admin: { description: 'Parent reviews shown in the carousel' },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
      ],
    },

    // ─── Section 4: Details Accordion ─────────────────────────────────────────
    {
      name: 'vTomtoTaboreZazites',
      type: 'array',
      label: 'V tomto tábore zažiješ',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
    {
      name: 'vCene',
      type: 'array',
      label: 'V cene',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
    {
      name: 'lokalita',
      type: 'textarea',
      label: 'Lokalita',
    },
    {
      name: 'doprava',
      type: 'textarea',
      label: 'Doprava',
    },
    {
      name: 'ubytovanie',
      type: 'array',
      label: 'Ubytovanie',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
    {
      name: 'zaPriplatok',
      type: 'array',
      label: 'Za príplatok',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },

    // ─── Section 4b: Stredisko ────────────────────────────────────────────────
    {
      name: 'hasStredisko',
      type: 'checkbox',
      label: 'Has stredisko section?',
      defaultValue: false,
    },
    {
      name: 'strediskoName',
      type: 'text',
      label: 'Stredisko name',
      admin: {
        condition: (data) => Boolean(data?.hasStredisko),
        description: 'e.g. "Horský hotel Lomy"',
      },
    },
    {
      name: 'strediskoDescription',
      type: 'textarea',
      label: 'Stredisko description',
      admin: {
        condition: (data) => Boolean(data?.hasStredisko),
      },
    },
    {
      name: 'strediskoGallery',
      type: 'array',
      label: 'Stredisko gallery (6 photos)',
      admin: {
        condition: (data) => Boolean(data?.hasStredisko),
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'mapLat',
      type: 'number',
      label: 'Map latitude',
      admin: {
        condition: (data) => Boolean(data?.hasStredisko),
      },
    },
    {
      name: 'mapLng',
      type: 'number',
      label: 'Map longitude',
      admin: {
        condition: (data) => Boolean(data?.hasStredisko),
      },
    },

    // ─── Section 5: Available Dates ───────────────────────────────────────────
    {
      name: 'dates',
      type: 'array',
      label: 'Dostupné termíny',
      admin: { description: 'Add, remove or edit dates freely' },
      fields: [
        {
          name: 'start',
          type: 'text',
          label: 'Date from',
          required: true,
          admin: { description: 'e.g. "03.08.2026"' },
        },
        {
          name: 'end',
          type: 'text',
          label: 'Date to',
          required: true,
          admin: { description: 'e.g. "09.08.2026"' },
        },
        {
          name: 'days',
          type: 'number',
          label: 'Number of days',
          required: true,
        },
        {
          name: 'originalPrice',
          type: 'text',
          label: 'Original price',
          admin: { description: 'e.g. "359 €"' },
        },
        {
          name: 'discountedPrice',
          type: 'text',
          label: 'Discounted price (leave empty if none)',
        },
        {
          name: 'registrationId',
          type: 'text',
          label: 'Registration ID (legacy)',
          admin: { description: 'Legacy manual ID — replaced by Profis Term ID below' },
        },
        {
          name: 'profisTerminId',
          type: 'number',
          label: 'Profis Term ID (id_Termin)',
          admin: {
            description: 'The id_Termin from ProfisXML for this date. Use the lookup script to find it.',
          },
        },
        {
          name: 'id_ZajezdHotel',
          type: 'number',
          label: 'Profis ZajezdHotel ID (id_ZajezdHotel)',
          admin: {
            description: 'The id_ZajezdHotel from ProfisXML for this camp. Set automatically by the populate script.',
          },
        },
        {
          name: 'vypredane',
          type: 'checkbox',
          label: 'Vypredané',
          defaultValue: false,
          admin: {
            description: 'Zaškrtnite ak je termín vypredaný — tlačidlo sa zmení na "Vypredané" a prihlásenie bude zablokované.',
          },
        },
        {
          name: 'capacityLimit',
          type: 'number',
          label: 'Limit rezervácií (voliteľné)',
          admin: {
            description: 'Ak vyplnené, systém automaticky ráta úspešné rezervácie tohto termínu a po dosiahnutí tohto počtu termín sám zaškrtne "Vypredané". Nechajte prázdne pre bežné termíny (bez lokálneho limitu).',
          },
        },
        {
          name: 'reservationsCount',
          type: 'number',
          label: 'Počet rezervácií (automaticky)',
          defaultValue: 0,
          admin: {
            description: 'Počíta systém automaticky pri každej úspešnej rezervácii — needitovať ručne, iba na kontrolu alebo reset.',
          },
        },
      ],
    },
  ],
}
