import React from 'react';

/**
 * UIverse Liquid Bubble Blob Expansion Button
 * Features: Silky smooth fluid radial blob expansion on hover/touch,
 * glassmorphic backdrop, crisp 100% responsive typography for smartphones & desktop.
 */

type BlobColor = 'red' | 'cyan' | 'purple' | 'pink' | 'white';

interface LiquidBlobButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  color?: BlobColor;
  className?: string;
  title?: string;
}

const COLOR_CLASSES: Record<BlobColor, string> = {
  red: 'blob-btn-red',
  cyan: 'blob-btn-cyan',
  purple: 'blob-btn-purple',
  pink: 'blob-btn-pink',
  white: 'blob-btn-white',
};

export const LiquidBlobButton: React.FC<LiquidBlobButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  color = 'cyan',
  className = '',
  title,
}) => {
  const colorClass = COLOR_CLASSES[color];
  const combinedClass = `uiverse-blob-button ${colorClass} ${className}`;

  const inner = (
    <>
      <span className="uiverse-blob-layer"></span>
      <span className="uiverse-blob-content">{children}</span>
    </>
  );

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
