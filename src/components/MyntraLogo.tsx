import React from 'react';

interface MyntraLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Authentic Myntra Brand Logo Component
 * Renders the iconic 4-ribbon overlapping M emblem with the official brand colorway
 * (Pink, Coral, Orange, and Golden Yellow) alongside the clean "myntra" wordmark.
 */
export const MyntraLogo: React.FC<MyntraLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const dimensions = {
    sm: { height: 22, iconSize: 22, fontSize: 'text-sm' },
    md: { height: 28, iconSize: 28, fontSize: 'text-base' },
    lg: { height: 36, iconSize: 36, fontSize: 'text-xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Authentic Myntra 4-ribbon overlapping 'M' emblem */}
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-2xs"
        aria-label="Myntra Logo"
      >
        <defs>
          {/* Gradient 1: Deep Magenta to Vivid Pink */}
          <linearGradient id="myntraGrad1" x1="0%" y1="100%" x2="40%" y2="0%">
            <stop offset="0%" stopColor="#c70054" />
            <stop offset="40%" stopColor="#e40066" />
            <stop offset="100%" stopColor="#ff3f6c" />
          </linearGradient>

          {/* Gradient 2: Vivid Pink to Bright Coral */}
          <linearGradient id="myntraGrad2" x1="20%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff3f6c" />
            <stop offset="60%" stopColor="#ff5a5f" />
            <stop offset="100%" stopColor="#ff7a36" />
          </linearGradient>

          {/* Gradient 3: Coral to Bright Orange */}
          <linearGradient id="myntraGrad3" x1="40%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#ff5252" />
            <stop offset="50%" stopColor="#ff7a18" />
            <stop offset="100%" stopColor="#ffa000" />
          </linearGradient>

          {/* Gradient 4: Orange to Golden Yellow */}
          <linearGradient id="myntraGrad4" x1="60%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9100" />
            <stop offset="50%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#ffca28" />
          </linearGradient>
        </defs>

        {/* Leftmost Ribbon Loop: Stem from bottom-left up to left peak */}
        <path
          d="M12 70 C10 48, 16 26, 32 10 C38 4, 46 6, 47 16 C48 26, 42 42, 33 56 C26 67, 18 73, 12 70 Z"
          fill="url(#myntraGrad1)"
        />

        {/* Inner-Left Ribbon: Loop from left peak down towards center valley */}
        <path
          d="M32 10 C38 4, 47 7, 49 18 C51 32, 45 49, 39 62 C34 71, 28 73, 24 67 C28 54, 38 32, 32 10 Z"
          fill="url(#myntraGrad2)"
          opacity="0.95"
        />

        {/* Inner-Right Ribbon: Loop from center valley up towards right peak */}
        <path
          d="M42 66 C40 52, 48 30, 58 14 C64 5, 74 7, 76 19 C78 33, 68 52, 58 65 C52 73, 44 74, 42 66 Z"
          fill="url(#myntraGrad3)"
        />

        {/* Rightmost Ribbon: Loop from right peak down to bottom-right */}
        <path
          d="M62 10 C68 4, 78 6, 80 18 C83 38, 86 54, 88 70 C83 74, 74 71, 68 62 C73 48, 77 30, 62 10 Z"
          fill="url(#myntraGrad4)"
        />

        {/* Dynamic Fold Highlight in Center Overlap */}
        <path
          d="M39 36 C45 22, 54 12, 60 11 C54 22, 46 36, 40 48 C38 43, 38 39, 39 36 Z"
          fill="#ff4081"
          opacity="0.8"
        />
      </svg>

      {/* Official styled "myntra" wordmark */}
      {showWordmark && (
        <span
          className={`font-black lowercase tracking-tight text-gray-900 ${dimensions.fontSize} font-sans`}
          style={{ letterSpacing: '-0.04em' }}
        >
          myntra
        </span>
      )}
    </div>
  );
};
