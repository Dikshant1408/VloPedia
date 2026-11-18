"use strict";

import React from "react";

interface RichTextProps {
  text: string;
  className?: string;
}

// Tag to CSS class mapping matching Valorant game aesthetics
const TAG_STYLES: Record<string, string> = {
  whitebold: "font-bold text-white",
  white: "text-white font-medium",
  teal: "text-[#0DF2F2] font-semibold",
  debuffred: "text-[#FF4655] font-semibold",
  buffblue: "text-[#3B82F6] font-semibold",
  primary: "text-primary font-semibold",
  success: "text-emerald-400 font-semibold",
  error: "text-[#FF4655] font-semibold",
  warning: "text-amber-400 font-semibold",
  yellow: "text-yellow-400 font-semibold",
  gold: "text-amber-300 font-semibold",
  muted: "text-muted",
  accent: "text-accent",
  key: "font-mono font-bold text-white bg-white/10 px-1 py-0.5 rounded text-[11px]",
};

/**
 * Strips all Valorant API markup tags and returns plain text.
 * Useful for SEO titles, meta descriptions, and JSON-LD schema.
 */
export function stripRichText(text: string): string {
  if (!text || typeof text !== "string") return text ?? "";
  if (!text.includes("<")) return text;
  return text
    .replace(/<[a-zA-Z0-9_-]+>(.*?)(?:<\/[a-zA-Z0-9_-]*>|<\/|$)/gs, (_m, content) => content)
    .replace(/<[^>]*>/g, "");
}

/**
 * Parses Valorant API rich text markup:
 * Supports:
 * - <whitebold>Keyword</>
 * - <debuffred>flashing</>
 * - <teal>radiant power</>
 * - <tag>content</tag>
 * - malformed/unclosed tags
 */
export function parseRichText(text: string): React.ReactNode {
  if (!text || typeof text !== "string") return text ?? "";
  if (!text.includes("<")) return text;

  // Match: <tagName>innerText</> or <tagName>innerText</tagName> or <tagName>innerText</ or to end of string
  const tagRegex = /<([a-zA-Z0-9_-]+)>(.*?)(?:<\/\1>|<\/>|<\/\1\b|<\/|$)/gs;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(text)) !== null) {
    const [full, tagName, innerText] = match;
    const tagStart = match.index;

    // Add plain text before this tag (cleaning up any accidental stray brackets)
    if (tagStart > lastIndex) {
      const beforeText = text.slice(lastIndex, tagStart).replace(/<\/[^>]*>/g, "");
      if (beforeText) parts.push(beforeText);
    }

    // Add the styled inner text
    const lowerTag = tagName.toLowerCase();
    const styleClass = TAG_STYLES[lowerTag] || "font-bold text-white";
    const parsedInner = innerText.includes("<") ? parseRichText(innerText) : innerText;

    parts.push(
      <span key={`${tagStart}-${lowerTag}`} className={styleClass}>
        {parsedInner}
      </span>
    );

    lastIndex = tagStart + full.length;
  }

  // Add remaining text (cleaning up any stray closing tags)
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex).replace(/<\/[^>]*>/g, "");
    if (remainingText) parts.push(remainingText);
  }

  return parts.length > 0 ? parts : text;
}

export function RichText({ text, className }: RichTextProps) {
  if (!text) return null;
  return (
    <span className={className}>
      {parseRichText(text)}
    </span>
  );
}
