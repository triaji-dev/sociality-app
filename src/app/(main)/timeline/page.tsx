"use client";

import { TimelineTabs } from "@/components/timeline/timeline-tabs";
import { AuthGuard } from "@/components/auth";

export default function TimelinePage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Timeline</h1>
        <TimelineTabs />
      </div>
    </AuthGuard>
  );
}
