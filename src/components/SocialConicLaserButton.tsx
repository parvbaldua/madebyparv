import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Conic Laser Beam Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features an intense rotating laser beam border highlight.
 */

interface SocialConicLaserButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialConicLaserButton: React.FC<SocialConicLaserButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-laser-insta' : 'social-laser-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-laser-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <span className="uiverse-laser-beam"></span>
      <div className="uiverse-laser-inner">
        <div className="uiverse-laser-icon-box">
          {isInsta ? (
            <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : (
            <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="uiverse-laser-action">{actionText} {label}</span>
          <span className="uiverse-laser-handle">{handle}</span>
        </div>
      </div>
    </a>
  );
};
