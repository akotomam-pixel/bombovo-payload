import type { GlobalConfig } from 'payload'

export const GiveawayPopupGlobal: GlobalConfig = {
  slug: 'giveaway-popup',
  label: 'Popup: Vyhraj Tábor Zadarmo',
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
      defaultValue: true,
      admin: {
        description: 'Vypni pre skrytie popupu na celom webe.',
      },
    },
    {
      name: 'delaySeconds',
      type: 'number',
      label: 'Oneskorenie zobrazenia (sekundy)',
      defaultValue: 20,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka (ľavý panel na desktopu)',
    },
    // Step 0
    {
      name: 'step0Headline',
      type: 'text',
      label: 'Krok 0 – Headline',
      defaultValue: 'Chceš vyhrať tábor zadarmo?',
    },
    {
      name: 'step0YesLabel',
      type: 'text',
      label: 'Krok 0 – Tlačidlo ÁNO',
      defaultValue: 'Áno, chcem vyhrať!',
    },
    {
      name: 'step0NoLabel',
      type: 'text',
      label: 'Krok 0 – Tlačidlo NIE',
      defaultValue: 'Nie, ďakujem',
    },
    // Step 1
    {
      name: 'step1Headline',
      type: 'text',
      label: 'Krok 1 – Headline',
      defaultValue: 'Zadaj Svoje Meno A Vyber Si Tábor',
    },
    {
      name: 'step1NamePlaceholder',
      type: 'text',
      label: 'Krok 1 – Placeholder mena',
      defaultValue: 'Tvoje meno',
    },
    {
      name: 'step1CampDefaultLabel',
      type: 'text',
      label: 'Krok 1 – Predvolená možnosť výberu tábora',
      defaultValue: 'Akýkoľvek Tábor',
    },
    {
      name: 'step1NextLabel',
      type: 'text',
      label: 'Krok 1 – Tlačidlo Ďalej',
      defaultValue: 'Ďalej',
    },
    // Step 2
    {
      name: 'step2Headline',
      type: 'text',
      label: 'Krok 2 – Headline',
      defaultValue: 'Zadaj Svoj Email A Si V Hre O Tábor Zadarmo',
    },
    {
      name: 'step2EmailPlaceholder',
      type: 'text',
      label: 'Krok 2 – Placeholder emailu',
      defaultValue: 'tvoj@email.sk',
    },
    {
      name: 'step2SubmitLabel',
      type: 'text',
      label: 'Krok 2 – Tlačidlo Odoslať',
      defaultValue: 'Prihlásiť sa do súťaže',
    },
    // Step 3
    {
      name: 'step3SuccessHeadline',
      type: 'text',
      label: 'Krok 3 – Úspech Headline',
      defaultValue: 'Si v hre! 🎉',
    },
    {
      name: 'step3SuccessBody',
      type: 'textarea',
      label: 'Krok 3 – Úspech Text',
      defaultValue:
        'Tvoja prihláška do súťaže o tábor zadarmo bola úspešne zaznamenaná. Víťaza vyhlásime čoskoro!',
    },
  ],
}
