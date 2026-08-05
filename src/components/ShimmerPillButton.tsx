import React from 'react';

/**
 * UIverse Shimmering Neon Gradient Pill Button
 * Highly clean, modern, and non-distracting UIverse button.
 * Features: Animated gradient border, glass backdrop, crisp responsive typography.
 */

type PillColor = 'red' | 'cyan' | 'purple' | 'pink' | 'white';

interface ShimmerPillButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  color?: PillColor;
  className?: string;
  title?: string;
}

const COLOR_MAP: Record<PillColor, string> = {
  red: 'shimmer-pill-red',
  cyan: 'shimmer-pill-cyan',
  purple: 'shimmer-pill-purple',
  pink: 'shimmer-pill-pink',
  white: 'shimmer-pill-white',
};

export const ShimmerPillButton: React.FC<ShimmerPillButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  color = 'cyan',
  className = '',
  title,
}) => {
  const colorClass = COLOR_MAP[color];
  const combinedClass = `uiverse-shimmer-pill ${colorClass} ${className}`;

  const inner = <span className="uiverse-shimmer-content">{children}</span>;

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
