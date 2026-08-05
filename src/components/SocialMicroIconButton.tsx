import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Micro Glass Social Pill Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Ultra space-efficient design: minimal height (32px), clean micro typography,
 * taking zero unnecessary space on smartphones or desktop screens.
 */

interface SocialMicroIconButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialMicroIconButton: React.FC<SocialMicroIconButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-micro-insta' : 'social-micro-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-micro-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-micro-icon-box">
        {isInsta ? (
          <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        )}
      </div>
      <span className="uiverse-micro-handle">{handle}</span>
    </a>
  );
};
