export const SDG_SOURCE_TYPES = Object.freeze({
  OFFICIAL: "official",
  DERIVED: "derived",
  SIMULATION: "simulation"
});

export const SDG_SOURCE_REGISTRY = Object.freeze({
  "world-bank-pip": Object.freeze({
    id: "world-bank-pip",
    goals: [1],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "World Bank Poverty and Inequality Platform",
    detail: "Poverty baseline and country poverty indicators",
    url: "https://pip.worldbank.org/"
  }),
  "un-goal-1": Object.freeze({
    id: "un-goal-1",
    goals: [1],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 1",
    detail: "No Poverty targets and indicator context",
    url: "https://sdgs.un.org/goals/goal1"
  }),
  "unep-food-waste-2024": Object.freeze({
    id: "unep-food-waste-2024",
    goals: [2],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNEP Food Waste Index Report 2024",
    detail: "Food waste reality context",
    url: "https://www.unep.org/resources/publication/food-waste-index-report-2024"
  }),
  "water-footprint-network": Object.freeze({
    id: "water-footprint-network",
    goals: [2],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "Water Footprint Network Product Gallery",
    detail: "Ingredient-level water footprint conversion reference",
    url: "https://www.waterfootprint.org/resources/interactive-tools/product-gallery/"
  }),
  "who-uhc-2025": Object.freeze({
    id: "who-uhc-2025",
    goals: [3],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "WHO Universal Health Coverage fact sheet",
    detail: "Health service access baseline, 2025 update",
    url: "https://www.who.int/news-room/fact-sheets/detail/universal-health-coverage-(uhc)"
  }),
  "unesco-uis-literacy": Object.freeze({
    id: "unesco-uis-literacy",
    goals: [4],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNESCO UIS Literacy",
    detail: "Literacy topic and data reference",
    url: "https://uis.unesco.org/en/topic/literacy"
  }),
  "world-bank-literacy": Object.freeze({
    id: "world-bank-literacy",
    goals: [4],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "World Bank adult literacy rate",
    detail: "Indicator SE.ADT.LITR.ZS",
    url: "https://data.worldbank.org/indicator/SE.ADT.LITR.ZS"
  }),
  "oecd-gender-wage-gap": Object.freeze({
    id: "oecd-gender-wage-gap",
    goals: [5],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "OECD Gender Wage Gap indicator",
    detail: "Country pay-gap values",
    url: "https://www.oecd.org/en/data/indicators/gender-wage-gap.html"
  }),
  "who-unicef-jmp-2025": Object.freeze({
    id: "who-unicef-jmp-2025",
    goals: [6],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "WHO/UNICEF JMP 2025",
    detail: "Drinking water and sanitation baseline",
    url: "https://data.unicef.org/resources/jmp-report-2025/"
  }),
  "epa-watersense-showerheads": Object.freeze({
    id: "epa-watersense-showerheads",
    goals: [6],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "EPA WaterSense showerheads",
    detail: "2.5 gallons per minute showerhead baseline converted to liters per minute",
    url: "https://www.epa.gov/watersense/showerheads"
  }),
  "tracking-sdg7-2025": Object.freeze({
    id: "tracking-sdg7-2025",
    goals: [7],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "Tracking SDG7: The Energy Progress Report 2025",
    detail: "Electricity access, clean cooking access, and renewables context",
    url: "https://www.iea.org/reports/tracking-sdg7-the-energy-progress-report-2025"
  }),
  "ilo-est-2026": Object.freeze({
    id: "ilo-est-2026",
    goals: [8],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "ILO Employment and Social Trends 2026",
    detail: "Labor-market baseline for decent work simulations",
    url: "https://researchrepository.ilo.org/esploro/outputs/report/Employment-and-social-trends-2026/995684768902676"
  }),
  "itu-facts-2025": Object.freeze({
    id: "itu-facts-2025",
    goals: [9],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "ITU Facts and Figures 2025",
    detail: "Connectivity baseline for infrastructure simulations",
    url: "https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/"
  }),
  "unido-sdg9": Object.freeze({
    id: "unido-sdg9",
    goals: [9],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNIDO statistical databases",
    detail: "Industrialization and manufacturing context",
    url: "https://www.unido.org/researchers/statistical-databases"
  }),
  "wir-2022": Object.freeze({
    id: "wir-2022",
    goals: [10],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "World Inequality Report 2022",
    detail: "Global net household wealth distribution, 2021",
    url: "https://wir2022.wid.world/chapter-1/"
  }),
  "un-goal-11": Object.freeze({
    id: "un-goal-11",
    goals: [11],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 11",
    detail: "Sustainable cities and communities targets",
    url: "https://sdgs.un.org/goals/goal11"
  }),
  "who-air-quality-guidelines": Object.freeze({
    id: "who-air-quality-guidelines",
    goals: [11],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "WHO global air quality guidelines",
    detail: "PM2.5 health guideline context",
    url: "https://www.who.int/publications/i/item/9789240034228"
  }),
  "un-habitat-world-cities-2024": Object.freeze({
    id: "un-habitat-world-cities-2024",
    goals: [11],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN-Habitat World Cities Report 2024",
    detail: "World Cities Report 2024: Cities and Climate Action",
    url: "https://unhabitat.org/sites/default/files/2024/11/wcr2024_-_full_report.pdf"
  }),
  "sdg11-city-planner-simulation": Object.freeze({
    id: "sdg11-city-planner-simulation",
    goals: [11],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "City Planner simulation",
    detail: "Happiness and PM2.5 outputs are educational scenario values, not official city statistics",
    url: ""
  }),
  "un-goal-12": Object.freeze({
    id: "un-goal-12",
    goals: [12],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 12",
    detail: "Responsible consumption and production target context",
    url: "https://sdgs.un.org/goals/goal12"
  }),
  "noaa-marine-debris-plastic": Object.freeze({
    id: "noaa-marine-debris-plastic",
    goals: [12],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "NOAA Marine Debris Program: Plastic",
    detail: "Plastic fragments into microplastics and may never fully go away",
    url: "https://marinedebris.noaa.gov/what-marine-debris/plastic"
  }),
  "noaa-debris-degradation": Object.freeze({
    id: "noaa-debris-degradation",
    goals: [12],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "NOAA Ocean Service: marine debris degradation",
    detail: "Debris degradation depends on material, size, thickness, and environmental conditions",
    url: "https://oceanservice.noaa.gov/facts/degrade.html"
  }),
  "unep-single-use-plastics": Object.freeze({
    id: "unep-single-use-plastics",
    goals: [12],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNEP Single-use plastics roadmap",
    detail: "Single-use plastic consumption and policy context",
    url: "https://www.unep.org/resources/report/single-use-plastics-roadmap-sustainability"
  }),
  "sdg12-trash-ghost-simulation": Object.freeze({
    id: "sdg12-trash-ghost-simulation",
    goals: [12],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "Trash Ghost persistence model",
    detail: "Persistence years are educational estimates, not exact official decomposition dates",
    url: ""
  })
});

export function getSdgSource(sourceId) {
  return SDG_SOURCE_REGISTRY[sourceId] || null;
}

export function getSdgSourcesForGoal(goalId) {
  const id = Number(goalId);
  return Object.values(SDG_SOURCE_REGISTRY).filter((source) => source.goals.includes(id));
}
