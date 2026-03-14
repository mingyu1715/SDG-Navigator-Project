import { SDG_DATA, getGoalById } from "./sdgs.js";

// SDG01은 별도 커스텀 상세 모듈을 사용하므로 여기서 제외한다.
// SDG02~17 임시 상세를 빠르게 수정하려면 이 파일만 편집하면 된다.
const DRAFT_OVERRIDES = {
  2: {
    description: "기아 종식을 위해 식량 접근성, 영양, 지역 식량 시스템의 회복력을 높이는 데 집중합니다.",
    features: [
      "취약 지역 급식/영양 지원 체계 강화",
      "소농 생산성 개선과 유통 손실 감소",
      "위기 상황 식량 안전망의 상시 가동"
    ]
  },
  3: {
    description: "예방 중심 보건과 필수 의료 접근성 개선으로 삶의 질을 높입니다.",
    features: [
      "기초 보건 서비스 접근성 확대",
      "예방접종/모자보건 커버리지 개선",
      "지역 단위 건강 리스크 조기 대응"
    ]
  },
  4: {
    description: "포용적 교육 기회 확대와 학습격차 완화를 핵심 목표로 둡니다.",
    features: [
      "기초학력 보장 프로그램 고도화",
      "디지털 학습 접근성 개선",
      "지역/계층 간 교육격차 완화"
    ]
  },
  5: {
    description: "성별 기반 불평등과 폭력을 줄이고 동등한 기회를 보장합니다.",
    features: [
      "성폭력/차별 대응체계 강화",
      "경제·정치 참여 기회 확대",
      "돌봄 부담의 공정한 분담"
    ]
  },
  6: {
    description: "안전한 물과 위생 접근성을 개선해 기본 생활 기반을 강화합니다.",
    features: [
      "취약 지역 식수 인프라 확충",
      "위생 시설 보급 및 관리 개선",
      "물 스트레스 지역 효율 관리"
    ]
  },
  7: {
    description: "청정에너지 전환과 에너지 접근성 개선을 동시에 추진합니다.",
    features: [
      "분산형 재생에너지 보급",
      "에너지 빈곤층 접근성 강화",
      "효율 개선으로 비용 부담 완화"
    ]
  },
  8: {
    description: "안전하고 공정한 노동환경을 기반으로 양질의 일자리를 확장합니다.",
    features: [
      "비공식 노동의 제도권 전환 지원",
      "청년·취약계층 고용 안전망 강화",
      "산업별 안전·인권 기준 고도화"
    ]
  },
  9: {
    description: "회복력 있는 인프라와 혁신 생태계 구축으로 지속가능 성장을 돕습니다.",
    features: [
      "지역 산업 기반시설 현대화",
      "중소기업 기술혁신 역량 강화",
      "디지털/친환경 전환 투자 확대"
    ]
  },
  10: {
    description: "소득·기회 격차를 줄여 사회적 포용성과 이동성을 높입니다.",
    features: [
      "취약계층 소득 보전 체계 개선",
      "서비스 접근 격차 완화",
      "차별 완화와 참여 기회 확대"
    ]
  },
  11: {
    description: "주거·교통·안전·환경을 통합 개선해 지속가능한 도시를 만듭니다.",
    features: [
      "노후 주거지 생활 인프라 개선",
      "대중교통 중심 이동성 강화",
      "도시 재난·기후 리스크 대응"
    ]
  },
  12: {
    description: "자원 순환과 폐기물 감축으로 책임 있는 소비·생산을 촉진합니다.",
    features: [
      "순환경제 기반 재사용·재활용 확대",
      "공급망 단계별 자원 효율 개선",
      "소비자 행동 변화 유도 캠페인"
    ]
  },
  13: {
    description: "감축과 적응 전략을 결합해 기후위기 대응력을 강화합니다.",
    features: [
      "지역 단위 탄소 감축 실행 강화",
      "기후 재난 조기경보·대응 고도화",
      "취약계층 적응 지원 확대"
    ]
  },
  14: {
    description: "해양 오염 저감과 생태계 복원으로 바다의 지속가능성을 확보합니다.",
    features: [
      "해양 플라스틱 유입 저감",
      "연안 생태계 복원 프로젝트 확대",
      "지속가능 수산 관리 강화"
    ]
  },
  15: {
    description: "육상 생태계와 생물다양성을 보호·복원합니다.",
    features: [
      "산림 훼손 억제 및 복원",
      "토양 황폐화 지역 회복",
      "생물다양성 핵심 서식지 보호"
    ]
  },
  16: {
    description: "투명하고 책임 있는 제도 강화로 신뢰 기반 사회를 구축합니다.",
    features: [
      "공공 데이터/절차 투명성 강화",
      "사법·행정 접근성 개선",
      "폭력·부패 예방 체계 고도화"
    ]
  },
  17: {
    description: "정부·기업·시민사회 협력으로 목표 달성 실행력을 높입니다.",
    features: [
      "다자 협력 프로젝트 운영 체계화",
      "재원·기술·데이터 협력 확대",
      "성과 기반 파트너십 관리"
    ]
  }
};

function toDraft(goalId) {
  const goal = getGoalById(goalId);
  if (!goal || goal.id === 1) return null;

  const override = DRAFT_OVERRIDES[goal.id] || {};
  return {
    id: goal.id,
    title: goal.title,
    subtitle: goal.sub,
    description: override.description || goal.detailed,
    features: override.features || ["초안 포인트를 입력하세요."]
  };
}

export const EDITABLE_DETAIL_DRAFTS = Object.freeze(
  SDG_DATA.filter((goal) => goal.id !== 1).map((goal) => toDraft(goal.id)).filter(Boolean)
);

export function getEditableDetailDraft(goalId) {
  const id = Number(goalId);
  if (!Number.isFinite(id) || id === 1) return null;
  return EDITABLE_DETAIL_DRAFTS.find((item) => item.id === id) || toDraft(id);
}
