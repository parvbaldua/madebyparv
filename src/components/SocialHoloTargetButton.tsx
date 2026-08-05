import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Sci-Fi Holographic Target Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features a glowing target ring and subtle diagonal shimmer sweep on hover.
 */

interface SocialHoloTargetButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialHoloTargetButton: React.FC<SocialHoloTargetButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-holo-target-insta' : 'social-holo-target-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-holo-target-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <span className="uiverse-holo-target-shimmer"></span>
      <div className="uiverse-holo-target-icon-box">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight z-10">
        <span className="uiverse-holo-target-action">{actionText} {label}</span>
        <span className="uiverse-holo-target-handle">{handle}</span>
      </div>
    </a>
  );
};
