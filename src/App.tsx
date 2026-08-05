import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Crown, X, Link2, Volume2, VolumeX, Flame, Music, Play, Youtube } from 'lucide-react';
import { LinksModal } from './components/LinksModal';
import { SeriesModal } from './components/SeriesModal';
import { AdminPage } from './components/AdminPage';
import { SlotCounter } from './components/SlotCounter';

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
  
  const [stats, setStats] = useState({
    seriesCount: 8,
    seriesTotal: 100,
    instaFam: 125,
    youtubeSubs: 555,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioTrackRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(err => console.warn('Using default stats', err));
  }, []);

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
    <div className="relative w-full bg-black text-white font-inter overflow-x-hidden select-none">

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
      <div className="fixed inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* ── Content Layer ──
           h-[100dvh] locks to viewport. overflow-y-auto lets content scroll if it truly overflows
           (e.g. very short phones or zoomed browsers). On normal desktops/tablets it will NOT scroll. */}
      <div className="relative z-10 flex h-[100dvh] flex-col px-4 sm:px-8 md:px-10 lg:px-16 max-w-[1600px] mx-auto overflow-y-auto">

        {/* ══════════════════════════════════════
            NAVBAR — Responsive across all devices
            ══════════════════════════════════════ */}
        <nav className="flex items-center justify-between shrink-0 gap-3 py-3 sm:py-4 lg:py-5 xl:py-6">
          {/* Left: Logo monogram + brand name — never shrinks */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img
              src="/logo-monogram.png"
              alt="MadeByParv Logo"
              width="48"
              height="48"
              className="h-8 sm:h-10 lg:h-12 w-auto object-contain shrink-0"
            />
            <span className="font-podium text-lg sm:text-2xl lg:text-[1.65rem] xl:text-3xl font-bold uppercase tracking-wider whitespace-nowrap">
              MadeByParv
            </span>
          </div>

          {/* Center: Desktop nav links — visible only at lg+ (≥1024px) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6 flex-1 justify-center min-w-0">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className="font-inter text-[11px] xl:text-xs text-white/80 tracking-[0.18em] uppercase hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right: Desktop controls — visible only at lg+ (≥1024px) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Official Track Pill */}
            <button
              onClick={toggleOfficialTrack}
              className={`btn-interactive btn-glow-pink flex items-center gap-1.5 px-3 py-2 xl:px-4 xl:py-2.5 rounded-full text-[10px] xl:text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                isPlayingTrack
                  ? 'bg-gradient-to-r from-[#FF007A] to-[#B600A8] border-[#FF007A] text-white animate-pulse shadow-lg shadow-pink-900/50'
                  : 'bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40'
              }`}
              title="Play MadeByParv Official Tech Hacks Track"
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingTrack ? 'text-white animate-bounce' : 'text-[#00F0FF]'}`} />
              <span>{isPlayingTrack ? 'Playing' : 'TRACK'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="btn-interactive btn-glow-subtle border border-white/30 hover:border-white/60 p-2 xl:p-2.5 rounded-full hover:bg-white/10 cursor-pointer text-white"
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
              className="btn-interactive btn-glow-cyan flex items-center gap-1.5 border border-white/30 hover:border-white/60 px-3 xl:px-5 py-2 xl:py-2.5 text-[10px] xl:text-[11px] tracking-widest uppercase hover:bg-white/10 cursor-pointer whitespace-nowrap"
            >
              <Link2 className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>LINKS</span>
            </button>
          </div>

          {/* Right: Mobile/Tablet controls — visible below lg (<1024px) */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
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

        {/* ══════════════════════════════════════
            HERO CONTENT — Vertically centered, height-adaptive
            ══════════════════════════════════════ */}
        <div className="flex flex-col justify-center flex-1 min-h-0 gap-[clamp(0.35rem,1vh,0.75rem)] sm:gap-[clamp(0.5rem,1.2vh,1rem)] lg:gap-[clamp(0.6rem,1.5vh,1.25rem)]">

          {/* Tagline */}
          <div className="flex items-center gap-2 animate-fade-up">
            <Crown className="w-3.5 h-3.5 text-white/70" />
            <span className="font-inter text-white/70 text-[10px] sm:text-xs lg:text-sm tracking-[0.25em] uppercase">
              AI-First Education &amp; Media
            </span>
          </div>

          {/* Main Heading — vmin-based: scales with BOTH viewport width & height
              Mobile (375×667): vmin=375 → 4.2*3.75+12.8 = 28.55px → clamped to 2rem (32px)
              Tablet (768×1024): vmin=768 → 4.2*7.68+12.8 = 45.06px → 2.82rem
              14.6" Laptop (1536×960): vmin=960 → 4.2*9.6+12.8 = 53.12px → 3.32rem
              24" Desktop (1920×1080): vmin=1080 → 4.2*10.8+12.8 = 58.16px → 3.64rem
              27" 1440p (2560×1440): vmin=1440 → 4.2*14.4+12.8 = 73.28px → 4.58rem
              All within clamp(2rem, ..., 5.5rem) → perfect scaling ✓ */}
          <h1
            className="font-podium text-white uppercase leading-[0.93] tracking-tight animate-fade-up-delay-1"
            style={{ fontSize: 'clamp(2rem, 4.2vmin + 0.8rem, 5.5rem)' }}
          >
            Learn.<br />
            Build.<br />
            Create.
          </h1>

          {/* Subtext */}
          <p className="font-inter text-white/70 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md animate-fade-up-delay-2">
            We make complex AI simple &amp; practical - not just information, <span className="text-white font-semibold">real-world action.</span>
          </p>

          {/* CTA Row — core buttons on all screens, secondary pills on sm+ */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:gap-3 animate-fade-up-delay-3">
            {/* Primary CTA — always visible */}
            <a
              href="https://www.youtube.com/@MadeByParv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive btn-glow-red group flex items-center gap-2 bg-[#FF0000] sm:bg-black sm:hover:bg-[#FF0000] hover:bg-[#CC0000] text-white px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs tracking-widest uppercase cursor-pointer shadow-lg shadow-red-900/30 font-semibold"
            >
              WATCH ON YOUTUBE
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Links Button — always visible */}
            <button
              onClick={() => setLinksOpen(true)}
              className="btn-interactive btn-glow-cyan flex items-center gap-2 border border-[#00F0FF]/50 bg-[#18011F]/60 hover:bg-[#18011F] px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs tracking-widest uppercase text-[#00F0FF] cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>DM LINKS &amp; RESOURCES</span>
            </button>

            {/* Watch Series — always visible */}
            <button
              onClick={() => setSeriesOpen(true)}
              className="btn-interactive btn-glow-purple flex items-center gap-2 border border-[#B600A8]/60 bg-[#B600A8]/20 hover:bg-[#B600A8]/40 px-3.5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] tracking-widest uppercase text-white cursor-pointer rounded-full"
            >
              <Flame className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
              <span>WATCH SERIES</span>
            </button>

            {/* Official Track Pill — Visible on all screens */}
            <button
              onClick={toggleOfficialTrack}
              className={`btn-interactive btn-glow-pink flex relative items-center gap-1.5 border px-3.5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] tracking-widest uppercase cursor-pointer rounded-full ${
                isPlayingTrack
                  ? 'bg-gradient-to-r from-[#FF007A] to-[#B600A8] border-[#FF007A] text-white animate-pulse shadow-lg shadow-pink-900/50'
                  : 'bg-white/10 border-[#FF007A]/60 hover:bg-white/20 text-white font-semibold'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingTrack ? 'text-white' : 'text-[#FF007A] animate-bounce'}`} />
              <span>{isPlayingTrack ? 'Playing Track' : 'Official Track'}</span>
              {!isPlayingTrack && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FF007A] text-white text-[8px] font-bold uppercase tracking-wider animate-pulse ml-0.5">
                  LISTEN
                </span>
              )}
            </button>

            {/* Sound Toggle Pill — hidden on small phones, shown on sm+ */}
            <button
              onClick={toggleSound}
              className="btn-interactive btn-glow-subtle hidden sm:flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 px-3.5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] tracking-widest uppercase text-white/80 cursor-pointer rounded-full"
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

          </div>

          {/* Stats Row with 3D Odometer Reel Slot Counter Animations (Slow 5-7 Sec Live Ticks) */}
          <div className="flex items-center gap-5 sm:gap-8 lg:gap-14 animate-fade-up-delay-4">
            <button
              onClick={() => setSeriesOpen(true)}
              className="text-left group cursor-pointer"
            >
              <p className="font-inter text-[#00F0FF] text-lg sm:text-2xl lg:text-4xl font-bold tracking-tight group-hover:underline">
                <SlotCounter target={stats.seriesCount} startFrom={0} suffix={`/${stats.seriesTotal}`} duration={5000} />
              </p>
              <p className="font-inter text-white/70 group-hover:text-white text-[8px] sm:text-xs tracking-widest uppercase mt-0.5 flex items-center gap-1">
                <span>Tech Hacks Series</span>
                <ArrowUpRight className="w-3 h-3 text-[#00F0FF]" />
              </p>
            </button>
            <div>
              <p className="font-inter text-white text-lg sm:text-2xl lg:text-4xl font-bold tracking-tight">
                <SlotCounter target={stats.instaFam} startFrom={Math.max(0, stats.instaFam - 10)} suffix="+" duration={6000} />
              </p>
              <p className="font-inter text-white/50 text-[8px] sm:text-xs tracking-widest uppercase mt-0.5">Insta Fam</p>
            </div>
            <div>
              <p className="font-inter text-white text-lg sm:text-2xl lg:text-4xl font-bold tracking-tight">
                <SlotCounter target={stats.youtubeSubs} startFrom={Math.max(0, stats.youtubeSubs - 10)} suffix="+" duration={7000} />
              </p>
              <p className="font-inter text-white/50 text-[8px] sm:text-xs tracking-widest uppercase mt-0.5">YouTube Subs</p>
            </div>
          </div>

          {/* Social Channels Row — Brutalist Animated Glow Cards */}
          <div className="flex flex-col gap-2 animate-fade-up-delay-4 mt-2">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <a
                href="https://www.instagram.com/madebyparv"
                target="_blank"
                rel="noopener noreferrer"
                className="brutalist-button insta-btn"
                title="Instagram @madebyparv"
              >
                <div className="brutalist-logo">
                  <InstagramIcon className="brutalist-icon text-[#FF007A]" />
                  <div className="brutalist-text">
                    <span>INSTAGRAM</span>
                    <span>@madebyparv</span>
                  </div>
                </div>
              </a>

              <a
                href="https://www.youtube.com/@MadeByParv"
                target="_blank"
                rel="noopener noreferrer"
                className="brutalist-button youtube-btn"
                title="YouTube @MadeByParv"
              >
                <div className="brutalist-logo">
                  <Youtube className="brutalist-icon text-[#FF0000]" />
                  <div className="brutalist-text">
                    <span>YOUTUBE</span>
                    <span>@MadeByParv</span>
                  </div>
                </div>
              </a>
            </div>

            <p className="font-inter text-white/60 text-[9px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 pl-0.5 mt-0.5">
              <span>Follow us on our socials for daily AI &amp; Tech updates</span>
            </p>
          </div>

        </div>

        {/* Bottom safety spacer */}
        <div className="shrink-0 h-2 sm:h-3 lg:h-4" />
      </div>

      {/* ══════════════════════════════════════
          GLASSMORPHISM MUSIC SUGGESTION CARD
          ══════════════════════════════════════ */}
      {showMusicPrompt && !isPlayingTrack && (
        <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-5 z-40 max-w-sm w-auto bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] animate-fade-in font-inter group transition-all duration-300 hover:border-[#FF007A]/60">
          
          {/* Ambient Gradient Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF007A]/15 via-transparent to-[#00F0FF]/15 pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#FF007A] to-[#00F0FF] p-[1px] shadow-lg shrink-0">
                <div className="w-full h-full rounded-[11px] bg-black/80 backdrop-blur-md flex items-center justify-center text-white">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 text-[#00F0FF] animate-bounce" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00F0FF] animate-ping" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#00F0FF]">
                    Official Theme Track
                  </span>
                </div>
                <h4 className="text-[11px] sm:text-sm font-bold text-white uppercase tracking-wide mt-0.5">
                  MadeByParv Tech Hacks
                </h4>
                <p className="text-[9px] sm:text-[10px] text-white/60 mt-0.5">
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

          <div className="relative z-10 mt-3 sm:mt-4 flex items-center gap-2">
            <button
              onClick={toggleOfficialTrack}
              className="flex-1 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] via-[#B600A8] to-[#00F0FF] hover:brightness-110 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play Official Track</span>
            </button>

            <button
              onClick={() => setShowMusicPrompt(false)}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-[11px] sm:text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MOBILE/TABLET FULLSCREEN MENU
          ══════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <img
              src="/logo-monogram.png"
              alt="MadeByParv Logo"
              className="h-9 sm:h-10 w-auto object-contain shrink-0"
            />
            <span className="font-podium text-xl sm:text-2xl font-bold uppercase tracking-wider">
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

        {/* Menu Nav — scrollable on short screens */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-5 sm:gap-8 overflow-y-auto py-4">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link}
              className="font-podium text-3xl sm:text-5xl text-white uppercase tracking-wider hover:opacity-70 transition-all duration-500 cursor-pointer"
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

          {/* Menu Action Buttons */}
          <div className="flex flex-col gap-2.5 sm:gap-3 w-full px-8 sm:px-10 max-w-sm">
            <button
              onClick={() => {
                setMenuOpen(false);
                toggleOfficialTrack();
              }}
              className="flex items-center justify-center gap-2 border border-[#FF007A]/60 bg-[#FF007A]/20 text-white px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs tracking-widest uppercase hover:bg-[#FF007A]/40 transition-all cursor-pointer rounded-full font-semibold"
            >
              <Music className="w-4 h-4 text-[#00F0FF]" />
              <span>{isPlayingTrack ? 'PAUSE OFFICIAL TRACK' : 'PLAY OFFICIAL TRACK'}</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                setSeriesOpen(true);
              }}
              className="flex items-center justify-center gap-2 border border-[#B600A8]/60 bg-[#B600A8]/20 text-white px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs tracking-widest uppercase hover:bg-[#B600A8]/40 transition-all cursor-pointer rounded-full font-semibold"
            >
              <Flame className="w-4 h-4 text-[#00F0FF]" />
              <span>WATCH TECH HACKS SERIES</span>
            </button>

            <a
              href="https://www.instagram.com/madebyparv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#FF007A]/40 bg-[#FF007A]/10 text-white px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs tracking-widest uppercase hover:bg-[#FF007A]/20 transition-all cursor-pointer rounded-full"
            >
              <InstagramIcon className="w-4 h-4 text-[#FF007A]" />
              <span>Instagram @madebyparv</span>
            </a>

            <button
              className="flex items-center justify-center gap-2 border border-[#00F0FF]/50 bg-[#18011F]/80 text-[#00F0FF] px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs tracking-widest uppercase hover:bg-[#00F0FF]/10 transition-all cursor-pointer rounded-full"
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
