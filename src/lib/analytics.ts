"use client";

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
    console.log(`[Analytics] Event: ${event}`, properties);
  }
};
