import type { CollectionConfig } from 'payload'

/**
 * "Sledovať dostupnosť" waitlist signups for sold-out škola v prírode termíny.
 *
 * `termin` is a hand-typed date-range string (e.g. "13.04.2026-17.04.2026" or
 * "05.04. – 09.04.2027"), not a relationship — termíny aren't their own Payload
 * records (see Strediska.ts's `dates` array), and the "rebuilt architecture"
 * strediská (Lomy, Osrblie, ...) store their termíny as plain strings in
 * data/{slug}/content.ts with no id at all. The date-range text is the only
 * identifier that exists in both places, so it's what ties a signup to a row,
 * matched by exact string equality against whatever range/label the button
 * that opened the form was showing.
 */
export const WaitlistSignups: CollectionConfig = {
  slug: 'waitlist-signups',
  labels: {
    singular: 'Waitlist Signup',
    plural: 'Waitlist Signups',
  },
  admin: {
    group: 'Školy v Prírode',
    useAsTitle: 'email',
    defaultColumns: ['meno', 'priezvisko', 'stredisko', 'termin', 'status', 'createdAt'],
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
      name: 'meno',
      type: 'text',
      label: 'Meno',
      required: true,
    },
    {
      name: 'priezvisko',
      type: 'text',
      label: 'Priezvisko',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
    },
    {
      name: 'telefon',
      type: 'text',
      label: 'Telefón',
      required: true,
    },
    {
      name: 'stredisko',
      type: 'relationship',
      relationTo: 'strediska',
      label: 'Stredisko',
      required: true,
    },
    {
      name: 'termin',
      type: 'text',
      label: 'Termín',
      required: true,
      admin: {
        description: 'Presný textový rozsah dátumu (napr. "13.04.2026-17.04.2026"), tak ako je zobrazený na stránke.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stav',
      defaultValue: 'caka',
      required: true,
      options: [
        { label: 'Čaká', value: 'caka' },
        { label: 'Upozornené', value: 'upozornene' },
      ],
    },
  ],
}
