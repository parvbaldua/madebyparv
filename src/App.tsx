import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award, Crown, X, Link2, Volume2, VolumeX, Instagram, Youtube } from 'lucide-react';
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

  // Guarantee continuous background video playback on mount & iOS Safari touch start
  useEffect(() => {
    if (videoRef.current && view === 'public') {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    const handleFirstUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleFirstUserInteraction, { passive: true });
    window.addEventListener('click', handleFirstUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('click', handleFirstUserInteraction);
    };
  }, [view]);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
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
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-black text-white font-inter overflow-y-auto sm:overflow-hidden">
      {/* ── Fullscreen Background Video (Fixed & Visual-Only MP4) ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        defaultMuted
        loop
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
        className="fixed inset-0 h-full w-full object-cover lg:scale-[1.1] pointer-events-none select-none"
        src="/hero-video.mp4"
      />

      {/* ── Dark gradient overlays for text readability ── */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

      {/* ── Content Layer ── */}
      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col px-4 sm:px-10 lg:px-16 justify-between">

        {/* ── NAVBAR ── */}
        <nav className="flex items-center justify-between py-4 sm:py-5 lg:py-7 shrink-0">
          {/* Left: Logo monogram + brand name */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/logo-monogram.png"
              alt="MadeByParv Logo"
              className="h-9 sm:h-12 lg:h-14 w-auto object-contain shrink-0"
            />
            <span className="font-podium text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider">
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
          </div>

          {/* Right: Mobile Controls (Sound + Hamburger) */}
          <div className="md:hidden flex items-center gap-2.5">
            <button
              onClick={toggleSound}
              className="p-2 border border-white/30 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#00F0FF]" />
              )}
            </button>

            <button
              className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
              onClick={() => setMenuOpen(true)}
            >
              <div className="space-y-1.5">
                <div className="w-5 h-0.5 bg-white" />
                <div className="w-5 h-0.5 bg-white" />
                <div className="w-3.5 h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </nav>

        {/* ── HERO CONTENT ── */}
        <div className="py-4 sm:py-6 lg:pb-16 flex flex-col justify-center flex-1">

          {/* Tagline */}
          <div className="flex items-center gap-2 mb-3 sm:mb-6 animate-fade-up">
            <Crown className="w-3.5 h-3.5 text-white/70" />
            <span className="font-inter text-white/70 text-[10px] sm:text-xs lg:text-sm tracking-[0.25em] uppercase">
              AI-First Education &amp; Media
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-podium text-white uppercase leading-[0.92] tracking-tight animate-fade-up-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 6.5vh, 6.5rem)' }}
          >
            Learn.<br />
            Build.<br />
            Create.
          </h1>

          {/* Subtext */}
          <p className="font-inter text-white/70 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md mt-3 sm:mt-6 animate-fade-up-delay-2">
            We make complex AI simple &amp; practical — not just information, <span className="text-white font-semibold">real-world action.</span>
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-5 sm:mt-8 animate-fade-up-delay-3">
            {/* Primary CTA (YouTube Red default on mobile, red on hover desktop) */}
            <a
              href="https://www.youtube.com/@MadeByParv"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-[#FF0000] sm:bg-black sm:hover:bg-[#FF0000] hover:bg-[#CC0000] text-white px-4 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg shadow-red-900/30 font-semibold"
            >
              WATCH ON YOUTUBE
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Links Button */}
            <button
              onClick={() => setLinksOpen(true)}
              className="flex items-center gap-2 border border-[#00F0FF]/50 bg-[#18011F]/60 hover:bg-[#18011F] px-4 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs tracking-widest uppercase transition-all text-[#00F0FF] cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>DM LINKS &amp; RESOURCES</span>
            </button>

            {/* Sound Toggle Pill */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 px-3.5 py-2.5 text-[10px] sm:text-[11px] tracking-widest uppercase transition-all text-white/80 cursor-pointer rounded-full"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-white/50" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-[#00F0FF] animate-pulse" />
                  <span>Audio On</span>
                </>
              )}
            </button>

            {/* Award badge */}
            <div className="hidden lg:flex items-center gap-3">
              <Award className="w-7 h-7 text-white/50" />
              <div>
                <p className="font-inter text-white/60 text-[10px] tracking-wider uppercase">AI Education</p>
                <p className="font-inter text-white/60 text-[10px] tracking-wider uppercase">Creator Studio</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 sm:gap-12 lg:gap-16 mt-6 sm:mt-10 animate-fade-up-delay-4">
            <div>
              <p className="font-inter text-[#00F0FF] text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight">8/100</p>
              <p className="font-inter text-white/50 text-[8px] sm:text-xs tracking-widest uppercase mt-0.5">Tech Hacks Series</p>
            </div>
            <div>
              <p className="font-inter text-white text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight">125+</p>
              <p className="font-inter text-white/50 text-[8px] sm:text-xs tracking-widest uppercase mt-0.5">Insta Fam</p>
            </div>
            <div>
              <p className="font-inter text-white text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight">555+</p>
              <p className="font-inter text-white/50 text-[8px] sm:text-xs tracking-widest uppercase mt-0.5">YouTube Subs</p>
            </div>
          </div>

          {/* ── Social Channels Links Row ── */}
          <div className="flex items-center gap-3 mt-5 sm:mt-8 animate-fade-up-delay-4">
            <a
              href="https://www.instagram.com/madebyparv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-[#B600A8]/30 hover:to-[#FF007A]/30 border border-white/10 hover:border-[#FF007A]/50 text-white/80 hover:text-white text-[11px] font-inter uppercase tracking-wider transition-all group"
            >
              <Instagram className="w-4 h-4 text-[#FF007A] group-hover:scale-110 transition-transform" />
              <span>@madebyparv</span>
            </a>

            <a
              href="https://www.youtube.com/@MadeByParv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white/80 hover:text-white text-[11px] font-inter uppercase tracking-wider transition-all group"
            >
              <Youtube className="w-4 h-4 text-[#FF0000] group-hover:scale-110 transition-transform" />
              <span>@MadeByParv</span>
            </a>
          </div>

        </div>

        {/* Bottom padding safety gap for mobile viewports */}
        <div className="h-4 sm:h-6 shrink-0" />
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
              className="h-10 w-auto object-contain shrink-0"
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

          {/* Mobile Social & Links Buttons */}
          <div className="flex flex-col gap-3 w-full px-10 max-w-sm">
            <a
              href="https://www.instagram.com/madebyparv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#FF007A]/40 bg-[#FF007A]/10 text-white px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-[#FF007A]/20 transition-all cursor-pointer rounded-full"
            >
              <Instagram className="w-4 h-4 text-[#FF007A]" />
              <span>Instagram @madebyparv</span>
            </a>

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
          </div>
        </nav>
      </div>

      {/* ── FEATURED LINKS & DM RESOURCES MODAL ── */}
      <LinksModal
        isOpen={linksOpen}
        onClose={() => setLinksOpen(false)}
      />
    </div>
  );
}

export default App;
