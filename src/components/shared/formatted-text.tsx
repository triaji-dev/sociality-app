"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormattedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

export function FormattedText({ text, className, linkClassName }: FormattedTextProps) {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  const parts = text.split(urlRegex);

  return (
    <span className={cn("whitespace-pre-wrap wrap-break-words", className)}>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-primary-300 hover:underline cursor-pointer transition-all",
                linkClassName
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
