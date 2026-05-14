import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RegistrationSection from '@/components/sections/RegistrationSection';

const Inscription = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Inscription;
