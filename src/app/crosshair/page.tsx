"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion-system";

/* ---- HUD helpers ---- */
function HudToggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer">
        {label}
      </label>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-primary cursor-pointer h-4 w-4" />
    </div>
  );
}

function HudSlider({ id, label, value, onChange, min, max, step, display }: {
  id: string; label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; display: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between font-mono text-[9px] font-bold">
        <label htmlFor={id} className="uppercase tracking-wider text-muted">{label}</label>
        <span className="text-foreground">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
        min={min} max={max} step={step}
        className="w-full h-1 appearance-none cursor-pointer accent-primary bg-border"
        aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
      />
    </div>
  );
}

export default function CrosshairPage() {
  const [color, setColor] = useState<string>("#00FF00");
  const [hasOutline, setHasOutline] = useState<boolean>(true);
  const [outlineOpacity, setOutlineOpacity] = useState<number>(0.5);
  const [outlineThickness, setOutlineThickness] = useState<number>(1);
  const [hasCenterDot, setHasCenterDot] = useState<boolean>(false);
  const [centerDotOpacity, setCenterDotOpacity] = useState<number>(1.0);
  const [centerDotThickness, setCenterDotThickness] = useState<number>(2);
  const [hasInnerLines, setHasInnerLines] = useState<boolean>(true);
  const [innerOpacity, setInnerOpacity] = useState<number>(1.0);
  const [innerLength, setInnerLength] = useState<number>(4);
  const [innerThickness, setInnerThickness] = useState<number>(2);
  const [innerOffset, setInnerOffset] = useState<number>(2);
  const [hasOuterLines, setHasOuterLines] = useState<boolean>(false);
  const [outerOpacity, setOuterOpacity] = useState<number>(0.35);
  const [outerLength, setOuterLength] = useState<number>(2);
  const [outerThickness, setOuterThickness] = useState<number>(2);
  const [outerOffset, setOuterOffset] = useState<number>(10);
  const [backdrop, setBackdrop] = useState<string>("ascent");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backdrops = {
    ascent: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    haven: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    void: "bg-black"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const drawLine = (x1: number, y1: number, x2: number, y2: number, thickness: number, opacity: number) => {
      if (hasOutline) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * outlineOpacity})`;
        ctx.lineWidth = thickness + outlineThickness * 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    if (hasCenterDot) {
      const r = centerDotThickness / 2;
      if (hasOutline) {
        ctx.fillStyle = `rgba(0, 0, 0, ${centerDotOpacity * outlineOpacity})`;
        ctx.fillRect(centerX - r - outlineThickness, centerY - r - outlineThickness, centerDotThickness + outlineThickness * 2, centerDotThickness + outlineThickness * 2);
      }
      ctx.fillStyle = color;
      ctx.globalAlpha = centerDotOpacity;
      ctx.fillRect(centerX - r, centerY - r, centerDotThickness, centerDotThickness);
      ctx.globalAlpha = 1.0;
    }

    if (hasInnerLines) {
      const offset = innerOffset;
      const length = innerLength;
      const thick = innerThickness;
      const op = innerOpacity;
      drawLine(centerX, centerY - offset - length, centerX, centerY - offset, thick, op);
      drawLine(centerX, centerY + offset, centerX, centerY + offset + length, thick, op);
      drawLine(centerX - offset - length, centerY, centerX - offset, centerY, thick, op);
      drawLine(centerX + offset, centerY, centerX + offset + length, centerY, thick, op);
    }

    if (hasOuterLines) {
      const offset = outerOffset;
      const length = outerLength;
      const thick = outerThickness;
      const op = outerOpacity;
      drawLine(centerX, centerY - offset - length, centerX, centerY - offset, thick, op);
      drawLine(centerX, centerY + offset, centerX, centerY + offset + length, thick, op);
      drawLine(centerX - offset - length, centerY, centerX - offset, centerY, thick, op);
      drawLine(centerX + offset, centerY, centerX + offset + length, centerY, thick, op);
    }
  }, [
    color, hasOutline, outlineOpacity, outlineThickness,
    hasCenterDot, centerDotOpacity, centerDotThickness,
    hasInnerLines, innerOpacity, innerLength, innerThickness, innerOffset,
    hasOuterLines, outerOpacity, outerLength, outerThickness, outerOffset
  ]);

  const getProfileCode = () => {
    return `0;p;0;s;1;P;c;5;h;${hasOutline ? 1 : 0};o;${outlineOpacity.toFixed(2)};t;${outlineThickness};d;${hasCenterDot ? 1 : 0};b;${centerDotOpacity.toFixed(2)};z;${centerDotThickness};0t;${innerThickness};0l;${innerLength};0o;${innerOffset};0a;${innerOpacity.toFixed(2)};1t;${hasOuterLines ? outerThickness : 0};1l;${outerLength};1o;${outerOffset};1a;${outerOpacity.toFixed(2)}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getProfileCode());
    toast.success("Crosshair code copied", {
      description: "Profile string successfully saved to your system clipboard.",
      className: "font-mono rounded-none"
    });
  };

  const handleReset = () => {
    setColor("#00FF00");
    setHasOutline(true);
    setOutlineOpacity(0.5);
    setOutlineThickness(1);
    setHasCenterDot(false);
    setCenterDotOpacity(1.0);
    setCenterDotThickness(2);
    setHasInnerLines(true);
    setInnerOpacity(1.0);
    setInnerLength(4);
    setInnerThickness(2);
    setInnerOffset(2);
    setHasOuterLines(false);
    setOuterOpacity(0.35);
    setOuterLength(2);
    setOuterThickness(2);
    setOuterOffset(10);
  };

  return (
    <div className="min-h-screen bg-[#0B141A] py-16 text-foreground">
      {/* Tactical grid overlay */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">CALIBRATOR // OPTIC</span>
          </div>
          <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">CROSSHAIR</h1>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
            Engineer and preview custom reticles. Export the code for direct in-game import.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Canvas */}
          <Reveal className="relative border border-[rgba(236,232,225,0.08)] bg-[#08111A] overflow-hidden cut-corner-tl-br">
            <div aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-10 bg-primary z-10" />
            <div aria-hidden="true" className="absolute right-0 top-0 bg-primary px-3 py-1 font-mono text-[9px] font-black tracking-wider text-black z-10">
              LIVE PREVIEW
            </div>
            <div className="absolute inset-0">
              {backdrop !== "void" && (
                <Image
                  src={backdrops[backdrop as keyof typeof backdrops] as string}
                  alt="backdrop"
                  fill
                  className="object-cover opacity-40"
                />
              )}
            </div>
            <div className="relative aspect-video w-full">
              <canvas ref={canvasRef} width={640} height={360} className="w-full h-full" aria-label="Crosshair preview canvas" />
            </div>

            {/* Backdrop picker */}
            <div className="relative border-t border-border bg-background/80 px-4 py-3 flex items-center gap-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted">Background:</span>
              {(["ascent", "haven", "void"] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBackdrop(b)}
                  className={[
                    "border px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors",
                    backdrop === b ? "border-primary text-primary bg-primary/10" : "border-border text-muted hover:border-white/30 hover:text-white",
                  ].join(" ")}
                >
                  {b}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Controls */}
          <div className="space-y-4">

            {/* Color */}
            <Reveal className="border border-border bg-[#0D1A22] p-5 space-y-3 cut-corner-br">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Color</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Cyan",    hex: "#00FFFF" },
                  { name: "Green",   hex: "#00FF00" },
                  { name: "Red",     hex: "#FF0000" },
                  { name: "Yellow",  hex: "#FFFF00" },
                  { name: "White",   hex: "#FFFFFF" },
                  { name: "Magenta", hex: "#FF00FF" },
                ].map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={`Set color to ${c.name}`}
                    aria-pressed={color === c.hex}
                    className={[
                      "h-8 w-8 border-2 transition-all",
                      color === c.hex ? "border-white scale-110" : "border-transparent hover:scale-105",
                    ].join(" ")}
                  />
                ))}
              </div>
            </Reveal>

            {/* Outline + Center dot */}
            <Reveal className="border border-border bg-[#0D1A22] p-5 space-y-4 cut-corner-br">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Outline &amp; Center Dot</h2>

              <HudToggle label="Outlines" checked={hasOutline} onChange={setHasOutline} id="outline-toggle" />
              {hasOutline && (
                <div className="space-y-3 pl-4 border-l border-border">
                  <HudSlider id="outline-opacity"    label="Outline Opacity"    value={outlineOpacity}    onChange={setOutlineOpacity}    min={0} max={1}   step={0.05} display={outlineOpacity.toFixed(2)} />
                  <HudSlider id="outline-thickness"  label="Outline Thickness"  value={outlineThickness}  onChange={setOutlineThickness}  min={1} max={6}   step={1}    display={`${outlineThickness}px`} />
                </div>
              )}

              <HudToggle label="Center Dot" checked={hasCenterDot} onChange={setHasCenterDot} id="centerdot-toggle" />
              {hasCenterDot && (
                <div className="space-y-3 pl-4 border-l border-border">
                  <HudSlider id="dot-opacity"    label="Dot Opacity"    value={centerDotOpacity}    onChange={setCenterDotOpacity}    min={0} max={1} step={0.05} display={centerDotOpacity.toFixed(2)} />
                  <HudSlider id="dot-thickness"  label="Dot Thickness"  value={centerDotThickness}  onChange={setCenterDotThickness}  min={1} max={8} step={1}    display={`${centerDotThickness}px`} />
                </div>
              )}
            </Reveal>

            {/* Inner lines */}
            <Reveal className="border border-border bg-[#0D1A22] p-5 space-y-4 cut-corner-br">
              <HudToggle label="Inner Lines" checked={hasInnerLines} onChange={setHasInnerLines} id="inner-toggle" />
              {hasInnerLines && (
                <div className="space-y-3 pl-4 border-l border-border">
                  <HudSlider id="inner-opacity"    label="Opacity"    value={innerOpacity}    onChange={setInnerOpacity}    min={0} max={1}  step={0.05} display={innerOpacity.toFixed(2)} />
                  <HudSlider id="inner-length"     label="Length"     value={innerLength}     onChange={setInnerLength}     min={0} max={20} step={1}    display={`${innerLength}`} />
                  <HudSlider id="inner-thickness"  label="Thickness"  value={innerThickness}  onChange={setInnerThickness}  min={1} max={10} step={1}    display={`${innerThickness}px`} />
                  <HudSlider id="inner-offset"     label="Offset"     value={innerOffset}     onChange={setInnerOffset}     min={0} max={20} step={1}    display={`${innerOffset}px`} />
                </div>
              )}
            </Reveal>

            {/* Outer lines */}
            <Reveal className="border border-border bg-[#0D1A22] p-5 space-y-4 cut-corner-br">
              <HudToggle label="Outer Lines" checked={hasOuterLines} onChange={setHasOuterLines} id="outer-toggle" />
              {hasOuterLines && (
                <div className="space-y-3 pl-4 border-l border-border">
                  <HudSlider id="outer-opacity"    label="Opacity"    value={outerOpacity}    onChange={setOuterOpacity}    min={0} max={1}  step={0.05} display={outerOpacity.toFixed(2)} />
                  <HudSlider id="outer-length"     label="Length"     value={outerLength}     onChange={setOuterLength}     min={0} max={20} step={1}    display={`${outerLength}`} />
                  <HudSlider id="outer-thickness"  label="Thickness"  value={outerThickness}  onChange={setOuterThickness}  min={1} max={10} step={1}    display={`${outerThickness}px`} />
                  <HudSlider id="outer-offset"     label="Offset"     value={outerOffset}     onChange={setOuterOffset}     min={0} max={40} step={1}    display={`${outerOffset}px`} />
                </div>
              )}
            </Reveal>

            {/* Code output + actions */}
            <Reveal className="border border-primary/30 bg-primary-softer p-5 space-y-3 cut-corner-br">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Export Code</h2>
              <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-3 font-mono text-[10px] text-muted break-all select-all">
                {getProfileCode()}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={handleCopyCode} className="cut-corner-br gap-2">
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy Code
                </Button>
                <Button variant="secondary" onClick={handleReset} className="cut-corner-br gap-2">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}
