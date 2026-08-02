import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { LiveProjectButton } from './LiveProjectButton';
import { ContactButton } from './ContactButton';
import { FadeIn } from './FadeIn';

interface Project {
  number: string;
  name: string;
  category: string;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
  liveUrl?: string;
}

const projectsData: Project[] = [
  {
    number: "01",
    name: "Tech Hacks Series",
    category: "Flagship",
    col1Img1:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    col1Img2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    col2Img:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    number: "02",
    name: "AI Cinematic & Shorts",
    category: "Content AI",
    col1Img1:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    col1Img2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    col2Img:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    number: "03",
    name: "Practical AI Workflows",
    category: "Automation",
    col1Img1:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    col1Img2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    col2Img:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

const whoWeServe = [
  'Students',
  'Content Creators',
  'Entrepreneurs',
  'Freelancers',
  'Professionals',
  'Curious Learners',
];

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  progress,
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const start = index / totalCards;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);

  return (
    <div
      ref={cardContainerRef}
      className="h-[85vh] sticky top-24 md:top-32 flex items-center justify-center mb-12 sm:mb-16"
    >
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
        }}
        className="relative w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden"
      >
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7E2EA]/15">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="font-black text-[#D7E2EA] leading-none select-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-[#D7E2EA]/60 uppercase tracking-widest font-light">
                {project.category}
              </span>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-medium uppercase text-[#D7E2EA] tracking-wide">
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton label="Live Project" href="#projects" />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 h-full items-stretch">
          <div className="md:col-span-5 flex flex-col gap-4">
            <img
              src={project.col1Img1}
              alt={`${project.name} preview 1`}
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover border border-[#D7E2EA]/10 shadow-md"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.col1Img2}
              alt={`${project.name} preview 2`}
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover border border-[#D7E2EA]/10 shadow-md"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>

          <div className="md:col-span-7 h-full flex">
            <img
              src={project.col2Img}
              alt={`${project.name} full preview`}
              className="w-full h-full min-h-[250px] sm:min-h-[320px] md:min-h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover border border-[#D7E2EA]/10 shadow-md"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-20 pb-32"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20 md:mb-28">
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>

        {/* Sticky Stacking Cards */}
        <div className="w-full flex flex-col relative">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              totalCards={projectsData.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Who We Serve Section */}
        <div className="w-full mt-24 flex flex-col items-center text-center gap-6">
          <FadeIn delay={0.1} y={20}>
            <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 font-light">
              Who We Serve
            </span>
          </FadeIn>
          <FadeIn delay={0.2} y={20}>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
              {whoWeServe.map((target) => (
                <span
                  key={target}
                  className="px-5 py-2 rounded-full border border-[#D7E2EA]/20 bg-[#D7E2EA]/5 text-[#D7E2EA] text-xs sm:text-sm font-medium uppercase tracking-wider"
                >
                  {target}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Footer / Contact Section */}
        <footer
          id="contact"
          className="w-full mt-24 pt-20 border-t border-[#D7E2EA]/10 flex flex-col items-center gap-10 text-center"
        >
          <FadeIn delay={0.1} y={30}>
            <h3 className="hero-heading font-black uppercase text-4xl sm:text-6xl md:text-7xl tracking-tight">
              We Make AI Practical
            </h3>
          </FadeIn>

          <FadeIn delay={0.2} y={30}>
            <p className="text-[#D7E2EA]/80 font-light max-w-2xl text-base sm:text-lg leading-relaxed">
              Empowering millions of people to understand, adopt, and leverage Artificial Intelligence through practical education, innovative tools, and real-world workflows that transform ideas into reality.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} y={30}>
            <ContactButton label="Contact Me" />
          </FadeIn>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-10 text-sm uppercase tracking-widest text-[#D7E2EA]/60 font-medium">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Unsplash
            </a>
          </div>

          <div className="text-xs text-[#D7E2EA]/40 pt-6">
            &copy; {new Date().getFullYear()} Made By Parv -- Parv Baldua. All Rights Reserved.
          </div>
        </footer>
      </div>
    </section>
  );
};
