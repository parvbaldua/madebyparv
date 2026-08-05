import React from 'react';

/**
 * UIverse Cyber-Glow Premium Button
 * Features: Multi-color animated neon glow aura, glassmorphic backdrop,
 * smooth 3D hover lift, shimmer sheen, and 100% responsive fluid scaling.
 */

type CyberVariant = 'red' | 'cyan' | 'purple' | 'pink' | 'white';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: CyberVariant;
  className?: string;
  title?: string;
}

const VARIANT_STYLES: Record<CyberVariant, string> = {
  red: 'cyber-btn-red',
  cyan: 'cyber-btn-cyan',
  purple: 'cyber-btn-purple',
  pink: 'cyber-btn-pink',
  white: 'cyber-btn-white',
};

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  variant = 'cyan',
  className = '',
  title,
}) => {
  const variantClass = VARIANT_STYLES[variant];
  const combinedClass = `cyber-button ${variantClass} ${className}`;

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
        <span className="cyber-button-content">{children}</span>
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
      <span className="cyber-button-content">{children}</span>
    </button>
  );
};
