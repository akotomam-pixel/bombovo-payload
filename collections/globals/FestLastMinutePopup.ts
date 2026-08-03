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
    // Step 0 — Yes/No
    {
      name: 'step0Headline',
      type: 'text',
      label: 'Krok 0 – Headline',
      defaultValue: 'Získaj Last Minute *zľavu* na|Fest animátor fest',
      admin: {
        description: 'Použi "|" na vynútenie zalomenia riadku. Text obalený hviezdičkami, napr. "*zľavu*", sa zvýrazní červeným boxom.',
      },
    },
    {
      name: 'step0SubHeadline',
      type: 'text',
      label: 'Krok 0 – Podnadpis',
      defaultValue: 'Chceš túto zľavu?',
    },
    {
      name: 'step0YesLabel',
      type: 'text',
      label: 'Krok 0 – Tlačidlo ÁNO',
      defaultValue: 'Áno, chcem zľavu!',
    },
    {
      name: 'step0NoLabel',
      type: 'text',
      label: 'Krok 0 – Tlačidlo NIE',
      defaultValue: 'Nie, ďakujem',
    },
    // Step 1 — Name + Email (single combined step)
    {
      name: 'step1Headline',
      type: 'text',
      label: 'Krok 1 – Headline',
      defaultValue: 'Zadaj svoje meno a email a získaj zľavu',
    },
    {
      name: 'step1NamePlaceholder',
      type: 'text',
      label: 'Krok 1 – Placeholder mena',
      defaultValue: 'Tvoje meno',
    },
    {
      name: 'step1EmailPlaceholder',
      type: 'text',
      label: 'Krok 1 – Placeholder emailu',
      defaultValue: 'tvoj@email.sk',
    },
    {
      name: 'step1SubmitLabel',
      type: 'text',
      label: 'Krok 1 – Tlačidlo Odoslať',
      defaultValue: 'Získať zľavu',
    },
    // Step 2 — Success (discount code)
    {
      name: 'step3Headline',
      type: 'text',
      label: 'Krok 2 – Headline',
      defaultValue: 'Tvoj zľavový kód je pripravený!',
    },
    {
      name: 'step3Body',
      type: 'textarea',
      label: 'Krok 2 – Text',
      defaultValue:
        'Skopíruj si kód nižšie a použi ho pri prihláške na Fest animátor fest. Na tomto termíne ostáva už len posledných pár voľných miest.',
    },
  ],
}
