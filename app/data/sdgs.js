import { toCardMeta } from "./sdgMetaAdapters.js";

const FALLBACK_SDG_DATA = [
  { id: 1, color: "#E5243B", title: "NO POVERTY", sub: "빈곤 퇴치", detailed: "취약계층 기본생활 보장과 안전망 강화로 빈곤의 악순환을 줄입니다." },
  { id: 2, color: "#DDA63A", title: "ZERO HUNGER", sub: "기아 종식", detailed: "안정적 식량 접근성과 영양 개선으로 기아와 영양 불균형을 해소합니다." },
  { id: 3, color: "#4C9F38", title: "GOOD HEALTH", sub: "건강과 웰빙", detailed: "예방 중심 보건체계와 의료 접근성 개선으로 건강한 삶을 지원합니다." },
  { id: 4, color: "#C5192D", title: "QUALITY EDUCATION", sub: "양질의 교육", detailed: "포용적 교육 기회 확대를 통해 학습격차를 줄이고 역량을 강화합니다.", titleSize: 27 },
  { id: 5, color: "#FF3A21", title: "GENDER EQUALITY", sub: "성평등", detailed: "성별 차별과 폭력 감소를 통해 동등한 기회와 권리를 보장합니다.", titleSize: 28 },
  { id: 6, color: "#26BDE2", title: "CLEAN WATER", sub: "깨끗한 물", detailed: "안전한 식수와 위생 환경 확보로 지속가능한 생활 기반을 만듭니다." },
  { id: 7, color: "#FCC30B", title: "CLEAN ENERGY", sub: "에너지", detailed: "재생에너지 확대와 효율 개선으로 모두를 위한 에너지 전환을 촉진합니다." },
  { id: 8, color: "#A21942", title: "DECENT WORK", sub: "양질의 일자리", detailed: "안전하고 공정한 노동환경을 통해 지속가능한 성장과 고용을 만듭니다." },
  { id: 9, color: "#FD6925", title: "INDUSTRY INNOVATION", sub: "산업과 혁신", detailed: "회복력 있는 인프라와 기술 혁신으로 미래 경쟁력을 강화합니다.", titleSize: 24 },
  { id: 10, color: "#DD1367", title: "REDUCED INEQUALITIES", sub: "불평등 완화", detailed: "소득과 기회 격차를 줄여 사회 참여의 공정성을 높입니다.", titleSize: 23 },
  { id: 11, color: "#FD9D24", title: "SUSTAINABLE CITIES", sub: "지속가능 도시", detailed: "주거·교통·환경 개선을 통해 포용적이고 안전한 도시를 구축합니다.", titleSize: 22 },
  { id: 12, color: "#BF8B2E", title: "RESPONSIBLE CONSUMPTION", sub: "책임 소비", detailed: "자원 순환과 폐기물 감축으로 지속가능한 소비·생산 체계를 확산합니다.", titleSize: 20 },
  { id: 13, color: "#3F7E44", title: "CLIMATE ACTION", sub: "기후 행동", detailed: "감축과 적응 전략을 강화해 기후위기에 대한 회복력을 높입니다." },
  { id: 14, color: "#0A97D9", title: "LIFE BELOW WATER", sub: "해양 생태", detailed: "해양 오염을 줄이고 바다 생태계를 보호해 지속가능성을 확보합니다.", titleSize: 24 },
  { id: 15, color: "#56C02B", title: "LIFE ON LAND", sub: "육상 생태", detailed: "산림·토양·생물다양성 보호와 복원으로 육상 생태를 지킵니다." },
  { id: 16, color: "#00689D", title: "PEACE JUSTICE", sub: "평화와 제도", detailed: "투명하고 책임 있는 제도 구축으로 사회 신뢰를 높입니다.", titleSize: 25 },
  { id: 17, color: "#19486A", title: "PARTNERSHIPS", sub: "협력", detailed: "정부·기업·시민사회 협력을 통해 목표 이행 역량을 확장합니다.", titleSize: 21 }
];

async function loadSdgData() {
  try {
    const res = await fetch("/app/data/sdgs.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Invalid SDG data");
    return data;
  } catch {
    return FALLBACK_SDG_DATA;
  }
}

export const SDG_DATA = Object.freeze(
  (await loadSdgData()).map((goal) => toCardMeta(goal))
);

export function getGoalById(goalId) {
  return SDG_DATA.find((goal) => goal.id === Number(goalId)) || null;
}

export function toGoalRoute(goalId) {
  return `/detailed/sdg-${String(goalId).padStart(2, "0")}/`;
}
