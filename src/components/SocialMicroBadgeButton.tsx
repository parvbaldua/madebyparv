import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Circular Micro Icon Badge Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Takes virtually zero static space (32px round pill/badge) and expands on hover/tap.
 */

interface SocialMicroBadgeButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialMicroBadgeButton: React.FC<SocialMicroBadgeButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-microbadge-insta' : 'social-microbadge-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-microbadge-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-microbadge-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        )}
      </div>
      <span className="uiverse-microbadge-handle">{handle}</span>
    </a>
  );
};
