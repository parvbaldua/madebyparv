import React, { useState, useRef } from 'react';
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';
import { ContactButton } from './ContactButton';
import { Cpu, Sparkles, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [avatarMode, setAvatarMode] = useState<'3d_depth' | '3d_render'>('3d_depth');
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
    const rotateY = ((x - centerX) / centerX) * 15;
    const glossX = (x / rect.width) * 100;
    const glossY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glossX, glossY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });
  };

  return (
    <section className="relative h-screen flex flex-col justify-between overflow-x-clip bg-[#0C0C0C]">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full z-20">
        <nav className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          <a
            href="#about"
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            About
          </a>
          <a
            href="#services"
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            What We Do
          </a>
          <a
            href="#projects"
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            Contact
          </a>
        </nav>
      </FadeIn>

      {/* Hero Heading Container */}
      <div className="overflow-hidden w-full z-0 px-4 md:px-8 mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] text-center sm:text-left select-none">
            Hi, i&apos;m parv
          </h1>
        </FadeIn>
      </div>

      {/* Hero Portrait: Real-Time 3D Spatial Depth Model */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto flex flex-col items-center justify-center">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-center justify-center p-3 cursor-pointer group"
              style={{ perspective: 1000 }}
            >
              {/* 3D Holographic Orbiting Rings */}
              <div className="absolute -inset-4 rounded-full border border-[#B600A8]/40 border-dashed animate-[spin_15s_linear_infinite] pointer-events-none" />
              <div className="absolute -inset-8 rounded-full border border-[#00F0FF]/30 border-dotted animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7621B0]/50 via-[#B600A8]/30 to-[#00F0FF]/25 blur-3xl scale-95 pointer-events-none" />

              {/* Interactive 3D Perspective Card */}
              <div
                className="relative rounded-[40px] p-2 bg-[#0C0C0C]/90 border-2 border-[#B600A8]/60 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl z-10 overflow-hidden transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(20px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Specular 3D Light Reflection Highlight */}
                <div
                  className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-60 group-hover:opacity-90"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(255,255,255,0.25) 0%, rgba(182,0,168,0.1) 40%, transparent 80%)`,
                  }}
                />

                {/* 3D AI HUD Top Tag */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#18011F]/90 backdrop-blur-md border border-[#B600A8]/50 px-3 py-1 rounded-full text-[10px] font-semibold text-white tracking-widest uppercase shadow-lg">
                  <Sparkles className="w-3 h-3 text-[#00F0FF] animate-pulse" />
                  <span>3D AI Avatar</span>
                </div>

                {/* AI Workflows Floating Badge */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#0C0C0C]/90 backdrop-blur-md border border-[#00F0FF]/50 px-3 py-1 rounded-full text-[10px] font-semibold text-[#00F0FF] tracking-widest uppercase shadow-lg">
                  <Cpu className="w-3 h-3 text-[#B600A8]" />
                  <span>Interactive 3D</span>
                </div>

                {/* Avatar Image with 3D Depth Layer */}
                <img
                  src={avatarMode === '3d_depth' ? '/parv_real_photo.png' : '/parv_3d_character.png'}
                  alt="Parv Baldua - 3D AI Avatar"
                  className="w-[240px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] object-cover object-top rounded-[32px] pointer-events-none transition-transform duration-300 group-hover:scale-105"
                  style={{
                    transform: 'translateZ(30px)',
                  }}
                />

                {/* Bottom 3D Tech HUD Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0C0C0C]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 flex items-center justify-between z-20">
                  <div className="flex flex-col">
                    <span className="text-[#D7E2EA] font-semibold uppercase tracking-wider text-xs sm:text-sm">
                      Parv Baldua
                    </span>
                    <span className="text-[10px] text-[#D7E2EA]/60 uppercase tracking-widest font-light">
                      MadeByParv // 3D Creator
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#00F0FF]">
                    <Zap className="w-4 h-4 fill-current text-[#B600A8]" />
                  </div>
                </div>
              </div>
            </div>
          </Magnet>
        </FadeIn>

        {/* Display Switcher */}
        <div className="z-30 mt-3 flex items-center gap-2 bg-[#0C0C0C]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D7E2EA]/15 shadow-2xl">
          <button
            onClick={() => setAvatarMode('3d_depth')}
            className={`px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              avatarMode === '3d_depth'
                ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white shadow-lg'
                : 'text-[#D7E2EA]/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>3D Spatial Depth</span>
          </button>
          <button
            onClick={() => setAvatarMode('3d_render')}
            className={`px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
              avatarMode === '3d_render'
                ? 'bg-[#B600A8] text-white shadow-md'
                : 'text-[#D7E2EA]/60 hover:text-white'
            }`}
          >
            Stylized 3D
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex items-end justify-between px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[240px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            we make ai practical -- turning complex ai into simple real-world workflows
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton label="Contact Me" />
        </FadeIn>
      </div>
    </section>
  );
};
