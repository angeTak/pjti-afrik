import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import logoUrl from '@/assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 sm:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoUrl} 
                alt="pjti-Afrik Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain brightness-0 invert" 
              />
              <span className="font-black font-display text-xl sm:text-2xl text-white leading-none">
                PJTI-<span className="text-accent">AFRIK</span>
              </span>
            </div>
            <p className="text-sm sm:text-base text-background/70 mb-6 max-w-md">
              Former les créateurs du futur dès aujourd'hui. Programme de formation 
              en informatique, IA et métiers du numérique pour enfants au Togo.
            </p>
            {/* Social links */}
            <div className="flex gap-3 sm:gap-4">
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-3">
              <li>
                <a href="#programme" className="text-background/70 hover:text-background transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors">
                  Structure du programme
                </a>
              </li>
              <li>
                <a href="#inscription" className="text-background/70 hover:text-background transition-colors">
                  Inscription
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors">
                  Partenaires
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <MapPin className="w-4 h-4 text-accent" />
                Lomé, Togo
              </li>
              <li>
                <a 
                  href="tel:+22893372905" 
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  +228 93 37 29 05
                </a>
              </li>
              <li>
                <a 
                  href="mailto:agcomelite@gmail.com" 
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4 text-accent" />
                  agcomelite@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container py-5 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-background/60 text-sm text-center md:text-left">
            © {currentYear} Programme Vacances Numérique. Tous droits réservés.
          </p>
          <div className="flex gap-4 sm:gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              Mentions légales
            </a>
            <a href="/admin/login" className="text-background/60 hover:text-background transition-colors flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-background/30"></span>
              Espace Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
