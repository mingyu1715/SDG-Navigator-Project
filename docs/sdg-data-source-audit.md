# SDG 1-10 Data Source Audit

Last updated: 2026-04-26

## Purpose

SDG10 now separates the user's input from a sourced reality dataset. SDG1-9 should follow the same discipline: every number shown in the experience must either be sourced, derived from a sourced rule, or clearly labeled as a simulation score.

## Data Types

| Type | Meaning | UI wording |
| --- | --- | --- |
| official | Direct value from an official dataset or report | Source: agency, year |
| derived | Calculated from official data and a documented conversion rule | Source + conversion rule |
| simulation | Designed score or scenario value for the interaction | Educational simulation, based on listed references |

## Source Standard

Each SDG detail model should expose source metadata near the values it drives.

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

When a value is not an official statistic, the model should include `type: "simulation"` and the UI should avoid presenting it as a measured result.

## Audit Table

| Goal | Current numeric surface | Current status | Source direction | Implementation decision |
| --- | --- | --- | --- | --- |
| SDG1 No Poverty | Scenario country coordinates, education chance, water distance, life expectancy | First pass labeled as simulation | World Bank Poverty and Inequality Platform, World Bank Data, UN SDG Goal 1 | Kept the lottery interaction and labeled daily budget, meal coverage, and water-time outputs as educational estimates. Next pass can replace scenario fields with country/year indicators. |
| SDG2 Zero Hunger | Ingredient water footprint, price, weight, CO2e, meal conversion | First pass labeled by data type | UNEP Food Waste Index 2024, FAO/UNEP food loss and waste data, Water Footprint Network, WFP hunger resources | Added source metadata for water footprint and food waste context. Marked local prices and CO2e conversion as simulation until replaced with item-specific official LCA data. |
| SDG3 Good Health | Country access score 1-5, survival %, response minutes, golden-time rate, BPM | First pass converted to documented simulation | WHO Universal Health Coverage, WHO emergency care, World Bank UHC indicators | Replaced "dummy model" copy with WHO-informed educational simulation wording. Next pass can map access tiers to official UHC service coverage index values. |
| SDG4 Quality Education | Country literacy rates and text distortion | First pass updated with source metadata | UNESCO UIS literacy data, World Bank indicator `SE.ADT.LITR.ZS` | Replaced Korea, India, and Niger with latest available World Bank values. Finland remains a labeled high-literacy reference estimate because the World Bank country series has no observation. Keep text distortion as derived from literacy rate. |
| SDG5 Gender Equality | Gender pay gap JSON marked "educational sample data" | First pass updated to OECD sourced values | OECD Gender Wage Gap indicator, ILO Global Wage Report, UN Women equal pay resources | Replaced current country values with OECD Gender Wage Gap MEDIAN values where available. Next pass can turn the source text into a clickable source chip. |
| SDG6 Clean Water | 9.5 L/min shower, 20 L per km conversion, 1 kg/L weight equivalence | First pass updated with source metadata | WHO/UNICEF JMP 2025, WHO drinking-water fact sheet, EPA WaterSense showerheads | Replaced 11 L/min with EPA 2.5gpm converted to 9.5 L/min. Kept 20 L/km walking distance as explicit educational assumption. |
| SDG7 Affordable Clean Energy | Default energy mix 32/28/40, air quality/carbon scores | First pass labeled as simulation | Tracking SDG7: The Energy Progress Report 2025, IEA electricity/access data | Added baseline note and changed result labels to scenario scores. Air/carbon results remain educational scores derived from the selected mix. |
| SDG8 Decent Work | Policy growth/job-quality scores, workforce scale | First pass labeled as simulation | ILO Employment and Social Trends 2026, ILOSTAT, OECD Employment Outlook | Kept policy game and changed visible metric wording to scores. Added model note and ILO resource. |
| SDG9 Industry, Innovation, Infrastructure | Jobs, connected workers/companies, efficiency, projects by scenario | First pass labeled as simulation | ITU Facts and Figures 2025, UNIDO SDG9/industrial development, World Bank digital adoption data | Kept bridge animation and scenario metrics, but labels result metrics as modeled outputs in the result message. |
| SDG10 Reduced Inequalities | Top 1, next 9, middle 40, bottom 50 wealth shares | Sourced | World Inequality Report 2022 | Current structure retained. Added the same `type` field as other SDGs for consistency. |

## Initial Source Register

| Key | Source | URL | Use |
| --- | --- | --- | --- |
| world-bank-pip | World Bank Poverty and Inequality Platform / poverty updates | https://pip.worldbank.org/ | SDG1 poverty baseline and country poverty indicators |
| un-goal-1 | UN SDG Goal 1 official page | https://sdgs.un.org/goals/goal1 | SDG1 target context |
| unep-food-waste-2024 | UNEP Food Waste Index Report 2024 | https://www.unep.org/resources/publication/food-waste-index-report-2024 | SDG2 food waste reality context |
| water-footprint-network | Water Footprint Network product gallery | https://www.waterfootprint.org/resources/interactive-tools/product-gallery/ | SDG2 ingredient water footprint |
| who-uhc-2025 | WHO Universal Health Coverage fact sheet, 2025 | https://www.who.int/news-room/fact-sheets/detail/universal-health-coverage-(uhc) | SDG3 health access baseline |
| unesco-uis-literacy | UNESCO UIS literacy topic/data | https://uis.unesco.org/en/topic/literacy | SDG4 literacy rates |
| world-bank-literacy | World Bank `SE.ADT.LITR.ZS` adult literacy rate | https://data.worldbank.org/indicator/SE.ADT.LITR.ZS | SDG4 country fallback data |
| oecd-gender-wage-gap | OECD Gender Wage Gap indicator | https://www.oecd.org/en/data/indicators/gender-wage-gap.html | SDG5 country pay gap values |
| who-unicef-jmp-2025 | WHO/UNICEF JMP 2025 | https://data.unicef.org/resources/jmp-report-2025/ | SDG6 drinking water and sanitation baseline |
| epa-watersense-showerheads | EPA WaterSense Showerheads | https://www.epa.gov/watersense/showerheads | SDG6 shower-flow conversion |
| tracking-sdg7-2025 | Tracking SDG7: The Energy Progress Report 2025 | https://www.iea.org/reports/tracking-sdg7-the-energy-progress-report-2025 | SDG7 electricity, clean cooking, renewables |
| ilo-est-2026 | ILO Employment and Social Trends 2026 | https://researchrepository.ilo.org/esploro/outputs/report/Employment-and-social-trends-2026/995684768902676 | SDG8 labor baseline |
| itu-facts-2025 | ITU Facts and Figures 2025 | https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/ | SDG9 connectivity baseline |
| unido-sdg9 | UNIDO industrial development / statistical databases | https://www.unido.org/researchers/statistical-databases | SDG9 industrialization context |
| wir-2022 | World Inequality Report 2022 | https://wir2022.wid.world/chapter-1/ | SDG10 wealth distribution |

## Implementation Order

1. Add shared source metadata helpers and a small source display pattern.
2. Replace SDG5 pay-gap JSON with sourced values because it is currently labeled as sample data. Done in first pass with OECD MEDIAN values.
3. Convert SDG3 dummy model into a documented simulation based on sourced access indicators. First pass done with WHO source metadata and UI copy.
4. Move SDG4 literacy rates into sourced data with year/source per country. First pass done in the detail model.
5. Add source metadata to SDG2 and SDG6 conversion rules. SDG2 and SDG6 first pass done.
6. Add simulation labels and official baseline context to SDG7, SDG8, and SDG9. First pass done.
7. Normalize SDG10 source metadata to the same structure. Done.

## Verification Rules

- Do not run browser visual checks unless explicitly requested.
- For each pass, run `node --check` on touched JS modules and `git diff --check`.
- When changing sourced data, keep a short citation note in the source metadata and avoid unsourced numeric copy in the UI.
