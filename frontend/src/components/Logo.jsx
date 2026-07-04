// Custom DocMind AI logo mark — a document silhouette with a scanning line,
// symbolizing AI reading/understanding a document. Avoids generic "brain" AI iconography.
const Logo = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document body */}
      <path
        d="M6 2.5H14L18 6.5V20.5C18 21.05 17.55 21.5 17 21.5H6.5C5.95 21.5 5.5 21.05 5.5 20.5V3.5C5.5 2.95 5.95 2.5 6.5 2.5Z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.08)"
      />
      {/* Folded corner */}
      <path
        d="M14 2.5V6.5H18"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Scan line */}
      <line x1="8" y1="12" x2="15" y2="12" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      {/* Scan pulse dot */}
      <circle cx="16.3" cy="12" r="1.3" fill="white" />
    </svg>
  );
};

export default Logo;