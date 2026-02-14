"use client";

import { TimelineTabs } from "@/components/timeline/timeline-tabs";
import { AuthGuard } from "@/components/auth";

export default function TimelinePage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto">
        <TimelineTabs />
      </div>
    </AuthGuard>
  );
}
