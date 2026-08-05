import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Compact Micro Glass Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Specially designed to be ultra-compact, sleek, and space-efficient on smartphones.
 */

interface SocialCompactButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialCompactButton: React.FC<SocialCompactButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-compact-insta' : 'social-compact-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-compact-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-compact-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        ) : (
          <Youtube className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        )}
      </div>
      <span className="uiverse-compact-handle">{handle}</span>
    </a>
  );
};
