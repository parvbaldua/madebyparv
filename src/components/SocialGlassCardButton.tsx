import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Responsive Glass Social Card Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Uses official brand-colored icon tiles (Instagram multi-color gradient & YouTube Red)
 * so icons are ALWAYS 100% visible on all devices.
 */

interface SocialGlassCardButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialGlassCardButton: React.FC<SocialGlassCardButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-glass-insta' : 'social-glass-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-glass-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-glass-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-glass-action">{actionText} {label}</span>
        <span className="uiverse-glass-handle">{handle}</span>
      </div>
    </a>
  );
};
