export function VaultSafeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Shield */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      
      {/* Inner Medical Cross */}
      <path d="M12 8v8" />
      <path d="M8 12h8" />
      
      {/* Subtle Vault/Secure lines on sides (optional reinforcement) */}
      <path d="M7 10h2" />
      <path d="M15 10h2" />
    </svg>
  );
}

export function VaultSafeShieldMedicalCrossIcon({ className = "h-6 w-6 text-primary" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Main Shield */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      
      {/* Medical Cross */}
      <path d="M12 8v8" />
      <path d="M8 12h8" />
      
      {/* Subtle Vault/Secure Lines */}
      <path d="M7 9.5h2" />
      <path d="M15 9.5h2" />
      <path d="M7 14.5h2" />
      <path d="M15 14.5h2" />
    </svg>
  );
}

export function VaultSafeShieldLockBoltIcon({ className = "h-6 w-6 text-primary" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Shield Base */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      
      {/* Central Lock Bolt / Secure Element */}
      <rect x="9" y="9" width="6" height="7" rx="1" />
      <circle cx="12" cy="12.5" r="1.5" />
      
      {/* Subtle side reinforcement lines */}
      <path d="M7 11h2" />
      <path d="M15 11h2" />
    </svg>
  );
}

export function VaultSafeMinimalShieldIcon({ className = "h-6 w-6 text-primary" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Shield */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      
      {/* Inner Hexagon (safety symbol) */}
      <path d="M12 7 L16.5 9.5 L16.5 14.5 L12 17 L7.5 14.5 L7.5 9.5 Z" />
      
      {/* Tiny center dot for focus */}
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

