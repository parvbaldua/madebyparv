import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Pulsing Pill Card with Glowing Icon Ring
 * Applied ONLY to social links (Instagram & YouTube)
 * Features an animated pulsing outer ring aura around the brand icon.
 */

interface SocialPulsingRingButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialPulsingRingButton: React.FC<SocialPulsingRingButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-ring-insta' : 'social-ring-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-ring-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-ring-icon-wrapper">
        <span className="uiverse-ring-pulse-aura"></span>
        <div className="uiverse-ring-icon-box">
          {isInsta ? (
            <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          ) : (
            <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          )}
        </div>
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-ring-action">{actionText} {label}</span>
        <span className="uiverse-ring-handle">{handle}</span>
      </div>
    </a>
  );
};
