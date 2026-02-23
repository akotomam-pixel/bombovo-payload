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
    vedúciPobytu: "",
    nazovSkoly: "",
    adresa: "",
    psc: "",
    mesto: "",
    telefon: "",
    email: "",
    stredisko: strediskoName,
    alternativneStredisko: "",
    animacnyProgram: "S animačným programom",
    bombovyBalicek: "Áno",
    pocetPedagogov: "",
    vekZiakov: "MŠ",
    pocetZiakov: "",
    zdravotnik: "Vlastný zdravotník",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dátum príchodu */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Dátum príchodu *
                  </label>
                  <input
                    type="text"
                    name="datumPrichodu"
                    value={formData.datumPrichodu}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    placeholder="DD.MM.RRRR"
                  />
                </div>

                {/* Meno vedúceho + Názov školy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Meno, priezvisko, titul vedúcej pobytu *
                    </label>
                    <input
                      type="text"
                      name="vedúciPobytu"
                      value={formData.vedúciPobytu}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                    />
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
                    required
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
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
                    required
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

                {/* Počet pedagógov */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Počet pedagógov *
                  </label>
                  <input
                    type="number"
                    name="pocetPedagogov"
                    value={formData.pocetPedagogov}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  />
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
                    required
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  >
                    <option value="MŠ">MŠ</option>
                    <option value="1. stupeň ZŠ">1. stupeň ZŠ</option>
                    <option value="2. stupeň ZŠ">2. stupeň ZŠ</option>
                  </select>
                </div>

                {/* Počet žiakov */}
                <div>
                  <label className="block text-bombovo-dark font-semibold mb-2">
                    Počet žiakov/študentov *
                  </label>
                  <input
                    type="number"
                    name="pocetZiakov"
                    value={formData.pocetZiakov}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  />
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
                    required
                    className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:border-bombovo-red"
                  >
                    <option value="Vlastný zdravotník">Vlastný zdravotník</option>
                    <option value="Zdravotník z CK">Zdravotník z CK</option>
                  </select>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200"
                  >
                    Odoslať prihlášku
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
