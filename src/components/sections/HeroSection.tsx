import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Terminal, Cpu, BookOpen } from 'lucide-react';
import heroChildren from '@/assets/hero-children.png';
import heroIllustration from '@/assets/hero-illustration.jpg';
import heroChild from '@/assets/hero-child.png';
import SeparatorPattern from '@/components/ui/SeparatorPattern';
import { useAdmin } from '@/context/AdminContext';

const TypewriterText = ({ text, delay = 50, startDelay = 0, showDot = false }: { text: string, delay?: number, startDelay?: number, showDot?: boolean }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      const timeout = setTimeout(() => setHasStarted(true), startDelay);
      return () => clearTimeout(timeout);
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay, startDelay, hasStarted]);

  return (
    <>
      {displayedText}
      {showDot && (
        <span className="animate-pulse inline-block text-purple-400 font-black ml-1">.</span>
      )}
    </>
  );
};

const HeroSection = () => {
  const { settings } = useAdmin();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-24 pb-8 sm:pt-32 sm:pb-14 lg:pt-[65px] lg:pb-[33px] overflow-hidden min-h-screen lg:min-h-[70vh] flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Dynamic background with mouse-follow effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs that follow mouse slightly */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-25 transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
            right: `${-mousePosition.x * 0.02}px`,
            bottom: `${-mousePosition.y * 0.02}px`,
            filter: 'blur(80px)',
          }}
        />

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float delay-200 opacity-50" />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-pink-400 rounded-full animate-float delay-300 opacity-70" />
        <div className="absolute bottom-20 right-32 w-4 h-4 bg-indigo-400 rounded-full animate-float delay-500 opacity-40" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-float delay-700 opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-violet-400 rounded-full animate-float delay-1000 opacity-50" />
      </div>

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 flex flex-col lg:grid lg:grid-cols-2 gap-0 sm:gap-6 lg:gap-16 items-center">

        {/* Mobile Title */}
        <div className="w-full lg:hidden text-center sm:text-left -mb-4 min-h-[140px]">
          <h1 className="leading-[1.1] tracking-tight">
            <span className="block text-4xl sm:text-5xl font-black uppercase text-white drop-shadow-2xl min-h-[48px] sm:min-h-[64px]">
              <TypewriterText text="Vacance challenge" delay={70} startDelay={300} />
            </span>
            <span className="block text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl animate-gradient mt-2 min-h-[28px] sm:min-h-[32px]">
              <TypewriterText text="Formation + challenge" delay={40} startDelay={1200} />
            </span>
            <span className="block text-3xl sm:text-4xl font-extrabold text-purple-300 drop-shadow-2xl mt-1 min-h-[40px] sm:min-h-[48px] uppercase tracking-wide">
              <TypewriterText text="Informatique" delay={60} startDelay={2300} showDot={true} />
            </span>
          </h1>
        </div>

        {/* Banner design - Right side (Image before text on mobile) */}
        <div className="reveal opacity-0 delay-100 relative w-full lg:col-start-2 lg:row-start-1 flex justify-center lg:justify-end">
          <div className="relative flex justify-center lg:justify-end items-center h-[380px] sm:h-[460px] lg:h-[610px]">
            {/* Main hero image */}
            <div className="relative group">
              {/* Background glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/20 rounded-3xl blur-2xl animate-pulse-slow" />

              {/* Image container */}
              <div className="relative w-[370px] max-w-[90vw] h-[280px] sm:w-[540px] sm:h-[360px] lg:w-[760px] lg:h-[490px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30">
                <img
                  src={heroChildren}
                  alt="Enfants apprenant la programmation ensemble"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'contrast(1.1) saturate(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating tech elements */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>

              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg animate-float delay-200">
                <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>

              <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 px-4 h-9 sm:h-10 bg-white border border-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl animate-float delay-400">
                <span className="text-purple-600 font-black text-sm whitespace-nowrap">{settings.ageRange} ans</span>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-10 left-10 w-8 h-8 bg-purple-400/30 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-10 right-10 w-6 h-6 bg-purple-400/30 rounded-full blur-md animate-pulse delay-300" />
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-pink-400/40 rounded-full blur-sm animate-pulse delay-600" />
          </div>
        </div>

        {/* Text content - Left side */}
        <div className="space-y-2 sm:space-y-8 w-full lg:col-start-1 lg:row-start-1 text-center sm:text-left -mt-4">
          {/* Desktop Title */}
          <div className="hidden lg:block space-y-2 min-h-[220px]">
            <h1 className="leading-[1.1] tracking-tight">
              <span className="block md:text-5xl lg:text-6xl font-black uppercase text-white drop-shadow-2xl min-h-[64px] lg:min-h-[80px]">
                <TypewriterText text="Vacance challenge" delay={70} startDelay={300} />
              </span>
              <span className="block md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient mt-3 min-h-[40px] lg:min-h-[48px]">
                <TypewriterText text="Formation + challenge" delay={40} startDelay={1200} />
              </span>
              <span className="block md:text-4xl lg:text-5xl font-extrabold text-purple-300 drop-shadow-2xl mt-2 min-h-[48px] lg:min-h-[64px] uppercase tracking-wide">
                <TypewriterText text="Informatique" delay={60} startDelay={2300} showDot={true} />
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="reveal opacity-0 delay-300 text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed mx-auto sm:mx-0">
            Rejoignez le Prix du Jeune Talent Informatique en pjti-Afrik. Un programme de {settings.durationWeeks} semaines pour passer de consommateur à acteur du digital grâce à la programmation, l'IA et la cybersécurité.
          </p>

          {/* CTA Buttons */}
          <div className="reveal opacity-0 delay-500 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
            <a
              href="/inscription"
              className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="/formation"
              className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              Voir les cours
            </a>
          </div>
        </div>
      </div>

      {/* Pattern separator */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <SeparatorPattern />
      </div>
    </section>
  );
};

export default HeroSection;
