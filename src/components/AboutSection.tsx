import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

const coreValues = [
  'Practical First',
  'Learn by Building',
  'Simplicity Wins',
  'Stay Curious',
  'Share Knowledge',
];

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Decorative 3D Images in Corners */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="3D Moon Icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain"
        />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="3D Shape Object"
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain"
        />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="3D Lego Icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain"
        />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D Group Object"
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain"
        />
      </FadeIn>

      {/* Content Container */}
      <div className="z-20 max-w-4xl flex flex-col items-center gap-10 sm:gap-14 md:gap-16 my-auto">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Text and Button Container */}
        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20">
          <AnimatedText
            text="MadeByParv is an AI-first education and media company dedicated to helping people understand, adopt, and benefit from artificial intelligence. Our mission is simple: turn complex AI into simple, practical workflows that anyone can use. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[620px]"
          />

          {/* Core Values Badges */}
          <FadeIn delay={0.15} y={20}>
            <div className="flex flex-wrap justify-center gap-3 max-w-xl">
              {coreValues.map((val) => (
                <span
                  key={val}
                  className="px-4 py-1.5 rounded-full border border-[#D7E2EA]/20 bg-[#D7E2EA]/5 text-[#D7E2EA] text-xs sm:text-sm font-medium uppercase tracking-wider"
                >
                  {val}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.25} y={30}>
            <ContactButton label="Contact Me" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
