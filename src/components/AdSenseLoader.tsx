"use client";

import { useEffect } from "react";

export default function AdSenseLoader() {
  useEffect(() => {
    let loaded = false;

    const loadScript = () => {
      if (loaded) return;
      loaded = true;

      // Clean up event listeners immediately
      window.removeEventListener("mousemove", loadScript);
      window.removeEventListener("scroll", loadScript);
      window.removeEventListener("keydown", loadScript);
      window.removeEventListener("touchstart", loadScript);

      // Dynamically inject the script tag
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5851997796287592";
      script.crossOrigin = "anonymous";
      script.async = true;
      document.body.appendChild(script);
    };

    // Attach listeners for first user interaction
    window.addEventListener("mousemove", loadScript, { passive: true });
    window.addEventListener("scroll", loadScript, { passive: true });
    window.addEventListener("keydown", loadScript, { passive: true });
    window.addEventListener("touchstart", loadScript, { passive: true });

    return () => {
      window.removeEventListener("mousemove", loadScript);
      window.removeEventListener("scroll", loadScript);
      window.removeEventListener("keydown", loadScript);
      window.removeEventListener("touchstart", loadScript);
    };
  }, []);

  return null;
}
