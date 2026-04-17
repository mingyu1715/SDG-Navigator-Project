import { SDG_DATA, getGoalById } from "./sdgs.js";
import { toEditableDetailDraft } from "./sdgMetaAdapters.js";

// SDG01은 별도 커스텀 상세 모듈을 사용하므로 여기서 제외한다.
// SDG02~17 임시 상세를 빠르게 수정하려면 이 파일만 편집하면 된다.
async function loadDraftOverrides() {
  try {
    const res = await fetch("/app/data/detailDraftOverrides.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data !== "object") throw new Error("Invalid draft overrides");
    return data;
  } catch {
    return {};
  }
}

const DRAFT_OVERRIDES = Object.freeze(await loadDraftOverrides());

function toDraft(goalId) {
  const goal = getGoalById(goalId);
  if (!goal || goal.id === 1) return null;

  const override = DRAFT_OVERRIDES[goal.id] || {};
  return toEditableDetailDraft(goal, override);
}

export const EDITABLE_DETAIL_DRAFTS = Object.freeze(
  SDG_DATA.filter((goal) => goal.id !== 1).map((goal) => toDraft(goal.id)).filter(Boolean)
);

export function getEditableDetailDraft(goalId) {
  const id = Number(goalId);
  if (!Number.isFinite(id) || id === 1) return null;
  return EDITABLE_DETAIL_DRAFTS.find((item) => item.id === id) || toDraft(id);
}
