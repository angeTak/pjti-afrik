import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const navLinks = [
  { label: 'Programme', href: '/programme' },
  { label: 'Formation', href: '/formation' },
  { label: 'Vote de projet', href: '/projets' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Partenaires', href: '/partenaires' },
  { label: 'Actualités & Galerie', href: '/actualites' },
];

const Header = () => {
  const { settings } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const now = new Date();
  const voteStart = settings.voteStartDate ? new Date(settings.voteStartDate) : null;
  const voteEnd = settings.voteEndDate ? new Date(settings.voteEndDate) : null;
  const voteActive = voteStart && voteEnd && now >= voteStart && now <= voteEnd;

  const filteredLinks = navLinks.filter(link => {
    if (link.href === '/projets') return voteActive;
    return true;
  });

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white py-3 sm:py-4 shadow-lg"
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <img 
            src="/src/assets/logo.png" 
            alt="PJTI-AFRIK Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-110 transition-transform duration-300" 
          />
          <span className="font-black font-display text-base sm:text-lg text-slate-900 leading-none">
            PJTI-<span className="text-purple-600">AFRIK</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {filteredLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a 
            href="/inscription" 
            className="inline-flex items-center gap-2 px-4 py-2 lg:px-5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:scale-105 hover:bg-purple-700 transition-all shadow-md"
          >
            S'inscrire
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 border border-gray-200"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {filteredLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 font-medium py-2.5 hover:text-purple-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a 
              href="/inscription"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:scale-105 hover:bg-purple-700 transition-all shadow-md w-full mt-2"
            >
              S'inscrire
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
