import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award, Crown, X, Link2, Volume2, VolumeX, Flame, Music, Play, Youtube } from 'lucide-react';
import { LinksModal } from './components/LinksModal';
import { SeriesModal } from './components/SeriesModal';
import { AdminPage } from './components/AdminPage';

const NAV_LINKS = ['YouTube', 'Tutorials', 'Series', 'Tools', 'Links', 'Contact'];

// Custom Instagram SVG Component
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export function App() {
  const [view, setView] = useState<'public' | 'admin'>(() => {
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      return 'admin';
    }
    return 'public';
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioTrackRef = useRef<HTMLAudioElement>(null);

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

  // Show music suggestion toast after 2.5s on landing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMusicPrompt(true);
    }, 2500);
    return () => clearTimeout(timer);
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

  // Crystal-clear, stutter-free video audio toggle with strict audio mutual exclusion
  const toggleSound = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.pause();
      setIsPlayingTrack(false);
    }

    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Video sound playback prevented:", err);
          });
        }
      }
    }
  };

  // Crystal-clear official music track toggle
  const toggleOfficialTrack = () => {
    setShowMusicPrompt(false);

    if (videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }

    if (audioTrackRef.current) {
      if (isPlayingTrack) {
        audioTrackRef.current.pause();
        setIsPlayingTrack(false);
      } else {
        audioTrackRef.current.currentTime = 0;
        const playPromise = audioTrackRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlayingTrack(true);
          }).catch(() => {
            toggleSound();
          });
        }
      }
    }
  };

  const handleNavClick = (link: string) => {
    const lower = link.toLowerCase();
    if (lower === 'series' || lower === 'tutorials') {
      setSeriesOpen(true);
    } else if (lower === 'links') {
      setLinksOpen(true);
    } else if (lower === 'youtube') {
      window.open('https://www.youtube.com/@MadeByParv', '_blank');
    } else if (lower === 'tools') {
      setLinksOpen(true);
    } else if (lower === 'contact') {
      window.location.href = 'mailto:madebyparv.ai@gmail.com';
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
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-black text-white font-inter overflow-y-auto select-none">
      {/* ── Fullscreen Background Video ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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

      {/* ── Official MadeByParv Tech Hacks Audio Track Player ── */}
      <audio
        ref={audioTrackRef}
        src="/madebyparv-theme.mp3"
        loop
        preload="none"
        onEnded={() => setIsPlayingTrack(false)}
      />

      {/* ── Dark gradient overlays for text readability ── */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* ── Content Layer (Initial Perfect Responsive Layout) ── */}
      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col px-4 sm:px-10 lg:px-16 justify-between">

        {/* ── NAVBAR ── */}
        <nav className="flex items-center justify-between py-4 sm:py-5 lg:py-7 shrink-0">
          {/* Left: Logo monogram + brand name */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/logo-monogram.png"
              alt="MadeByParv Logo"
              width="48"
              height="48"
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

          {/* Right: Sound Control + Official Track + Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Play Official Track Pill Button */}
            <button
              onClick={toggleOfficialTrack}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                isPlayingTrack
                  ? 'bg-gradient-to-r from-[#FF007A] to-[#B600A8] border-[#FF007A] text-white animate-pulse shadow-lg shadow-pink-900/50'
                  : 'bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40'
              }`}
              title="Play MadeByParv Official Tech Hacks Track"
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingTrack ? 'text-white animate-bounce' : 'text-[#00F0FF]'}`} />
              <span>{isPlayingTrack ? 'Playing Official Track' : 'Official Track'}</span>
            </button>

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
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleOfficialTrack}
              className={`p-2 border rounded-full transition-opacity cursor-pointer ${
                isPlayingTrack ? 'border-[#FF007A] bg-[#FF007A]/20' : 'border-white/30'
              }`}
              title="Official Track"
            >
              <Music className={`w-4 h-4 ${isPlayingTrack ? 'text-[#FF007A]' : 'text-[#00F0FF]'}`} />
            </button>

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
        <div className="py-4 sm:py-6 lg:pb-16 flex flex-col justify-center flex-1 my-auto">

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

            {/* Tech Hacks Series CTA Pill */}
            <button
              onClick={() => setSeriesOpen(true)}
              className="flex items-center gap-2 border border-[#B600A8]/60 bg-[#B600A8]/20 hover:bg-[#B600A8]/40 px-3.5 py-2.5 text-[10px] sm:text-[11px] tracking-widest uppercase transition-all text-white cursor-pointer rounded-full"
            >
              <Flame className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
              <span>WATCH SERIES</span>
            </button>

            {/* Play Official Theme Track Pill */}
            <button
              onClick={toggleOfficialTrack}
              className={`relative flex items-center gap-2 border px-3.5 py-2.5 text-[10px] sm:text-[11px] tracking-widest uppercase transition-all cursor-pointer rounded-full ${
                isPlayingTrack
                  ? 'bg-gradient-to-r from-[#FF007A] to-[#B600A8] border-[#FF007A] text-white animate-pulse shadow-lg shadow-pink-900/50'
                  : 'bg-white/10 border-[#FF007A]/60 hover:bg-white/20 text-white font-semibold'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingTrack ? 'text-white' : 'text-[#FF007A] animate-bounce'}`} />
              <span>{isPlayingTrack ? 'Playing Track' : 'Official Track'}</span>
              {!isPlayingTrack && (
                <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF007A] text-white text-[8px] font-bold uppercase tracking-wider animate-pulse">
                  Listen
                </span>
              )}
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
            <div className="hidden lg:flex items-center gap-3 ml-2">
              <Award className="w-7 h-7 text-white/50" />
              <div>
                <p className="font-inter text-white/60 text-[10px] tracking-wider uppercase">AI Education</p>
                <p className="font-inter text-white/60 text-[10px] tracking-wider uppercase">Creator Studio</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 sm:gap-12 lg:gap-16 mt-6 sm:mt-10 animate-fade-up-delay-4">
            <button
              onClick={() => setSeriesOpen(true)}
              className="text-left group cursor-pointer"
            >
              <p className="font-inter text-[#00F0FF] text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight group-hover:underline">
                8/100
              </p>
              <p className="font-inter text-white/70 group-hover:text-white text-[8px] sm:text-xs tracking-widest uppercase mt-0.5 flex items-center gap-1">
                <span>Tech Hacks Series</span>
                <ArrowUpRight className="w-3 h-3 text-[#00F0FF]" />
              </p>
            </button>
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
              <InstagramIcon className="w-4 h-4 text-[#FF007A] group-hover:scale-110 transition-transform" />
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

      {/* ── ULTRA-PREMIUM GLASSMORPHISM MUSIC SUGGESTION CARD ── */}
      {showMusicPrompt && !isPlayingTrack && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-8 sm:bottom-6 z-40 max-w-sm w-auto bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] animate-fade-in font-inter group transition-all duration-300 hover:border-[#FF007A]/60">
          
          {/* Subtle Ambient Gradient Glow Backdrop */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF007A]/15 via-transparent to-[#00F0FF]/15 pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF007A] to-[#00F0FF] p-[1px] shadow-lg shrink-0">
                <div className="w-full h-full rounded-[11px] bg-black/80 backdrop-blur-md flex items-center justify-center text-white">
                  <Music className="w-5 h-5 text-[#00F0FF] animate-bounce" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00F0FF]">
                    Official Theme Track
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide mt-0.5">
                  MadeByParv Tech Hacks
                </h4>
                <p className="text-[10px] text-white/60 mt-0.5">
                  Indian Rap A.I. Edition
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMusicPrompt(false)}
              className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-2.5">
            <button
              onClick={toggleOfficialTrack}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] via-[#B600A8] to-[#00F0FF] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play Official Track</span>
            </button>

            <button
              onClick={() => setShowMusicPrompt(false)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
            <button
              onClick={() => {
                setMenuOpen(false);
                toggleOfficialTrack();
              }}
              className="flex items-center justify-center gap-2 border border-[#FF007A]/60 bg-[#FF007A]/20 text-white px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-[#FF007A]/40 transition-all cursor-pointer rounded-full font-semibold"
            >
              <Music className="w-4 h-4 text-[#00F0FF]" />
              <span>{isPlayingTrack ? 'PAUSE OFFICIAL TRACK' : 'PLAY OFFICIAL TRACK'}</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                setSeriesOpen(true);
              }}
              className="flex items-center justify-center gap-2 border border-[#B600A8]/60 bg-[#B600A8]/20 text-white px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-[#B600A8]/40 transition-all cursor-pointer rounded-full font-semibold"
            >
              <Flame className="w-4 h-4 text-[#00F0FF]" />
              <span>WATCH TECH HACKS SERIES</span>
            </button>

            <a
              href="https://www.instagram.com/madebyparv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#FF007A]/40 bg-[#FF007A]/10 text-white px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-[#FF007A]/20 transition-all cursor-pointer rounded-full"
            >
              <InstagramIcon className="w-4 h-4 text-[#FF007A]" />
              <span>Instagram @madebyparv</span>
            </a>

            <button
              className="flex items-center justify-center gap-2 border border-[#00F0FF]/50 bg-[#18011F]/80 text-[#00F0FF] px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-[#00F0FF]/10 transition-all cursor-pointer rounded-full"
              onClick={() => {
                setMenuOpen(false);
                setLinksOpen(true);
              }}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>DM LINKS &amp; RESOURCES</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ── FEATURED LINKS MODAL ── */}
      <LinksModal
        isOpen={linksOpen}
        onClose={() => setLinksOpen(false)}
      />

      {/* ── TECH HACKS SERIES MODAL ── */}
      <SeriesModal
        isOpen={seriesOpen}
        onClose={() => setSeriesOpen(false)}
      />
    </div>
  );
}

export default App;
