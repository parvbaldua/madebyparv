import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Conic Multi-Border Glow Social Card Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features dual animated gradient border & subtle glowing shadow.
 */

interface SocialNeonConicCardButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialNeonConicCardButton: React.FC<SocialNeonConicCardButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-conic-insta' : 'social-conic-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-conic-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-conic-icon-box">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-conic-action">{actionText} {label}</span>
        <span className="uiverse-conic-handle">{handle}</span>
      </div>
    </a>
  );
};
