import React from 'react';
import { FadeIn } from './FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const servicesData: ServiceItem[] = [
  {
    number: "01",
    name: "AI Education & Workflows",
    description:
      "Simplifying cutting-edge AI technologies into step-by-step guides that anyone can follow. We focus on real-world applications where people learn by building.",
  },
  {
    number: "02",
    name: "Tech Hacks Series",
    description:
      "Our flagship 'Tech Hacks You Didn't Know You Needed' series introduces hidden features, AI workflows, and digital tools that save time and boost productivity.",
  },
  {
    number: "03",
    name: "AI Content Creation",
    description:
      "Teaching creators to produce viral short-form videos, cinematic visuals, AI ads, and consistent characters with prompt engineering and creative automation.",
  },
  {
    number: "04",
    name: "Productivity & Automation",
    description:
      "Showing how AI can automate repetitive work, organize information, generate ideas, and streamline workflows for creators, freelancers, and businesses.",
  },
  {
    number: "05",
    name: "Digital Safety & Awareness",
    description:
      "Educating users on AI scams, cybersecurity, deepfakes, and online privacy to ensure everyone stays informed, confident, and protected in an AI-driven world.",
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2
            className="font-black uppercase text-[#0C0C0C] tracking-tight leading-none mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        {/* Services List */}
        <div className="w-full flex flex-col">
          {servicesData.map((service, index) => (
            <FadeIn key={service.number} delay={index * 0.1} y={30}>
              <div
                className={`w-full flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 ${
                  index !== servicesData.length - 1
                    ? 'border-b border-[rgba(12,12,12,0.15)]'
                    : ''
                }`}
              >
                {/* Number */}
                <div
                  className="font-black text-[#0C0C0C] leading-none mb-4 md:mb-0 md:w-1/3 shrink-0"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {service.number}
                </div>

                {/* Name and Description */}
                <div className="flex flex-col gap-2 md:w-2/3">
                  <h3
                    className="font-medium uppercase text-[#0C0C0C]"
                    style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="font-light leading-relaxed text-[#0C0C0C]/60 max-w-2xl"
                    style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
