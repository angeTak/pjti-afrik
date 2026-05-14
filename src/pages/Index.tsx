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
import { useAdmin } from '@/context/AdminContext';
import Projets from './Projets';

const Index = () => {
  const { settings } = useAdmin();

  // Check if voting is active
  const now = new Date();
  const voteStart = settings.voteStartDate ? new Date(settings.voteStartDate) : null;
  const voteEnd = settings.voteEndDate ? new Date(settings.voteEndDate) : null;
  const voteActive = voteStart && voteEnd && now >= voteStart && now <= voteEnd;

  if (voteActive) {
    return <Projets />;
  }

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
