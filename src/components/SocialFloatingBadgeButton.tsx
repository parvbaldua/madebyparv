import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Floating Minimalist Badge Capsule Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features a glowing brand status tag on the right side of the pill.
 */

interface SocialFloatingBadgeButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialFloatingBadgeButton: React.FC<SocialFloatingBadgeButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const tagText = isInsta ? 'INSTA' : 'YT';
  const colorClass = isInsta ? 'social-floating-insta' : 'social-floating-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-floating-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-floating-icon-box">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
        )}
      </div>
      <span className="uiverse-floating-handle">{handle}</span>
      <span className="uiverse-floating-tag">{tagText}</span>
    </a>
  );
};
