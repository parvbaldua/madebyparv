import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Border Glitch Pill Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Compact, responsive, with subtle brand glowing border trail & status dot.
 */

interface SocialGlowPillButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialGlowPillButton: React.FC<SocialGlowPillButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-glowpill-insta' : 'social-glowpill-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-glowpill-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-glowpill-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        ) : (
          <Youtube className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        )}
      </div>
      <span className="uiverse-glowpill-handle">{handle}</span>
      <span className="uiverse-glowpill-dot"></span>
    </a>
  );
};
