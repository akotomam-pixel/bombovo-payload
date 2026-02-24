import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import HomePageButtons from '@/components/HomePageButtons'
import HeroSection from '@/components/HeroSection'
import ReviewCarousel from '@/components/ReviewCarousel'
import TopCampsWithSearch from '@/components/TopCampsWithSearch'
import FourReasons from '@/components/FourReasons'
import SkolyVPrirode from '@/components/SkolyVPrirode'
import GiveawaySection from '@/components/GiveawaySection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section 0: Top Bar - Grey Background */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Section 1: Header - Sticky Navigation (stays on top throughout page) */}
      <Header />
      
      {/* Mobile Home Page Buttons - Below header, scrolls away (mobile only) */}
      <HomePageButtons />
      
      {/* Section 2: Hero Section - Grey Background */}
      <div className="bg-bombovo-gray">
        <HeroSection />
      </div>
      
      {/* DIVIDER 1: Grey → White (Yellow) */}
      <WaveDivider color="yellow" variant={1} />
      
      {/* Section 3: Review Carousel - White Background */}
      <div className="bg-white">
        <ReviewCarousel />
      </div>
      
      {/* DIVIDER 2: White → Grey (Red) */}
      <WaveDivider color="red" variant={2} />
      
      {/* Section 4: Top Camps With Search - Grey Background */}
      {/* Combined section: Best camps headline + 3 camp cards + transition text + search bar */}
      <div className="bg-bombovo-gray">
        <TopCampsWithSearch />
      </div>
      
      {/* DIVIDER 3: Grey → White (Yellow) */}
      <WaveDivider color="yellow" variant={3} />
      
      {/* Section 5: Four Reasons - White Background */}
      <div className="bg-white">
        <FourReasons />
      </div>
      
      {/* DIVIDER 4: White → Grey (Red) */}
      <WaveDivider color="red" variant={1} />
      
      {/* Section 6: Školy v Prírode - Grey Background */}
      <div className="bg-bombovo-gray">
        <SkolyVPrirode />
      </div>
      
      {/* DIVIDER 5: Grey → White (Blue) */}
      <WaveDivider color="blue" variant={2} />

      {/* Section 6.1: Giveaway Form - White Background */}
      <div className="bg-white">
        <GiveawaySection />
      </div>

      {/* DIVIDER 5.1: White → Grey (Blue) */}
      <WaveDivider color="blue" variant={1} />

      {/* Section 7: FAQ - Grey Background */}
      <div className="bg-bombovo-gray">
        <FAQ />
      </div>
      
      {/* DIVIDER 6: Grey → Dark (Red) */}
      <WaveDivider color="red" variant={3} />
      
      {/* Section 8: Footer - Dark Background */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}



