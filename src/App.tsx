import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award, Crown, X, Link2, Volume2, VolumeX, Settings } from 'lucide-react';
import { LinksModal } from './components/LinksModal';
import { AdminPage } from './components/AdminPage';

const NAV_LINKS = ['YouTube', 'Tutorials', 'Tools', 'Links', 'Contact'];

export function App() {
  const [view, setView] = useState<'public' | 'admin'>(() => {
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      return 'admin';
    }
    return 'public';
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hash listener for #admin URL support
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
        setView('admin');
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Ensure continuous background video playback on mount
  useEffect(() => {
    if (videoRef.current && view === 'public') {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay started:', err);
      });
    }
  }, [view]);

  const toggleSound = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted === false) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleNavClick = (link: string) => {
    const lower = link.toLowerCase();
    if (lower === 'links') {
      setLinksOpen(true);
    } else if (lower === 'youtube' || lower === 'tutorials') {
      window.open('https://www.youtube.com/@MadeByParv', '_blank');
    } else if (lower === 'tools') {
      setLinksOpen(true);
    } else if (lower === 'contact') {
      setLinksOpen(true);
    }
  };

  if (view === 'admin') {
    return (
      <AdminPage
        onBackToSite={() => {
          setView('public');
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white font-inter">
      {/* ── Fullscreen Background Video (Always Looping, No Controls, Audio Supported) ── */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover lg:scale-[1.1] pointer-events-none select-none"
        src="/hero-video.mp4"
      />

      {/* ── Dark gradient overlays for text readability ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

      {/* ── Content Layer ── */}
      <div className="relative z-10 flex h-full flex-col px-6 sm:px-10 lg:px-16">

        {/* ── NAVBAR ── */}
        <nav className="flex items-center justify-between py-5 lg:py-7">
          {/* Left: Logo monogram + brand name */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-monogram.png"
              alt="MadeByParv Logo"
              className="h-12 sm:h-14 w-auto object-contain shrink-0"
            />
            <span className="font-podium text-2xl sm:text-3xl font-bold uppercase tracking-wider">
              MadeByParv
            </span>
          </div>

          {/* Center: Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className="font-inter text-sm text-white/80 tracking-widest uppercase hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right: Sound Control + Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Audio Sound Toggle */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 border border-white/30 hover:border-white/60 p-3 rounded-full text-xs tracking-widest uppercase hover:bg-white/10 transition-all cursor-pointer text-white"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#00F0FF] animate-pulse" />
              )}
            </button>

            {/* Featured Links CTA */}
            <button
              onClick={() => setLinksOpen(true)}
              className="flex items-center gap-2 border border-white/30 hover:border-white/60 px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/10 transition-all cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>FEATURED LINKS</span>
            </button>

            {/* Hidden Admin Access Gear Icon */}
            <button
              onClick={() => {
                setView('admin');
                window.location.hash = 'admin';
              }}
              className="p-3 text-white/30 hover:text-white transition-colors cursor-pointer"
              title="Admin Link Manager"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Mobile Controls (Sound + Hamburger) */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="p-2 border border-white/30 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white/60" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#00F0FF]" />
              )}
            </button>

            <button
              className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
              onClick={() => setMenuOpen(true)}
            >
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-white" />
                <div className="w-6 h-0.5 bg-white" />
                <div className="w-4 h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </nav>

        {/* ── FLEX SPACER ── */}
        <div className="flex-1" />

        {/* ── HERO CONTENT ── */}
        <div className="pb-10 sm:pb-14 lg:pb-20">

          {/* Tagline */}
          <div className="flex items-center gap-2.5 mb-6 lg:mb-8 animate-fade-up">
            <Crown className="w-4 h-4 text-white/70" />
            <span className="font-inter text-white/70 text-xs sm:text-sm tracking-[0.3em] uppercase">
              AI-First Education &amp; Media
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-podium text-white uppercase leading-[0.92] tracking-tight animate-fade-up-delay-1"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
          >
            Learn.<br />
            Build.<br />
            Create.
          </h1>

          {/* Subtext */}
          <p className="font-inter text-white/70 text-sm sm:text-base leading-relaxed max-w-md mt-6 lg:mt-8 animate-fade-up-delay-2">
            We make complex AI simple &amp;<br />
            practical — not just information,<br />
            <span className="text-white font-semibold">real-world action.</span>
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 lg:mt-10 animate-fade-up-delay-3">
            {/* Primary CTA */}
            <a
              href="https://www.youtube.com/@MadeByParv"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-black hover:bg-neutral-900 px-5 sm:px-7 py-3 sm:py-4 text-[11px] sm:text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              WATCH ON YOUTUBE
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Links Button */}
            <button
              onClick={() => setLinksOpen(true)}
              className="flex items-center gap-2 border border-[#00F0FF]/50 bg-[#18011F]/60 hover:bg-[#18011F] px-5 sm:px-7 py-3 sm:py-4 text-[11px] sm:text-xs tracking-widest uppercase transition-all text-[#00F0FF] cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>DM LINKS &amp; RESOURCES</span>
            </button>

            {/* Sound Toggle Pill */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-[11px] tracking-widest uppercase transition-all text-white/80 cursor-pointer rounded-full"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white/50" />
                  <span>Unmute Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
                  <span>Audio Enabled</span>
                </>
              )}
            </button>

            {/* Award badge */}
            <div className="hidden sm:flex items-center gap-3">
              <Award className="w-8 h-8 text-white/50" />
              <div>
                <p className="font-inter text-white/60 text-xs tracking-wider uppercase">AI Education</p>
                <p className="font-inter text-white/60 text-xs tracking-wider uppercase">Creator Studio</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 sm:gap-12 lg:gap-16 mt-8 sm:mt-10 lg:mt-14 animate-fade-up-delay-4">
            <div>
              <p className="font-inter text-[#00F0FF] text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">100+</p>
              <p className="font-inter text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">AI Tutorials</p>
            </div>
            <div>
              <p className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">50+</p>
              <p className="font-inter text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">Tools Reviewed</p>
            </div>
            <div>
              <p className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">10K+</p>
              <p className="font-inter text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">Community Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <img
              src="/logo-monogram.png"
              alt="MadeByParv Logo"
              className="h-12 w-auto object-contain shrink-0"
            />
            <span className="font-podium text-2xl font-bold uppercase tracking-wider">
              MadeByParv
            </span>
          </div>
          <button
            className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Nav */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-8">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link}
              className="font-podium text-4xl sm:text-5xl text-white uppercase tracking-wider hover:opacity-70 transition-all duration-500 cursor-pointer"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: menuOpen ? `${100 + i * 80}ms` : '0ms',
              }}
              onClick={() => {
                setMenuOpen(false);
                handleNavClick(link);
              }}
            >
              {link}
            </button>
          ))}

          {/* Mobile Sound Control & Links Buttons */}
          <div className="flex flex-col gap-3 w-full px-10 max-w-sm">
            <button
              onClick={toggleSound}
              className="flex items-center justify-center gap-2 border border-white/30 bg-white/10 text-white px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-white/20 transition-all cursor-pointer rounded-full"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00F0FF]" />}
              <span>{isMuted ? 'Unmute Audio' : 'Audio Enabled'}</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 border border-[#00F0FF]/50 bg-[#18011F]/80 text-[#00F0FF] px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-white/10 transition-all cursor-pointer rounded-full"
              onClick={() => {
                setMenuOpen(false);
                setLinksOpen(true);
              }}
            >
              <Link2 className="w-4 h-4" />
              <span>DM LINKS &amp; RESOURCES</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 text-white/50 text-xs uppercase tracking-widest py-2 hover:text-white transition-colors cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                setView('admin');
                window.location.hash = 'admin';
              }}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Link Manager</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ── FEATURED LINKS & DM RESOURCES MODAL ── */}
      <LinksModal
        isOpen={linksOpen}
        onClose={() => setLinksOpen(false)}
        onOpenAdmin={() => {
          setView('admin');
          window.location.hash = 'admin';
        }}
      />
    </div>
  );
}

export default App;
