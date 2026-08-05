import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Masterpiece Glass Capsule Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Designed for ultra-premium elegance, perfect proportion, and seamless integration
 * into MadeByParv's high-tech AI design system.
 */

interface SocialMasterpieceButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialMasterpieceButton: React.FC<SocialMasterpieceButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-masterpiece-insta' : 'social-masterpiece-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-masterpiece-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-masterpiece-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-masterpiece-action">{actionText}</span>
        <span className="uiverse-masterpiece-handle">{handle}</span>
      </div>
    </a>
  );
};
