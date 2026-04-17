import { normalizeCustomDetailRenderer } from "./rendererContract.js";
import { toDefaultDetailFrameMeta } from "../data/sdgViewAdapters.js";

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
    3,
    {
      title: "Same Disease, Different Outcome",
      subtitle: "응급 접근의 격차",
      lead: "같은 응급상황이라도, 국가별 의료 접근 조건이 다르면 결과는 완전히 달라집니다.",
      hint: "체험 시작 후 두 환경의 상태 변화를 비교하세요"
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
  ],
  [
    5,
    {
      title: "The Gender Pay Clock",
      subtitle: "임금 시계",
      lead: "퇴근 시간은 같아도, 임금 격차가 있으면 무급 노동이 시작되는 시각은 달라집니다.",
      hint: "국가를 선택하고 시작하세요"
    }
  ],
  [
    6,
    {
      title: "The Weight of Water",
      subtitle: "물통의 무게",
      lead: "당신이 일상적으로 쓰는 물은 누군가에게는 들어 올리고 옮겨야 하는 무게가 됩니다.",
      hint: "샤워 시간을 입력하고 물의 무게를 체감하세요"
    }
  ],
  [
    7,
    {
      title: "The Green Mixer",
      subtitle: "우리 도시 에너지 믹스",
      lead: "어둠을 보여주는 대신, 우리가 직접 도시를 깨끗하게 밝히는 시뮬레이터입니다.",
      hint: "슬라이더를 움직여 도시 전환의 결과를 바로 확인하세요"
    }
  ]
]);

const CUSTOM_DETAIL_DEFINITIONS = new Map([
  [
    1,
    {
      loadModule: () => import("./sdg01Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg01DetailContent(customHost)
    }
  ],
  [
    2,
    {
      loadModule: () => import("./sdg02Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg02DetailContent(customHost)
    }
  ],
  [
    3,
    {
      loadModule: () => import("./sdg03Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg03DetailContent(customHost)
    }
  ],
  [
    4,
    {
      loadModule: () => import("./sdg04Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg04DetailContent(customHost)
    }
  ],
  [
    5,
    {
      loadModule: () => import("./sdg05Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg05DetailContent(customHost)
    }
  ],
  [
    6,
    {
      loadModule: () => import("./sdg06Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg06DetailContent(customHost)
    }
  ],
  [
    7,
    {
      loadModule: () => import("./sdg07Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg07DetailContent(customHost)
    }
  ]
]);

function getCustomDetailDefinition(goalId) {
  return CUSTOM_DETAIL_DEFINITIONS.get(Number(goalId)) || null;
}

export function hasCustomDetailRenderer(goalId) {
  return Boolean(getCustomDetailDefinition(goalId));
}

export async function preloadCustomDetailRenderer(goalId) {
  const definition = getCustomDetailDefinition(goalId);
  if (!definition) return false;

  try {
    await definition.loadModule();
    return true;
  } catch {
    return false;
  }
}

export async function createCustomDetailRenderer(goalId, customHost) {
  const definition = getCustomDetailDefinition(goalId);
  if (!definition) return null;
  try {
    const mod = await definition.loadModule();
    return normalizeCustomDetailRenderer(goalId, definition.createRenderer(mod, customHost));
  } catch {
    return null;
  }
}

export function getDetailFrameMeta(goalId, baseGoal) {
  const id = Number(goalId);
  const override = FRAME_META_OVERRIDES.get(id);
  if (override) return override;

  return toDefaultDetailFrameMeta(id, baseGoal);
}
