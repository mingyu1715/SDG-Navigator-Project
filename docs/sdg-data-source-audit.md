# SDG 1-17 Data Source Audit

Last updated: 2026-05-08

## Purpose

This document defines how SDG Navigator handles statistics, derived values, and educational simulation values across all 17 detailed SDG experiences.

Every number shown in a detail page must be one of these:

- **official**: a direct value or official context from a public agency, international organization, or recognized dataset.
- **derived**: a value calculated from a documented source and a stated conversion rule.
- **simulation**: an educational interaction score or scenario value designed for the experience.

When a value is not an official statistic, the UI and data model should avoid presenting it as measured reality.

## Data Type Standard

| Type | Meaning | Required documentation |
| --- | --- | --- |
| `official` | Direct public statistic, official report, or authoritative target context | Source name, basis year or report year, indicator meaning, URL |
| `derived` | Conversion or scenario value calculated from source context | Original source, conversion rule, assumptions, URL |
| `simulation` | Educational score or visual model value | Clear simulation label, purpose, limits, and source context if used |

## Source Metadata Pattern

Each detailed model should keep source metadata close to the values it drives. Shared source metadata is managed in `app/data/sdgSourceRegistry.js`.

```js
export const SDGXX_SOURCES = Object.freeze({
  metricKey: {
    type: "official",
    name: "Agency or report name",
    detail: "Indicator, geography, year, and conversion rule if needed",
    url: "https://..."
  }
});
```

If a value is a simulation, use `type: "simulation"` and make the UI label clear.

## Current Audit Table

| Goal | Main numeric surface | Current status | Source basis | Implementation decision |
| --- | --- | --- | --- | --- |
| SDG1 No Poverty | Scenario location, daily budget, meal coverage, water access/time outputs | Simulation with official poverty context | World Bank Poverty and Inequality Platform, UN SDG Goal 1 | Keep the lottery structure. Show outputs as educational estimates, not exact country statistics. |
| SDG2 Zero Hunger | Ingredient water footprint, food waste context, item price/weight/CO2e conversion | Mixed: official/derived context plus simulation conversions | UNEP Food Waste Index 2024, Water Footprint Network | Keep ingredient interaction. Mark local prices and conversion outputs as educational estimates until official item-level LCA data is added. |
| SDG3 Good Health | Access tier, survival rate, response minutes, golden-time rate, BPM | Simulation informed by official health-access context | WHO Universal Health Coverage, WHO emergency care resources | Keep access tier model. Label access levels and survival outputs as educational simulation values. |
| SDG4 Quality Education | Literacy rate, source year, text distortion strength | Official or derived reference depending on country | UNESCO UIS, World Bank `SE.ADT.LITR.ZS` | Country values keep source year/source type. Finland remains a high-literacy reference estimate where World Bank country observation is unavailable. |
| SDG5 Gender Equality | Gender wage gap by country, unpaid wage-clock output | Official pay-gap input plus derived clock output | OECD Gender Wage Gap indicator | Use OECD values where available. Clock output is derived from the official gap and selected work-time assumptions. |
| SDG6 Clean Water | Shower flow, water weight, walking-distance conversion | Derived and simulation values with official water context | WHO/UNICEF JMP 2025, EPA WaterSense | 9.5 L/min uses EPA 2.5 gpm conversion. 20 L per 1 km walking rule is an explicit educational assumption. |
| SDG7 Affordable Clean Energy | Energy mix percentages, air quality score, carbon score | Simulation with official energy-access context | Tracking SDG7: The Energy Progress Report 2025 | Keep mixer interaction. Result labels must remain scenario scores, not official city measurements. |
| SDG8 Decent Work | Growth, job quality, workforce scale by policy choice | Simulation with labor-market context | ILO Employment and Social Trends, ILOSTAT/OECD context | Keep one-choice dilemma game. Visible metrics remain policy scenario scores. |
| SDG9 Industry, Innovation, Infrastructure | Jobs, connected people/companies, efficiency, project count | Simulation with infrastructure/connectivity context | ITU Facts and Figures, UNIDO statistical databases | Keep bridge animation and modeled metrics. Result copy should state that outputs are modeled. |
| SDG10 Reduced Inequalities | Top 1%, next 9%, middle 40%, bottom 50% wealth shares | Official sourced values | World Inequality Report 2022 | Retain reality comparison. User input is hypothetical; reality distribution is sourced. |
| SDG11 Sustainable Cities | Happiness index, PM2.5, green/transit/recycling effects | Simulation with official city and air-quality context | UN SDG Goal 11, WHO Air Quality Guidelines, UN-Habitat World Cities Report 2024 | Keep city planner. Happiness and PM2.5 values are educational scenario outputs. |
| SDG12 Responsible Consumption | Decomposition/persistence years and expected remaining year | Simulation estimates with official plastic/debris context | UN SDG Goal 12, NOAA marine debris resources, UNEP single-use plastics | Keep trash ghost timeline. Persistence years are not exact official decomposition dates. |
| SDG13 Climate Action | Warming scenario, sea-level height, exposed city/landmark list | Mixed: official/derived context plus simulation visualization | UN SDG Goal 13, IPCC AR6, NASA Sea Level Projection Tool, Climate Central | Keep rising water line. It is not a parcel-level flood map and must stay labeled as educational visualization. |
| SDG14 Life Below Water | Turtle health index, microplastic load, click count | Simulation with official marine-debris impact context | UN SDG Goal 14, NOAA ingestion resource, IUCN, UNEP marine litter assessment | Keep click model. Health and microplastic accumulation values are interaction scores. |
| SDG15 Life on Land | Habitat pressure, species list, domino collapse steps | Simulation with species/habitat source context | UN SDG Goal 15, IUCN Red List, WWF species and habitat resources | Keep domino interaction. Species and habitat relationships are source-backed context; pressure scores are educational. |
| SDG16 Peace, Justice and Strong Institutions | Conflict markers, conflict facts, casualties/displacement/homicide context | Mixed: official global facts, derived conflict hotspot context, simulation map markers | UN SDG Report 2025 Goal 16, UNODC, ACLED | Markers represent conflict regions and are not live event points. Region facts must display their source basis. |
| SDG17 Partnerships | Network nodes/links, internet users, ODA, trade, UN members | Official headline figures plus simulation network links | UN SDG Goal 17, ITU, OECD, UNCTAD, UN Member States | Keep globe network. Nodes/links are educational visualization, not live institution locations. |

## Source Register by Goal

| Goal | Source IDs |
| --- | --- |
| SDG1 | `world-bank-pip`, `un-goal-1` |
| SDG2 | `unep-food-waste-2024`, `water-footprint-network` |
| SDG3 | `who-uhc-2025` |
| SDG4 | `unesco-uis-literacy`, `world-bank-literacy` |
| SDG5 | `oecd-gender-wage-gap` |
| SDG6 | `who-unicef-jmp-2025`, `epa-watersense-showerheads` |
| SDG7 | `tracking-sdg7-2025` |
| SDG8 | `ilo-est-2026` |
| SDG9 | `itu-facts-2025`, `unido-sdg9` |
| SDG10 | `wir-2022` |
| SDG11 | `un-goal-11`, `who-air-quality-guidelines`, `un-habitat-world-cities-2024`, `sdg11-city-planner-simulation` |
| SDG12 | `un-goal-12`, `noaa-marine-debris-plastic`, `noaa-debris-degradation`, `unep-single-use-plastics`, `sdg12-trash-ghost-simulation` |
| SDG13 | `un-goal-13`, `ipcc-ar6-wgi-sea-level`, `climate-central-picturing-future`, `nasa-sea-level-projection-tool`, `sdg13-rising-line-simulation` |
| SDG14 | `un-goal-14`, `noaa-marine-debris-ingestion`, `iucn-marine-plastic-pollution`, `unep-marine-litter-assessment`, `sdg14-ocean-stomach-simulation` |
| SDG15 | `un-goal-15`, `iucn-red-list`, `wwf-palm-oil-species`, `wwf-cerrado`, `wwf-soy-production`, `wwf-illegal-logging`, `wwf-asian-elephant`, `wwf-red-panda`, `sdg15-extinction-domino-simulation` |
| SDG16 | `un-goal-16`, `un-sdg-report-2025-goal-16`, `unodc-global-study-homicide-2023`, `acled-conflict-index-2025`, `sdg16-silence-conflict-simulation` |
| SDG17 | `un-goal-17`, `itu-facts-2025-goal-17`, `oecd-oda-2025-preliminary`, `unctad-global-trade-2024`, `un-member-states`, `sdg17-global-network-simulation` |

## Full Source Register

| ID | Type | Source | URL |
| --- | --- | --- | --- |
| `world-bank-pip` | official | World Bank Poverty and Inequality Platform | https://pip.worldbank.org/ |
| `un-goal-1` | official | UN SDG Goal 1 | https://sdgs.un.org/goals/goal1 |
| `unep-food-waste-2024` | official | UNEP Food Waste Index Report 2024 | https://www.unep.org/resources/publication/food-waste-index-report-2024 |
| `water-footprint-network` | derived | Water Footprint Network Product Gallery | https://www.waterfootprint.org/resources/interactive-tools/product-gallery/ |
| `who-uhc-2025` | official | WHO Universal Health Coverage fact sheet | https://www.who.int/news-room/fact-sheets/detail/universal-health-coverage-(uhc) |
| `unesco-uis-literacy` | official | UNESCO UIS Literacy | https://uis.unesco.org/en/topic/literacy |
| `world-bank-literacy` | official | World Bank adult literacy rate | https://data.worldbank.org/indicator/SE.ADT.LITR.ZS |
| `oecd-gender-wage-gap` | official | OECD Gender Wage Gap indicator | https://www.oecd.org/en/data/indicators/gender-wage-gap.html |
| `who-unicef-jmp-2025` | official | WHO/UNICEF JMP 2025 | https://data.unicef.org/resources/jmp-report-2025/ |
| `epa-watersense-showerheads` | derived | EPA WaterSense showerheads | https://www.epa.gov/watersense/showerheads |
| `tracking-sdg7-2025` | official | Tracking SDG7: The Energy Progress Report 2025 | https://www.iea.org/reports/tracking-sdg7-the-energy-progress-report-2025 |
| `ilo-est-2026` | official | ILO Employment and Social Trends 2026 | https://researchrepository.ilo.org/esploro/outputs/report/Employment-and-social-trends-2026/995684768902676 |
| `itu-facts-2025` | official | ITU Facts and Figures 2025 | https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/ |
| `unido-sdg9` | official | UNIDO statistical databases | https://www.unido.org/researchers/statistical-databases |
| `wir-2022` | official | World Inequality Report 2022 | https://wir2022.wid.world/chapter-1/ |
| `un-goal-11` | official | UN SDG Goal 11 | https://sdgs.un.org/goals/goal11 |
| `who-air-quality-guidelines` | official | WHO global air quality guidelines | https://www.who.int/publications/i/item/9789240034228 |
| `un-habitat-world-cities-2024` | official | UN-Habitat World Cities Report 2024 | https://unhabitat.org/sites/default/files/2024/11/wcr2024_-_full_report.pdf |
| `sdg11-city-planner-simulation` | simulation | City Planner simulation |  |
| `un-goal-12` | official | UN SDG Goal 12 | https://sdgs.un.org/goals/goal12 |
| `noaa-marine-debris-plastic` | official | NOAA Marine Debris Program: Plastic | https://marinedebris.noaa.gov/what-marine-debris/plastic |
| `noaa-debris-degradation` | official | NOAA Ocean Service: marine debris degradation | https://oceanservice.noaa.gov/facts/degrade.html |
| `unep-single-use-plastics` | official | UNEP Single-use plastics roadmap | https://www.unep.org/resources/report/single-use-plastics-roadmap-sustainability |
| `sdg12-trash-ghost-simulation` | simulation | Trash Ghost persistence model |  |
| `un-goal-13` | official | UN SDG Goal 13 | https://sdgs.un.org/goals/goal13 |
| `ipcc-ar6-wgi-sea-level` | official | IPCC AR6 WGI Chapter 9 | https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9 |
| `climate-central-picturing-future` | derived | Climate Central: Picturing Our Future | https://www.climatecentral.org/report/picturing-our-future |
| `nasa-sea-level-projection-tool` | official | NASA Sea Level Projection Tool | https://sealevel.nasa.gov/ipcc-ar6-sea-level-projection-tool |
| `sdg13-rising-line-simulation` | simulation | Rising Line scenario model |  |
| `un-goal-14` | official | UN SDG Goal 14 | https://sdgs.un.org/goals/goal14 |
| `noaa-marine-debris-ingestion` | official | NOAA Marine Debris Program: Ingestion | https://marinedebris.noaa.gov/why-marine-debris-problem/ingestion |
| `iucn-marine-plastic-pollution` | official | IUCN Marine Plastic Pollution | https://www.iucn.org/resources/issues-brief/marine-plastic-pollution |
| `unep-marine-litter-assessment` | official | UNEP marine litter and plastic pollution assessment | https://www.unep.org/resources/pollution-solution-global-assessment-marine-litter-and-plastic-pollution |
| `sdg14-ocean-stomach-simulation` | simulation | Ocean's Stomach click model |  |
| `un-goal-15` | official | UN SDG Goal 15 | https://sdgs.un.org/goals/goal15 |
| `iucn-red-list` | official | IUCN Red List | https://www.iucnredlist.org/ |
| `wwf-palm-oil-species` | derived | WWF: species threatened by unsustainable palm oil | https://www.worldwildlife.org/stories/endangered-species-threatened-by-unsustainable-palm-oil-production |
| `wwf-cerrado` | derived | WWF: Cerrado | https://www.worldwildlife.org/places/cerrado |
| `wwf-soy-production` | derived | WWF: soy production | https://wwf.panda.org/discover/our_focus/food_practice/sustainable_production/soy/ |
| `wwf-illegal-logging` | derived | WWF: stopping illegal logging | https://www.worldwildlife.org/our-work/forests/deforestation-and-forest-degradation/stopping-illegal-logging/ |
| `wwf-asian-elephant` | derived | WWF: Asian elephant | https://www.worldwildlife.org/species/asian-elephant |
| `wwf-red-panda` | derived | WWF: red panda | https://www.worldwildlife.org/species/red-panda |
| `sdg15-extinction-domino-simulation` | simulation | Extinction Domino scenario model |  |
| `un-goal-16` | official | UN SDG Goal 16 | https://sdgs.un.org/goals/goal16 |
| `un-sdg-report-2025-goal-16` | official | UN SDG Report 2025: Goal 16 | https://unstats.un.org/sdgs/report/2025/Goal-16/ |
| `unodc-global-study-homicide-2023` | official | UNODC Global Study on Homicide 2023 | https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html |
| `acled-conflict-index-2025` | derived | ACLED Weekly Conflict Index | https://acleddata.com/platform/weekly-conflict-index |
| `sdg16-silence-conflict-simulation` | simulation | Silence of Conflict map model |  |
| `un-goal-17` | official | UN SDG Goal 17 | https://sdgs.un.org/goals/goal17 |
| `itu-facts-2025-goal-17` | official | ITU Facts and Figures 2025 | https://www.itu.int/en/mediacentre/Pages/PR-2025-11-17-Facts-and-Figures.aspx |
| `oecd-oda-2025-preliminary` | official | OECD preliminary ODA data | https://www.oecd.org/en/about/news/press-releases/2026/04/international-aid-fell-sharply-in-2025-says-oecd.html |
| `unctad-global-trade-2024` | official | UNCTAD Global Trade Update | https://unctad.org/news/global-trade-hits-record-33-trillion-2024-driven-services-and-developing-economies |
| `un-member-states` | official | United Nations About Us | https://www.un.org/en/about-us/ |
| `sdg17-global-network-simulation` | simulation | Global Network visualization model |  |

## Maintenance Rules

1. Do not add unsourced numeric copy to the UI.
2. If a metric is not official, label it as simulation or derived.
3. If a source has a year or report edition, keep that year in code or documentation.
4. When changing sourced values, update `app/data/sdgSourceRegistry.js` and this document in the same commit.
5. Do not run browser visual checks unless explicitly requested.
6. For source/data edits, run static checks before completion.

## Static Verification

Recommended checks for source/data/document edits:

```bash
git diff --check
node --check app/data/sdgSourceRegistry.js
node --check app/details/sdgXXContentModel.js
```

For broad final review, run `node --check` against all application JavaScript files and inspect route/file coverage for SDG 1-17.
