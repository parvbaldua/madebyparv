import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Ultra-Clean Micro Glass Chip Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Ultra-minimalist, zero-clutter 26px chip designed to keep the site looking 100% clean, airy and spacious.
 */

interface SocialUltraCleanChipButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialUltraCleanChipButton: React.FC<SocialUltraCleanChipButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-ultraclean-insta' : 'social-ultraclean-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-ultraclean-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-ultraclean-icon">
        {isInsta ? (
          <InstagramIcon className="w-3 h-3 text-white" />
        ) : (
          <Youtube className="w-3 h-3 text-white" />
        )}
      </div>
      <span className="uiverse-ultraclean-handle">{handle}</span>
    </a>
  );
};
