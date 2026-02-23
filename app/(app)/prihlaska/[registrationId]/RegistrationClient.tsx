"use client";

import { useState } from "react";
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
}

export default function RegistrationClient({
  campName,
  campLocation,
  dateStart,
  dateEnd,
  originalPrice,
  discountedPrice,
}: Props) {
  const [formData, setFormData] = useState({
    // Informácie zákonného zástupcu
    parentName: "",
    street: "",
    city: "",
    zip: "",
    phone: "",
    email: "",

    // Informácie dieťaťa
    childName: "",
    birthDate: "",

    // Intolerancie
    hasIntolerance: "nie",
    intoleranceDetails: "",

    // Ostatné
    roomWith: "",
    tshirtSize: "",
    discountCode: "",

    // Druhé dieťa
    hasSecondChild: false,
    childName2: "",
    birthDate2: "",
    hasIntolerance2: "nie",
    intoleranceDetails2: "",
    roomWith2: "",
    tshirtSize2: "",

    // Checkboxy
    employerContribution: false,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

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

        {/* Form Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSubmitted ? (
            <div className="bg-white rounded-3xl border-4 border-bombovo-blue p-6 md:p-8">
              <div className="text-center py-16 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark mb-6">
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
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border-4 border-bombovo-blue p-6 md:p-8"
            >
              {/* Informácie Zákonného Zástupcu */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-bombovo-dark mb-6">
                  Informácie Zákonného Zástupcu
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Meno a Priezvisko *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Ulica a číslo domu *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-bombovo-dark font-semibold mb-2">
                        Mesto *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-bombovo-dark font-semibold mb-2">
                        PSČ *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-bombovo-dark font-semibold mb-2">
                        Telefón *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
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
                        className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informácie Dieťaťa */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-bombovo-dark mb-6">
                  Informácie Dieťaťa
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Meno a Priezvisko Dieťaťa *
                    </label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Dátum Narodenia *
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                    />
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
                  <div className="mt-4">
                    <label className="block text-bombovo-dark font-semibold mb-2">
                      Prosím špecifikujte špeciálnu stravu dieťaťa
                    </label>
                    <textarea
                      name="intoleranceDetails"
                      value={formData.intoleranceDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                    />
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
              <div className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-2">
                  Vyberte veľkosť trička Bombovo *
                </label>
                <select
                  name="tshirtSize"
                  value={formData.tshirtSize}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                >
                  <option value="">Zvoľte veľkosť</option>
                  <option value="122">122 (7-8 rokov)</option>
                  <option value="136">136 (9-11 rokov)</option>
                  <option value="146">146 (12-14 rokov)</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              {/* Pridať druhé dieťa */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-dashed border-bombovo-red rounded-xl hover:bg-bombovo-gray transition-colors">
                  <input
                    type="checkbox"
                    name="hasSecondChild"
                    checked={formData.hasSecondChild}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-bombovo-red focus:ring-bombovo-red rounded"
                  />
                  <span className="text-bombovo-red font-semibold text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Pridať 2. dieťa (súrodenec)
                  </span>
                </label>

                {formData.hasSecondChild && (
                  <div className="mt-6 p-6 bg-bombovo-gray rounded-xl space-y-6">
                    <h3 className="text-xl font-bold text-bombovo-dark mb-4">
                      Informácie 2. Dieťaťa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-bombovo-dark font-semibold mb-2">
                          Meno a Priezvisko Dieťaťa *
                        </label>
                        <input
                          type="text"
                          name="childName2"
                          value={formData.childName2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                        />
                      </div>
                      <div>
                        <label className="block text-bombovo-dark font-semibold mb-2">
                          Dátum Narodenia *
                        </label>
                        <input
                          type="date"
                          name="birthDate2"
                          value={formData.birthDate2}
                          onChange={handleInputChange}
                          required={formData.hasSecondChild}
                          className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                        />
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
                        <div className="mt-4">
                          <label className="block text-bombovo-dark font-semibold mb-2">
                            Prosím špecifikujte špeciálnu stravu dieťaťa
                          </label>
                          <textarea
                            name="intoleranceDetails2"
                            value={formData.intoleranceDetails2}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                          />
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

                    <div>
                      <label className="block text-bombovo-dark font-semibold mb-2">
                        Vyberte veľkosť trička Bombovo *
                      </label>
                      <select
                        name="tshirtSize2"
                        value={formData.tshirtSize2}
                        onChange={handleInputChange}
                        required={formData.hasSecondChild}
                        className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                      >
                        <option value="">Zvoľte veľkosť</option>
                        <option value="122">122 (7-8 rokov)</option>
                        <option value="136">136 (9-11 rokov)</option>
                        <option value="146">146 (12-14 rokov)</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Zľavový kupón */}
              <div className="mb-8">
                <label className="block text-bombovo-dark font-semibold mb-2">
                  Zľavový kupón (nepovinné)
                </label>
                <input
                  type="text"
                  name="discountCode"
                  value={formData.discountCode}
                  onChange={handleInputChange}
                  placeholder="Zadajte zľavový kód"
                  className="w-full px-4 py-3 border-2 border-bombovo-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
                />
              </div>

              {/* Checkboxy */}
              <div className="mb-8 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="employerContribution"
                    checked={formData.employerContribution}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-1 text-bombovo-yellow focus:ring-bombovo-yellow rounded"
                  />
                  <div>
                    <span className="text-bombovo-dark font-semibold">
                      Mám záujem využiť príspevok na rekreáciu od zamestnávateľa
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Faktúra Vám bude zaslaná po realizácii tábora.
                    </p>
                  </div>
                </label>
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow rounded"
                  />
                  <span className="text-bombovo-dark font-semibold">
                    Súhlasím so zasielaním noviniek
                  </span>
                </label>
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

              {/* GDPR */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 mt-1 text-bombovo-yellow focus:ring-bombovo-yellow rounded"
                  />
                  <span className="text-bombovo-dark font-semibold">
                    Súhlasím so spracovaním osobných údajov a so všetkými podmienkami platnými na rok 2026 *
                  </span>
                </label>
              </div>

              {/* Platba */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-bombovo-dark mb-6">Platba</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="zaloha"
                      checked={formData.paymentMethod === "zaloha"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                    />
                    <span className="text-bombovo-dark">
                      Zaplatím zálohu 50 eur a zostatok doplatím najneskôr 2 týždne pred nástupom
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="naraz"
                      checked={formData.paymentMethod === "naraz"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-bombovo-yellow focus:ring-bombovo-yellow"
                    />
                    <span className="text-bombovo-dark">Zaplatím celú sumu tábora</span>
                  </label>
                </div>
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
              <div className="text-center">
                <button
                  type="submit"
                  className="px-12 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-xl rounded-full hover:translate-y-0.5 transition-transform duration-150"
                >
                  Odoslať rezerváciu
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
                  <span className="text-2xl font-bold text-bombovo-red">{discountedPrice}</span>
                </div>
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
