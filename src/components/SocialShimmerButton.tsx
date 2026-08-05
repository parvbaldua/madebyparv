import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Border Pill with Sliding Shimmer Overlay
 * Applied ONLY to social links (Instagram & YouTube)
 */

interface SocialShimmerButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialShimmerButton: React.FC<SocialShimmerButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow' : 'Subscribe';
  const Icon = isInsta ? InstagramIcon : Youtube;
  const colorClass = isInsta ? 'social-shimmer-insta' : 'social-shimmer-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-shimmer-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <span className="uiverse-shimmer-beam"></span>
      <div className="uiverse-shimmer-icon-box">
        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-shimmer-action">{actionText} • {label}</span>
        <span className="uiverse-shimmer-handle">{handle}</span>
      </div>
    </a>
  );
};
