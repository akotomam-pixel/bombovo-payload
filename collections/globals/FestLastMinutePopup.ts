import type { GlobalConfig } from 'payload'

export const FestLastMinutePopupGlobal: GlobalConfig = {
  slug: 'fest-last-minute-popup',
  label: 'Popup: Fest Last Minute',
  admin: {
    group: 'Marketing',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'isEnabled',
      type: 'checkbox',
      label: 'Popup zapnutý',
      defaultValue: false,
      admin: {
        description: 'Vypni pre skrytie popupu na tejto route.',
      },
    },
    {
      name: 'delaySeconds',
      type: 'number',
      label: 'Oneskorenie zobrazenia (sekundy)',
      defaultValue: 5,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka (ľavý panel na desktopu)',
    },
    {
      name: 'discountCode',
      type: 'text',
      label: 'Zľavový kód',
      defaultValue: 'BOMBOVO',
    },
    // Step 0
    {
      name: 'step0Headline',
      type: 'text',
      label: 'Krok 0 – Headline',
    },
    {
      name: 'step0YesLabel',
      type: 'text',
      label: 'Krok 0 – Tlačidlo ÁNO',
    },
    {
      name: 'step0NoLabel',
      type: 'text',
      label: 'Krok 0 – Tlačidlo NIE',
    },
    // Step 1
    {
      name: 'step1Headline',
      type: 'text',
      label: 'Krok 1 – Headline',
    },
    {
      name: 'step1NamePlaceholder',
      type: 'text',
      label: 'Krok 1 – Placeholder mena',
    },
    {
      name: 'step1NextLabel',
      type: 'text',
      label: 'Krok 1 – Tlačidlo Ďalej',
    },
    // Step 2
    {
      name: 'step2Headline',
      type: 'text',
      label: 'Krok 2 – Headline',
    },
    {
      name: 'step2EmailPlaceholder',
      type: 'text',
      label: 'Krok 2 – Placeholder emailu',
    },
    {
      name: 'step2SubmitLabel',
      type: 'text',
      label: 'Krok 2 – Tlačidlo Odoslať',
    },
    // Step 3
    {
      name: 'step3Headline',
      type: 'text',
      label: 'Krok 3 – Headline',
    },
    {
      name: 'step3Body',
      type: 'textarea',
      label: 'Krok 3 – Text',
    },
  ],
}
