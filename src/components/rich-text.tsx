"use strict";

interface RichTextProps {
  text: string;
  className?: string;
}

// Tag to CSS class mapping
const TAG_STYLES: Record<string, string> = {
  whitebold: "font-bold text-white",
  white: "text-white",
  teal: "text-[#0DF2F2]",
  debuffred: "text-[#FF4655]",
  primary: "text-primary",
  success: "text-success",
  error: "text-error",
  muted: "text-muted",
  accent: "text-accent",
};

function parseRichText(text: string): React.ReactNode {
  // Regex to match tags like <teal>text</ or <teal>text</teal>
  // VALORANT API uses malformed tags: <tag>content</ (missing closing tag name and >)
  const tagRegex = /<(\w+)>(.*?)<\/\1>?/gs;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(tagRegex)) {
    const [full, tagName, innerText] = match;
    const tagStart = match.index!;

    // Add text before this tag
    if (tagStart > lastIndex) {
      parts.push(text.slice(lastIndex, tagStart));
    }

    // Add the styled inner text
    const className = TAG_STYLES[tagName] || "";
    parts.push(
      <span key={tagStart} className={className}>
        {parseRichText(innerText)}
      </span>
    );

    lastIndex = match.index! + full.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function RichText({ text, className }: RichTextProps) {
  return (
    <span className={className}>
      {parseRichText(text)}
    </span>
  );
}
