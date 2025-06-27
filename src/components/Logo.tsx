export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-xl font-bold font-headline text-accent ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M9.34 4.63 12 2l2.66 2.63a3 3 0 0 1 .53 1.51L16 6H8l.81-1.86a3 3 0 0 1 .53-1.51Z" />
        <path d="M8 6h8v6a2 2 0 0 1-2 2h-1.5a2 2 0 0 0-2.5 2 2 2 0 0 1-2.5 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
      </svg>
      <span>ENTNT Dental Hub</span>
    </div>
  );
}
