import React from 'react';

/**
 * UIverse Minimalist Luxury Glass Button
 * Inspired by Apple & Linear design: dark glassmorphism, subtle 1px border,
 * smooth ambient glow on hover, 100% clean typography across all screens.
 */

type LuxuryAccent = 'red' | 'cyan' | 'purple' | 'pink' | 'white';

interface LuxuryGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  accent?: LuxuryAccent;
  className?: string;
  title?: string;
}

const ACCENT_CLASSES: Record<LuxuryAccent, string> = {
  red: 'lg-btn-red',
  cyan: 'lg-btn-cyan',
  purple: 'lg-btn-purple',
  pink: 'lg-btn-pink',
  white: 'lg-btn-white',
};

export const LuxuryGlassButton: React.FC<LuxuryGlassButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  accent = 'cyan',
  className = '',
  title,
}) => {
  const accentClass = ACCENT_CLASSES[accent];
  const combinedClass = `luxury-glass-button ${accentClass} ${className}`;

  const inner = <span className="luxury-button-inner">{children}</span>;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClass}
        onClick={onClick}
        title={title}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClass}
      title={title}
    >
      {inner}
    </button>
  );
};
