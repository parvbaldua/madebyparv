import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Minimalist Split Badge Social Chip Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Ultra-compact split chip design with solid brand icon block on the left
 * and dark frosted glass handle container on the right.
 */

interface SocialSplitChipButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialSplitChipButton: React.FC<SocialSplitChipButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const colorClass = isInsta ? 'social-splitchip-insta' : 'social-splitchip-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-splitchip-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-splitchip-left">
        {isInsta ? (
          <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        )}
      </div>
      <div className="uiverse-splitchip-right">
        <span className="uiverse-splitchip-handle">{handle}</span>
      </div>
    </a>
  );
};
