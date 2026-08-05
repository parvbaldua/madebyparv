import React from 'react';

/**
 * UIverse Cyberpunk / Retro Polygon Cut Button
 * Features: Angular clipped polygon corners, neon border outline,
 * skewed text label, scanline flash on hover, 100% responsive.
 */

type CyberpunkVariant = 'red' | 'cyan' | 'purple' | 'pink' | 'white';

interface CyberpunkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: CyberpunkVariant;
  className?: string;
  title?: string;
}

const VARIANT_CLASSES: Record<CyberpunkVariant, string> = {
  red: 'cp-btn-red',
  cyan: 'cp-btn-cyan',
  purple: 'cp-btn-purple',
  pink: 'cp-btn-pink',
  white: 'cp-btn-white',
};

export const CyberpunkButton: React.FC<CyberpunkButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  variant = 'cyan',
  className = '',
  title,
}) => {
  const variantClass = VARIANT_CLASSES[variant];
  const combinedClass = `cyberpunk-button ${variantClass} ${className}`;

  const inner = <span className="cyberpunk-button-content">{children}</span>;

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
