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
