import React from 'react';

/**
 * Galaxy / Space Animated Button (UIverse by elijahgummer)
 * Features: Starry galaxy background, glowing stars, shooting star lines,
 * radial cosmic gradient, wobble & blur text on active.
 */

interface SpaceButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  hue?: number; // 0 for Red, 190 for Cyan, 280 for Purple/Pink
}

export const SpaceButton: React.FC<SpaceButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  className = '',
  hue = 190, // default cyan/blue galaxy
}) => {
  const customStyle = {
    '--hue': hue,
  } as React.CSSProperties;

  const content = (
    <>
      <span className="backdrop"></span>
      <span className="galaxy"></span>
      <span className="space-button-text">{children}</span>
    </>
  );

  if (href) {
    return (
      <div className={`galaxy-button ${className}`} style={customStyle}>
        <a
          href={href}
          target={target}
          rel={rel}
          onClick={onClick}
          className="space-button"
        >
          {content}
        </a>
      </div>
    );
  }

  return (
    <div className={`galaxy-button ${className}`} style={customStyle}>
      <button onClick={onClick} className="space-button" type="button">
        {content}
      </button>
    </div>
  );
};
