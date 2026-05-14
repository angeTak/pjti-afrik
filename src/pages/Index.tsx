import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import NewsCarouselSection from '@/components/sections/NewsCarouselSection';
import AboutSection from '@/components/sections/AboutSection';
import WhySection from '@/components/sections/WhySection';
import ChallengeSection from '@/components/sections/ChallengeSection';
import PricingSection from '@/components/sections/PricingSection';
import PartnersSection from '@/components/sections/PartnersSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <NewsCarouselSection />
        <WhySection />
        <ChallengeSection />
        <PricingSection />
        <PartnersSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
