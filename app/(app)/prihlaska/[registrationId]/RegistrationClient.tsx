"use client";

import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    ecotrack: (...args: unknown[]) => void
  }
}
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface Props {
  campName: string;
  campLocation: string;
  dateStart: string;
  dateEnd: string;
  originalPrice: string;
  discountedPrice: string;
  registrationId: string;
  profisTerminId: number | null;
  id_ZajezdHotel: number | null;
  campAge?: string | null;
}

export default function RegistrationClient({
  campName,
  campLocation,
  dateStart,
  dateEnd,
  originalPrice,
  discountedPrice,
  registrationId,
  profisTerminId,
  id_ZajezdHotel,
  campAge,
}: Props) {
  const [formData, setFormData] = useState({
    // Informácie zákonného zástupcu
    parentFirstName: "",
    parentLastName: "",
    street: "",
    streetNumber: "",
    city: "",
    zip: "",
    phone: "",
    email: "",

    // Informácie dieťaťa
    childFirstName: "",
    childLastName: "",
    birthDate: "",

    // Intolerancie
    hasIntolerance: "nie",
    intoleranceDetails: "",

    // Ostatné
    roomWith: "",
    tshirtSize: "",
    discountCode: "",

    // Adresa dieťaťa 1
    childStreet: "",
    childStreetNumber: "",
    childCity: "",
    childZip: "",

    // Druhé dieťa
    hasSecondChild: false,
    childFirstName2: "",
    childLastName2: "",
    birthDate2: "",
    childStreet2: "",
    childStreetNumber2: "",
    childCity2: "",
    childZip2: "",
    hasIntolerance2: "nie",
    intoleranceDetails2: "",
    roomWith2: "",
    tshirtSize2: "",

    // Checkboxy
    insurance: false,
    newsletter: false,
    photoConsent: "ano",
    gdprConsent: false,

    // Platba
    paymentMethod: "zaloha",

    // Ostatné informácie
    additionalInfo: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tshirtSizes, setTshirtSizes] = useState<{ id: number; nazev: string }[]>([]);

  const [discountStatus, setDiscountStatus] = useState<'idle' | 'applying' | 'applied' | 'error'>('idle');
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [appliedDiscountParamId, setAppliedDiscountParamId] = useState<number | null>(null);
  const [discountedPriceFromCode, setDiscountedPriceFromCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/profitour/tshirt-sizes')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data.sizes)) setTshirtSizes(data.sizes) })
      .catch(() => {}) // silent fail — fallback options shown below
  }, []);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorNode, setSubmitErrorNode] = useState<React.ReactNode>(null);
  const [birthDateError, setBirthDateError] = useState(false);
  const [birthDate2Error, setBirthDate2Error] = useState(false);
  const [birthDateMsg, setBirthDateMsg] = useState<string | null>(null);
  const [birthDate2Msg, setBirthDate2Msg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Split date inputs (DD / MM / YYYY) — avoids the Mac browser date-picker confusion
  const [bd1, setBd1] = useState({ d: '', m: '', y: '' });
  const [bd2, setBd2] = useState({ d: '', m: '', y: '' });
  const d1Ref = useRef<HTMLInputElement>(null);
  const m1Ref = useRef<HTMLInputElement>(null);
  const y1Ref = useRef<HTMLInputElement>(null);
  const d2Ref = useRef<HTMLInputElement>(null);
  const m2Ref = useRef<HTMLInputElement>(null);
  const y2Ref = useRef<HTMLInputElement>(null);

  // Accept 1-2 digit day/month so single-digit entries like "5" still assemble correctly
  const makeDateISO = (d: string, m: string, y: string) =>
    d.length >= 1 && m.length >= 1 && y.length === 4
      ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
      : '';

  // Parse "11-16" or "Pre deti vo veku 11-16 rokov" → { min: 11, max: 16 } (used only for error message text)
  const ageRange = (() => {
    if (!campAge) return null;
    const match = campAge.match(/(\d+)[–\-](\d+)/);
    return match ? { min: Number(match[1]), max: Number(match[2]) } : null;
  })();

  const handleDatePart = (
    part: 'day' | 'month' | 'year',
    rawVal: string,
    parts: { d: string; m: string; y: string },
    setParts: React.Dispatch<React.SetStateAction<{ d: string; m: string; y: string }>>,
    fieldName: 'birthDate' | 'birthDate2',
    dRef: React.RefObject<HTMLInputElement | null>,
    mRef: React.RefObject<HTMLInputElement | null>,
    yRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const digits = rawVal.replace(/\D/g, '');
    const maxLen = part === 'year' ? 4 : 2;
    const val = digits.slice(0, maxLen);
    const next = part === 'day' ? { ...parts, d: val }
      : part === 'month' ? { ...parts, m: val }
      : { ...parts, y: val };
    setParts(next);
    // Clear any age error from a previous Profis submission when the user edits the date
    if (fieldName === 'birthDate') { setBirthDateError(false); setBirthDateMsg(null); }
    else { setBirthDate2Error(false); setBirthDate2Msg(null); }
    const iso = makeDateISO(next.d, next.m, next.y);
    setFormData(prev => ({ ...prev, [fieldName]: iso }));
    // Auto-advance focus
    if (part === 'day' && val.length === 2) mRef.current?.focus();
    if (part === 'month' && val.length === 2) yRef.current?.focus();
    // Auto-back on backspace when empty
    if (part === 'month' && val === '' && rawVal === '') dRef.current?.focus();
    if (part === 'year' && val === '' && rawVal === '') mRef.current?.focus();
  };

  const clearFieldError = (name: string) => {
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    clearFieldError(name);
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateFields = (): boolean => {
    const errors: Record<string, string> = {};
    const req = (field: string, value: string | boolean) => {
      if (!value || (typeof value === 'string' && !value.trim())) errors[field] = 'Prosím vyplňte povinné polia.';
    };
    req('parentFirstName', formData.parentFirstName);
    req('parentLastName', formData.parentLastName);
    req('street', formData.street);
    req('streetNumber', formData.streetNumber);
    req('city', formData.city);
    req('zip', formData.zip);
    if (!errors['zip'] && formData.zip && !/^\d{5}$/.test(formData.zip.replace(/\s/g, ''))) {
      errors['zip'] = 'Prosím zadajte správne PSČ.';
    }
    req('phone', formData.phone);
    req('email', formData.email);
    if (!errors['email'] && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors['email'] = 'Zadali ste nesprávnu emailovú adresu.';
    }
    req('childFirstName', formData.childFirstName);
    req('childLastName', formData.childLastName);
    req('birthDate', formData.birthDate);
    req('childStreet', formData.childStreet);
    req('childStreetNumber', formData.childStreetNumber);
    req('childCity', formData.childCity);
    req('childZip', formData.childZip);
    if (!errors['childZip'] && formData.childZip && !/^\d{5}$/.test(formData.childZip.replace(/\s/g, ''))) {
      errors['childZip'] = 'Prosím zadajte správne PSČ.';
    }
    if (formData.hasIntolerance === 'ano') req('intoleranceDetails', formData.intoleranceDetails);
    req('tshirtSize', formData.tshirtSize);
    if (!formData.gdprConsent) errors['gdprConsent'] = 'Prosím zaškrtnite všetky povinné polia na vyplnenie prihlášky.';
    if (formData.hasSecondChild) {
      req('childFirstName2', formData.childFirstName2);
      req('childLastName2', formData.childLastName2);
      req('birthDate2', formData.birthDate2);
      req('childStreet2', formData.childStreet2);
      req('childStreetNumber2', formData.childStreetNumber2);
      req('childCity2', formData.childCity2);
      req('childZip2', formData.childZip2);
      if (!errors['childZip2'] && formData.childZip2 && !/^\d{5}$/.test(formData.childZip2.replace(/\s/g, ''))) {
        errors['childZip2'] = 'Prosím zadajte správne PSČ.';
      }
      if (formData.hasIntolerance2 === 'ano') req('intoleranceDetails2', formData.intoleranceDetails2);
      req('tshirtSize2', formData.tshirtSize2);
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleApplyDiscount = async () => {
    const kod = formData.discountCode.trim();
    if (!kod || !profisTerminId) return;
    setDiscountStatus('applying');
    setDiscountMessage(null);
    try {
      const discRes = await fetch('/api/profitour/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kod }),
      });
      const discData = await discRes.json();
      if (!discRes.ok || discData.error) {
        setDiscountStatus('error');
        setDiscountMessage(discData.error ?? 'Neplatný zľavový kód.');
        return;
      }
      const paramId: number = discData.id_SkupinaSlevaParametr;
      setAppliedDiscountParamId(paramId);

      // Re-run Kalkulace with the discount param to show the new price
      const birthDates = [
        formData.birthDate,
        ...(formData.hasSecondChild && formData.birthDate2 ? [formData.birthDate2] : []),
      ].filter(Boolean);
      const kalRes = await fetch('/api/profitour/kalkulace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_Termin: profisTerminId,
          id_ZajezdHotel: id_ZajezdHotel ?? undefined,
          birthDates: birthDates.length ? birthDates : undefined,
          discountParamId: paramId,
        }),
      });
      const kalData = await kalRes.json();
      if (kalData.kalkulace?.celkemCena) {
        const mena = kalData.kalkulace.mena ?? '€';
        setDiscountedPriceFromCode(`${kalData.kalkulace.celkemCena} ${mena}`);
      }

      setDiscountStatus('applied');
      setDiscountMessage('Zľavový kód bol úspešne uplatnený!');
    } catch {
      setDiscountStatus('error');
      setDiscountMessage('Neplatný zľavový kód.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitErrorNode(null);
    setBirthDateError(false);
    setBirthDate2Error(false);
    setBirthDateMsg(null);
    setBirthDate2Msg(null);
    if (!validateFields()) return;

    // If a discount code was entered but not validated by Profis, block the submission
    if (formData.discountCode.trim() && discountStatus !== 'applied') {
      setDiscountStatus('error');
      setDiscountMessage('Použitý kód je neplatný.');
      document.getElementById('field-discountCode')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      if (profisTerminId) {
        // ── Build travelers list with full details for Profis contract fields ──
        const cestujici = [
          {
            datumNarozeni: formData.birthDate,
            jmeno: formData.childFirstName,
            prijmeni: formData.childLastName || '-',
            ulice: [formData.childStreet, formData.childStreetNumber].filter(Boolean).join(' '),
            psc: formData.childZip,
            roomWith: formData.roomWith || undefined,
          },
          ...(formData.hasSecondChild && formData.birthDate2
            ? [{
                datumNarozeni: formData.birthDate2,
                jmeno: formData.childFirstName2,
                prijmeni: formData.childLastName2 || '-',
                ulice: [formData.childStreet2, formData.childStreetNumber2].filter(Boolean).join(' '),
                psc: formData.childZip2,
                roomWith: formData.roomWith2 || undefined,
              }]
            : []),
        ];

        // ── Build notes string (child names + all extra fields Profis can't store) ──
        const extras = [
          `Dieťa 1: ${formData.childFirstName} ${formData.childLastName}`.trim(),
          formData.childStreet ? `Adresa dieťaťa 1: ${[formData.childStreet, formData.childStreetNumber].filter(Boolean).join(' ')}, ${formData.childCity} ${formData.childZip}` : '',
          formData.hasSecondChild && (formData.childFirstName2 || formData.childLastName2) ? `Dieťa 2: ${formData.childFirstName2} ${formData.childLastName2}`.trim() : '',
          formData.hasSecondChild && formData.childStreet2 ? `Adresa dieťaťa 2: ${[formData.childStreet2, formData.childStreetNumber2].filter(Boolean).join(' ')}, ${formData.childCity2} ${formData.childZip2}` : '',
          formData.tshirtSize ? `Tričko: ${formData.tshirtSize}` : '',
          formData.hasSecondChild && formData.tshirtSize2 ? `Tričko 2: ${formData.tshirtSize2}` : '',
          formData.roomWith ? `Ubytovať s: ${formData.roomWith}` : '',
          formData.hasIntolerance === 'ano' && formData.intoleranceDetails ? `Intolerancia: ${formData.intoleranceDetails}` : '',
          formData.hasSecondChild && formData.hasIntolerance2 === 'ano' && formData.intoleranceDetails2 ? `Intolerancia 2: ${formData.intoleranceDetails2}` : '',
          formData.hasSecondChild && formData.roomWith2 ? `Ubytovať s 2: ${formData.roomWith2}` : '',
          `Platba: ${formData.paymentMethod === 'zaloha' ? 'záloha 50€' : 'celá suma'}`,
          formData.additionalInfo ? `Poznámka: ${formData.additionalInfo}` : '',
        ].filter(Boolean).join(' | ');

        // ── Step 1: Kalkulace — get id_SkupinaSlevaKombinace ─────────────────
        const birthDates = cestujici.map(c => c.datumNarozeni);
        const kalkulaceRes = await fetch('/api/profitour/kalkulace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_Termin: profisTerminId,
            id_ZajezdHotel: id_ZajezdHotel ?? undefined,
            birthDates,
            ...(appliedDiscountParamId ? { discountParamId: appliedDiscountParamId } : {}),
          }),
        });
        const kalkulaceData = await kalkulaceRes.json();
        if (!kalkulaceRes.ok || kalkulaceData.error) {
          throw new Error(kalkulaceData.error ?? 'Chyba pri výpočte ceny.');
        }
        const id_SkupinaSlevaKombinace = kalkulaceData.kalkulace?.id_SkupinaSlevaKombinace ?? 0;
        // Transport (svoz) IDs, accommodation ID and resolved hotel ID returned from kalkulace
        const svozTamId = kalkulaceData.svozTamId ?? null;
        const svozZpetId = kalkulaceData.svozZpetId ?? null;
        const resolvedHotelId = kalkulaceData.resolvedHotelId ?? id_ZajezdHotel ?? null;
        const id_Ubytovani = kalkulaceData.id_Ubytovani ?? 0;
        const id_TypStrava = kalkulaceData.id_TypStrava ?? 0;

        // ── Step 2: Create order ──────────────────────────────────────────────
        const orderRes = await fetch('/api/profitour/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_Termin: profisTerminId,
            id_ZajezdHotel: resolvedHotelId ?? undefined,
            id_Ubytovani,
            id_TypStrava,
            id_SkupinaSlevaKombinace,
            ...(appliedDiscountParamId ? { id_SkupinaSlevaParametr: appliedDiscountParamId } : {}),
            svozTamId,
            svozZpetId,
            jmeno: formData.parentFirstName,
            prijmeni: formData.parentLastName || '-',
            email: formData.email,
            telefon: formData.phone,
            ulice: [formData.street, formData.streetNumber].filter(Boolean).join(' '),
            mesto: formData.city,
            psc: formData.zip,
            cestujici,
            insurance: formData.insurance,
            additionalInfo: formData.additionalInfo || undefined,
            poznamka: extras,
            url: typeof window !== 'undefined' ? window.location.href : 'https://bombovo.sk',
          }),
        });
        const orderData = await orderRes.json();

        if (!orderRes.ok || orderData.error) {
          throw new Error(orderData.error ?? 'Chyba pri odosielaní objednávky.');
        }

        // ObjednatResult returns ID, Klic, plus id_Klient + cestujiciIds from ObjednavkaDetail
        const { id_Objednavka, klic, id_Klient, cestujiciIds, cestujiciKlientIds, souhlasKlic, klientEmail } = orderData;

        // ── Step 3: Extra fields (t-shirt + intolerances) ─────────────────────
        // Non-blocking — failure must not prevent order finalization
        try {
          const extraCestujici = (cestujiciIds ?? []).map((id_Cestujici: number, idx: number) => {
            const isFirstChild = idx === 0;
            const intolerance = isFirstChild
              ? (formData.hasIntolerance === 'ano' ? formData.intoleranceDetails : undefined)
              : (formData.hasSecondChild && formData.hasIntolerance2 === 'ano' ? formData.intoleranceDetails2 : undefined);
            const childName = isFirstChild
              ? formData.childFirstName
              : formData.childFirstName2;
            const roomWith = isFirstChild
              ? (formData.roomWith || undefined)
              : (formData.hasSecondChild ? (formData.roomWith2 || undefined) : undefined);
            return {
              id_Cestujici,
              id_KlientCestujici: (cestujiciKlientIds ?? [])[idx] ?? null,
              id_VelikostTricka: isFirstChild
                ? (Number(formData.tshirtSize) || null)
                : (formData.hasSecondChild ? (Number(formData.tshirtSize2) || null) : null),
              zdravotniOmezeni: intolerance || undefined,
              childName: childName || undefined,
              roomWith,
            };
          });

          await fetch('/api/profitour/order/extra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_Klient: id_Klient ?? null,
              cestujici: extraCestujici,
              gdprOmezeni: formData.additionalInfo || undefined,
              newsletter: formData.gdprConsent || undefined,
              photoConsent: formData.photoConsent || undefined,
              klientEmail: klientEmail ?? undefined,
              souhlasKlic: souhlasKlic ?? undefined,
            }),
          });
        } catch (extraErr) {
          console.warn('[prihlaska] order/extra non-blocking error:', extraErr);
        }

        // ── Step 4: Finalize order ────────────────────────────────────────────
        await fetch('/api/profitour/order/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_Objednavka,
            klic,
            email: formData.email,
            name: `${formData.parentFirstName} ${formData.parentLastName}`.trim(),
            campName,
          }),
        });
      }
      // If profisTerminId is not set yet, the form still submits but without Profis
      // (legacy flow — useful until all camps have profisTerminId populated)

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'prihlaska_submitted' });
        }
      }, 100);

      if (typeof window !== 'undefined' && typeof window.ecotrack === 'function') {
        const cleanPrice = discountedPrice.replace(/[^0-9.]/g, '');
        window.ecotrack('setUserId', formData.email);
        window.ecotrack('addTrans', registrationId, 'Bombovo', cleanPrice, '0', '0', '', '', 'EUR');
        window.ecotrack('addItem', registrationId, registrationId, campName, 'letny-tabor', cleanPrice, '1');
        window.ecotrack('trackTrans');
        const ecmid = new URLSearchParams(window.location.search).get('ecmid') ||
                      document.cookie.match(/ecmid=([^;]+)/)?.[1] ||
                      'priamy';
        if (ecmid !== 'priamy') {
          fetch('https://script.google.com/macros/s/AKfycbxb-uieDsMkLrXZ98LxTKUpjYIE7iCat4uue-YikXYLfuv1f_lEKeKg7Je5JYfOTEeZCQ/exec', {
            method: 'POST',
            body: JSON.stringify({
              name: formData.firstName + ' ' + formData.lastName,
              price: cleanPrice + ' EUR',
              ecmid: ecmid
            })
          }).catch(() => {});
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Neznáma chyba. Skúste znova.';
      const isAgeError = msg.includes('nie je možné obsadiť') || msg.includes('Kalkulace.Warning') || msg.includes('vek') || msg.includes('věk');
      const isDateError = msg.includes('cannot be parsed as the type') || msg.includes('DateTime');
      const isPhoneError = msg.includes('Telefon') || msg.includes('telefon') || msg.includes('KlientDataInput.Telefon');
      const isEmailError = msg.includes('Email') || msg.includes('KlientDataInput.Email');
      if (isDateError) {
        const isInvalidDate = (iso: string) => !iso || isNaN(new Date(iso).getTime());
        const child1Bad = isInvalidDate(formData.birthDate);
        const child2Bad = formData.hasSecondChild && isInvalidDate(formData.birthDate2);
        const invalidMsg = 'Nesprávne zadaný dátum narodenia. Skontrolujte prosím zadaný dátum.';
        if (child1Bad || (!child1Bad && !child2Bad)) { setBirthDateError(true); setBirthDateMsg(invalidMsg); }
        if (child2Bad) { setBirthDate2Error(true); setBirthDate2Msg(invalidMsg); }
        const scrollTarget = (child2Bad && !child1Bad)
          ? document.getElementById('birthDate2')
          : document.getElementById('birthDate');
        scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (isAgeError) {
        // Determine which child's date is actually out of range so only that field turns red.
        // Profis is still the sole validator — this is purely for UI highlighting.
        const childAgeOutOfRange = (birthDate: string): boolean => {
          if (!birthDate || !ageRange) return true;
          const birth = new Date(birthDate);
          if (isNaN(birth.getTime())) return true;
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
          return age < ageRange.min || age > ageRange.max;
        };

        const child1Bad = childAgeOutOfRange(formData.birthDate);
        const child2Bad = formData.hasSecondChild && !!formData.birthDate2 && childAgeOutOfRange(formData.birthDate2);
        const onlyChild2Bad = !child1Bad && child2Bad;
        const onlyChild1Bad = child1Bad && !child2Bad;

        setBirthDateError(!onlyChild2Bad);
        if (formData.hasSecondChild && formData.birthDate2) {
          setBirthDate2Error(!onlyChild1Bad);
        }
        const scrollTarget = onlyChild2Bad
          ? document.getElementById('birthDate2')
          : document.getElementById('birthDate');
        scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (isPhoneError) {
        setFieldErrors({ phone: 'Zadali ste nesprávne číslo.' });
        document.getElementById('field-phone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (isEmailError) {
        setFieldErrors({ email: 'Zadali ste nesprávnu emailovú adresu.' });
        document.getElementById('field-email')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (msg.includes('Nelze rezervovat') || msg.includes('TerminOvereniDostupnosti')) {
        setSubmitErrorNode(
          <>
            Tento termín je už plne obsadený, skúste si vybrať iný tábor z našej ponuky táborov, alebo nás kontaktujte na{' '}
            <a href="mailto:bombovo@bombovo.sk" className="underline text-blue-600">bombovo@bombovo.sk</a>
            {' '}alebo telefonicky na číslo{' '}
            <a href="tel:+421915774213" className="underline text-blue-600">+421 915 774 213</a>.
          </>
        );
      } else {
        setSubmitError(`Prihlášku na tábor ${campName} momentálne nie je možné odoslať. Prosím kontaktujte nás na emaili bombovo@bombovo.sk alebo na telefónnom čísle +421 915 774 213 a my vám s prihláškou pomôžeme.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const ageErrorMsg = ageRange
    ? `Tento tábor je pre deti vo veku ${ageRange.min}–${ageRange.max} rokov, prosím skontrolujte zadaný dátum narodenia dieťaťa.`
    : 'Prosím skontrolujte zadaný dátum narodenia dieťaťa.';

  return (
    <div className="min-h-screen flex flex-col bg-bombovo-gray">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <main className="flex-grow py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-center gap-4 mb-6 overflow-x-auto">
            <div className="flex-shrink-0">
              <Image
                src="/images/reservation-icon.png"
                alt="Reservation Icon"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-bombovo-dark relative whitespace-nowrap">
              Rezervácia Tábora {campName}
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 400 12"
                preserveAspectRatio="none"
                style={{ height: "12px" }}
              >
                <path
                  d="M 0 8 Q 50 2, 100 6 T 200 6 T 300 6 T 400 8"
                  stroke="#DF2935"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-bombovo-dark mt-8">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-bombovo-yellow text-2xl" />
              <span className="text-lg md:text-xl font-bold whitespace-nowrap">
                {dateStart} - {dateEnd}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-bombovo-yellow text-2xl" />
              <span className="text-lg md:text-xl font-bold whitespace-nowrap">
                {campLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Success box — wider than the form, outside max-w-4xl */}
        {isSubmitted && (
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1064px'}}>
            <div className="bg-white rounded-3xl border-4 border-bombovo-blue p-6 md:p-8 my-12">
              <div className="text-center py-16 space-y-6">
                <h2 className="text-2xl md:text-4xl font-bold text-bombovo-dark mb-6 md:whitespace-nowrap">
                  Ďakujeme za vašu rezerváciu a nevieme sa dočkať!
                </h2>
                <p className="text-lg md:text-xl text-bombovo-dark leading-relaxed">
                  Vaša rezervácia bola úspešne odoslaná. V priebehu niekoľkých minút by vám mal prísť email s inštrukciami na platbu a s celkovými inštrukciami.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Ak máte nejaké ďalšie otázky, prosím neváhajte nás kontaktovať na email:{" "}
                  <a href="mailto:bombovo@bombovo.sk" className="text-bombovo-red font-semibold hover:underline">
                    bombovo@bombovo.sk
                  </a>{" "}
                  alebo na čísle{" "}
                  <a href="tel:+421915774213" className="text-bombovo-red font-semibold hover:underline">
                    +421 915 774 213
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isSubmitted && (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-3xl border-4 border-bombovo-blue p-6 md:p-8"
            >
              {/* Informácie Zákonného Zástupcu */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-bombovo-dark mb-6">
                  Informácie Zákonného Zástupcu
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="field-parentFirstName">
                      <label className={`block font-semibold mb-2 ${fieldErrors.parentFirstName ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Meno *
                      </label>
                      <input
                        type="text"
                        name="parentFirstName"
                        value={formData.parentFirstName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.parentFirstName ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.parentFirstName && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.parentFirstName}</p>}
                    </div>
                    <div id="field-parentLastName">
                      <label className={`block font-semibold mb-2 ${fieldErrors.parentLastName ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Priezvisko *
                      </label>
                      <input
                        type="text"
                        name="parentLastName"
                        value={formData.parentLastName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.parentLastName ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.parentLastName && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.parentLastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-[2fr_1fr] gap-4">
                    <div id="field-street">
                      <label className={`block font-semibold mb-2 ${fieldErrors.street ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Ulica *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.street ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.street && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.street}</p>}
                    </div>
                    <div id="field-streetNumber">
                      <label className={`block font-semibold mb-2 ${fieldErrors.streetNumber ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Číslo domu *
                      </label>
                      <input
                        type="text"
                        name="streetNumber"
                        value={formData.streetNumber}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.streetNumber ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.streetNumber && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.streetNumber}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="field-city">
                      <label className={`block font-semibold mb-2 ${fieldErrors.city ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Mesto *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.city ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.city && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.city}</p>}
                    </div>
                    <div id="field-zip">
                      <label className={`block font-semibold mb-2 ${fieldErrors.zip ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        PSČ *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.zip ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.zip && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.zip}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="field-phone">
                      <label className={`block font-semibold mb-2 ${fieldErrors.phone ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Telefón *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.phone ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.phone && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.phone}</p>}
                    </div>
                    <div id="field-email">
                      <label className={`block font-semibold mb-2 ${fieldErrors.email ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.email ? 'border-red-500' : 'border-bombovo-blue'}`}
                      />
                      {fieldErrors.email && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.email}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informácie Dieťaťa */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-bombovo-dark mb-6">
                  Informácie Dieťaťa
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div id="field-childFirstName">
                    <label className={`block font-semibold mb-2 ${fieldErrors.childFirstName ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      Meno Dieťaťa *
                    </label>
                    <input
                      type="text"
                      name="childFirstName"
                      value={formData.childFirstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childFirstName ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.childFirstName && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childFirstName}</p>}
                  </div>
                  <div id="field-childLastName">
                    <label className={`block font-semibold mb-2 ${fieldErrors.childLastName ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      Priezvisko Dieťaťa *
                    </label>
                    <input
                      type="text"
                      name="childLastName"
                      value={formData.childLastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childLastName ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.childLastName && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childLastName}</p>}
                  </div>
                </div>
                <div id="field-birthDate" className="mb-4">
                  <label className={`block font-semibold mb-2 ${birthDateError || fieldErrors.birthDate ? 'text-red-600' : 'text-bombovo-dark'}`}>
                    Dátum Narodenia *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={d1Ref}
                      id="birthDate"
                      type="text"
                      inputMode="numeric"
                      placeholder="DD"
                      maxLength={2}
                      value={bd1.d}
                      onChange={e => handleDatePart('day', e.target.value, bd1, setBd1, 'birthDate', d1Ref, m1Ref, y1Ref)}
                      className={`w-16 px-3 py-3 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${birthDateError || fieldErrors.birthDate ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    <span className="text-bombovo-dark font-semibold">/</span>
                    <input
                      ref={m1Ref}
                      type="text"
                      inputMode="numeric"
                      placeholder="MM"
                      maxLength={2}
                      value={bd1.m}
                      onChange={e => handleDatePart('month', e.target.value, bd1, setBd1, 'birthDate', d1Ref, m1Ref, y1Ref)}
                      onKeyDown={e => e.key === 'Backspace' && bd1.m === '' && d1Ref.current?.focus()}
                      className={`w-16 px-3 py-3 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${birthDateError || fieldErrors.birthDate ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    <span className="text-bombovo-dark font-semibold">/</span>
                    <input
                      ref={y1Ref}
                      type="text"
                      inputMode="numeric"
                      placeholder="YYYY"
                      maxLength={4}
                      value={bd1.y}
                      onChange={e => handleDatePart('year', e.target.value, bd1, setBd1, 'birthDate', d1Ref, m1Ref, y1Ref)}
                      onKeyDown={e => e.key === 'Backspace' && bd1.y === '' && m1Ref.current?.focus()}
                      className={`w-24 px-3 py-3 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${birthDateError || fieldErrors.birthDate ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                  </div>
                  {fieldErrors.birthDate && !birthDateError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{fieldErrors.birthDate}</p>
                  )}
                  {birthDateError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{birthDateMsg ?? ageErrorMsg}</p>
                  )}
                </div>
                <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
                  <div id="field-childStreet">
                    <label className={`block font-semibold mb-2 ${fieldErrors.childStreet ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      Ulica dieťaťa *
                    </label>
                    <input
                      type="text"
                      name="childStreet"
                      value={formData.childStreet}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childStreet ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.childStreet && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childStreet}</p>}
                  </div>
                  <div id="field-childStreetNumber">
                    <label className={`block font-semibold mb-2 ${fieldErrors.childStreetNumber ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      Číslo domu *
                    </label>
                    <input
                      type="text"
                      name="childStreetNumber"
                      value={formData.childStreetNumber}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childStreetNumber ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.childStreetNumber && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childStreetNumber}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div id="field-childCity">
                    <label className={`block font-semibold mb-2 ${fieldErrors.childCity ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      Mesto *
                    </label>
                    <input
                      type="text"
                      name="childCity"
                      value={formData.childCity}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childCity ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.childCity && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childCity}</p>}
                  </div>
                  <div id="field-childZip">
                    <label className={`block font-semibold mb-2 ${fieldErrors.childZip ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      PSČ *
                    </label>
                    <input
                      type="text"
                      name="childZip"
                      value={formData.childZip}
                      onChange={handleInputChange}
                      required
                      placeholder="napr. 81101"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childZip ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.childZip && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childZip}</p>}
                  </div>
                </div>
              </div>

              {/* Intolerancie */}
              <div className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-3">
                  Intolerancie v stravovaní *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="hasIntolerance"
                      value="ano"
                      checked={formData.hasIntolerance === "ano"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                    />
                    <span className="text-bombovo-dark">Áno, má intoleranciu / špeciálnu stravu</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="hasIntolerance"
                      value="nie"
                      checked={formData.hasIntolerance === "nie"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                    />
                    <span className="text-bombovo-dark">Nie, nemá žiadnu intoleranciu</span>
                  </label>
                </div>
                {formData.hasIntolerance === "ano" && (
                  <div id="field-intoleranceDetails" className="mt-4">
                    <label className={`block font-semibold mb-2 ${fieldErrors.intoleranceDetails ? 'text-red-600' : 'text-bombovo-dark'}`}>
                      Prosím špecifikujte špeciálnu stravu dieťaťa *
                    </label>
                    <textarea
                      name="intoleranceDetails"
                      value={formData.intoleranceDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.intoleranceDetails ? 'border-red-500' : 'border-bombovo-blue'}`}
                    />
                    {fieldErrors.intoleranceDetails && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.intoleranceDetails}</p>}
                  </div>
                )}
              </div>

              {/* Ubytovať s */}
              <div className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-2">
                  Ubytovať s (nepovinné)
                </label>
                <input
                  type="text"
                  name="roomWith"
                  value={formData.roomWith}
                  onChange={handleInputChange}
                  placeholder="Meno kamaráta/kamarátky"
                  className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                />
              </div>

              {/* Veľkosť trička */}
              <div id="field-tshirtSize" className="mb-8">
                <label className={`block font-semibold mb-2 ${fieldErrors.tshirtSize ? 'text-red-600' : 'text-bombovo-dark'}`}>
                  Vyberte veľkosť trička Bombovo *
                </label>
                <select
                  name="tshirtSize"
                  value={formData.tshirtSize}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.tshirtSize ? 'border-red-500' : 'border-bombovo-blue'}`}
                >
                  <option value="">Zvoľte veľkosť</option>
                  {tshirtSizes.length > 0
                    ? tshirtSizes.map(s => <option key={s.id} value={String(s.id)}>{s.nazev}</option>)
                    : <>
                        <option value="1">122 (7-8 rokov)</option>
                        <option value="2">136 (9-11 rokov)</option>
                        <option value="3">146 (12-14 rokov)</option>
                        <option value="4">S</option>
                        <option value="5">M</option>
                        <option value="6">L</option>
                        <option value="7">XL</option>
                      </>
                  }
                </select>
                {fieldErrors.tshirtSize && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.tshirtSize}</p>}
              </div>

              {/* Pridať druhé dieťa */}
              <div className="mb-8">
                <div className="border-2 border-dashed border-bombovo-yellow rounded-xl overflow-hidden">
                  <div className="bg-bombovo-yellow px-4 py-2 text-center">
                    <span className="text-bombovo-dark font-semibold text-sm">Voliteľné</span>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-yellow-50 transition-colors">
                    <input
                      type="checkbox"
                      name="hasSecondChild"
                      checked={formData.hasSecondChild}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow rounded"
                    />
                    <span className="text-bombovo-dark font-semibold text-lg flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Pridať 2. dieťa (súrodenec)
                    </span>
                  </label>
                </div>

                {formData.hasSecondChild && (
                  <div className="mt-6 p-6 bg-bombovo-gray rounded-xl space-y-6">
                    <h3 className="text-xl font-bold text-bombovo-dark mb-4">
                      Informácie 2. Dieťaťa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div id="field-childFirstName2">
                        <label className={`block font-semibold mb-2 ${fieldErrors.childFirstName2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                          Meno Dieťaťa *
                        </label>
                        <input
                          type="text"
                          name="childFirstName2"
                          value={formData.childFirstName2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childFirstName2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        {fieldErrors.childFirstName2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childFirstName2}</p>}
                      </div>
                      <div id="field-childLastName2">
                        <label className={`block font-semibold mb-2 ${fieldErrors.childLastName2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                          Priezvisko Dieťaťa *
                        </label>
                        <input
                          type="text"
                          name="childLastName2"
                          value={formData.childLastName2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childLastName2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        {fieldErrors.childLastName2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childLastName2}</p>}
                      </div>
                    </div>
                    <div id="field-birthDate2">
                      <label className={`block font-semibold mb-2 ${birthDate2Error || fieldErrors.birthDate2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Dátum Narodenia *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={d2Ref}
                          id="birthDate2"
                          type="text"
                          inputMode="numeric"
                          placeholder="DD"
                          maxLength={2}
                          value={bd2.d}
                          onChange={e => handleDatePart('day', e.target.value, bd2, setBd2, 'birthDate2', d2Ref, m2Ref, y2Ref)}
                          className={`w-16 px-3 py-3 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${birthDate2Error || fieldErrors.birthDate2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        <span className="text-bombovo-dark font-semibold">/</span>
                        <input
                          ref={m2Ref}
                          type="text"
                          inputMode="numeric"
                          placeholder="MM"
                          maxLength={2}
                          value={bd2.m}
                          onChange={e => handleDatePart('month', e.target.value, bd2, setBd2, 'birthDate2', d2Ref, m2Ref, y2Ref)}
                          onKeyDown={e => e.key === 'Backspace' && bd2.m === '' && d2Ref.current?.focus()}
                          className={`w-16 px-3 py-3 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${birthDate2Error || fieldErrors.birthDate2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        <span className="text-bombovo-dark font-semibold">/</span>
                        <input
                          ref={y2Ref}
                          type="text"
                          inputMode="numeric"
                          placeholder="YYYY"
                          maxLength={4}
                          value={bd2.y}
                          onChange={e => handleDatePart('year', e.target.value, bd2, setBd2, 'birthDate2', d2Ref, m2Ref, y2Ref)}
                          onKeyDown={e => e.key === 'Backspace' && bd2.y === '' && m2Ref.current?.focus()}
                          className={`w-24 px-3 py-3 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${birthDate2Error || fieldErrors.birthDate2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                      </div>
                      {fieldErrors.birthDate2 && !birthDate2Error && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{fieldErrors.birthDate2}</p>
                      )}
                      {birthDate2Error && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{birthDate2Msg ?? ageErrorMsg}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-[2fr_1fr] gap-4">
                      <div id="field-childStreet2">
                        <label className={`block font-semibold mb-2 ${fieldErrors.childStreet2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                          Ulica dieťaťa *
                        </label>
                        <input
                          type="text"
                          name="childStreet2"
                          value={formData.childStreet2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childStreet2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        {fieldErrors.childStreet2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childStreet2}</p>}
                      </div>
                      <div id="field-childStreetNumber2">
                        <label className={`block font-semibold mb-2 ${fieldErrors.childStreetNumber2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                          Číslo domu *
                        </label>
                        <input
                          type="text"
                          name="childStreetNumber2"
                          value={formData.childStreetNumber2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childStreetNumber2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        {fieldErrors.childStreetNumber2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childStreetNumber2}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div id="field-childCity2">
                        <label className={`block font-semibold mb-2 ${fieldErrors.childCity2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                          Mesto *
                        </label>
                        <input
                          type="text"
                          name="childCity2"
                          value={formData.childCity2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childCity2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        {fieldErrors.childCity2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childCity2}</p>}
                      </div>
                      <div id="field-childZip2">
                        <label className={`block font-semibold mb-2 ${fieldErrors.childZip2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                          PSČ *
                        </label>
                        <input
                          type="text"
                          name="childZip2"
                          value={formData.childZip2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          placeholder="napr. 81101"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.childZip2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                        />
                        {fieldErrors.childZip2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.childZip2}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-bombovo-dark font-semibold mb-3">
                        Intolerancie v stravovaní *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasIntolerance2"
                            value="ano"
                            checked={formData.hasIntolerance2 === "ano"}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                          />
                          <span className="text-bombovo-dark">Áno, má intoleranciu / špeciálnu stravu</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasIntolerance2"
                            value="nie"
                            checked={formData.hasIntolerance2 === "nie"}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                          />
                          <span className="text-bombovo-dark">Nie, nemá žiadnu intoleranciu</span>
                        </label>
                      </div>
                      {formData.hasIntolerance2 === "ano" && (
                        <div id="field-intoleranceDetails2" className="mt-4">
                          <label className={`block font-semibold mb-2 ${fieldErrors.intoleranceDetails2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                            Prosím špecifikujte špeciálnu stravu dieťaťa *
                          </label>
                          <textarea
                            name="intoleranceDetails2"
                            value={formData.intoleranceDetails2}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.intoleranceDetails2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                          />
                          {fieldErrors.intoleranceDetails2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.intoleranceDetails2}</p>}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-bombovo-dark font-semibold mb-2">
                        Ubytovať s (nepovinné)
                      </label>
                      <input
                        type="text"
                        name="roomWith2"
                        value={formData.roomWith2}
                        onChange={handleInputChange}
                        placeholder="Meno kamaráta/kamarátky"
                        className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                      />
                    </div>

                    <div id="field-tshirtSize2">
                      <label className={`block font-semibold mb-2 ${fieldErrors.tshirtSize2 ? 'text-red-600' : 'text-bombovo-dark'}`}>
                        Vyberte veľkosť trička Bombovo *
                      </label>
                      <select
                        name="tshirtSize2"
                        value={formData.tshirtSize2}
                        onChange={handleInputChange}
                        required={formData.hasSecondChild}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${fieldErrors.tshirtSize2 ? 'border-red-500' : 'border-bombovo-blue'}`}
                      >
                        <option value="">Zvoľte veľkosť</option>
                        {tshirtSizes.length > 0
                          ? tshirtSizes.map(s => <option key={s.id} value={String(s.id)}>{s.nazev}</option>)
                          : <>
                              <option value="1">122 (7-8 rokov)</option>
                              <option value="2">136 (9-11 rokov)</option>
                              <option value="3">146 (12-14 rokov)</option>
                              <option value="4">S</option>
                              <option value="5">M</option>
                              <option value="6">L</option>
                              <option value="7">XL</option>
                            </>
                        }
                      </select>
                      {fieldErrors.tshirtSize2 && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.tshirtSize2}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Zľavový kupón */}
              <div id="field-discountCode" className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-2">
                  Zľavový kupón (nepovinné)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="discountCode"
                    value={formData.discountCode}
                    onChange={e => {
                      handleInputChange(e);
                      if (discountStatus !== 'idle') {
                        setDiscountStatus('idle');
                        setDiscountMessage(null);
                        setAppliedDiscountParamId(null);
                        setDiscountedPriceFromCode(null);
                      }
                    }}
                    placeholder="Zadajte zľavový kód"
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow ${discountStatus === 'applied' ? 'border-green-500' : discountStatus === 'error' ? 'border-red-500' : 'border-bombovo-blue'}`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={discountStatus === 'applying' || !formData.discountCode.trim()}
                    className="px-6 py-3 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {discountStatus === 'applying' ? 'Overujem...' : 'Uplatniť'}
                  </button>
                </div>
                {discountMessage && (
                  <p className={`mt-2 text-sm font-medium ${discountStatus === 'applied' ? 'text-green-600' : 'text-red-600'}`}>
                    {discountMessage}
                  </p>
                )}
              </div>

              {/* Súhlas so zverejnením fotografií */}
              <div className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-3">
                  Súhlas so zverejnením fotografií *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="photoConsent"
                      value="ano"
                      checked={formData.photoConsent === "ano"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                    />
                    <span className="text-bombovo-dark">Áno</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="photoConsent"
                      value="nie"
                      checked={formData.photoConsent === "nie"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                    />
                    <span className="text-bombovo-dark">Nie</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Pri voľbe &ldquo;Nie&rdquo; bude dieťa nosiť červený náramok a nebude na spoločných fotkách.
                </p>
              </div>

              {/* GDPR / newsletter súhlas */}
              <div id="field-gdprConsent" className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 mt-1 text-bombovo-yellow focus:ring-bombovo-yellow rounded"
                  />
                  <span className={`font-semibold ${fieldErrors.gdprConsent ? 'text-red-600' : 'text-bombovo-dark'}`}>
                    Súhlasím so zasielaním noviniek v zmysle GDPR dokumentácie *
                  </span>
                </label>
                {fieldErrors.gdprConsent && <p className="mt-1 text-sm text-red-600 font-medium">{fieldErrors.gdprConsent}</p>}
              </div>

              {/* ECP poistenie */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="insurance"
                    checked={formData.insurance}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow rounded"
                  />
                  <span className="text-bombovo-dark font-semibold">
                    Mám záujem o komplexné cestovné poistenie ECP (4.50 €)
                  </span>
                </label>
              </div>

              {/* Platba */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-bombovo-dark mb-6">Platba</h2>
                <p className="text-bombovo-dark">
                  Zaplatím zálohu min 50 eur a zostatok doplatím najneskôr 2 týždne pred nástupom
                </p>
              </div>

              {/* Ostatné informácie */}
              <div className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-2">
                  Ostatné informácie
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tu môžete uviesť akékoľvek dodatočné informácie..."
                  className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                />
              </div>

              {/* Submit */}
              <div className="text-center space-y-4">
                {(submitError || submitErrorNode) && (
                  <div className="p-4 bg-red-50 border-2 border-red-400 rounded-xl text-red-700 font-semibold text-sm">
                    {submitErrorNode ?? submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-xl rounded-full hover:translate-y-0.5 transition-transform duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Odosielam...' : 'Odoslať rezerváciu'}
                </button>
              </div>
            </form>
          )}

          {/* Price Summary */}
          {!isSubmitted && (
            <div className="mt-8 bg-white rounded-3xl border-4 border-bombovo-yellow p-6 md:p-8">
              <h2 className="text-2xl font-bold text-bombovo-dark mb-4">Cenový prehľad</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-bombovo-dark">Cena tábora:</span>
                  <span className="text-lg font-semibold text-bombovo-dark line-through">
                    {originalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-bombovo-dark font-bold">Zľavnená cena:</span>
                  <span className="text-2xl font-bold text-bombovo-red">
                    {discountStatus === 'applied' && discountedPriceFromCode ? discountedPriceFromCode : discountedPrice}
                  </span>
                </div>
                {discountStatus === 'applied' && (
                  <div className="flex justify-between items-center text-sm text-green-600 font-semibold">
                    <span>Zľavový kód „{formData.discountCode.toUpperCase()}":</span>
                    <span>uplatnený ✓</span>
                  </div>
                )}
                {formData.insurance && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-bombovo-dark">Cestovné poistenie ECP:</span>
                    <span className="text-bombovo-dark">+ 4.50 €</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
