"use client";

/**
 * Lightweight analytics utility for MVP.
 * In a real app, this would send data to a service like Google Analytics, Mixpanel, or PostHog.
 * For now, it logs to the console for verification.
 */

type AnalyticsEvent = 
  | "view_post"
  | "like_post"
  | "unlike_post"
  | "save_post"
  | "unsave_post"
  | "comment_post"
  | "follow_user"
  | "unfollow_user"
  | "share_post"
  | "share_profile";

interface EventProperties {
  postId?: number;
  targetUsername?: string;
  source?: string;
  [key: string]: any;
}

export const analytics = {
  track: (event: AnalyticsEvent, properties?: EventProperties) => {
    // In production, you would call your analytics provider here
    // Example: window.ga('send', 'event', 'Interaction', event, properties);
    
    console.log(`[Analytics] Event: ${event}`, properties);
    
    // Optional: Send to a lightweight internal logging endpoint
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event, properties, timestamp: Date.now() }) });
  }
};
