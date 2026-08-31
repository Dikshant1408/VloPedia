/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from "react";

const GLITCH_CHARS = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789$#@&%?[]{}<>/\\+=_*-";

export function useTextDecoder(initialText: string, speed = 30, delay = 0) {
  const [displayText, setDisplayText] = useState(initialText);
  const targetTextRef = useRef(initialText);
  const frameRef = useRef<number | null>(null);

  const startDecoder = useCallback((text: string) => {
    targetTextRef.current = text;
    let iteration = 0;
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const update = () => {
      const target = targetTextRef.current;
      const result = target
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          
          if (index < iteration) {
            return target[index];
          }
          
          // Return a random glitch character
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");

      setDisplayText(result);

      if (iteration < target.length) {
        iteration += 1 / 3; // speed regulator
        frameRef.current = requestAnimationFrame(update);
      } else {
        setDisplayText(target);
      }
    };

    frameRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (delay > 0) {
      timeoutId = setTimeout(() => {
        startDecoder(initialText);
      }, delay);
    } else {
      startDecoder(initialText);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialText, delay, startDecoder]);

  const trigger = useCallback(() => {
    startDecoder(targetTextRef.current);
  }, [startDecoder]);

  return { displayText, trigger };
}
