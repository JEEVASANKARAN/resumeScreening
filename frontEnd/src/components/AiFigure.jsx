/* Floating abstract human-like AI figure built with SVG paths */
export default function AiFigure({ className = '' }) {
  return (
    <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#c084fc" />
          <stop offset="50%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glowing Aura Core */}
      <circle cx="50" cy="70" r="28" fill="url(#coreGlow)">
        <animate attributeName="r" values="24;32;24" dur="8s" repeatCount="indefinite" />
      </circle>

      {/* Head */}
      <circle cx="50" cy="18" r="12" stroke="url(#fg)" strokeWidth="1.5" />
      <circle cx="50" cy="18" r="16" stroke="url(#fg)" strokeWidth="0.5" strokeDasharray="2 4" />
      
      {/* Eyes - Glowing dots */}
      <circle cx="45" cy="17" r="2.5" fill="#22d3ee">
        <animate attributeName="r" values="1.5;3;1.5" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="55" cy="17" r="2.5" fill="#22d3ee">
        <animate attributeName="r" values="1.5;3;1.5" dur="4s" repeatCount="indefinite" />
      </circle>
      <line x1="45" y1="17" x2="55" y2="17" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />
      
      {/* Neck */}
      <line x1="50" y1="30" x2="50" y2="40" stroke="url(#fg)" strokeWidth="1.5" />
      
      {/* Shoulders & Torso outline */}
      <path d="M22 45 Q50 36 78 45 L74 95 Q50 105 26 95 Z" stroke="url(#fg)" strokeWidth="1.2" fill="none" />
      
      {/* Arms */}
      <path d="M22 45 L12 85 L20 100" stroke="url(#fg)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M78 45 L88 85 L80 100" stroke="url(#fg)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      
      {/* Energy Core / Heart */}
      <circle cx="50" cy="70" r="8" stroke="url(#fg)" strokeWidth="1.5" fill="none">
        <animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="70" r="3" fill="#ffffff" />
      
      {/* Intricate Circuit Lines */}
      <polyline points="28,65 42,70 28,75" stroke="url(#fg)" strokeWidth="1" opacity="0.6" fill="none" />
      <polyline points="72,65 58,70 72,75" stroke="url(#fg)" strokeWidth="1" opacity="0.6" fill="none" />
      <line x1="50" y1="40" x2="50" y2="62" stroke="url(#fg)" strokeWidth="1" opacity="0.6" />
      <line x1="50" y1="78" x2="50" y2="100" stroke="url(#fg)" strokeWidth="1" opacity="0.6" />
      
      <circle cx="35" cy="85" r="2" fill="url(#fg)" />
      <circle cx="65" cy="85" r="2" fill="url(#fg)" />
      
      {/* Floating Legs Effect */}
      <path d="M34 98 Q30 130 38 145" stroke="url(#fg)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M66 98 Q70 130 62 145" stroke="url(#fg)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="148" r="2" fill="#22d3ee" opacity="0.6" />
      <circle cx="62" cy="148" r="2" fill="#22d3ee" opacity="0.6" />

    </svg>
  )
}
