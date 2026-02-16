"use client";

import { useState } from "react";
import { X, Copy, Share2, Twitter, Facebook, MessageCircle, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 group p-2 transition-transform cursor-pointer focus:outline-none"
    >
      <div className={cn(
        "w-12 h-12 flex items-center justify-center rounded-full bg-muted transition-all duration-200 group-hover:scale-110 group-active:scale-95 border border-transparent group-hover:border-border/50",
        active && "bg-primary/10 text-primary border-primary/20"
      )}>
        <Icon className={cn("w-5 h-5 transition-colors", colorClass)} strokeWidth={1.5} />
      </div>
      <span className="text-muted-foreground text-xs font-medium group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );

  const ShareContent = () => (
    <div className="flex flex-col gap-6 py-4 w-full">
       <div className="grid grid-cols-4 gap-4">
          <ShareButton 
            onClick={handleCopyLink} 
            icon={copied ? Check : Copy} 
            label={copied ? "Copied" : "Copy"} 
            active={copied}
          />
          <ShareButton 
            onClick={handleNativeShare} 
            icon={Share2} 
            label="More" 
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

       <div className="space-y-2">
          <p className="text-sm font-medium text-foreground px-1">Page Link</p>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-xl border border-border/50 group-focus-within:border-primary/50 transition-colors">
             <div className="flex-1 px-2 overflow-hidden min-w-0">
                <p className="text-sm text-muted-foreground truncate font-mono select-all">{url}</p>
             </div>
             <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyLink}
                className={cn(
                   "h-8 px-3 rounded-lg font-medium transition-all hover:bg-background shadow-sm",
                   copied ? "text-green-500" : "text-primary"
                )}
             >
                {copied ? "Copied" : "Copy"}
             </Button>
          </div>
       </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent showCloseButton={false} className="sm:max-w-md gap-0 p-0 overflow-hidden border-border bg-background shadow-lg sm:rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold">Share</DialogTitle>
            <DialogClose className="rounded-full p-2 hover:bg-accent transition-colors -mr-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="px-6 pb-6">
            <ShareContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] max-h-[85vh] p-0 flex flex-col gap-0 bg-background border-t border-border">
         <SheetHeader className="px-6 py-4 border-b border-border/40">
            <SheetTitle className="text-lg font-bold text-left">Share</SheetTitle>
         </SheetHeader>
         <div className="px-6 pb-8 pt-2">
            <ShareContent />
         </div>
      </SheetContent>
    </Sheet>
  );
}
