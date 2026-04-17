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

  const fallbackData = toGoalDetailFallback(id, getGoalById(id));
  cache.set(id, fallbackData);
  return fallbackData;
}
