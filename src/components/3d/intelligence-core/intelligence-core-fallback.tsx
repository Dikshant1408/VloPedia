"use client";

import React from "react";
import { CoreDomain, DOMAIN_METADATA } from "./intelligence-core.config";

interface FallbackProps {
  activeDomain: CoreDomain;
  className?: string;
}

export function IntelligenceCoreFallback({ activeDomain, className = "" }: FallbackProps) {
  const current = DOMAIN_METADATA[activeDomain] || DOMAIN_METADATA.idle;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background radial glow */}
      <div 
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-25 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: current.accentColor }}
      />

      {/* Tactical HUD Vector Core */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-[420px] max-h-[420px] drop-shadow-2xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Orbit Reticle */}
        <circle
          cx="200"
          cy="200"
          r="175"
          stroke="rgba(236, 232, 225, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Tactical Tick Marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 168;
          const y1 = 200 + Math.sin(rad) * 168;
          const x2 = 200 + Math.cos(rad) * 178;
          const y2 = 200 + Math.sin(rad) * 178;
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(236, 232, 225, 0.25)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Concentric Telemetry Ring 1 */}
        <circle
          cx="200"
          cy="200"
          r="140"
          stroke={current.accentColor}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="90 30"
          className="transition-all duration-700"
        />

        {/* Concentric Telemetry Ring 2 */}
        <circle
          cx="200"
          cy="200"
          r="110"
          stroke="rgba(236, 232, 225, 0.15)"
          strokeWidth="1"
        />

        {/* Diagonal Crosshair Guidelines */}
        <line x1="60" y1="200" x2="340" y2="200" stroke="rgba(236, 232, 225, 0.06)" strokeWidth="1" />
        <line x1="200" y1="60" x2="200" y2="340" stroke="rgba(236, 232, 225, 0.06)" strokeWidth="1" />

        {/* Faceted Outer Exoshell (Graphite Polyhedral Silhouette) */}
        <polygon
          points="200,85 285,135 285,265 200,315 115,265 115,135"
          fill="#0D1118"
          stroke="rgba(236, 232, 225, 0.2)"
          strokeWidth="1.5"
        />

        {/* Faceted Inner Chamber (Titanium Panels) */}
        <polygon
          points="200,110 265,150 265,250 200,290 135,250 135,150"
          fill="#121821"
          stroke={current.accentColor}
          strokeWidth="1.2"
          strokeOpacity="0.6"
          className="transition-all duration-500"
        />

        {/* Central Radianite Crystalline Prism */}
        <polygon
          points="200,140 245,175 245,225 200,260 155,225 155,175"
          fill={current.accentColor}
          fillOpacity="0.25"
          stroke={current.accentColor}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Core Heart Diamond */}
        <polygon
          points="200,165 225,200 200,235 175,200"
          fill={current.accentColor}
          className="transition-all duration-300"
        />

        {/* Telemetry Labels & Coordinates */}
        <text
          x="200"
          y="40"
          textAnchor="middle"
          fill="rgba(236, 232, 225, 0.5)"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="2"
        >
          VLOPEDIA // INTELLIGENCE CORE
        </text>

        <text
          x="200"
          y="370"
          textAnchor="middle"
          fill={current.accentColor}
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="1.5"
          className="transition-colors duration-300"
        >
          {current.label.toUpperCase()} : {current.count}
        </text>

        {/* Subtle Domain Micro-pips */}
        <circle cx="200" cy="85" r="3" fill={current.accentColor} />
        <circle cx="285" cy="135" r="2.5" fill="#0DF2F2" />
        <circle cx="285" cy="265" r="2.5" fill="rgba(236, 232, 225, 0.4)" />
        <circle cx="200" cy="315" r="3" fill={current.accentColor} />
        <circle cx="115" cy="265" r="2.5" fill="#0DF2F2" />
        <circle cx="115" cy="135" r="2.5" fill="rgba(236, 232, 225, 0.4)" />
      </svg>
    </div>
  );
}
