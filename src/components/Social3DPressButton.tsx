import React from 'react';
import { Instagram as InstagramIcon, Youtube } from 'lucide-react';

/**
 * UIverse Retro 3D Press Social Button
 * Applied ONLY to social links (Instagram & YouTube)
 * Features 3D offset shadow and tactile press down effect on tap/click.
 */

interface Social3DPressButtonProps {
  platform: 'instagram' | 'youtube';
  handle: string;
  href: string;
  className?: string;
}

export const Social3DPressButton: React.FC<Social3DPressButtonProps> = ({
  platform,
  handle,
  href,
  className = '',
}) => {
  const isInsta = platform === 'instagram';
  const label = isInsta ? 'Instagram' : 'YouTube';
  const actionText = isInsta ? 'Follow' : 'Subscribe';
  const Icon = isInsta ? InstagramIcon : Youtube;
  const colorClass = isInsta ? 'social-3d-insta' : 'social-3d-youtube';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`uiverse-social-3d-btn ${colorClass} ${className}`}
      title={`${label} ${handle}`}
    >
      <div className="uiverse-3d-icon-box">
        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="uiverse-3d-action">{actionText} • {label}</span>
        <span className="uiverse-3d-handle">{handle}</span>
      </div>
    </a>
  );
};
