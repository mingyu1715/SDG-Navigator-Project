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
  ],
  [
    8,
    {
      title: "Growth vs Job Quality",
      subtitle: "성장과 고용의 딜레마",
      lead: "경제 성장률이 올라가도 일자리 질은 같은 방향으로 움직이지 않을 수 있습니다.",
      hint: "체험 시작 후 한 번의 선택으로 결과를 확인하세요"
    }
  ],
  [
    9,
    {
      title: "The Connection Bridge",
      subtitle: "미래 연결 브릿지",
      lead: "기술 인프라가 끊어진 산업 생태계를 연결하면 생산과 혁신이 함께 움직이기 시작합니다.",
      hint: "산업과 혁신을 연결할 기반 시설을 선택하세요"
    }
  ],
  [
    10,
    {
      title: "The Wealth Cake",
      subtitle: "부의 케이크 나누기",
      lead: "공정하다고 생각한 분배와 현실의 전 세계 자산 분포를 하나의 케이크로 비교합니다.",
      hint: "슬라이더로 분배를 정한 뒤 현실 보기 버튼을 눌러보세요"
    }
  ],
  [
    11,
    {
      title: "City Planner",
      subtitle: "스마트 그린 시티 설계",
      lead: "공원, 대중교통, 재활용 거점을 조절해 도시의 행복지수와 미세먼지 변화를 확인합니다.",
      hint: "도시 전략과 전환 강도를 정해 회색 격자를 살아 있는 도시로 바꿔보세요"
    }
  ],
  [
    12,
    {
      title: "The Trash Ghost",
      subtitle: "쓰레기 유령",
      lead: "버린 물건이 눈앞에서 사라진 뒤에도 지구에 남는 긴 시간을 보여줍니다.",
      hint: "오늘 버린 일회용품을 선택해 쓰레기 유령의 시간을 확인하세요"
    }
  ],
  [
    13,
    {
      title: "The Rising Line",
      subtitle: "침수 한계선",
      lead: "지구 온난화가 해안 도시의 어느 선까지 물을 끌어올리는지 보여줍니다.",
      hint: "예상 기온 상승폭을 선택해 수면선 변화를 확인하세요"
    }
  ],
  [
    14,
    {
      title: "The Ocean's Stomach",
      subtitle: "바다의 위장",
      lead: "우리가 버린 플라스틱이 해양 생물의 몸 안에 어떤 무게로 남는지 보여줍니다.",
      hint: "화면을 클릭해 바다거북의 위장에 쌓이는 파편을 확인하세요"
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
  ],
  [
    8,
    {
      loadModule: () => import("./sdg08Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg08DetailContent(customHost)
    }
  ],
  [
    9,
    {
      loadModule: () => import("./sdg09Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg09DetailContent(customHost)
    }
  ],
  [
    10,
    {
      loadModule: () => import("./sdg10Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg10DetailContent(customHost)
    }
  ],
  [
    11,
    {
      loadModule: () => import("./sdg11Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg11DetailContent(customHost)
    }
  ],
  [
    12,
    {
      loadModule: () => import("./sdg12Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg12DetailContent(customHost)
    }
  ],
  [
    13,
    {
      loadModule: () => import("./sdg13Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg13DetailContent(customHost)
    }
  ],
  [
    14,
    {
      loadModule: () => import("./sdg14Content.js"),
      createRenderer: (mod, customHost) => new mod.Sdg14DetailContent(customHost)
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
