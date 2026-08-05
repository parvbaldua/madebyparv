import React from 'react';
import { Instagram as InstagramIcon, Youtube, ArrowUpRight } from 'lucide-react';

/**
 * UIverse Neon Pill with Animated Radial Glow Pointer Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Ultra-compact pill design with left brand icon badge and right glowing hover arrow.
 */

interface SocialGlowPointerButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialGlowPointerButton: React.FC<SocialGlowPointerButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-glowpointer-insta' : 'social-glowpointer-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-glowpointer-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-glowpointer-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        )}
      </div>
      <span className="uiverse-glowpointer-handle">{handle}</span>
      <div className="uiverse-glowpointer-arrow">
        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
      </div>
    </a>
  );
};
