import React from 'react';
import { Youtube } from 'lucide-react';
import { InstagramGradientIcon } from './SocialBadgeButton';

/**
 * UIverse Neon Halo Glass Pill Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features an ambient neon halo aura ring on hover/touch.
 */

interface SocialHaloButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialHaloButton: React.FC<SocialHaloButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-halo-insta' : 'social-halo-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-halo-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-halo-icon-box">
        {isInsta ? (
          <InstagramGradientIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        ) : (
          <Youtube className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FF0000]" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-halo-action">{actionText} {label}</span>
        <span className="uiverse-halo-handle">{handle}</span>
      </div>
    </a>
  );
};
