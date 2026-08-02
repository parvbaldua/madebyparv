import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharacterProps {
  char: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Character: React.FC<CharacterProps> = ({ char, range, progress }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block select-none">
      <span className="opacity-0">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p ref={containerRef} className={`relative flex flex-wrap justify-center ${className}`}>
      {characters.map((char, index) => {
        const start = index / totalChars;
        const end = Math.min(1, (index + 1) / totalChars);
        return (
          <Character
            key={index}
            char={char}
            range={[start, end]}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
};
