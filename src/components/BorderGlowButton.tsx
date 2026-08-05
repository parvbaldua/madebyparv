import React from 'react';

/**
 * UIverse Rotating Border Glow Trail Button (Conic Gradient Beam)
 * Popular on AI apps & landing pages: a glowing neon beam rotates continuously around the pill border.
 */

type GlowTheme = 'cyan' | 'red' | 'purple' | 'pink' | 'white';

interface BorderGlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  theme?: GlowTheme;
  className?: string;
  title?: string;
}

const THEME_CLASSES: Record<GlowTheme, string> = {
  cyan: 'glow-btn-cyan',
  red: 'glow-btn-red',
  purple: 'glow-btn-purple',
  pink: 'glow-btn-pink',
  white: 'glow-btn-white',
};

export const BorderGlowButton: React.FC<BorderGlowButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  theme = 'cyan',
  className = '',
  title,
}) => {
  const themeClass = THEME_CLASSES[theme];
  const combinedClass = `border-glow-button ${themeClass} ${className}`;

  const inner = <span className="glow-button-content">{children}</span>;

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
