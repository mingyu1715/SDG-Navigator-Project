import { getGoalById } from "../data/sdgs.js";
import { getEditableDetailDraft } from "../data/detailDrafts.js";

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
    const fallbackData = {
      id,
      title: fallback ? fallback.title : `SDG ${String(id).padStart(2, "0")}`,
      subtitle: fallback ? fallback.sub : "",
      description: fallback ? fallback.detailed : "상세 정보가 없습니다.",
      features: ["초안 포인트를 입력하세요."]
    };
    cache.set(id, fallbackData);
    return fallbackData;
  }
}
