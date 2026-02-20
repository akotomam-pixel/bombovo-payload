'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPreSkolyDropdownOpen, setIsPreSkolyDropdownOpen] = useState(false)
  const [isPreSkolyMobileOpen, setIsPreSkolyMobileOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  const openMenu = () => setIsMobileMenuOpen(true)
  const closeMenu = () => {
    setIsMobileMenuOpen(false)
    setIsPreSkolyMobileOpen(false)
  }

  const togglePreSkolyDropdown = () => setIsPreSkolyDropdownOpen(!isPreSkolyDropdownOpen)
  const togglePreSkolyMobile = () => setIsPreSkolyMobileOpen(!isPreSkolyMobileOpen)

  return (
    <>
      {/* DESKTOP NAVIGATION (768px and above) - REDESIGNED */}
      <header className="hidden md:block border-b border-bombovo-gray sticky top-0 z-50 bg-bombovo-gray">
        {/* Upper line: Social media */}
        <div className="py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-bombovo-dark font-medium">Nájdeš nás:</span>
                <a 
                  href="https://www.facebook.com/Bombovo.sk/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bombovo-blue hover:text-bombovo-red transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/bombovo/?hl=en" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bombovo-blue hover:text-bombovo-red transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4" style={{ paddingBottom: '10px' }}>
              {/* Logo and navigation links */}
              <div className="flex items-center gap-8 flex-wrap justify-center lg:justify-start">
                {/* Logo */}
                <Link href="/" className="lg:-ml-8">
                  <div 
                    className="w-[101px] h-[101px] overflow-hidden flex items-center justify-center"
                  >
                    <Image
                      src="/images/hat1.jpg"
                      alt="Bombovo Logo"
                      width={101}
                      height={101}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>

                {/* Navigation links with hand-drawn underlines */}
                <nav className="flex items-center gap-6 flex-wrap justify-center">
                  {/* Letné tábory - Yellow underline */}
                  <Link 
                    href="/letne-tabory" 
                    className="relative inline-flex flex-col items-center text-bombovo-dark font-medium text-[1.2rem] group"
                  >
                    <span>Letné tábory</span>
                    <svg 
                      className="absolute -bottom-1 left-0 w-full" 
                      height="8" 
                      viewBox="0 0 120 8" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M 0,4 Q 30,2 60,4 T 120,4" 
                        stroke="#FDCA40" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Link>

                  {/* Pre školy - Red underline with Dropdown */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsPreSkolyDropdownOpen(true)}
                    onMouseLeave={() => setIsPreSkolyDropdownOpen(false)}
                  >
                    <button 
                      onClick={togglePreSkolyDropdown}
                      className="relative inline-flex flex-col items-center text-bombovo-dark font-medium text-[1.2rem] group cursor-pointer bg-transparent border-none"
                    >
                      <span className="flex items-center gap-1">
                        Pre školy
                        <svg 
                          className={`w-3 h-3 transition-transform duration-200 ${isPreSkolyDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                      <svg 
                        className="absolute -bottom-1 left-0 w-full" 
                        height="8" 
                        viewBox="0 0 100 8" 
                        preserveAspectRatio="none"
                      >
                        <path 
                          d="M 0,5 Q 25,3 50,5 T 100,5" 
                          stroke="#DF2935" 
                          strokeWidth="2.5" 
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isPreSkolyDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-50 min-w-[220px]"
                        >
                          <Link 
                            href="/skoly-v-prirode"
                            className="relative block px-5 py-3 text-bombovo-dark hover:bg-bombovo-gray transition-colors text-sm font-medium group"
                          >
                            <span className="relative inline-block">
                              Školy v prírode
                              <svg 
                                className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                height="6" 
                                viewBox="0 0 140 6" 
                                preserveAspectRatio="none"
                              >
                                <path 
                                  d="M 0,3 Q 35,2 70,3 T 140,3" 
                                  stroke="#DF2935" 
                                  strokeWidth="2" 
                                  fill="none"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          </Link>
                          <Link 
                            href="/skolske-vylety"
                            className="relative block px-5 py-3 text-bombovo-dark hover:bg-bombovo-gray transition-colors text-sm font-medium group"
                          >
                            <span className="relative inline-block">
                              Školské výlety
                              <svg 
                                className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                height="6" 
                                viewBox="0 0 130 6" 
                                preserveAspectRatio="none"
                              >
                                <path 
                                  d="M 0,3 Q 32.5,2 65,3 T 130,3" 
                                  stroke="#DF2935" 
                                  strokeWidth="2" 
                                  fill="none"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          </Link>
                          <Link 
                            href="/adaptacne-kurzy"
                            className="relative block px-5 py-3 text-bombovo-dark hover:bg-bombovo-gray transition-colors text-sm font-medium group"
                          >
                            <span className="relative inline-block">
                              Adaptačné kurzy
                              <svg 
                                className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                height="6" 
                                viewBox="0 0 140 6" 
                                preserveAspectRatio="none"
                              >
                                <path 
                                  d="M 0,3 Q 35,2 70,3 T 140,3" 
                                  stroke="#DF2935" 
                                  strokeWidth="2" 
                                  fill="none"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Naša Misia - Blue underline */}
                  <Link 
                    href="/nasa-misia" 
                    className="relative inline-flex flex-col items-center text-bombovo-dark font-medium text-[1.2rem] group"
                  >
                    <span>Naša Misia</span>
                    <svg 
                      className="absolute -bottom-1 left-0 w-full" 
                      height="8" 
                      viewBox="0 0 110 8" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M 0,3 Q 27.5,5 55,3 T 110,3" 
                        stroke="#3772FF" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Link>
                </nav>
              </div>

              {/* Right menu items */}
              <nav className="flex items-center gap-4 flex-wrap justify-center">
                <Link 
                  href="/faq" 
                  className="relative inline-flex flex-col items-center text-bombovo-dark font-normal text-base group"
                >
                  <span>Otázky</span>
                  <svg 
                    className="absolute -bottom-1 left-0 w-full" 
                    height="8" 
                    viewBox="0 0 80 8" 
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M 0,4 Q 20,2 40,4 T 80,4" 
                      stroke="#080708" 
                      strokeWidth="1.5" 
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <Link 
                  href="/pripravujeme" 
                  className="relative inline-flex flex-col items-center text-bombovo-dark font-normal text-base group"
                >
                  <span>Pridaj sa do tímu</span>
                  <svg 
                    className="absolute -bottom-1 left-0 w-full" 
                    height="8" 
                    viewBox="0 0 150 8" 
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M 0,5 Q 37.5,3 75,5 T 150,5" 
                      stroke="#080708" 
                      strokeWidth="1.5" 
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <Link 
                  href="/kontakt" 
                  className="px-8 py-4 bg-transparent border-2 border-[#080708] text-[#080708] font-semibold rounded-full text-base hover:bg-bombovo-gray transition-all duration-200"
                >
                  Kontaktujte nás
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION (Below 768px) - Updated Menu */}
      <header className="md:hidden sticky top-0 z-50 bg-bombovo-gray border-b border-bombovo-gray">
        <div className="flex justify-between items-center px-5 py-3 h-[60px]">
          {/* Logo - Left Side */}
          <Link href="/" onClick={closeMenu}>
            <div className="w-[45px] h-[45px] overflow-hidden flex items-center justify-center">
              <Image
                src="/images/hat1.jpg"
                alt="Bombovo Logo"
                width={45}
                height={45}
                className="object-cover w-full h-full"
              />
            </div>
          </Link>

          {/* Hamburger Icon - Right Side */}
          <button
            onClick={openMenu}
            className="text-bombovo-dark focus:outline-none"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg 
              className="w-9 h-9" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] bg-white md:hidden"
            role="navigation"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col h-full">
              {/* Top Section: Logo and Close Button */}
              <div className="flex justify-between items-center px-5 py-3 h-[60px]">
                {/* Logo - Left Side */}
                <Link href="/" onClick={closeMenu}>
                  <div className="w-[45px] h-[45px] overflow-hidden flex items-center justify-center">
                    <Image
                      src="/images/hat1.jpg"
                      alt="Bombovo Logo"
                      width={45}
                      height={45}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>

                {/* Close (X) Button - Right Side */}
                <button
                  onClick={closeMenu}
                  className="text-bombovo-dark focus:outline-none"
                  aria-label="Close menu"
                >
                  <svg 
                    className="w-9 h-9" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Navigation Links */}
                <nav className="py-6">
                  <Link 
                    href="/letne-tabory"
                    onClick={closeMenu}
                    className="block px-6 py-4 text-lg font-semibold text-bombovo-dark hover:bg-bombovo-gray transition-colors"
                  >
                    Letné tábory
                  </Link>
                  <div>
                    <button
                      onClick={togglePreSkolyMobile}
                      className="w-full flex items-center justify-between px-6 py-4 text-lg font-semibold text-bombovo-dark hover:bg-bombovo-gray transition-colors"
                    >
                      <span>Pre školy</span>
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${isPreSkolyMobileOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isPreSkolyMobileOpen && (
                      <div className="bg-bombovo-gray border-l-4 border-bombovo-red ml-6">
                        <Link 
                          href="/skoly-v-prirode"
                          onClick={closeMenu}
                          className="relative block px-6 py-3 text-base font-medium text-bombovo-dark hover:bg-white transition-colors group"
                        >
                          <span className="relative inline-block">
                            Školy v prírode
                            <svg 
                              className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                              height="6" 
                              viewBox="0 0 140 6" 
                              preserveAspectRatio="none"
                            >
                              <path 
                                d="M 0,3 Q 35,2 70,3 T 140,3" 
                                stroke="#DF2935" 
                                strokeWidth="2" 
                                fill="none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        </Link>
                        <Link 
                          href="/skolske-vylety"
                          onClick={closeMenu}
                          className="relative block px-6 py-3 text-base font-medium text-bombovo-dark hover:bg-white transition-colors group"
                        >
                          <span className="relative inline-block">
                            Školské výlety
                            <svg 
                              className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                              height="6" 
                              viewBox="0 0 130 6" 
                              preserveAspectRatio="none"
                            >
                              <path 
                                d="M 0,3 Q 32.5,2 65,3 T 130,3" 
                                stroke="#DF2935" 
                                strokeWidth="2" 
                                fill="none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        </Link>
                        <Link 
                          href="/adaptacne-kurzy"
                          onClick={closeMenu}
                          className="relative block px-6 py-3 text-base font-medium text-bombovo-dark hover:bg-white transition-colors group"
                        >
                          <span className="relative inline-block">
                            Adaptačné kurzy
                            <svg 
                              className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                              height="6" 
                              viewBox="0 0 140 6" 
                              preserveAspectRatio="none"
                            >
                              <path 
                                d="M 0,3 Q 35,2 70,3 T 140,3" 
                                stroke="#DF2935" 
                                strokeWidth="2" 
                                fill="none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link 
                    href="/nasa-misia"
                    onClick={closeMenu}
                    className="block px-6 py-4 text-lg font-semibold text-bombovo-dark hover:bg-bombovo-gray transition-colors"
                  >
                    Naša Misia
                  </Link>
                  <Link 
                    href="/faq"
                    onClick={closeMenu}
                    className="block px-6 py-4 text-lg font-semibold text-bombovo-dark hover:bg-bombovo-gray transition-colors"
                  >
                    Otázky
                  </Link>
                  <Link 
                    href="/pripravujeme"
                    onClick={closeMenu}
                    className="block px-6 py-4 text-lg font-semibold text-bombovo-dark hover:bg-bombovo-gray transition-colors"
                  >
                    Pridaj sa do tímu
                  </Link>
                </nav>

                {/* Social Media Section */}
                <div className="px-6 py-6">
                  <p className="text-bombovo-dark font-medium text-base mb-4">Nájdeš nás:</p>
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://www.facebook.com/Bombovo.sk/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-bombovo-blue flex items-center justify-center text-white hover:bg-bombovo-red transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebook size={24} />
                    </a>
                    <a 
                      href="https://www.instagram.com/bombovo/?hl=en" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-bombovo-blue flex items-center justify-center text-white hover:bg-bombovo-red transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Button - Fixed at Bottom */}
              <div className="px-6 py-6 bg-white">
                <Link 
                  href="/kontakt"
                  onClick={closeMenu}
                  className="block w-full px-6 py-4 bg-transparent border-2 border-bombovo-dark text-bombovo-dark font-bold rounded-full text-center text-base hover:bg-bombovo-gray transition-all duration-200"
                >
                  Kontaktujte nás
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
