export const SDG10_STAGE_IDEAL = "ideal";
export const SDG10_STAGE_REALITY = "reality";

export const SDG10_MIN_TOP1_SHARE = 1;
export const SDG10_MAX_TOP1_SHARE = 60;
export const SDG10_DEFAULT_TOP1_SHARE = 10;
export const SDG10_COUNT_ANIMATION_MS = 820;

export const SDG10_SOURCE = Object.freeze({
  name: "World Inequality Report 2022",
  detail: "Global net household wealth distribution, 2021",
  url: "https://wir2022.wid.world/chapter-1/"
});

export const SDG10_GROUPS = Object.freeze([
  Object.freeze({
    key: "top1",
    label: "상위 1%",
    populationShare: 1,
    color: "#e94f6f",
    mutedColor: "#8d3044"
  }),
  Object.freeze({
    key: "next9",
    label: "다음 9%",
    populationShare: 9,
    color: "#f6a04d",
    mutedColor: "#8f5a2f"
  }),
  Object.freeze({
    key: "middle40",
    label: "중간 40%",
    populationShare: 40,
    color: "#f3d66b",
    mutedColor: "#84743b"
  }),
  Object.freeze({
    key: "bottom50",
    label: "하위 50%",
    populationShare: 50,
    color: "#6bd6c6",
    mutedColor: "#326f68"
  })
]);

export const SDG10_REALITY_DISTRIBUTION = Object.freeze({
  top1: 37.8,
  next9: 37.8,
  middle40: 22.4,
  bottom50: 2.0
});

export function clampSdg10Share(value) {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return SDG10_DEFAULT_TOP1_SHARE;
  return Math.min(SDG10_MAX_TOP1_SHARE, Math.max(SDG10_MIN_TOP1_SHARE, nextValue));
}

export function createSdg10InitialState() {
  return {
    stage: SDG10_STAGE_IDEAL,
    top1Share: SDG10_DEFAULT_TOP1_SHARE,
    distribution: calculateSdg10IdealDistribution(SDG10_DEFAULT_TOP1_SHARE)
  };
}

export function calculateSdg10IdealDistribution(top1ShareInput) {
  const top1Share = clampSdg10Share(top1ShareInput);
  const remainingShare = 100 - top1Share;
  const remainingPopulation = 99;

  return {
    top1: roundSdg10Share(top1Share),
    next9: roundSdg10Share((remainingShare * 9) / remainingPopulation),
    middle40: roundSdg10Share((remainingShare * 40) / remainingPopulation),
    bottom50: roundSdg10Share((remainingShare * 50) / remainingPopulation)
  };
}

export function getSdg10RealityDistribution() {
  return { ...SDG10_REALITY_DISTRIBUTION };
}

export function getSdg10Top10Share(distribution) {
  return roundSdg10Share((Number(distribution?.top1) || 0) + (Number(distribution?.next9) || 0));
}

export function getSdg10ComparisonRows(userDistribution, realityDistribution = SDG10_REALITY_DISTRIBUTION) {
  return [
    {
      key: "top1",
      label: "상위 1%",
      userValue: userDistribution.top1,
      realityValue: realityDistribution.top1
    },
    {
      key: "top10",
      label: "상위 10%",
      userValue: getSdg10Top10Share(userDistribution),
      realityValue: getSdg10Top10Share(realityDistribution)
    },
    {
      key: "bottom50",
      label: "하위 50%",
      userValue: userDistribution.bottom50,
      realityValue: realityDistribution.bottom50
    }
  ];
}

export function toSdg10CakeSegments(distribution) {
  let cursor = 0;
  return SDG10_GROUPS.map((group) => {
    const value = roundSdg10Share(distribution[group.key] || 0);
    const start = cursor;
    cursor = roundSdg10Share(cursor + value);
    return {
      ...group,
      value,
      start,
      end: cursor
    };
  });
}

export function formatSdg10Percent(value) {
  return `${roundSdg10Share(value).toFixed(1)}%`;
}

export function formatSdg10Delta(value) {
  const rounded = roundSdg10Share(value);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}%p`;
}

function roundSdg10Share(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}
