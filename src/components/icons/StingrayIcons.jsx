import React from 'react';
import { STINGRAY_ICON_PATHS } from './stingrayIconPaths';

/**
 * Universal StingrayIcon component
 * @param {string} name - Icon key from STINGRAY_ICON_PATHS
 * @param {number|string} size - Icon dimensions in px (default: 24)
 * @param {string} className - Optional Tailwind / CSS classes
 * @param {string} color - Fill color (default: 'currentColor')
 */
export function StingrayIcon({
  name = 'p-ray',
  size = 24,
  className = '',
  color = 'currentColor',
  ...props
}) {
  const icon = STINGRAY_ICON_PATHS[name] || STINGRAY_ICON_PATHS['p-ray'];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill={color}
      shapeRendering="crispEdges"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label={icon.name}
      role="img"
      {...props}
    >
      <path d={icon.path} />
    </svg>
  );
}

// Named exports for convenient direct imports
export const PRayIcon = (props) => <StingrayIcon name="p-ray" {...props} />;
export const StealthRayIcon = (props) => <StingrayIcon name="stealth-ray" {...props} />;
export const MantaRayIcon = (props) => <StingrayIcon name="manta-ray" {...props} />;
export const StingrayGearIcon = (props) => <StingrayIcon name="gear" {...props} />;
export const StingrayTrophyIcon = (props) => <StingrayIcon name="trophy" {...props} />;
export const StingrayDownloadIcon = (props) => <StingrayIcon name="download" {...props} />;
export const StingrayUploadIcon = (props) => <StingrayIcon name="upload" {...props} />;
export const StingrayChatIcon = (props) => <StingrayIcon name="chat" {...props} />;
export const StingrayVerifiedIcon = (props) => <StingrayIcon name="verified" {...props} />;
export const StingrayGamepadIcon = (props) => <StingrayIcon name="gamepad" {...props} />;
export const StingrayShieldIcon = (props) => <StingrayIcon name="shield" {...props} />;
export const StingrayNeuralIcon = (props) => <StingrayIcon name="neural-ai" {...props} />;
export const StingraySonarIcon = (props) => <StingrayIcon name="sonar" {...props} />;
export const StingrayTerminalIcon = (props) => <StingrayIcon name="terminal" {...props} />;
export const StingrayBoltIcon = (props) => <StingrayIcon name="bolt" {...props} />;
export const StingrayStarIcon = (props) => <StingrayIcon name="star" {...props} />;
export const StingrayUserIcon = (props) => <StingrayIcon name="user" {...props} />;
export const StingraySearchIcon = (props) => <StingrayIcon name="search" {...props} />;
export const StingrayFolderIcon = (props) => <StingrayIcon name="folder" {...props} />;
export const StingrayCubeIcon = (props) => <StingrayIcon name="cube" {...props} />;

export default StingrayIcon;
