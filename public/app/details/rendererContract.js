const DEFAULT_FRAME_MODE = "generic";

export function normalizeCustomDetailRenderer(goalId, renderer) {
  if (!renderer || typeof renderer.render !== "function") {
    return null;
  }

  return {
    goalId: Number(goalId),
    panelClass: typeof renderer.panelClass === "string" ? renderer.panelClass : "",
    frameMode: typeof renderer.frameMode === "string" ? renderer.frameMode : DEFAULT_FRAME_MODE,
    render() {
      return renderer.render();
    },
    destroy() {
      if (typeof renderer.destroy === "function") {
        renderer.destroy();
      }
    }
  };
}
