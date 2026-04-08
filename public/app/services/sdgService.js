import { getGoalById } from "../data/sdgs.js";
import { getEditableDetailDraft } from "../data/detailDrafts.js";
import { toGoalDetailFallback } from "../data/sdgMetaAdapters.js";

const cache = new Map();

export async function fetchGoalDetail(goalId) {
  const id = Number(goalId);
  if (cache.has(id)) return cache.get(id);

  const draft = getEditableDetailDraft(id);
  if (draft) {
    cache.set(id, draft);
    return draft;
  }

  const fallback = getGoalById(id);
  try {
    const res = await fetch(`/api/sdgs/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.set(id, data);
    return data;
  } catch {
    const fallbackData = toGoalDetailFallback(id, fallback);
    cache.set(id, fallbackData);
    return fallbackData;
  }
}
