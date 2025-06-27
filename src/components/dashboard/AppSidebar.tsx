"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/hooks/use-app";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  LogOut,
  BadgeDollarSign
} from "lucide-react";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/appointments", label: "Appointments", icon: Stethoscope },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
];

const patientNavItems = [
  { href: "/patient/dashboard", label: "My Dashboard", icon: LayoutDashboard },
];

export function AppSidebar() {
  const { user, logout } = useApp();
  const pathname = usePathname();
  const navItems = user?.role === "Admin" ? adminNavItems : patientNavItems;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === href && "bg-muted text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          {/* Add extra content here if needed */}
        </div>
      </div>
    </div>
  );
}
