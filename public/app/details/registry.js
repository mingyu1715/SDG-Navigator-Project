import { Sdg01DetailContent } from "./sdg01Content.js";
import { Sdg02DetailContent } from "./sdg02Content.js";
import { Sdg04DetailContent } from "./sdg04Content.js";

const FRAME_META_OVERRIDES = new Map([
  [
    1,
    {
      title: "No Poverty",
      subtitle: "생존의 로또",
      lead: "같은 지구, 다른 출발선. 태어나는 위치만으로 하루의 생존 조건이 달라집니다.",
      hint: "시작 버튼을 눌러 체험하세요"
    }
  ],
  [
    2,
    {
      title: "The Revenge of a Forgotten Fridge",
      subtitle: "잊혀진 냉장고의 복수",
      lead: "버리는 순간, 낭비는 커집니다.",
      hint: "문이나 버튼으로 냉장고를 열어보세요"
    }
  ],
  [
    4,
    {
      title: "The Lens of Illiteracy",
      subtitle: "문맹의 시선",
      lead: "같은 정보, 다른 세상. 누군가에게는 기회가 되는 문장이, 누군가에게는 의미 없는 기호일 뿐입니다.",
      hint: "국가를 선택하여 시작하세요"
    }
  ]
]);

export function createCustomDetailRenderers(customHost) {
  return new Map([
    [1, new Sdg01DetailContent(customHost)],
    [2, new Sdg02DetailContent(customHost)],
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
