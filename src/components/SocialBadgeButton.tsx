import React from 'react';
import { Youtube } from 'lucide-react';

/**
 * Authentic Instagram Multi-Color Gradient Icon SVG
 * Official Brand Colors: #f09433 -> #e6683c -> #dc2743 -> #cc2366 -> #bc1888
 */
export const InstagramGradientIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#insta-brand-gradient)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
      <linearGradient id="insta-brand-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface SocialBadgeButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const SocialBadgeButton: React.FC<SocialBadgeButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const tagText = isInsta ? 'FOLLOW' : 'SUBSCRIBE';
  const colorClass = isInsta ? 'social-badge-insta' : 'social-badge-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-badge-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-badge-left">
        {isInsta ? (
          <InstagramGradientIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 uiverse-badge-icon" />
        ) : (
          <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5 uiverse-badge-icon text-[#FF0000]" />
        )}
        <span className="uiverse-badge-handle">{handle}</span>
      </div>
      <span className="uiverse-badge-tag">{tagText}</span>
    </a>
  );
};
