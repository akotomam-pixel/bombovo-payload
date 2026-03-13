"use client";

import { useState } from "react";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface StrediskoOption {
  id: string;
  name: string;
}

interface Props {
  strediskoId: string;
  strediskoName: string;
  initialDate: string;
  allStrediskaOptions: StrediskoOption[];
}

export default function RegistrationSVPClient({
  strediskoId,
  strediskoName,
  initialDate,
  allStrediskaOptions,
}: Props) {
  const [formData, setFormData] = useState({
    datumPrichodu: initialDate,
    datumOdchodu: "",
    veduciPobytu: "",
    nazovSkoly: "",
    adresa: "",
    psc: "",
    mesto: "",
    telefon: "",
    email: "",
    stredisko: strediskoName,
    alternativneStredisko: "",
    vekZiakov: "MŠ",
    pocetZiakov: "",
    pocetPedagogov: "",
    zdravotnik: "Vlastný zdravotník",
    animacnyProgram: "S animačným programom",
    bombovyBalicek: "Áno",
    poznamka: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const requiredFields: (keyof typeof formData)[] = [
    'datumPrichodu', 'veduciPobytu', 'nazovSkoly', 'adresa', 'psc', 'mesto',
    'telefon', 'email', 'alternativneStredisko', 'pocetZiakov', 'pocetPedagogov',
  ];

  const isFieldError = (field: keyof typeof formData) =>
    showErrors && requiredFields.includes(field) && !formData[field];

  const fieldClass = (field: keyof typeof formData) =>
    `w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-bombovo-red ${
      isFieldError(field) ? 'border-red-500' : 'border-bombovo-blue'
    }`;

  const selectClass = (field: keyof typeof formData) =>
    `w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-bombovo-red ${
      isFieldError(field) ? 'border-red-500' : 'border-bombovo-blue'
    }`;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const hasErrors = requiredFields.some((f) => !formData[f]);
    if (hasErrors) {
      setShowErrors(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact-svp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSubmitError(data.error ?? 'Nastala chyba. Skúste to prosím znova.');
        return;
      }
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'prihlaska_svp_submitted' });
        }
      }, 100);
    } catch {
      setSubmitError('Nastala chyba. Skúste to prosím znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bombovo-gray">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <div className="bg-bombovo-gray py-12 md:py-16">
        {/* Header */}
        <div className="w-full text-center mb-8">
          <div className="inline-flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image
                src="/images/reservation-icon.png"
                alt="Reservation Icon"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark whitespace-nowrap relative inline-block">
              Formulár na cenovú ponuku -{" "}
              <span className="text-bombovo-red">{strediskoName}</span>
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ height: "12px" }}
              >
                <path
                  d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                  stroke="#FDCA40"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                  stroke="#FDCA40"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </h1>
          </div>
        </div>

        {/* Form container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-bombovo-blue rounded-3xl p-6 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark mb-6">
                  Ďakujeme za váš záujem!
                </h2>
                <p className="text-lg md:text-xl text-bombovo-dark leading-relaxed">
                  Vaša cenová ponuka je na ceste nášmu tímu a ten sa vám ozve v
                  priebehu niekoľkých dní.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Dátum príchodu + Dátum odchodu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Dátum príchodu *
                    </label>
                    <input
                      type="text"
                      name="datumPrichodu"
                      value={formData.datumPrichodu}
                      onChange={handleInputChange}
                      className={fieldClass('datumPrichodu')}
                      placeholder="DD.MM.RRRR"
                    />
                    {isFieldError('datumPrichodu') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Dátum odchodu
                    </label>
                    <input
                      type="text"
                      name="datumOdchodu"
                      value={formData.datumOdchodu}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                      placeholder="DD.MM.RRRR"
                    />
                  </div>
                </div>

                {/* Meno vedúceho + Názov školy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Meno, priezvisko, titul vedúcej pobytu *
                    </label>
                    <input
                      type="text"
                      name="veduciPobytu"
                      value={formData.veduciPobytu}
                      onChange={handleInputChange}
                      className={fieldClass('veduciPobytu')}
                    />
                    {isFieldError('veduciPobytu') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Názov školy / organizácie *
                    </label>
                    <input
                      type="text"
                      name="nazovSkoly"
                      value={formData.nazovSkoly}
                      onChange={handleInputChange}
                      className={fieldClass('nazovSkoly')}
                    />
                    {isFieldError('nazovSkoly') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                </div>

                {/* Adresa + PSČ + Mesto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Adresa *
                    </label>
                    <input
                      type="text"
                      name="adresa"
                      value={formData.adresa}
                      onChange={handleInputChange}
                      className={fieldClass('adresa')}
                    />
                    {isFieldError('adresa') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      PSČ *
                    </label>
                    <input
                      type="text"
                      name="psc"
                      value={formData.psc}
                      onChange={handleInputChange}
                      className={fieldClass('psc')}
                    />
                    {isFieldError('psc') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Mesto *
                    </label>
                    <input
                      type="text"
                      name="mesto"
                      value={formData.mesto}
                      onChange={handleInputChange}
                      className={fieldClass('mesto')}
                    />
                    {isFieldError('mesto') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                </div>

                {/* Telefón + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Telefón *
                    </label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleInputChange}
                      className={fieldClass('telefon')}
                    />
                    {isFieldError('telefon') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={fieldClass('email')}
                    />
                    {isFieldError('email') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                </div>

                {/* Stredisko (read-only) */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Škola v prírode/stredisko *
                  </label>
                  <input
                    type="text"
                    name="stredisko"
                    value={formData.stredisko}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Alternatívne stredisko */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Alternatívne stredisko *
                  </label>
                  <select
                    name="alternativneStredisko"
                    value={formData.alternativneStredisko}
                    onChange={handleInputChange}
                    className={selectClass('alternativneStredisko')}
                  >
                    <option value="">Vyberte alternatívne stredisko</option>
                    {allStrediskaOptions
                      .filter((s) => s.id !== strediskoId)
                      .map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                  {isFieldError('alternativneStredisko') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                </div>

                {/* Vek žiakov */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Vek žiakov/študentov *
                  </label>
                  <select
                    name="vekZiakov"
                    value={formData.vekZiakov}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  >
                    <option value="MŠ">MŠ</option>
                    <option value="1. stupeň ZŠ">1. stupeň ZŠ</option>
                    <option value="2. stupeň ZŠ">2. stupeň ZŠ</option>
                  </select>
                </div>

                {/* Počet žiakov + Počet pedagógov */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Počet žiakov/študentov *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="pocetZiakov"
                      value={formData.pocetZiakov}
                      onChange={handleInputChange}
                      className={fieldClass('pocetZiakov')}
                    />
                    {isFieldError('pocetZiakov') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Počet pedagógov *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="pocetPedagogov"
                      value={formData.pocetPedagogov}
                      onChange={handleInputChange}
                      className={fieldClass('pocetPedagogov')}
                    />
                    {isFieldError('pocetPedagogov') && <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>}
                  </div>
                </div>

                {/* Zdravotník */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Zdravotník *
                  </label>
                  <select
                    name="zdravotnik"
                    value={formData.zdravotnik}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  >
                    <option value="Vlastný zdravotník">Vlastný zdravotník</option>
                    <option value="Zdravotník z CK">Zdravotník z CK</option>
                  </select>
                </div>

                {/* Animačný program */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Animačný program *
                  </label>
                  <select
                    name="animacnyProgram"
                    value={formData.animacnyProgram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  >
                    <option value="S animačným programom">S animačným programom</option>
                    <option value="Bez animačného programu">Bez animačného programu</option>
                  </select>
                </div>

                {/* Bombový balíček */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Bombový balíček
                  </label>
                  <select
                    name="bombovyBalicek"
                    value={formData.bombovyBalicek}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  >
                    <option value="Áno">Áno</option>
                    <option value="Nie">Nie</option>
                  </select>
                </div>

                {/* Poznámka */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Poznámka
                  </label>
                  <textarea
                    name="poznamka"
                    value={formData.poznamka}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red resize-none"
                    placeholder="Napíšte prípadné poznámky alebo špeciálne požiadavky..."
                  />
                </div>

                {/* Submit */}
                <div className="pt-6">
                  {showErrors && requiredFields.some((f) => !formData[f]) && (
                    <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl">
                      <p className="text-sm text-red-600 font-semibold">Prosím vyplňte všetky povinné polia označené červenou farbou.</p>
                    </div>
                  )}
                  {submitError && (
                    <div className="mb-4 p-4 bg-red-50 border-2 border-bombovo-red rounded-xl">
                      <p className="text-sm text-bombovo-red">{submitError}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? 'Odosiela sa...' : 'Odoslať prihlášku'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
