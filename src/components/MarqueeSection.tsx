import React, { useRef, useState, useEffect } from 'react';

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

// Row 1: First 11 images, tripled
const row1Images = [
  ...marqueeImages.slice(0, 11),
  ...marqueeImages.slice(0, 11),
  ...marqueeImages.slice(0, 11),
];

// Row 2: Remaining 10 images, tripled
const row2Images = [
  ...marqueeImages.slice(11),
  ...marqueeImages.slice(11),
  ...marqueeImages.slice(11),
];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const row1Transform = `translateX(${scrollOffset - 200}px)`;
  const row2Transform = `translateX(-${scrollOffset - 200}px)`;

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: Moves RIGHT on scroll */}
        <div
          className="flex gap-3 w-max"
          style={{
            transform: row1Transform,
            willChange: 'transform',
          }}
        >
          {row1Images.map((src, index) => (
            <img
              key={`row1-${index}`}
              src={src}
              alt={`3D Design showcase row 1 item ${index + 1}`}
              loading="lazy"
              className="w-[280px] h-[180px] sm:w-[350px] sm:h-[225px] md:w-[420px] md:h-[270px] rounded-2xl object-cover shrink-0 select-none shadow-lg border border-white/5"
            />
          ))}
        </div>

        {/* Row 2: Moves LEFT on scroll */}
        <div
          className="flex gap-3 w-max"
          style={{
            transform: row2Transform,
            willChange: 'transform',
          }}
        >
          {row2Images.map((src, index) => (
            <img
              key={`row2-${index}`}
              src={src}
              alt={`3D Design showcase row 2 item ${index + 1}`}
              loading="lazy"
              className="w-[280px] h-[180px] sm:w-[350px] sm:h-[225px] md:w-[420px] md:h-[270px] rounded-2xl object-cover shrink-0 select-none shadow-lg border border-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
