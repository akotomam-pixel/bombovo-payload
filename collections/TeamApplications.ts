import type { CollectionConfig } from 'payload'

/**
 * Applications from /prihlaska-animator and /prihlaska-zdravotnik.
 *
 * A safety net: every valid application is saved here before any email goes
 * out, so nothing is lost if Resend fails. Written only by the server route
 * (lib/prihlaska/handler.ts, with overrideAccess) — never via the public API.
 */
export const TeamApplications: CollectionConfig = {
  slug: 'team-applications',
  labels: {
    singular: 'Prihláška do tímu',
    plural: 'Prihlášky do tímu',
  },
  admin: {
    group: 'Tím',
    useAsTitle: 'email',
    defaultColumns: ['meno', 'priezvisko', 'role', 'termin', 'email', 'telefon', 'createdAt'],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  timestamps: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      label: 'Rola',
      required: true,
      options: [
        { label: 'Animátor', value: 'animator' },
        { label: 'Zdravotník', value: 'zdravotnik' },
      ],
    },
    { name: 'termin', type: 'text', label: 'Termín školenia', required: true },
    { name: 'titul', type: 'text', label: 'Titul' },
    { name: 'meno', type: 'text', label: 'Meno', required: true },
    { name: 'priezvisko', type: 'text', label: 'Priezvisko', required: true },
    {
      name: 'datumNarodenia',
      type: 'text',
      label: 'Dátum narodenia',
      admin: { description: 'Tak, ako prišiel z formulára: RRRR-MM-DD.' },
    },
    { name: 'adresa', type: 'text', label: 'Adresa' },
    { name: 'psc', type: 'text', label: 'PSČ' },
    { name: 'mesto', type: 'text', label: 'Mesto' },
    { name: 'telefon', type: 'text', label: 'Telefón', required: true },
    { name: 'email', type: 'text', label: 'Email', required: true },
    { name: 'vzdelanie', type: 'text', label: 'Vzdelanie / odbornosť' },
    { name: 'strava', type: 'textarea', label: 'Intolerancie / alergie' },
    { name: 'gdpr', type: 'checkbox', label: 'Súhlas GDPR', defaultValue: false },
    {
      type: 'collapsible',
      label: 'Stav emailov',
      fields: [
        { name: 'internalEmailSent', type: 'checkbox', label: 'Interný email odoslaný', defaultValue: false },
        { name: 'confirmationEmailSent', type: 'checkbox', label: 'Potvrdenie uchádzačovi odoslané', defaultValue: false },
        { name: 'emailError', type: 'textarea', label: 'Chyba pri odosielaní' },
      ],
    },
  ],
}
