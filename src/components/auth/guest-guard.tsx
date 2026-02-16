"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PageLoader } from "@/components/shared/loading-spinner";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard component redirects authenticated users to the timeline page.
 * It is used for pages that should only be accessible to guests (e.g., Login, Register).
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && !isLoading && isAuthenticated) {
      router.replace("/timeline");
    }
  }, [isAuthenticated, isLoading, isHydrated, router]);

  // Show a loader while checking auth state
  if (!isHydrated || isLoading) {
    return <PageLoader />;
  }

  // If authenticated, we show nothing (or the loader) while the redirect happens
  if (isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
