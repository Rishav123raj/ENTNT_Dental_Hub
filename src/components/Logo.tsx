import { Tooth } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-xl font-bold font-headline text-accent ${className}`}>
      <Tooth className="h-6 w-6" />
      <span>ENTNT Dental Hub</span>
    </div>
  );
}
