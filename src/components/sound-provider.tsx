"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { soundSystem, SoundType } from "@/lib/sound-system";

interface SoundContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  playSound: (type: SoundType) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const SoundContext = createContext<SoundContextValue>({
  isMuted: false,
  toggleMute: () => {},
  setMuted: () => {},
  playSound: () => {},
  volume: 0.5,
  setVolume: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    setIsMutedState(soundSystem.getMuted());
    setVolumeState(soundSystem.getVolume());

    const handleFirstGesture = () => {
      soundSystem.initOnGesture();
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    // Delegated sound feedback on interactive elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        'button, a, [role="button"], [role="tab"], [data-sound], input[type="radio"], input[type="checkbox"]'
      );
      if (!target) return;

      const soundOverride = target.getAttribute("data-sound") as SoundType | null;
      if (soundOverride) {
        soundSystem.play(soundOverride);
      } else if (target.getAttribute("role") === "tab" || target.classList.contains("tab")) {
        soundSystem.play("tab");
      } else {
        soundSystem.play("click");
      }
    };

    const handleGlobalHover = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        'button, a, [role="button"], [role="tab"], [data-sound-hover]'
      );
      if (!target) return;
      soundSystem.play("hover");
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    document.addEventListener("mouseover", handleGlobalHover, { capture: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      document.removeEventListener("mouseover", handleGlobalHover, { capture: true });
    };
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = soundSystem.toggleMute();
    setIsMutedState(nextMuted);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    soundSystem.setMuted(muted);
    setIsMutedState(muted);
  }, []);

  const setVolume = useCallback((vol: number) => {
    soundSystem.setVolume(vol);
    setVolumeState(vol);
  }, []);

  const playSound = useCallback((type: SoundType) => {
    soundSystem.play(type);
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, setMuted, playSound, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
