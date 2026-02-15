"use client";

import { useState } from "react";
import { X, Copy, Share2, Twitter, Facebook, MessageCircle, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  const ShareButton = ({ 
    onClick, 
    icon: Icon, 
    label, 
    colorClass = "text-foreground",
    active = false
  }: { 
    onClick: () => void; 
    icon: any; 
    label: string; 
    colorClass?: string;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className={cn(
        "w-12 h-12 flex items-center justify-center rounded-2xl bg-muted group-hover:bg-accent group-hover:scale-110 transition-all duration-200",
        active && "bg-primary/20 text-primary"
      )}>
        <Icon className={cn("w-6 h-6", colorClass)} strokeWidth={1.5} />
      </div>
      <span className="text-foreground text-[10px] font-medium leading-tight">
        {label}
      </span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-70 flex items-end md:items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[440px] bg-background border border-border rounded-[32px] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 shadow-2xl">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-6 py-5 border-b border-border/50">
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            Share
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors cursor-pointer group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-6 gap-8">
          {/* Share Grid */}
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            <ShareButton 
              onClick={handleCopyLink} 
              icon={copied ? Check : Copy} 
              label={copied ? "Copied" : "Copy"} 
              active={copied}
            />
            <ShareButton 
              onClick={handleNativeShare} 
              icon={Share2} 
              label="System" 
            />
            <ShareButton 
              onClick={() => handleSocialShare("whatsapp")} 
              icon={MessageCircle} 
              label="WhatsApp" 
              colorClass="text-[#25D366]" 
            />
            <ShareButton 
              onClick={() => handleSocialShare("telegram")} 
              icon={Send} 
              label="Telegram" 
              colorClass="text-[#0088cc]" 
            />
            <ShareButton 
              onClick={() => handleSocialShare("twitter")} 
              icon={Twitter} 
              label="Twitter" 
              colorClass="text-[#1DA1F2]" 
            />
            <ShareButton 
              onClick={() => handleSocialShare("facebook")} 
              icon={Facebook} 
              label="Facebook" 
              colorClass="text-[#1877F2]" 
            />
          </div>

          {/* URL Section */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium px-1">Page Link</p>
            <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50 focus-within:border-primary/50 transition-colors">
              <div className="flex-1 px-3 py-2 overflow-hidden">
                <p className="text-foreground text-sm truncate font-medium">{url}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                  copied ? "bg-green-500/10 text-green-500" : "bg-primary text-white hover:opacity-90 active:scale-95"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
