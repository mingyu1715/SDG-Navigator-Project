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
  }),
  "un-goal-13": Object.freeze({
    id: "un-goal-13",
    goals: [13],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 13",
    detail: "Climate action targets and indicator context",
    url: "https://sdgs.un.org/goals/goal13"
  }),
  "ipcc-ar6-wgi-sea-level": Object.freeze({
    id: "ipcc-ar6-wgi-sea-level",
    goals: [13],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "IPCC AR6 WGI Chapter 9",
    detail: "Global mean sea-level rise by warming level, Table 9.10",
    url: "https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9"
  }),
  "climate-central-picturing-future": Object.freeze({
    id: "climate-central-picturing-future",
    goals: [13],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "Climate Central: Picturing Our Future",
    detail: "Long-term coastal exposure comparison at 1.5°C and 3°C warming",
    url: "https://www.climatecentral.org/report/picturing-our-future"
  }),
  "nasa-sea-level-projection-tool": Object.freeze({
    id: "nasa-sea-level-projection-tool",
    goals: [13],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "NASA Sea Level Projection Tool",
    detail: "IPCC AR6 sea-level projection tool and local projection context",
    url: "https://sealevel.nasa.gov/ipcc-ar6-sea-level-projection-tool"
  }),
  "sdg13-rising-line-simulation": Object.freeze({
    id: "sdg13-rising-line-simulation",
    goals: [13],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "Rising Line scenario model",
    detail: "Water height and location lists are educational visualizations, not parcel-level flood maps",
    url: ""
  }),
  "un-goal-14": Object.freeze({
    id: "un-goal-14",
    goals: [14],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 14",
    detail: "Life below water targets and marine pollution indicator context",
    url: "https://sdgs.un.org/goals/goal14"
  }),
  "noaa-marine-debris-ingestion": Object.freeze({
    id: "noaa-marine-debris-ingestion",
    goals: [14],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "NOAA Marine Debris Program: Ingestion",
    detail: "Marine species can mistake debris for food and suffer blocked or damaged digestive systems",
    url: "https://marinedebris.noaa.gov/why-marine-debris-problem/ingestion"
  }),
  "iucn-marine-plastic-pollution": Object.freeze({
    id: "iucn-marine-plastic-pollution",
    goals: [14],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "IUCN Marine Plastic Pollution",
    detail: "Marine plastic pollution causes ingestion, entanglement, and ecosystem impacts",
    url: "https://www.iucn.org/resources/issues-brief/marine-plastic-pollution"
  }),
  "unep-marine-litter-assessment": Object.freeze({
    id: "unep-marine-litter-assessment",
    goals: [14],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNEP marine litter and plastic pollution assessment",
    detail: "Global assessment of marine litter and plastic pollution impacts",
    url: "https://www.unep.org/resources/pollution-solution-global-assessment-marine-litter-and-plastic-pollution"
  }),
  "sdg14-ocean-stomach-simulation": Object.freeze({
    id: "sdg14-ocean-stomach-simulation",
    goals: [14],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "Ocean's Stomach click model",
    detail: "Health index and microplastic load are educational interaction scores, not veterinary measurements",
    url: ""
  }),
  "un-goal-15": Object.freeze({
    id: "un-goal-15",
    goals: [15],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 15",
    detail: "Life on Land targets for forests, biodiversity, ecosystems, and threatened species",
    url: "https://sdgs.un.org/goals/goal15"
  }),
  "iucn-red-list": Object.freeze({
    id: "iucn-red-list",
    goals: [15],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "IUCN Red List",
    detail: "Threatened species categories and species-level conservation status reference",
    url: "https://www.iucnredlist.org/"
  }),
  "wwf-palm-oil-species": Object.freeze({
    id: "wwf-palm-oil-species",
    goals: [15],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "WWF: species threatened by unsustainable palm oil",
    detail: "Palm oil expansion context for orangutans, tigers, elephants, and tropical forest species",
    url: "https://www.worldwildlife.org/stories/endangered-species-threatened-by-unsustainable-palm-oil-production"
  }),
  "wwf-cerrado": Object.freeze({
    id: "wwf-cerrado",
    goals: [15],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "WWF: Cerrado",
    detail: "Cerrado habitat conversion context linked to agriculture and wildlife pressure",
    url: "https://www.worldwildlife.org/places/cerrado"
  }),
  "wwf-soy-production": Object.freeze({
    id: "wwf-soy-production",
    goals: [15],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "WWF: soy production",
    detail: "Soy expansion and ecosystem conversion context used for cattle-feed linkage",
    url: "https://wwf.panda.org/discover/our_focus/food_practice/sustainable_production/soy/"
  }),
  "wwf-illegal-logging": Object.freeze({
    id: "wwf-illegal-logging",
    goals: [15],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "WWF: stopping illegal logging",
    detail: "Illegal logging, timber demand, and forest degradation context",
    url: "https://www.worldwildlife.org/our-work/forests/deforestation-and-forest-degradation/stopping-illegal-logging/"
  }),
  "wwf-asian-elephant": Object.freeze({
    id: "wwf-asian-elephant",
    goals: [15],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "WWF: Asian elephant",
    detail: "Habitat loss and fragmentation context for Asian elephants",
    url: "https://www.worldwildlife.org/species/asian-elephant"
  }),
  "wwf-red-panda": Object.freeze({
    id: "wwf-red-panda",
    goals: [15],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "WWF: red panda",
    detail: "Forest habitat pressure context for red pandas",
    url: "https://www.worldwildlife.org/species/red-panda"
  }),
  "sdg15-extinction-domino-simulation": Object.freeze({
    id: "sdg15-extinction-domino-simulation",
    goals: [15],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "Extinction Domino scenario model",
    detail: "Domino steps and pressure scores are educational interaction values, not official biodiversity metrics",
    url: ""
  }),
  "un-goal-16": Object.freeze({
    id: "un-goal-16",
    goals: [16],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 16",
    detail: "Peace, justice and strong institutions targets and indicator context",
    url: "https://sdgs.un.org/goals/goal16"
  }),
  "un-sdg-report-2025-goal-16": Object.freeze({
    id: "un-sdg-report-2025-goal-16",
    goals: [16],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Report 2025: Goal 16",
    detail: "Conflict-related deaths, homicide rate, forced displacement, and killings of protected groups",
    url: "https://unstats.un.org/sdgs/report/2025/Goal-16/"
  }),
  "unodc-global-study-homicide-2023": Object.freeze({
    id: "unodc-global-study-homicide-2023",
    goals: [16],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNODC Global Study on Homicide 2023",
    detail: "Intentional homicide definition and global violence measurement context",
    url: "https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html"
  }),
  "acled-conflict-index-2025": Object.freeze({
    id: "acled-conflict-index-2025",
    goals: [16],
    type: SDG_SOURCE_TYPES.DERIVED,
    name: "ACLED Weekly Conflict Index",
    detail: "Conflict severity ranking, weekly conflict intensity, and global conflict hotspot context",
    url: "https://acleddata.com/platform/weekly-conflict-index"
  }),
  "sdg16-silence-conflict-simulation": Object.freeze({
    id: "sdg16-silence-conflict-simulation",
    goals: [16],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "Silence of Conflict map model",
    detail: "Conflict markers are representative educational map points, not live event markers",
    url: ""
  }),
  "un-goal-17": Object.freeze({
    id: "un-goal-17",
    goals: [17],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UN SDG Goal 17",
    detail: "Partnerships for the Goals targets and indicator context",
    url: "https://sdgs.un.org/goals/goal17"
  }),
  "itu-facts-2025-goal-17": Object.freeze({
    id: "itu-facts-2025-goal-17",
    goals: [17],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "ITU Facts and Figures 2025",
    detail: "Estimated global Internet users and offline population",
    url: "https://www.itu.int/en/mediacentre/Pages/PR-2025-11-17-Facts-and-Figures.aspx"
  }),
  "oecd-oda-2025-preliminary": Object.freeze({
    id: "oecd-oda-2025-preliminary",
    goals: [17],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "OECD preliminary ODA data",
    detail: "Official development assistance by DAC members and associates, 2025 preliminary data",
    url: "https://www.oecd.org/en/about/news/press-releases/2026/04/international-aid-fell-sharply-in-2025-says-oecd.html"
  }),
  "unctad-global-trade-2024": Object.freeze({
    id: "unctad-global-trade-2024",
    goals: [17],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "UNCTAD Global Trade Update",
    detail: "Global trade in goods and services, 2024",
    url: "https://unctad.org/news/global-trade-hits-record-33-trillion-2024-driven-services-and-developing-economies"
  }),
  "un-member-states": Object.freeze({
    id: "un-member-states",
    goals: [17],
    type: SDG_SOURCE_TYPES.OFFICIAL,
    name: "United Nations About Us",
    detail: "UN Member States count",
    url: "https://www.un.org/en/about-us/"
  }),
  "sdg17-global-network-simulation": Object.freeze({
    id: "sdg17-global-network-simulation",
    goals: [17],
    type: SDG_SOURCE_TYPES.SIMULATION,
    name: "Global Network visualization model",
    detail: "Nodes and links are educational visualizations, not live institution locations",
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
