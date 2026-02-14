"use client";

import { useState } from "react";
import { X, Copy, Share2, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  description = "",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url });
      } else {
        handleCopyLink();
      }
    } catch (err) {
      // User cancelled sharing
    }
  };

  const handleSocialShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Desktop Modal */}
      <div className="hidden md:flex relative flex-col w-[400px] bg-background border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-row justify-between items-center p-6 border-b border-border">
          <h2 className="text-foreground text-lg font-bold leading-7 tracking-tight">
            Share
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-6 gap-4">
          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <Copy className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              <span className="text-foreground text-sm font-medium">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <Share2 className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              <span className="text-foreground text-sm font-medium">Share</span>
            </button>

            <button
              onClick={() => handleSocialShare("twitter")}
              className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <Twitter className="w-6 h-6 text-[#1DA1F2]" strokeWidth={1.5} />
              <span className="text-foreground text-sm font-medium">Twitter</span>
            </button>

            <button
              onClick={() => handleSocialShare("facebook")}
              className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <Facebook className="w-6 h-6 text-[#1877F2]" strokeWidth={1.5} />
              <span className="text-foreground text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* URL Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-muted-foreground text-xs font-medium mb-1">Link</p>
            <p className="text-foreground text-sm font-normal break-all">{url}</p>
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-70 animate-in slide-in-from-bottom duration-300">
        <div className="flex flex-col bg-background rounded-t-2xl border-t border-border">
          {/* Header */}
          <div className="flex flex-row justify-between items-center p-4 border-b border-border">
            <h2 className="text-foreground text-lg font-bold leading-7 tracking-tight">
              Share
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-foreground" strokeWidth={2} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col p-4 gap-4 pb-8">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <Copy className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                <span className="text-foreground text-sm font-medium">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>

              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <Share2 className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                <span className="text-foreground text-sm font-medium">Share</span>
              </button>

              <button
                onClick={() => handleSocialShare("twitter")}
                className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <Twitter className="w-6 h-6 text-[#1DA1F2]" strokeWidth={1.5} />
                <span className="text-foreground text-sm font-medium">Twitter</span>
              </button>

              <button
                onClick={() => handleSocialShare("facebook")}
                className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <Facebook className="w-6 h-6 text-[#1877F2]" strokeWidth={1.5} />
                <span className="text-foreground text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* URL Preview */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs font-medium mb-1">Link</p>
              <p className="text-foreground text-sm font-normal break-all">{url}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
