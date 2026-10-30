"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html>
      <head>
        <title>Application Error | VloPedia</title>
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="max-w-md text-center">
            <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-4">Application Error</h1>
            <p className="text-secondary mb-6">
              A client-side exception occurred while loading the page.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider rounded hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
