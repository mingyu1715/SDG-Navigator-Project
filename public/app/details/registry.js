import { Sdg04DetailContent } from "./sdg04Content.js";

const FRAME_META_OVERRIDES = new Map([
  [4, { title: "The Lens of Illiteracy", subtitle: "문맹의 시선" }]
]);

export function createCustomDetailRenderers(customHost) {
  return new Map([
    [4, new Sdg04DetailContent(customHost)]
  ]);
}

export function getDetailFrameMeta(goalId, baseGoal) {
  const id = Number(goalId);
  const override = FRAME_META_OVERRIDES.get(id);
  if (override) return override;

  return {
    title: baseGoal?.title || `SDG ${String(id).padStart(2, "0")}`,
    subtitle: baseGoal?.sub || ""
  };
}
