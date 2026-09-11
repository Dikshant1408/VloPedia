/**
 * WebGL Detector Utility for VloPedia
 * Safely tests for WebGL / WebGL2 capability in browser environments
 * without leaking canvas contexts or breaking during Next.js SSR.
 */

let cachedWebGLSupport: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (cachedWebGLSupport !== null) {
    return cachedWebGLSupport;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    const isSupported = Boolean(gl && gl instanceof WebGLRenderingContext || (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext));

    // Release context resources if supported
    if (gl) {
      const loseContext = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }
    }

    cachedWebGLSupport = isSupported;
    return isSupported;
  } catch {
    cachedWebGLSupport = false;
    return false;
  }
}
