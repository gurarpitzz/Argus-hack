import React from 'react';

interface ArgusLogoProps {
  size?: number;
  className?: string;
}

export const ArgusShieldEyeLogo: React.FC<ArgusLogoProps> = ({ 
  size = 42, 
  className = ""
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size * 1.12 }}
    >
      <svg
        viewBox="0 0 100 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
      >
        <defs>
          <filter id="argusGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="irisGrad" x1="42" y1="44" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF7ED" />
            <stop offset="45%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>

        {/* Outer Shield Outline */}
        <path
          d="M50 4 L88 18 C88 58 74 90 50 108 C26 90 12 58 12 18 Z"
          stroke="url(#shieldGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(249, 115, 22, 0.08)"
          filter="url(#argusGlow)"
        />

        {/* Inner Shield Contour */}
        <path
          d="M50 13 L80 24 C80 54 68 81 50 96 C32 81 20 54 20 24 Z"
          stroke="#F97316"
          strokeWidth="1.8"
          strokeOpacity="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Top Brow / Sensor Bracket Lines */}
        <path
          d="M32 27 Q50 22 68 27"
          stroke="#F97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#argusGlow)"
        />
        <path
          d="M37 22 L43 22 M57 22 L63 22"
          stroke="#F97316"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Eye - Upper Eyelid Curve */}
        <path
          d="M22 52 C30 36 70 36 78 52"
          stroke="#FF6B00"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
          filter="url(#argusGlow)"
        />
        {/* Eye - Lower Eyelid Curve */}
        <path
          d="M22 52 C30 68 70 68 78 52"
          stroke="#FF6B00"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
          filter="url(#argusGlow)"
        />

        {/* Outer Iris Ring */}
        <circle
          cx="50"
          cy="52"
          r="12.5"
          stroke="#F97316"
          strokeWidth="2.5"
          fill="rgba(255, 247, 237, 0.95)"
          filter="url(#argusGlow)"
        />

        {/* Inner Glowing Pupil */}
        <circle
          cx="50"
          cy="52"
          r="6.5"
          fill="url(#irisGrad)"
          stroke="#EA580C"
          strokeWidth="1"
          filter="url(#argusGlow)"
        />

        {/* Pupil Specular Highlight */}
        <circle
          cx="48"
          cy="50"
          r="1.8"
          fill="#FFFFFF"
        />

        {/* Bottom Cybernetic Bracket Accents */}
        <path
          d="M36 76 Q50 82 64 76"
          stroke="#F97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.95"
          filter="url(#argusGlow)"
        />
        <path
          d="M44 83 L50 87 L56 83"
          stroke="#F97316"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export const ArgusBrand: React.FC<{
  logoSize?: number;
  titleSize?: string;
  subtitleSize?: string;
  className?: string;
}> = ({
  logoSize = 44,
  titleSize = "text-2xl",
  subtitleSize = "text-[11px]",
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <ArgusShieldEyeLogo size={logoSize} />
      <div className="flex flex-col justify-center">
        <span className={`${titleSize} font-extrabold tracking-wider text-slate-900 uppercase leading-none font-sans flex items-center gap-1.5`}>
          ARGUS
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
        </span>
        <span className={`${subtitleSize} font-medium text-slate-500 tracking-normal leading-tight mt-1`}>
          Digital Forensics & Intelligence Platform
        </span>
      </div>
    </div>
  );
};
