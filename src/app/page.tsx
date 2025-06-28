"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/hooks/use-app";
import { Loader2, ShieldCheck, CalendarHeart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        const url = user.role === "Admin" ? "/admin/dashboard" : `/patient/dashboard`;
        router.push(url);
      }
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Modern Dental Care for a Brighter Smile
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our platform provides seamless management of patient records, appointments, and billing, making dental care efficient and stress-free.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                     <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need in One Place</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From patient onboarding to treatment history, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-2">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Patient Data</h3>
                <p className="text-muted-foreground">
                  Robust security measures to keep patient information confidential and safe.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-2">
                    <CalendarHeart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Appointment Scheduling</h3>
                <p className="text-muted-foreground">
                  Easily manage appointments and calendars for both staff and patients.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-2">
                    <Wallet className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Billing & Invoicing</h3>
                <p className="text-muted-foreground">
                  Streamlined billing process with automated invoicing and payment tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ENTNT Dental Hub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
             <p className="text-xs text-muted-foreground">
                Built with Firebase Studio
            </p>
        </nav>
      </footer>
    </div>
  );
}
