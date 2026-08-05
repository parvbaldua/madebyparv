import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Neon Glow Trail Social Button
 * Dedicated social button with animated neon border trail & glassmorphic core.
 * Optimized for smartphones & desktop.
 */

interface SocialGlowButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialGlowButton: React.FC<SocialGlowButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow' : 'Subscribe';
  const Icon = isInsta ? InstagramIcon : Youtube;
  const colorClass = isInsta ? 'social-glow-insta' : 'social-glow-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-glow-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <span className="uiverse-social-glow-border"></span>
      <div className="uiverse-social-glow-inner">
        <div className="uiverse-social-glow-icon">
          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="uiverse-social-action">{actionText} • {label}</span>
          <span className="uiverse-social-handle">{handle}</span>
        </div>
      </div>
    </a>
  );
};
