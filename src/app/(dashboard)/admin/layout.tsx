"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/use-app";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "Admin") {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'Admin') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
