import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Responsive Glossy Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Designed to look stunning on both smartphones & desktop screens.
 */

interface SocialButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const Icon = isInsta ? InstagramIcon : Youtube;
  const colorClass = isInsta ? 'social-btn-insta' : 'social-btn-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-social-icon-wrapper">
        <Icon className="uiverse-social-icon" />
      </div>
      <div className="uiverse-social-text">
        <span className="uiverse-social-platform">{label}</span>
        <span className="uiverse-social-handle">{handle}</span>
      </div>
    </a>
  );
};
