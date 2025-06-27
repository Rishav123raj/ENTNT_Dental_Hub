"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/use-app";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        const url = user.role === "Admin" ? "/admin/dashboard" : `/patient/dashboard`;
        router.push(url);
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
