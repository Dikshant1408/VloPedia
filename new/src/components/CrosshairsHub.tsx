/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playSFX } from "../utils/sfx";
import { 
  Crosshair, Copy, Check, Search, RefreshCw, Sliders, Play, 
  Settings, User, Smile, Tv, FileCode, Sparkles, Download, 
  Upload, Eye, EyeOff, Shield, RefreshCw as ResetIcon, ArrowRight
} from "lucide-react";

// Crosshair preset interface
export interface CrosshairPreset {
  id: string;
  name: string;
  category: "pro" | "funny" | "creator";
  team?: string;
  code: string;
  properties: {
    color: string;
    centerDot: boolean;
    centerDotSize: number;
    centerDotOpacity: number;
    innerLines: boolean;
    innerThickness: number;
    innerLength: number;
    innerGap: number;
    innerOpacity: number;
    outerLines: boolean;
    outerThickness: number;
    outerLength: number;
    outerGap: number;
    outerOpacity: number;
    outline: boolean;
    outlineThickness: number;
    outlineOpacity: number;
  };
}

// Highly authentic catalog of crosshairs
const CROSSHAIR_PRESETS: CrosshairPreset[] = [
  {
    id: "tenz",
    name: "TenZ",
    category: "pro",
    team: "Sentinels",
    code: "0;s;1;P;c;5;h;0;m;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0;S;c;4;s;0.8;o;1",
    properties: {
      color: "#00ffff", // Cyan
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 1,
      innerLength: 2,
      innerGap: 2,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 2,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "shroud",
    name: "Shroud",
    category: "pro",
    team: "Sentinels",
    code: "0;P;c;5;h;0;m;1;0t;1;0l;3;0o;2;0a;1;0f;0;1b;0",
    properties: {
      color: "#00ffff", // Cyan
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 1,
      innerLength: 3,
      innerGap: 2,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 2,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "tarik",
    name: "Tarik",
    category: "creator",
    team: "Sentinels Creator",
    code: "0;P;o;1;d;1;f;0;0t;0;0l;0;0o;0;0a;0;0f;0;1t;0;1l;0;1o;0;1a;0;1f;0",
    properties: {
      color: "#ffffff", // White
      centerDot: true,
      centerDotSize: 2,
      centerDotOpacity: 1,
      innerLines: false,
      innerThickness: 1,
      innerLength: 0,
      innerGap: 0,
      innerOpacity: 0,
      outerLines: false,
      outerThickness: 1,
      outerLength: 0,
      outerGap: 0,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "asuna",
    name: "Asuna",
    category: "pro",
    team: "100 Thieves",
    code: "0;P;o;1;h;0;0t;1;0l;2;0o;3;0a;1;0f;0;1b;0",
    properties: {
      color: "#ffffff", // White
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 1,
      innerLength: 2,
      innerGap: 3,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 2,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "yay",
    name: "Yay",
    category: "pro",
    team: "Free Agent",
    code: "0;P;h;0;0l;4;0o;0;0a;1;0f;0;1b;0",
    properties: {
      color: "#00ff00", // Green (or White)
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 1,
      innerLength: 4,
      innerGap: 0,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 2,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.5,
    }
  },
  {
    id: "derke",
    name: "Derke",
    category: "pro",
    team: "Fnatic",
    code: "0;s;1;P;c;5;o;1;d;1;z;3;f;0;0t;0;0l;0;0o;0;0a;0;0f;0;1t;0;1l;0;1o;0;1a;0;1f;0",
    properties: {
      color: "#00ffff", // Cyan
      centerDot: true,
      centerDotSize: 3,
      centerDotOpacity: 1,
      innerLines: false,
      innerThickness: 1,
      innerLength: 0,
      innerGap: 0,
      innerOpacity: 0,
      outerLines: false,
      outerThickness: 1,
      outerLength: 0,
      outerGap: 0,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "boaster",
    name: "Boaster",
    category: "pro",
    team: "Fnatic",
    code: "0;s;1;P;c;1;o;1;d;1;0l;0;0o;2;0a;1;0f;0;1b;0;S;c;1",
    properties: {
      color: "#00ff00", // Green
      centerDot: true,
      centerDotSize: 2,
      centerDotOpacity: 1,
      innerLines: false,
      innerThickness: 1,
      innerLength: 0,
      innerGap: 2,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 1,
      outerLength: 0,
      outerGap: 0,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "f0rxen",
    name: "f0rxen",
    category: "pro",
    team: "Paper Rex",
    code: "0;P;c;8;u;FF0055FF;h;0;b;1;0t;1;0l;3;0o;1;0a;1;0f;0;1b;0",
    properties: {
      color: "#ff0055", // Custom Pinkish
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 1,
      innerLength: 3,
      innerGap: 1,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 2,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.5,
    }
  },
  {
    id: "kyedae",
    name: "Kyedae",
    category: "creator",
    team: "100T Streamer",
    code: "0;P;c;5;h;0;0l;4;0o;2;0a;1;0f;0;1b;0",
    properties: {
      color: "#00ffff", // Cyan
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 1,
      innerLength: 4,
      innerGap: 2,
      innerOpacity: 1,
      outerLines: false,
      outerThickness: 2,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 0,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.5,
    }
  },
  {
    id: "among-us",
    name: "Among Us",
    category: "funny",
    code: "0;P;c;5;t;3;o;1;f;0;m;1;0t;4;0l;5;0o;0;0a;1;0f;0;1t;8;1l;3;1o;0;1a;1;1f;0",
    properties: {
      color: "#ff0000", // Red body
      centerDot: false,
      centerDotSize: 2,
      centerDotOpacity: 0,
      innerLines: true,
      innerThickness: 4,
      innerLength: 5,
      innerGap: 0,
      innerOpacity: 1,
      outerLines: true,
      outerThickness: 8,
      outerLength: 3,
      outerGap: 0,
      outerOpacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "nerd-glasses",
    name: "Nerd Glasses",
    category: "funny",
    code: "0;P;c;8;t;2;o;1;d;1;z;1;a;1;f;0;0t;10;0l;2;0o;5;0a;1;0f;0;1t;4;1l;10;1o;1;1a;1;1f;0",
    properties: {
      color: "#00ff00",
      centerDot: true,
      centerDotSize: 1,
      centerDotOpacity: 1,
      innerLines: true,
      innerThickness: 10,
      innerLength: 2,
      innerGap: 5,
      innerOpacity: 1,
      outerLines: true,
      outerThickness: 4,
      outerLength: 10,
      outerGap: 1,
      outerOpacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "pokeball",
    name: "Pokeball",
    category: "funny",
    code: "0;P;c;7;o;1;d;1;0t;10;0l;5;0o;0;0a;1;0f;0;1t;4;1l;1;1o;1;1a;1;1f;0",
    properties: {
      color: "#ffc0cb",
      centerDot: true,
      centerDotSize: 2,
      centerDotOpacity: 1,
      innerLines: true,
      innerThickness: 10,
      innerLength: 5,
      innerGap: 0,
      innerOpacity: 1,
      outerLines: true,
      outerThickness: 4,
      outerLength: 1,
      outerGap: 1,
      outerOpacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  },
  {
    id: "heart",
    name: "Heart shape",
    category: "funny",
    code: "0;P;c;7;o;0.1;d;1;z;1;a;1;f;0;0t;10;0l;2;0o;1;0a;1;0f;0;1t;5;1l;2;1o;1;1a;1;1f;0",
    properties: {
      color: "#ff0055", // Red-Pink
      centerDot: true,
      centerDotSize: 1,
      centerDotOpacity: 1,
      innerLines: true,
      innerThickness: 10,
      innerLength: 2,
      innerGap: 1,
      innerOpacity: 1,
      outerLines: true,
      outerThickness: 5,
      outerLength: 2,
      outerGap: 1,
      outerOpacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.1,
    }
  },
  {
    id: "smiley",
    name: "Smiley Face",
    category: "funny",
    code: "0;P;c;1;t;2;o;1;d;1;z;3;a;1;f;0;0t;10;0l;2;0o;2;0a;1;0f;0;1t;1;1l;2;1o;10;1a;1;1f;0",
    properties: {
      color: "#00ff00",
      centerDot: true,
      centerDotSize: 3,
      centerDotOpacity: 1,
      innerLines: true,
      innerThickness: 10,
      innerLength: 2,
      innerGap: 2,
      innerOpacity: 1,
      outerLines: true,
      outerThickness: 1,
      outerLength: 2,
      outerGap: 10,
      outerOpacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 1,
    }
  }
];

// Map backgrounds for testing crosshair readability
const BACKGROUND_THEMES = [
  {
    id: "tactical-slate",
    name: "Tactical Charcoal",
    image: null,
    className: "bg-[#0B141A] border-2 border-[#1A2C38]"
  },
  {
    id: "ascent-a",
    name: "Ascent A Site",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "bind-b",
    name: "Bind B Site",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "practice-range",
    name: "Practice Target",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=600",
  }
];

export default function CrosshairsHub() {
  const [activeCatalogTab, setActiveCatalogTab] = useState<"ALL" | "PRO" | "CREATOR" | "FUNNY">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom builder state (Default set to TenZ)
  const [color, setColor] = useState("#00ffff");
  const [centerDot, setCenterDot] = useState(false);
  const [centerDotSize, setCenterDotSize] = useState(2);
  const [centerDotOpacity, setCenterDotOpacity] = useState(0);
  const [innerLines, setInnerLines] = useState(true);
  const [innerThickness, setInnerThickness] = useState(1);
  const [innerLength, setInnerLength] = useState(2);
  const [innerGap, setInnerGap] = useState(2);
  const [innerOpacity, setInnerOpacity] = useState(1);
  const [outerLines, setOuterLines] = useState(false);
  const [outerThickness, setOuterThickness] = useState(2);
  const [outerLength, setOuterLength] = useState(2);
  const [outerGap, setOuterGap] = useState(10);
  const [outerOpacity, setOuterOpacity] = useState(0);
  const [outline, setOutline] = useState(true);
  const [outlineThickness, setOutlineThickness] = useState(1);
  const [outlineOpacity, setOutlineOpacity] = useState(1);
  
  // HUD Background selection
  const [activeBackgroundId, setActiveBackgroundId] = useState("tactical-slate");
  const [pastedCode, setPastedCode] = useState("");
  const [parseError, setParseError] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);

  // Dynamic code generator based on state values
  const getGeneratedCode = () => {
    let parts = ["0", "P"];
    
    // Color mapping
    const colorMap: Record<string, string> = {
      "#00ff00": "1", // Green
      "#7fff00": "2", // Yellow-Green
      "#ffff00": "3", // Yellow
      "#0000ff": "4", // Blue
      "#00ffff": "5", // Cyan
      "#ff0000": "6", // Red
      "#ffc0cb": "7", // Pink
    };
    
    const colIndex = colorMap[color.toLowerCase()];
    if (colIndex) {
      parts.push(`c;${colIndex}`);
    } else {
      parts.push("c;8");
      parts.push(`u;${color.toUpperCase().replace("#", "")}FF`);
    }
    
    // Outline
    if (outline) {
      parts.push("o;1");
      if (outlineThickness !== 1) parts.push(`t;${outlineThickness}`);
      if (outlineOpacity !== 1) parts.push(`q;${outlineOpacity}`);
    } else {
      parts.push("o;0");
    }
    
    // Center Dot
    if (centerDot) {
      parts.push("d;1");
      if (centerDotSize !== 2) parts.push(`z;${centerDotSize}`);
      if (centerDotOpacity !== 1) parts.push(`a;${centerDotOpacity}`);
    } else {
      parts.push("h;0");
    }
    
    // Inner Lines
    if (innerLines) {
      parts.push(`0t;${innerThickness}`);
      parts.push(`0l;${innerLength}`);
      parts.push(`0o;${innerGap}`);
      parts.push(`0a;${innerOpacity}`);
      parts.push("0f;0");
      parts.push("0b;0");
    } else {
      parts.push("0s;0");
    }
    
    // Outer Lines
    if (outerLines) {
      parts.push(`1t;${outerThickness}`);
      parts.push(`1l;${outerLength}`);
      parts.push(`1o;${outerGap}`);
      parts.push(`1a;${outerOpacity}`);
      parts.push("1f;0");
      parts.push("1b;0");
    }
    
    return parts.join(";");
  };

  const handleCopyGenerated = () => {
    const codeToCopy = getGeneratedCode();
    navigator.clipboard.writeText(codeToCopy);
    playSFX.scanBeep();
    setCopiedId("GENERATED");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Preset loader
  const loadPreset = (preset: CrosshairPreset) => {
    playSFX.selectSurge();
    const p = preset.properties;
    setColor(p.color);
    setCenterDot(p.centerDot);
    setCenterDotSize(p.centerDotSize);
    setCenterDotOpacity(p.centerDotOpacity);
    setInnerLines(p.innerLines);
    setInnerThickness(p.innerThickness);
    setInnerLength(p.innerLength);
    setInnerGap(p.innerGap);
    setInnerOpacity(p.innerOpacity);
    setOuterLines(p.outerLines);
    setOuterThickness(p.outerThickness);
    setOuterLength(p.outerLength);
    setOuterGap(p.outerGap);
    setOuterOpacity(p.outerOpacity);
    setOutline(p.outline);
    setOutlineThickness(p.outlineThickness);
    setOutlineOpacity(p.outlineOpacity);

    // Scroll smoothly to builder on mobile
    const builderEl = document.getElementById("crosshair-builder");
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Raw code parser
  const handleParseCode = () => {
    try {
      setParseError("");
      setParseSuccess(false);
      
      if (!pastedCode || !pastedCode.includes(";")) {
        setParseError("Invalid crosshair signature. Code must contain semi-colons.");
        playSFX.tick();
        return;
      }

      // Default temporary properties
      let p_color = "#00ff00";
      let p_centerDot = false;
      let p_centerDotSize = 2;
      let p_centerDotOpacity = 1;
      let p_innerLines = true;
      let p_innerThickness = 1;
      let p_innerLength = 3;
      let p_innerGap = 2;
      let p_innerOpacity = 1;
      let p_outerLines = false;
      let p_outerThickness = 1;
      let p_outerLength = 2;
      let p_outerGap = 10;
      let p_outerOpacity = 0.5;
      let p_outline = true;
      let p_outlineThickness = 1;
      let p_outlineOpacity = 0.5;

      const parts = pastedCode.trim().split(";");
      
      // Basic validation
      if (parts[0] !== "0") {
        // Just a warning, not blocking
      }

      // Read values sequentially or as pairs
      for (let i = 0; i < parts.length; i++) {
        const item = parts[i];
        
        // Find properties mapped by keys
        if (item === "c") {
          const val = parseInt(parts[i + 1]);
          const colorMap: Record<number, string> = {
            1: "#00ff00",
            2: "#7fff00",
            3: "#ffff00",
            4: "#0000ff",
            5: "#00ffff",
            6: "#ff0000",
            7: "#ffc0cb",
          };
          if (colorMap[val]) p_color = colorMap[val];
          i++;
        } else if (item === "u") {
          const val = parts[i + 1];
          if (val) {
            p_color = "#" + val.slice(0, 6).toLowerCase();
          }
          i++;
        } else if (item === "d") {
          p_centerDot = parts[i + 1] === "1";
          i++;
        } else if (item === "h" && parts[i + 1] === "0") {
          p_centerDot = false;
          i++;
        } else if (item === "z") {
          p_centerDotSize = parseInt(parts[i + 1]) || 2;
          i++;
        } else if (item === "a") {
          p_centerDotOpacity = parseFloat(parts[i + 1]) || 1;
          i++;
        } else if (item === "0t") {
          p_innerThickness = parseInt(parts[i + 1]) || 1;
          p_innerLines = true;
          i++;
        } else if (item === "0l") {
          p_innerLength = parseInt(parts[i + 1]) || 0;
          p_innerLines = p_innerLength > 0;
          i++;
        } else if (item === "0o") {
          p_innerGap = parseInt(parts[i + 1]) || 0;
          i++;
        } else if (item === "0a") {
          p_innerOpacity = parseFloat(parts[i + 1]) || 1;
          p_innerLines = p_innerOpacity > 0;
          i++;
        } else if (item === "1t") {
          p_outerThickness = parseInt(parts[i + 1]) || 1;
          p_outerLines = true;
          i++;
        } else if (item === "1l") {
          p_outerLength = parseInt(parts[i + 1]) || 0;
          p_outerLines = p_outerLength > 0;
          i++;
        } else if (item === "1o") {
          p_outerGap = parseInt(parts[i + 1]) || 0;
          p_outerLines = true;
          i++;
        } else if (item === "1a") {
          p_outerOpacity = parseFloat(parts[i + 1]) || 0;
          p_outerLines = p_outerOpacity > 0;
          i++;
        } else if (item === "o") {
          p_outline = parts[i + 1] === "1";
          i++;
        } else if (item === "t") {
          p_outlineThickness = parseInt(parts[i + 1]) || 1;
          i++;
        } else if (item === "q") {
          p_outlineOpacity = parseFloat(parts[i + 1]) || 1;
          i++;
        }
      }

      // Apply values to state
      setColor(p_color);
      setCenterDot(p_centerDot);
      setCenterDotSize(p_centerDotSize);
      setCenterDotOpacity(p_centerDotOpacity);
      setInnerLines(p_innerLines);
      setInnerThickness(p_innerThickness);
      setInnerLength(p_innerLength);
      setInnerGap(p_innerGap);
      setInnerOpacity(p_innerOpacity);
      setOuterLines(p_outerLines);
      setOuterThickness(p_outerThickness);
      setOuterLength(p_outerLength);
      setOuterGap(p_outerGap);
      setOuterOpacity(p_outerOpacity);
      setOutline(p_outline);
      setOutlineThickness(p_outlineThickness);
      setOutlineOpacity(p_outlineOpacity);

      setParseSuccess(true);
      playSFX.scanBeep();
      setTimeout(() => setParseSuccess(false), 3000);
    } catch (e) {
      setParseError("Could not successfully parse this string. Check code integrity.");
      playSFX.tick();
    }
  };

  const handleCopyPresetCode = (preset: CrosshairPreset) => {
    navigator.clipboard.writeText(preset.code);
    playSFX.scanBeep();
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick action presets for manual color buttons
  const QUICK_COLORS = [
    { name: "Cyan", value: "#00ffff" },
    { name: "Green", value: "#00ff00" },
    { name: "Red", value: "#ff0000" },
    { name: "Yellow", value: "#ffff00" },
    { name: "White", value: "#ffffff" },
    { name: "Pink", value: "#ffc0cb" },
  ];

  // Filtering for presets card matrix
  const filteredPresets = CROSSHAIR_PRESETS.filter((preset) => {
    // Category check
    if (activeCatalogTab === "PRO" && preset.category !== "pro") return false;
    if (activeCatalogTab === "CREATOR" && preset.category !== "creator") return false;
    if (activeCatalogTab === "FUNNY" && preset.category !== "funny") return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = preset.name.toLowerCase().includes(q);
      const matchesTeam = preset.team?.toLowerCase().includes(q) || false;
      return matchesName || matchesTeam;
    }
    return true;
  });

  // Dynamic SVG Crosshair visual renderer
  const renderCrosshairSVG = (
    c_color: string,
    c_dot: boolean,
    c_dotSize: number,
    c_dotOp: number,
    c_inner: boolean,
    c_innerThick: number,
    c_innerLen: number,
    c_innerGap: number,
    c_innerOp: number,
    c_outer: boolean,
    c_outerThick: number,
    c_outerLen: number,
    c_outerGap: number,
    c_outerOp: number,
    c_outline: boolean,
    c_outlineThick: number,
    c_outlineOp: number,
    size: number = 120,
    customType?: string
  ) => {
    const center = size / 2;

    // Render fun custom elements for troll crosshairs
    if (customType === "among-us") {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Black background grid */}
          <rect x={center - 15} y={center - 20} width="30" height="40" rx="6" fill="#000000" opacity="0.6" stroke={c_color} strokeWidth="1.5" />
          {/* Main Red crewmate body */}
          <rect x={center - 10} y={center - 15} width="20" height="30" rx="5" fill="#FA4454" />
          {/* Blue Visor */}
          <rect x={center - 6} y={center - 10} width="16" height="10" rx="3" fill="#0DF2F2" stroke="#000000" strokeWidth="1" />
          {/* Backpack */}
          <rect x={center - 15} y={center - 8} width="6" height="18" rx="2" fill="#BA1E2A" />
          {/* Legs split cut */}
          <rect x={center - 2} y={center + 10} width="4" height="6" fill="#000000" opacity="0.3" />
        </svg>
      );
    }

    if (customType === "nerd-glasses") {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Left lens */}
          <rect x={center - 18} y={center - 8} width="14" height="14" rx="2" fill="none" stroke={c_color} strokeWidth="3" />
          {/* Right lens */}
          <rect x={center + 4} y={center - 8} width="14" height="14" rx="2" fill="none" stroke={c_color} strokeWidth="3" />
          {/* Glasses bridge */}
          <line x1={center - 4} y1={center - 2} x2={center + 4} y2={center - 2} stroke={c_color} strokeWidth="3" />
          {/* Eyes inside */}
          <circle cx={center - 11} cy={center - 1} r="2" fill={c_color} />
          <circle cx={center + 11} cy={center - 1} r="2" fill={c_color} />
        </svg>
      );
    }

    if (customType === "heart") {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path d={`M ${center} ${center + 12} 
                   C ${center - 15} ${center - 2} ${center - 15} ${center - 15} ${center} ${center - 15} 
                   C ${center + 15} ${center - 15} ${center + 15} ${center - 2} ${center} ${center + 12} Z`} 
                fill="#FA4454" stroke="#000000" strokeWidth="1.5" />
        </svg>
      );
    }

    if (customType === "pokeball") {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer Ring */}
          <circle cx={center} cy={center} r="18" fill="none" stroke="#000000" strokeWidth="2.5" />
          {/* Top Half Red */}
          <path d={`M ${center - 18} ${center} A 18 18 0 0 1 ${center + 18} ${center} Z`} fill="#FA4454" stroke="#000000" strokeWidth="1" />
          {/* Bottom Half White */}
          <path d={`M ${center - 18} ${center} A 18 18 0 0 0 ${center + 18} ${center} Z`} fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          {/* Center line */}
          <line x1={center - 18} y1={center} x2={center + 18} y2={center} stroke="#000000" strokeWidth="2" />
          {/* Center button */}
          <circle cx={center} cy={center} r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
        </svg>
      );
    }

    // Default crosshair drawing logic
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outlines of Inner Lines (Render black backing first for crisp overlay) */}
        {c_outline && c_inner && (
          <>
            {/* Inner Left Backing */}
            <rect 
              x={center - c_innerGap - c_innerLen - c_outlineThick} 
              y={center - c_innerThick / 2 - c_outlineThick} 
              width={c_innerLen + c_outlineThick * 2} 
              height={c_innerThick + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
            {/* Inner Right Backing */}
            <rect 
              x={center + c_innerGap - c_outlineThick} 
              y={center - c_innerThick / 2 - c_outlineThick} 
              width={c_innerLen + c_outlineThick * 2} 
              height={c_innerThick + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
            {/* Inner Top Backing */}
            <rect 
              x={center - c_innerThick / 2 - c_outlineThick} 
              y={center - c_innerGap - c_innerLen - c_outlineThick} 
              width={c_innerThick + c_outlineThick * 2} 
              height={c_innerLen + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
            {/* Inner Bottom Backing */}
            <rect 
              x={center - c_innerThick / 2 - c_outlineThick} 
              y={center + c_innerGap - c_outlineThick} 
              width={c_innerThick + c_outlineThick * 2} 
              height={c_innerLen + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
          </>
        )}

        {/* Outlines of Outer Lines */}
        {c_outline && c_outer && (
          <>
            {/* Outer Left Backing */}
            <rect 
              x={center - c_outerGap - c_outerLen - c_outlineThick} 
              y={center - c_outerThick / 2 - c_outlineThick} 
              width={c_outerLen + c_outlineThick * 2} 
              height={c_outerThick + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
            {/* Outer Right Backing */}
            <rect 
              x={center + c_outerGap - c_outlineThick} 
              y={center - c_outerThick / 2 - c_outlineThick} 
              width={c_outerLen + c_outlineThick * 2} 
              height={c_outerThick + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
            {/* Outer Top Backing */}
            <rect 
              x={center - c_outerThick / 2 - c_outlineThick} 
              y={center - c_outerGap - c_outerLen - c_outlineThick} 
              width={c_outerThick + c_outlineThick * 2} 
              height={c_outerLen + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
            {/* Outer Bottom Backing */}
            <rect 
              x={center - c_outerThick / 2 - c_outlineThick} 
              y={center + c_outerGap - c_outlineThick} 
              width={c_outerThick + c_outlineThick * 2} 
              height={c_outerLen + c_outlineThick * 2} 
              fill="#000000" 
              opacity={c_outlineOp} 
            />
          </>
        )}

        {/* Center Dot Outlines */}
        {c_outline && c_dot && (
          <rect 
            x={center - c_dotSize / 2 - c_outlineThick} 
            y={center - c_dotSize / 2 - c_outlineThick} 
            width={c_dotSize + c_outlineThick * 2} 
            height={c_dotSize + c_outlineThick * 2} 
            fill="#000000" 
            opacity={c_outlineOp} 
          />
        )}

        {/* True Center Dot */}
        {c_dot && (
          <rect 
            x={center - c_dotSize / 2} 
            y={center - c_dotSize / 2} 
            width={c_dotSize} 
            height={c_dotSize} 
            fill={c_color} 
            opacity={c_dotOp} 
          />
        )}

        {/* Inner Lines Actual */}
        {c_inner && (
          <>
            {/* Left */}
            <rect 
              x={center - c_innerGap - c_innerLen} 
              y={center - c_innerThick / 2} 
              width={c_innerLen} 
              height={c_innerThick} 
              fill={c_color} 
              opacity={c_innerOp} 
            />
            {/* Right */}
            <rect 
              x={center + c_innerGap} 
              y={center - c_innerThick / 2} 
              width={c_innerLen} 
              height={c_innerThick} 
              fill={c_color} 
              opacity={c_innerOp} 
            />
            {/* Top */}
            <rect 
              x={center - c_innerThick / 2} 
              y={center - c_innerGap - c_innerLen} 
              width={c_innerThick} 
              height={c_innerLen} 
              fill={c_color} 
              opacity={c_innerOp} 
            />
            {/* Bottom */}
            <rect 
              x={center - c_innerThick / 2} 
              y={center + c_innerGap} 
              width={c_innerThick} 
              height={c_innerLen} 
              fill={c_color} 
              opacity={c_innerOp} 
            />
          </>
        )}

        {/* Outer Lines Actual */}
        {c_outer && (
          <>
            {/* Left */}
            <rect 
              x={center - c_outerGap - c_outerLen} 
              y={center - c_outerThick / 2} 
              width={c_outerLen} 
              height={c_outerThick} 
              fill={c_color} 
              opacity={c_outerOp} 
            />
            {/* Right */}
            <rect 
              x={center + c_outerGap} 
              y={center - c_outerThick / 2} 
              width={c_outerLen} 
              height={c_outerThick} 
              fill={c_color} 
              opacity={c_outerOp} 
            />
            {/* Top */}
            <rect 
              x={center - c_outerThick / 2} 
              y={center - c_outerGap - c_outerLen} 
              width={c_outerThick} 
              height={c_outerLen} 
              fill={c_color} 
              opacity={c_outerOp} 
            />
            {/* Bottom */}
            <rect 
              x={center - c_outerThick / 2} 
              y={center + c_outerGap} 
              width={c_outerThick} 
              height={c_outerLen} 
              fill={c_color} 
              opacity={c_outerOp} 
            />
          </>
        )}
      </svg>
    );
  };

  const activeBackground = BACKGROUND_THEMES.find(b => b.id === activeBackgroundId);

  return (
    <div className="w-full min-h-screen pt-4 pb-20 relative">
      <div className="absolute inset-0 pointer-events-none tactical-grid-bg opacity-[0.2]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[rgba(236,232,225,0.12)] pb-6 mb-10 mt-6">
          <div>
            <div className="eyebrow mb-2">
              <span className="w-2 h-2 bg-[#FA4454]" />
              <span>CALIBRATION HUD // CROSSHAIR MATRIX</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-[#ECE8E1] tracking-tighter uppercase flex items-center mt-1">
              CROSSHAIRS HUB
              <span className="w-2.5 h-2.5 bg-[#0DF2F2] ml-3 rounded-full animate-pulse" />
            </h1>
            <p className="font-mono text-xs text-white/40 mt-1 max-w-lg leading-relaxed">
              Top-tier player settings and creative crosshairs database. Calibrate, test, copy and build custom tactical scopes directly for the Valorant Client.
            </p>
          </div>
        </div>

        {/* Main Grid: Builder and Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 5 COLUMNS: Live Interactive Crosshair Builder & Testing Stage */}
           <div id="crosshair-builder" className="lg:col-span-5 surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm relative">


            <h2 className="font-display font-black text-xl text-white tracking-wider uppercase mb-6 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#FA4454]" />
              <span>TACTICAL CALIBRATOR</span>
            </h2>

            {/* TESTING STAGE PREVIEW */}
            <div className="relative aspect-video rounded-xs overflow-hidden flex items-center justify-center border border-white/15 group shadow-inner">
              {/* background selected */}
              {activeBackground?.image ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 scale-100 group-hover:scale-102"
                  style={{ backgroundImage: `url(${activeBackground.image})` }}
                />
              ) : (
                <div className={`absolute inset-0 ${activeBackground?.className}`} />
              )}
              
              {/* Outer grid decor */}
              <div className="absolute inset-0 pointer-events-none border border-[#0DF2F2]/10 bg-radial at-center from-transparent via-black/20 to-black/60" />
              
              {/* Dynamic crosshair drawing in the exact center */}
              <div className="relative z-10 scale-150 transform transition-transform duration-300">
                {renderCrosshairSVG(
                  color,
                  centerDot,
                  centerDotSize,
                  centerDotOpacity,
                  innerLines,
                  innerThickness,
                  innerLength,
                  innerGap,
                  innerOpacity,
                  outerLines,
                  outerThickness,
                  outerLength,
                  outerGap,
                  outerOpacity,
                  outline,
                  outlineThickness,
                  outlineOpacity,
                  100
                )}
              </div>

              {/* Scope circle overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute w-[85%] h-[85%] rounded-full border border-[#0DF2F2]/15 animate-spin-slow">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[8px] text-[#0DF2F2]/40 tracking-widest bg-[#0B141A] px-1.5">
                    CAL_01
                  </span>
                  <div className="absolute top-1/2 left-0 w-2 h-px bg-[#0DF2F2]/30 -translate-y-1/2" />
                  <div className="absolute top-1/2 right-0 w-2 h-px bg-[#0DF2F2]/30 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-0 h-2 w-px bg-[#0DF2F2]/30 -translate-x-1/2" />
                  <div className="absolute left-1/2 bottom-0 h-2 w-px bg-[#0DF2F2]/30 -translate-x-1/2" />
                </div>
              </div>

              {/* Interactive Target Label */}
              <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 border border-white/5 font-mono text-[8px] text-[#0DF2F2] tracking-widest select-none pointer-events-none">
                PREVIEW // {activeBackground?.name.toUpperCase()}
              </div>
            </div>

            {/* STAGE ENVIRONMENT BACKGROUND TOGGLES */}
            <div className="mt-4 flex items-center justify-between border-b border-white/5 pb-4">
              <span className="font-mono text-[9px] text-white/40 tracking-wider">ENVIRONMENT</span>
              <div className="flex space-x-1.5">
                {BACKGROUND_THEMES.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      playSFX.hoverClick();
                      setActiveBackgroundId(bg.id);
                    }}
                    className={`px-2 py-1 border font-mono text-[8px] tracking-wider transition-colors cursor-none interactive-tactical ${
                      activeBackgroundId === bg.id
                        ? "bg-[#0DF2F2]/10 border-[#0DF2F2] text-[#0DF2F2]"
                        : "bg-transparent border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    {bg.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* BUILDER SLIDERS CONTROLS */}
            <div className="mt-6 space-y-5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Color Controls */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-white tracking-widest uppercase">1. RETICLE COLOR</label>
                  <span className="font-mono text-[10px] text-[#0DF2F2]">{color.toUpperCase()}</span>
                </div>
                {/* Custom Color Squares */}
                <div className="flex flex-wrap gap-2">
                  {QUICK_COLORS.map((qc) => (
                    <button
                      key={qc.value}
                      onClick={() => {
                        playSFX.hoverClick();
                        setColor(qc.value);
                      }}
                      className="w-6 h-6 rounded-xs relative border border-white/10 active:scale-95 transition-transform"
                      style={{ backgroundColor: qc.value }}
                      title={qc.name}
                    >
                      {color.toLowerCase() === qc.value.toLowerCase() && (
                        <div className="absolute inset-0 border-2 border-black rounded-xs flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                  {/* Custom Color Input */}
                  <div className="relative flex items-center">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-6 bg-transparent border border-white/10 rounded-xs cursor-pointer p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Outlines Toggle & Slider */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-white tracking-widest">2. OUTLINES</span>
                  <input
                    type="checkbox"
                    checked={outline}
                    onChange={(e) => {
                      playSFX.tick();
                      setOutline(e.target.checked);
                    }}
                     className="w-3 h-3 text-[#FA4454] bg-[#0B141A] border-white/20 rounded-xs cursor-pointer"
                  />
                </div>
                {outline && (
                  <div className="grid grid-cols-2 gap-4 pl-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>THICKNESS</span>
                        <span>{outlineThickness}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        step="1"
                        value={outlineThickness}
                        onChange={(e) => setOutlineThickness(parseInt(e.target.value))}
                        className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>OPACITY</span>
                        <span>{outlineOpacity}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={outlineOpacity}
                        onChange={(e) => setOutlineOpacity(parseFloat(e.target.value))}
                        className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Center Dot Controls */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-white tracking-widest">3. CENTER DOT</span>
                  <input
                    type="checkbox"
                    checked={centerDot}
                    onChange={(e) => {
                      playSFX.tick();
                      setCenterDot(e.target.checked);
                      if (e.target.checked && centerDotOpacity === 0) {
                        setCenterDotOpacity(1);
                      }
                    }}
                     className="w-3 h-3 text-[#FA4454] bg-[#0B141A] border-white/20 rounded-xs cursor-pointer"
                  />
                </div>
                {centerDot && (
                  <div className="grid grid-cols-2 gap-4 pl-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>SIZE</span>
                        <span>{centerDotSize}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        step="1"
                        value={centerDotSize}
                        onChange={(e) => setCenterDotSize(parseInt(e.target.value))}
                        className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>OPACITY</span>
                        <span>{centerDotOpacity}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={centerDotOpacity}
                        onChange={(e) => setCenterDotOpacity(parseFloat(e.target.value))}
                        className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Inner Lines Controls */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-white tracking-widest">4. INNER LINES</span>
                  <input
                    type="checkbox"
                    checked={innerLines}
                    onChange={(e) => {
                      playSFX.tick();
                      setInnerLines(e.target.checked);
                    }}
                     className="w-3 h-3 text-[#FA4454] bg-[#0B141A] border-white/20 rounded-xs cursor-pointer"
                  />
                </div>
                {innerLines && (
                  <div className="space-y-2.5 pl-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>THICKNESS</span>
                          <span>{innerThickness}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={innerThickness}
                          onChange={(e) => setInnerThickness(parseInt(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>LENGTH</span>
                          <span>{innerLength}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={innerLength}
                          onChange={(e) => setInnerLength(parseInt(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>GAP / OFFSET</span>
                          <span>{innerGap}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={innerGap}
                          onChange={(e) => setInnerGap(parseInt(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>OPACITY</span>
                          <span>{innerOpacity}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={innerOpacity}
                          onChange={(e) => setInnerOpacity(parseFloat(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Outer Lines Controls */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-white tracking-widest">5. OUTER LINES</span>
                  <input
                    type="checkbox"
                    checked={outerLines}
                    onChange={(e) => {
                      playSFX.tick();
                      setOuterLines(e.target.checked);
                      if (e.target.checked && outerOpacity === 0) {
                        setOuterOpacity(0.5);
                      }
                    }}
                     className="w-3 h-3 text-[#FA4454] bg-[#0B141A] border-white/20 rounded-xs cursor-pointer"
                  />
                </div>
                {outerLines && (
                  <div className="space-y-2.5 pl-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>THICKNESS</span>
                          <span>{outerThickness}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={outerThickness}
                          onChange={(e) => setOuterThickness(parseInt(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>LENGTH</span>
                          <span>{outerLength}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={outerLength}
                          onChange={(e) => setOuterLength(parseInt(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>GAP / OFFSET</span>
                          <span>{outerGap}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={outerGap}
                          onChange={(e) => setOuterGap(parseInt(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>OPACITY</span>
                          <span>{outerOpacity}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={outerOpacity}
                          onChange={(e) => setOuterOpacity(parseFloat(e.target.value))}
                          className="w-full accent-[#FA4454] bg-white/10 h-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* GENERATED EXPORT CODE ACTION FOOTER */}
            <div className="mt-8 pt-5 border-t border-white/15 bg-black/40 p-4 rounded-xs border border-white/5">
              <span className="font-mono text-[9px] text-[#0DF2F2] tracking-wider block mb-2 uppercase">VALORANT IMPORT STRING</span>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-black/60 border border-white/10 px-3 py-2 font-mono text-[9.5px] text-white overflow-x-auto whitespace-nowrap scrollbar-none rounded-xs select-all">
                  {getGeneratedCode()}
                </div>
                <button
                  onClick={handleCopyGenerated}
                  className="flex items-center space-x-1.5 bg-[#FA4454] hover:bg-[#ff5a68] text-white font-mono text-[10px] tracking-widest px-4 py-2.5 rounded-xs font-bold transition-all border border-[#FA4454] cursor-none interactive-tactical"
                >
                  {copiedId === "GENERATED" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 7 COLUMNS: Presets Catalog & Advanced Import Tool */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* RAW CODE PARSER MATRIX */}
            <div className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm relative">
              <h2 className="font-display font-black text-lg text-white tracking-wider uppercase mb-3 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#0DF2F2]" />
                <span>IMPORT CODE CALIBRATION</span>
              </h2>
              <p className="font-mono text-[10px] text-white/40 mb-4 uppercase">
                Paste any external Valorant crosshair profile code below to load its configuration into the live visual calibrator instantly.
              </p>

              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Paste Valorant Code (e.g. 0;P;c;5;h;0;0t;1;0l;2;0o;2;0a;1...)"
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 px-3 py-2.5 font-mono text-[11px] text-white placeholder-white/20 rounded-xs focus:outline-none focus:border-[#0DF2F2]"
                />
                <button
                  onClick={handleParseCode}
                  className="px-5 bg-transparent border border-[#0DF2F2] text-[#0DF2F2] hover:bg-[#0DF2F2]/10 font-mono text-xs tracking-widest uppercase font-bold transition-all rounded-xs cursor-none interactive-tactical"
                >
                  LOAD CODE
                </button>
              </div>

              {/* Feedback messages */}
              {parseError && (
                <div className="mt-3 font-mono text-[10px] text-[#FA4454] bg-[#FA4454]/5 border border-[#FA4454]/20 p-2 rounded-xs uppercase">
                  ERROR // {parseError}
                </div>
              )}
              {parseSuccess && (
                <div className="mt-3 font-mono text-[10px] text-[#0DF2F2] bg-[#0DF2F2]/5 border border-[#0DF2F2]/20 p-2 rounded-xs uppercase">
                  CALIBRATOR RE-ALIGNED // CUSTOM CODE SUCCESSFULLY MOUNTED!
                </div>
              )}
            </div>

            {/* PRESETS CATALOG CONTAINER */}
            <div className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm relative">
              
              {/* Tabs and Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-5 mb-6 space-y-4 md:space-y-0">
                
                {/* Catalog Title */}
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#FA4454]" />
                   <span className="font-display font-black text-lg text-white uppercase tracking-wider">DATABASE CATALOG</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5">
                  {(["ALL", "PRO", "CREATOR", "FUNNY"] as const).map((tab) => {
                    const isActive = activeCatalogTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => {
                          playSFX.hoverClick();
                          setActiveCatalogTab(tab);
                        }}
                        className={`px-3 py-1.5 font-mono text-[9px] tracking-widest uppercase border transition-all rounded-xs cursor-none interactive-tactical ${
                          isActive
                            ? "bg-[#FA4454] border-[#FA4454] text-white"
                            : "bg-transparent border-white/10 text-white/50 hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search input bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="SEARCH PRO PLAYER, TEAM, CREATOR OR FUNNY STYLES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 pl-11 pr-4 py-3 font-mono text-xs text-white placeholder-white/20 rounded-xs uppercase focus:outline-none focus:border-[#FA4454] transition-colors"
                />
              </div>

              {/* PRESETS GRID SCROLL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPresets.length === 0 ? (
                  <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-xs">
                    <Smile className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="font-mono text-xs text-white/40 uppercase">NO ALIGNED CHANNELS FOUND IN THIS NODE</p>
                  </div>
                ) : (
                  filteredPresets.map((preset) => {
                    const prop = preset.properties;
                    return (
                      <div
                        key={preset.id}
                        className="surface-glass border-[rgba(236,232,225,0.12)] p-4 clip-diagonal-sm hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-colors relative flex items-center space-x-4 group"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="corner-chip">{preset.category === "pro" ? "PRO" : preset.category === "creator" ? "CREATOR" : "FUNNY"}</div>
                        {/* Dynamic Crosshair Miniature Preview box */}
                        <div className="w-16 h-16 bg-[#0B141A] border border-white/15 rounded-xs flex items-center justify-center relative overflow-hidden select-none pointer-events-none shrink-0 shadow-inner">
                          {/* Radial overlay */}
                          <div className="absolute inset-0 bg-radial at-center from-white/[0.03] to-transparent" />
                          <div className="scale-75">
                            {renderCrosshairSVG(
                              prop.color,
                              prop.centerDot,
                              prop.centerDotSize,
                              prop.centerDotOpacity,
                              prop.innerLines,
                              prop.innerThickness,
                              prop.innerLength,
                              prop.innerGap,
                              prop.innerOpacity,
                              prop.outerLines,
                              prop.outerThickness,
                              prop.outerLength,
                              prop.outerGap,
                              prop.outerOpacity,
                              prop.outline,
                              prop.outlineThickness,
                              prop.outlineOpacity,
                              70,
                              preset.category === "funny" ? preset.id : undefined
                            )}
                          </div>
                        </div>

                        {/* Presets Info details */}
                        <div className="flex-1 min-w-0 pt-2">
                          <h3 className="font-display font-black text-base text-[#ECE8E1] uppercase truncate mt-0.5 leading-none">
                            {preset.name}
                          </h3>
                          {preset.team ? (
                            <span className="font-mono text-[9px] text-[#0DF2F2] block uppercase mt-1">
                              {preset.team}
                            </span>
                          ) : (
                            <span className="font-mono text-[9px] text-white/30 block uppercase mt-1">
                              CUSTOM FORM
                            </span>
                          )}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex flex-col space-y-1.5 shrink-0">
                          {/* Load in Builder */}
                          <button
                            onClick={() => loadPreset(preset)}
                            className="px-2.5 py-1.5 bg-[#0DF2F2]/5 hover:bg-[#0DF2F2]/10 border border-[#0DF2F2]/30 text-[#0DF2F2] font-mono text-[8px] tracking-widest uppercase font-bold transition-all rounded-xs cursor-none interactive-tactical"
                            title="Load values in visual calibrator to edit"
                          >
                            CALIBRATE
                          </button>
                          
                          {/* Copy Code */}
                          <button
                            onClick={() => handleCopyPresetCode(preset)}
                            className={`px-2.5 py-1.5 border font-mono text-[8px] tracking-widest uppercase font-bold transition-all rounded-xs cursor-none interactive-tactical ${
                              copiedId === preset.id
                                ? "bg-[#0DF2F2] border-[#0DF2F2] text-black"
                                : "bg-transparent border-white/10 hover:border-white text-white/70 hover:text-white"
                            }`}
                          >
                            {copiedId === preset.id ? "COPIED" : "COPY CODE"}
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
