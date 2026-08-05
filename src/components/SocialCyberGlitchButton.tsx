import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Sci-Fi Cyber Polygon Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features futuristic polygon cut corners and glowing neon border.
 */

interface SocialCyberGlitchButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialCyberGlitchButton: React.FC<SocialCyberGlitchButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-cyber-insta' : 'social-cyber-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-cyber-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-cyber-icon-box">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-cyber-action">{actionText} {label}</span>
        <span className="uiverse-cyber-handle">{handle}</span>
      </div>
    </a>
  );
};
