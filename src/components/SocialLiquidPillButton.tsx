import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Liquid Morphing Pill Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features an animated fluid neon gradient border trail that shifts continuously.
 */

interface SocialLiquidPillButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialLiquidPillButton: React.FC<SocialLiquidPillButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-liquid-insta' : 'social-liquid-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-liquid-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-liquid-icon-tile">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-liquid-action">{actionText} {label}</span>
        <span className="uiverse-liquid-handle">{handle}</span>
      </div>
    </a>
  );
};
