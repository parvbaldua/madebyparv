import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Glossy Glassmorphic Pill Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features soft frosted glass surface and glowing brand drop-shadow.
 */

interface SocialGlassNeumorphicButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialGlassNeumorphicButton: React.FC<SocialGlassNeumorphicButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow on' : 'Subscribe to';
  const colorClass = isInsta ? 'social-neumorphism-insta' : 'social-neumorphism-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-neumorphism-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-neumorphism-icon-box">
        {isInsta ? (
          <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-neumorphism-action">{actionText} {label}</span>
        <span className="uiverse-neumorphism-handle">{handle}</span>
      </div>
    </a>
  );
};
