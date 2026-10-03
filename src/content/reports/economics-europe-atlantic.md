---
id: "rep-economics-europe-atlantic-2026"

title: "Atlantic Slavery, European Development, and Colonial Extraction"

subtitle: "A Quantitative Historical-Economics Research Proposal (Consolidated Version 3)"

date: "2026-10-04"
version: "1.0"

author:
  name: "Africalia"
  type: "Interdisciplinary Research & Knowledge Initiative"
  role: "Institutional / Project Author"
  platform: "Africalia Research Platform"

publication:
  series: "Africalia Working Paper & Policy Brief Series"
  seriesNumber: "Africalia Working Paper No. 08"
  type: "working_paper"
  status: "Research Edition"
  language: "en"
  citationStyle: "Chicago Author-Date"
  category: "Africalia Working Paper & Policy Brief Series"
  issn: "ISSN 2983-4921 (Online Archive)"
  jelCodes:
    - "N17"
    - "O10"
    - "N37"
    - "F54"

research:
  disciplines:
    - "African History"
    - "Atlantic History"
    - "Atlantic Economy"
    - "International Law"
    - "Postcolonial Studies"

  methodology: "Interdisciplinary historical, economic, and spatial analysis"

ai_assistance:
  enabled: true
  system: "Anthropic"
  role:
    - "Research discovery"
    - "Source synthesis"
    - "Information organization"
    - "Editorial assistance"
  status: "AI-assisted"
  accountability: "Africalia"

section: "working-papers"
pillar: "development"

regions:
  - "Africa"
  - "Americas"
  - "Caribbean"

countries:
  - "GHA"
  - "HTI"
  - "GBR"
  - "FRA"

tags:
  - "Economic Development"
  - "Transatlantic Slave Trade"

icon: "ph:scales-bold"
readTimeMinutes: 22
featured: true
---

# Atlantic Slavery, European Development, and Colonial Extraction

## A Quantitative Historical-Economics Research Proposal (Consolidated Version 3)

**Status:** Research proposal, version 3 (consolidates v2 and the v3 amendment)
**Date:** 3 October 2026
**Purpose:** Design an empirically testable framework for estimating how much of European economic development, and of the divergence between Europe and other world regions, can causally be attributed to Atlantic slavery and, separately, to later colonial extraction, together with the measured long-run consequences for African and Caribbean economies. The study estimates economic effects and does not adjudicate legal or moral questions (Section 0).

## Revision summary

**Changes introduced in v2 (methodological review):**



 1. Net surplus replaces gross value added as the target.
 2. Counterfactuals are defined by what replaces slavery, not only by what is removed.
 3. Additive "shares of explanation" are replaced by a Shapley-value decomposition, with interactions reported separately.
 4. Non-European comparators are added, because a divergence claim cannot be tested on a Europe-only panel.
 5. Identification is tiered by unit of analysis; country-level synthetic controls are supporting evidence only.
 6. Indirect exposure is measured explicitly.
 7. Local effects are not extrapolated to national effects without a spatial general-equilibrium model.
 8. Colonial extraction is a separate module, measured net of the costs of empire.
 9. The African side is a full module.
10. Pre-registration and a specification-curve protocol are added.

**Changes introduced in v3 (response to the March 2026 UN resolution and the reparative-justice debate):**

11\. A normative and legal scope statement and a context table (Section 0).
12\. Added research questions Q5 (Caribbean outcomes) and Q6 (documented transfers and attribution).
13\. A Caribbean module (Section 12.2).
14\. A documented-transfers and institution-level attribution module (Section 11).
15\. A remedy-form map showing what the study can and cannot inform (Section 13).
16\. Interpretation guardrails and a publication commitment (Section 15).
17\. A consultation and data-governance plan (Section 16).

## Abstract

The proposal develops a quantitative program to test a strong historical proposition: that the Atlantic slave system was a major causal contributor to the economic divergence between participating European economies and other regions, and that colonial extraction later reinforced it. It separates five mechanisms that are often conflated: the transatlantic slave trade, plantation production based on enslaved labour, the European value chains built on plantation commodities, broader Atlantic trade and institutional change, and later colonial extraction.

The central empirical object is a set of explicitly specified counterfactual economies. For each, the proposal defines what is removed, what replaces it, and how freed resources are reallocated. Estimates combine historical voyage and trade records, European city and national data, wealth-holder and documented-transfer records, and non-European comparator series, including Caribbean and African economies, with tiered causal identification and a multi-region structural model. The contribution of each mechanism is reported with uncertainty, and the term "main driver" is defined in advance by pre-registered criteria.

The proposal does not assume that slavery was the largest cause of European development, and it does not address whether reparations are owed; it produces evidence that may inform that debate under stated limits. All numerical examples are hypothetical.

# 0. Normative and Legal Scope

**This study estimates economic effects. It does not adjudicate legal or moral questions.**

The study does **not** address:



1. Whether the transatlantic slave trade and chattel slavery were wrongful. That is not an empirical question, and no result here bears on it.
2. Whether any state, institution or family owes reparations, or in what form. Liability depends on legal doctrine (including disputes about intertemporal law, attribution and standing) and on political and moral judgment.
3. How crimes against humanity should be compared in gravity. The UN resolution's "gravest crime" language is a normative claim, and objections to ranking atrocities are normative too. Economic results neither support nor refute them.
4. The value of human life, suffering or cultural loss. GDP-type accounting cannot capture these, and they are not offset against economic estimates (Section 12).

The study **does** produce evidence that may inform such debates:

* the scale and net surplus of the slave system (gain-based inputs);
* measured long-run economic losses in African and Caribbean economies (loss-based inputs);
* documented transfers (emancipation compensation, Haiti's indemnity) with traceable payers and recipients;
* institution-level attribution where records permit.

**Symmetry rule.** A finding that net economic gains to Europe were small would not weaken the wrongfulness of slavery or any reparative claim grounded in it. A finding that they were large would not by itself establish legal liability. The report states this wherever results are summarized.

## 0.1 Context

On 25 March 2026 the UN General Assembly adopted a Ghana-led resolution (A/RES/80/250, draft A/80/L.48) declaring the trafficking and chattel enslavement of Africans the gravest crime against humanity and encouraging good-faith dialogue on reparatory justice, including apology, restitution, compensation and rehabilitation. The vote was 123 in favor, 52 abstentions and 3 against. General Assembly resolutions are not legally binding; they carry political and moral weight. Positions as reported (sources in the References):

| Actor | Position as reported |
|----|----|
| Ghana, African Union | Sponsored and welcomed the resolution; pursue reparative justice as part of historical justice and Agenda 2063 |
| CARICOM | Revised Ten-Point Plan approved July 2026; seeks reparatory justice from the UK, other European states and "all enslaving nations"; includes apology, memorialization, debt cancellation, technology transfer, monetary compensation, and Haiti as a central case |
| United States, Argentina, Israel | Voted against. The US stated it recognizes no legal right to reparations for wrongs not illegal under international law at the time, and objects to a hierarchy of crimes against humanity |
| European Union members, United Kingdom | Abstained. Concerns reported include the implied hierarchy among crimes against humanity |
| Russia, China | Voted in favor |

# 1. Research Questions

The first draft posed one question. It is split here into six, because they require different data, estimands and identification strategies.

* **Q1 (scale and net surplus).** How large was the slave system as a share of European economies, and how much of that was surplus over the next-best use of the same labour, capital and shipping?
* **Q2 (causal local effects).** Did exposure to the slave system cause measurable changes in outcomes (population, wages, manufacturing, property values, capital) in the places most exposed?
* **Q3 (aggregate and persistent effects).** Do local effects aggregate into national effects once reallocation across places is accounted for, and do they persist through capital accumulation and structural change?
* **Q4 (divergence).** What share of the 1500–1900 divergence between participating European economies and non-European comparators (for example China, India, the Ottoman Empire, Japan) can be attributed to the slave system, to later colonial extraction, and to competing mechanisms?
* **Q5 (Caribbean outcomes).** What were the long-run economic consequences for Caribbean economies of plantation slavery, its abolition and post-emancipation arrangements, and how do they vary by colonial power, crop and timing of emancipation?
* **Q6 (documented transfers and attribution).** For transfers documented in the historical record, what were their magnitudes, who paid and received, and what would their counterfactual use have yielded? Where records allow, which institutions can be linked to measurable gains?

Colonial extraction (roughly 1750–1914, varying by empire) is analysed in its own module (Section 10) because it differs in era, mechanism and measurement from the Atlantic slave system, which was at its peak before about 1850.

# 2. Conceptual Framework

Three pathways are distinguished. They are linked, and their interactions are estimated, not assumed away.

| Pathway A: Slave system to capital | Pathway B: Atlantic commerce to institutions | Pathway C: Colonial extraction |
|----|----|----|
| Africa | Atlantic commerce | Colonial conquest |
| ↓ enslaved people | ↓ merchant wealth | ↓ land, resource and labour extraction |
| ↓ plantation Americas | ↓ political influence | ↓ European income, revenue, capital and markets |
| ↓ sugar, cotton, tobacco and coffee | ↓ institutional change |    |
| ↓ European merchants | ↓ investment |    |
| ↓ shipping, insurance and finance | ↓ growth |    |
| ↓ manufacturing and capital accumulation |    |    |

Pathway B is **not specific to slavery**: Atlantic commerce included non-slave trade. The slave-specific component of Pathway B is one quantity to be estimated, not a premise.

**Key conceptual distinction.** Pathway A can be measured as *gross* activity (value added in the slave system) or as *net surplus* (value added minus what the same factors would have earned elsewhere). Only net surplus is a causal contribution. Gross value added measures scale.

# 3. Estimands and Definitions

## 3.1 Gross value added (descriptive)

```
VA_system = VA_trade + VA_plantation + VA_dependent_industries
```

with intermediate inputs netted out to avoid double counting. This is the benchmark quantity in the existing literature (for example Rönnbäck's British reconstruction) and answers Q1 only in part.

## 3.2 Net surplus (the first-round causal quantity)

Net surplus is the sum, over factors (labour, capital, shipping, land, commercial skill), of returns in the slave system minus returns in the best feasible alternative use. It requires an explicit **reallocation rule**.

## 3.3 Coercion rent

For plantations, the relevant comparison is not "plantation versus nothing." It is plantation production under slavery versus production under the cheapest feasible alternative labour regime (free or indentured labour at wages sufficient to attract equivalent supply), plus the output lost where no alternative regime would have been viable. This isolates the surplus attributable to coercion.

## 3.4 Slave-system exposure: a vector, not a sum

Exposure is kept as a vector, with standardized indices used only where needed:

* **Trade:** voyages, captives embarked and disembarked, mortality, voyage value, by *financing and owning location* as well as departure port.
* **Plantation:** imports and processing of plantation commodities by port and region, refining capacity, cotton mill inputs.
* **Value chain:** shipping tonnage, insurance and banking activity linked to the above.
* **Indirect exposure:** supplier regions whose exports served the slave trade or plantation markets (textiles, linen, metalware, firearms, beads, timber), including regions without ports.

## 3.5 Colonial extraction

Transfers associated with European colonial rule: taxation, resource extraction, land appropriation, forced labour, monopoly trade, preferential markets, profits and fiscal transfers. These are measured **net of the metropolitan costs of empire** (administration, military expenditure, subsidies), because gross transfers overstate the benefit to the metropole (Section 10).

# 4. Counterfactual Design

## 4.1 Specifying the replacement world

A counterfactual "S = 0" is underdetermined. Each scenario is defined by what is removed, what replaces it, and how resources are reallocated:

```
Y0_it = Y_it ( removed component , reallocation rule ρ )
ρ ∈ { full reallocation, partial reallocation, no reallocation }
```

| Scenario | Removed | Replacement assumption |
|----|----|----|
| C0 | Slave trade | Plantations persist with alternative labour supply; higher labour cost |
| C1a | Plantation slavery | Plantation production persists under free or indentured labour; scale and price adjust |
| C1b | Plantation slavery | Plantation sectors do not develop; resources redeployed |
| C2 | Whole Atlantic slave system | Combination of C0 and C1 with price responses |
| C3 | Colonial extraction | Net transfers removed; costs of empire also removed |
| C4 | Atlantic empire | C2 and C3 combined |
| C5 | All Atlantic trade (bounding exercise) | Not a slavery counterfactual; measures Atlantic integration |

Each scenario is run under the three reallocation rules. The spread between rules is itself a reported result: it expresses how much the answer depends on an assumption that data only partly identify. For the Caribbean, "no slavery" worlds are especially ill-defined, since the colonies' existence depended on the system; scenarios must be specified as above.

## 4.2 Dynamic capital with endogenous investment

Investment responds in the counterfactual instead of being held fixed:

```
K0_{t+1} = (1 − δ) K0_t + I0_t
I0_t     = I_other_t + φ_t · I_S_t
```

Here φ is the share of slave-derived investment that would have been invested domestically in the counterfactual (at counterfactual returns), with φ = 0 meaning the funds have no alternative use and φ = 1 full reallocation. φ is bounded in \[0, 1\] and informed by evidence on how holders of slavery wealth invested compared with otherwise similar individuals (for example, the 1833 British compensation records). Savings rates respond to counterfactual returns.

## 4.3 General-equilibrium effects

Removing slavery changes prices (sugar and cotton become more expensive, demand falls), factor allocation, and trade patterns. Partial-equilibrium subtraction is therefore not adequate for aggregate claims. Aggregate counterfactuals are computed in a multi-region structural model (Section 7).

# 5. What Would Constitute Strong Evidence?

Correlation between slave-system participation and later wealth does not establish causation. Five tests are proposed.



1. **Temporal precedence, plus exogeneity.** Precedence is necessary but insufficient: ports that were already growing plausibly attracted more voyages. Tests require pre-trend checks and variation not driven by local economic prospects.
2. **Dose-response with estimated shape.** Effects need not be linear or strictly monotone (thresholds and diminishing returns are plausible). The dose-response function is estimated non-parametrically, and the test is that effects are systematically higher at higher exposure over the relevant range.
3. **Exogenous variation.** Core results must survive identification strategies using variation unrelated to subsequent local development.
4. **Counterfactual magnitude.** The report estimates the difference between observed and counterfactual outcomes under each scenario and reallocation rule, not just coefficients.
5. **Competing explanations.** Estimates are assessed against domestic institutions, technology, coal and energy, agricultural productivity, non-slave Atlantic trade, Asian trade, demography, finance, war and state formation, and geography.

# 6. Identification, Tiered by Unit of Analysis

## 6.1 Tier A: individuals and localities (Britain)

* Link slaveholder and compensation records to later investment, occupations and local economic outcomes.
* Use exogenous variation in slavery wealth, such as weather-driven Middle Passage mortality as in Heblich, Redding and Voth.
* **Scope limit:** this design applies to Britain. It does not transfer to a country panel without a new instrument and exclusion argument.

## 6.2 Tier B: European city panel

* Staggered-exposure designs using heterogeneity-robust estimators (Callaway and Sant'Anna; Sun and Abraham), not two-way fixed effects, which can be biased with continuous, staggered treatment.
* Spatial exposure from voyages and plantation imports with distance weights, and candidate instruments based on oceanographic and wind accessibility to embarkation regions, with exclusion restrictions argued case by case (war, privateering and naval policy are threats).
* Outcomes: population, wages, manufacturing employment, mills, taxable property, shipping tonnage, bank and insurer formation.
* **Interpretation limit:** city-level gains may reflect reallocation from elsewhere. They are relative gains, not aggregate gains.

## 6.3 Tier C: country level

* With roughly seven treated states and nearly universal Atlantic exposure among coastal powers, there is no clean control group. Non-participants (for instance Swiss, German, Irish and Baltic suppliers) were indirectly exposed, which biases comparisons toward zero.
* Country-level evidence is therefore **supporting and descriptive**, and used to calibrate the structural model.
* Synthetic controls are used only for specific episodes (for example abolition and emancipation shocks), with inference by randomization or permutation given few units.

## 6.4 Tier D: global comparators

* Add non-European comparators and reconstructed series for the divergence question (Q4).
* Because treatment cannot be randomized at this level, Q4 is answered through the structural model, calibrated on Tiers A to C and disciplined by comparator data.

# 7. Structural Model

A multi-region quantitative model (Europe, the Caribbean and other Atlantic colonies as explicit regions, Africa, major Asian economies) with:

* trade in plantation commodities, textiles and manufactures, with price-responsive demand;
* spatial structure and migration within Britain and across European cities (the spatial general-equilibrium approach of Heblich, Redding and Voth is the template);
* capital accumulation with endogenous saving and the φ parameter of Section 4.2;
* sector choice (agriculture, manufacturing, commerce) and learning-by-doing in industry;
* an institutional channel treated explicitly (Section 8.3).

The model is calibrated to Tier A and B estimates, and counterfactual scenarios are solved as new equilibria. Static first-round estimates are reported alongside dynamic estimates, so readers can see how much depends on compounding.

# 8. Decomposing the Divergence

## 8.1 Why additive shares are not used

Shares summing to 100% require mechanisms that are additive and independent. They are neither: slavery and other Atlantic trade interact, and institutions are partly a product of Atlantic merchant power. A two-mechanism illustration (hypothetical numbers):

```
Mechanism A alone: +10    Mechanism B alone: +10    A and B together: +30
Additive reading: 10 + 10 = 20, with 10 unexplained "interaction"
Shapley reading:  A = 15, B = 15
```

## 8.2 Shapley decomposition

Let N be the set of mechanisms: slave system, colonial extraction, other Atlantic trade, domestic institutions, technology and energy, demography. For each subset T of mechanisms, the model simulates the divergence closed by T. The contribution of mechanism j is

```
φ_j = Σ over T ⊆ N∖{j}   [ |T|! (n − |T| − 1)! / n! ] · [ V(T ∪ {j}) − V(T) ]
```

With six mechanisms this requires 64 scenario runs, which is feasible. Results report the Shapley contribution of each mechanism and, separately, the pure-interaction component.

## 8.3 Treating institutions

Institutions may be an independent cause or a channel through which Atlantic commerce operated. Two versions are reported:

* **Version 1:** institutions as an independent mechanism (shares to institutions are larger).
* **Version 2:** institutions as a mediator, with their effects attributed back to the Atlantic mechanisms that shaped them (shares to the slave system and Atlantic trade are larger).

The gap between the versions is reported as a conceptual uncertainty, not resolved by choosing one.

## 8.4 Pre-registered "main driver" criteria

Fixed before any outcome analysis, with numeric thresholds to be set in the pre-registration:

* **Majority:** posterior probability that the slave system's Shapley share exceeds 50% is at least a pre-specified threshold.
* **Dominance:** posterior probability that its share exceeds that of every competing mechanism is at least a pre-specified threshold.
* **Robustness:** conclusions hold across the specification curve (Section 14).

All three criteria are published whatever the result.

# 9. Worked Illustration: Gross versus Net (Hypothetical)

These numbers are **hypothetical arithmetic**, not estimates.

Suppose gross value added in the slave system is 11% of GDP (the order of magnitude reported for Britain by the value-added literature, not verified here). Suppose factors in the counterfactual are redeployed at a fraction φ_prod of their original productivity.

| Redeployed productivity | First-round net loss (% of GDP) |
|----|----|
| 95% | 0.55 |
| 85% | 1.65 |
| 70% | 3.30 |

The first-round loss is a small fraction of the 11% headline. Whether the long-run effect is also small depends on dynamic channels the first-round figure omits: learning in industry, financial development, clustering, institutional change. These are exactly what Tiers A and B and the structural model are designed to measure. The illustration shows why the dynamic effect, not the headline value-added share, is the quantity that matters, and why it could turn out either small or large.

# 10. Colonial Extraction Module

* **Net, not gross.** Estimate transfers net of military, administrative and subsidy costs borne by the metropole, distinguishing who gained (merchants, the state, particular regions) from the metropolitan economy as a whole.
* **Channels:** fiscal transfers, profits, forced-labour output, land transfers, preferential trade, unequal terms of trade, and capital export returns.
* **Dynamic specification:**

```
Y_ct = ρ Y_c,t−1 + β_S S_ct + γ C_ct + θ X_ct + α_c + τ_t + ε_ct
```

* **Interaction with Pathway A.** Whether the slave system built imperial capacity that enabled later extraction is tested via mediation, with the caveat that mediators are endogenous.
* **Era separation.** Later extraction is not credited to slavery, and slavery-era effects are not credited to later colonialism.

# 11. Documented Transfers and Institution-Level Attribution

## 11.1 Documented transfers

Some transfers are recorded precisely enough to measure directly:

* **British emancipation compensation (1830s).** Payments to slaveholders, with recipients named in the records; the enslaved received none. Used both as identification data (Tier A) and as a documented transfer.
* **Haiti's post-independence indemnity.** Payments, associated borrowing and interest, and recipients among French state and financial actors.
* **Apprenticeship and post-emancipation labour regimes,** valued where records allow.

For each transfer: amount, date, payer, recipient, instrument and sources. Magnitudes are reported in original currency and in real terms.

**Counterfactual path.** The value of a past transfer today depends on the assumed return it would have earned, and compounding over two centuries is hypersensitive to that assumption. The project therefore:

* reports results as time-slices (for example at emancipation, 1900, 1950, today) and does not headline a single present value;
* reports a range across returns, with the lowest and highest values shown together;
* links the counterfactual investment path to the φ reallocation parameter (Section 4.2).

## 11.2 Institution-level attribution

Where records permit, trace measurable gains to specific institutions (banks, insurers, merchant houses, shipping firms, universities, churches, families). Attribution is graded:

| Grade | Standard |
|----|----|
| Documented | Direct record of the transaction, ownership or payment |
| Probable | Strong circumstantial linkage across multiple sources |
| Structural | Participation in the system inferred from sector or location, no direct record |

Only "documented" and "probable" findings are reported by name, and only after the review step in Section 16. "Structural" findings are reported in aggregate.

**Ethics.** Naming individuals and descendants of non-elite participants is avoided; research focuses on institutions and public-record wealth holders. Living private persons are not named without clear public-interest justification and prior review.

# 12. African-Side and Caribbean-Side Modules

## 12.1 African side

* long-run effects of slave exports on African economic outcomes, using ethnicity-level exposure and instruments for exposure (Nunn; Nunn and Wantchekon);
* effects on population, state formation, institutions and trust, with demographic counterfactuals;
* a joint accounting in which the European, African and Caribbean counterfactuals use consistent exposure measures, so the sides of the Atlantic system can be compared.

GDP-type accounting does not capture the human cost to the enslaved or the loss of life. These are reported separately and are not netted against economic gains.

## 12.2 Caribbean side

**Estimands**

* Long-run income, health, land concentration, public debt and fiscal capacity in Caribbean economies, relative to comparators.
* Value and destination of plantation surplus, distinguishing absentee-owned profits repatriated from locally retained income.
* Effects of the post-emancipation regime: owner compensation, apprenticeship periods, later indentured labour, land access.
* Contemporary vulnerabilities that CARICOM links to this history (for example debt and climate exposure) are treated as hypotheses to test, with mechanisms specified. Linking them to history is an empirical claim to be tested, not assumed.

**Identification**

* Variation across islands and territories in crop mix, plantation intensity, colonial power (British, French, Dutch, Danish, Spanish) and the timing and terms of emancipation.
* Candidate instruments from crop suitability and geography in the factor-endowment tradition (for example Engerman and Sokoloff), with exclusion restrictions argued case by case.
* Event-study designs around emancipation and compensation using heterogeneity-robust estimators (as in Section 6.2).
* Within-colony comparisons where records exist.

**Caveats.** Many Caribbean territories are small, so statistical power is limited; results will lean on structural calibration and historical case evidence, not large-N inference.

# 13. Remedy-Form Map

The standard international framing of reparation distinguishes restitution, compensation, rehabilitation, satisfaction (including apology and memorialization) and guarantees of non-repetition (UN Basic Principles on the Right to a Remedy and Reparation). The project can inform some forms directly and others not at all.

| Remedy form | What this project can contribute | What it cannot |
|----|----|----|
| Compensation | Gain-based and loss-based estimates; documented transfers; ranges across reallocation rules | The legal entitlement, the amount owed, or the responsible party |
| Restitution | Identification of specific assets, transfers and recipients (Section 11) | Whether restitution is due |
| Rehabilitation and development | Estimates of persistent economic gaps; targeting evidence by region | The design or adequacy of programs |
| Satisfaction (apology, memorialization, education) | Historical evidence and documentation | Quantification; this is not an econometric question |
| Guarantees of non-repetition | Little | Largely outside the study's scope |

The report states this map in its introduction so the numbers are not read as a complete account of reparative justice.

# 14. Robustness, Falsification and Inference

* **Pre-registration** of definitions, scenarios, thresholds and the main specification before outcome analysis.
* **Specification curve** across exposure definitions, samples, periods, outcomes, instruments and model parameters; report the full distribution.
* **Placebo exposure:** assign fictitious exposure before actual participation.
* **Pre-trends:** test whether high-exposure places were already growing faster; use lagged growth to probe reverse causality.
* **Non-slave ports and non-plantation commodities:** test whether effects operate specifically through plantation-linked sectors.
* **Indirect-exposure test:** estimate the effect on nominal non-participants with high indirect exposure.
* **Alternative outcomes:** GDP, population, real wages, manufacturing, capital, urbanization, tax revenue. Prefer outcomes not derived from trade statistics, because some reconstructed GDP series embed trade assumptions (a circularity risk); use multiple GDP reconstructions.
* **Leave-one-country-out** and few-unit inference by randomization methods.

# 15. Interpretation Guardrails and Publication Commitment



1. **Publish regardless of direction.** All pre-registered criteria and all specifications are published whatever the result, including null, small or unwelcome ones.
2. **Claims ledger.** Each report includes a table of statements the evidence does and does not support, using the "should not claim" list (Section 20) plus the symmetry rule (Section 0).
3. **Lead with uncertainty.** Headline figures are always given with their range across reallocation rules and the 95% interval; a single number is never used alone in summaries.
4. **Plain-language summaries** for non-specialist audiences, reviewed for misreadable simplifications.
5. **No single-number damages claims.** The project does not produce a headline "amount owed." It produces ranges and decompositions, labelled as inputs to deliberation.
6. **Version control for results.** Changes to estimates after publication are logged with reasons.

# 16. Consultation and Data Governance

The research concerns peoples and states with direct stakes in the findings, so the design includes:

* **Advisory group** including African and Caribbean economic historians and archivists, formed before Phase I, with a role in reviewing definitions, scenarios and framing (not only results).
* **Engagement with regional research bodies,** such as the CARICOM Reparations Commission's research centre and African regional institutions, on access to archives, questions that matter locally, and co-authorship where appropriate.
* **Data governance.** Shared data inventories; archive credit and access arrangements; open publication of the compiled datasets and code, with care for personal data in named-individual records.
* **Capacity.** Training and dataset access for researchers in the Caribbean and Africa, written into the budget.
* **Review step before naming institutions** (Section 11.2): sources, grades and wording checked by at least two reviewers outside the core team.

This is a plan, not a commitment from named partners; partners must be approached and agree.

# 17. Data Architecture

Relational database. All series carry source and data-quality fields.

| Table | Contents |
|----|----|
| `slave_voyages` | voyage_id, year, flag, departure_port, **financing_location, owner_location**, embarkation and disembarkation regions, embarked, disembarked, mortality, vessel |
| `european_economy` | location_id, year, population, GDP (multiple reconstructions), GDP_pc, wages, real_wage, manufacturing, capital, urbanization, tax_revenue, indirect_exposure_index |
| `colonial_extraction` | colonial_power, colony, year, tax_revenue, commodity_value, forced_labor, land_transfer, **net_fiscal_transfer** (after metropolitan costs), military_cost, administrative_cost |
| `plantation_commodity_flows` | commodity, origin, destination port, quantity, value, processing location |
| `wealth_holders` | slave-wealth records, compensation amounts, later investment portfolio |
| `documented_transfers` | transfer_id, type, amount, currency, date, payer, recipient, source, grade |
| `institutions` | institution_id, type, name, linked_transfers, attribution_grade, sources |
| `caribbean_economy` | territory, year, colonial_power, crop_mix, plantation_intensity, income, health, debt, land_concentration |
| `african_exposure` | ethnicity-level export measures, outcomes |
| `comparators` | non-European regions: output, population, trade, fiscal series |

# 18. Uncertainty

Measurement error is substantial, and so is **model** uncertainty (reallocation rules, φ, elasticities, institutional treatment). The project reports:

* point estimates, standard errors and 95% intervals;
* the spread across reallocation rules and across the specification curve;
* Bayesian posteriors for structural parameters and for the Shapley shares;
* data-quality ratings and sensitivity to missing observations.

# 19. What the Project Could Establish

A hierarchy, from weakest to strongest. A null or negative result at any level is reported with the same prominence.



1. The slave system was economically significant (scale; gross value added).
2. It generated net surplus over next-best uses.
3. Exposure caused measurable local effects.
4. Local effects aggregate to national effects after reallocation.
5. Effects persisted through capital accumulation and structural change.
6. Later colonial extraction added net benefits to metropolitan economies.
7. The slave system explains a specified share of the divergence from non-European comparators, relative to competing mechanisms.

Level 7 is the strongest claim and depends on the structural model and on the institutional treatment in Section 8.3.

In parallel, the project can establish: (a) measured long-run consequences for African and Caribbean economies (Section 12); and (b) documented transfers quantified as ranges, with institution-level attribution where records permit (Section 11).

# 20. What the Project Should Not Claim Without Evidence



 1. That European industrialization would not have occurred without slavery.
 2. That every European country benefited equally.
 3. That all Atlantic trade was slavery-dependent.
 4. That all colonial wealth was generated by slavery.
 5. That the value of plantation output equals European profit, or that gross value added equals causal contribution.
 6. That a large value-added share implies an equally large long-run growth effect.
 7. That correlation between participation and later wealth proves causation.
 8. That local or city-level effects equal national effects.
 9. That mechanism shares must sum to 100% independent of interactions.
10. That findings for Britain generalize to other European states.
11. That any result settles the legal or moral questions set out in Section 0, including whether reparations are owed or in what amount.

# 21. Research Sequence

* **Phase 0, pre-registration and scope.** Fix definitions, scenarios, reallocation rules, decomposition design and decision thresholds; adopt the scope statement (Section 0) and guardrails (Section 15); form the advisory group (Section 16).
* **Phase I, data construction.** Voyages (with financing and ownership), European port and city data, GDP reconstructions, wages and manufacturing, plantation commodity flows, wealth-holder and compensation records, documented transfers and institution records, colonial fiscal data, Caribbean series, comparators, African exposure.
* **Phase II, descriptive reconstruction.** Maps, time series, port rankings, **gross versus net** value-added chains, exposure vectors including indirect exposure.
* **Phase III, causal identification.** Tier A (Britain), Tier B (cities), Tier C supporting evidence, Caribbean identification (Section 12.2). If Tier A or B designs fail pre-trend or placebo tests, the structural model is calibrated from the literature and the failure is reported.
* **Phase IV, structural model.** Build, calibrate, validate against held-out outcomes.
* **Phase V, counterfactuals and decomposition.** Scenarios C0 to C5 under three reallocation rules, with the Shapley decomposition and both institutional treatments.
* **Phase VI, robustness.** Specification curve, placebo and indirect-exposure tests.
* **Phase VII, synthesis.** Comparison across Britain, France, the Netherlands, Portugal (with Brazil-Africa trade treated separately), Spain, Denmark and other participants; African and Caribbean modules; remedy-form map (Section 13) and claims ledger (Section 15).

# 22. Limitations and Risks

* **Few treated units** at the country level limit statistical inference; the design shifts weight to city and individual evidence for that reason.
* **Model dependence.** Aggregate and divergence results rest on structural assumptions; the project reports how much.
* **Data comparability** across states and periods is uneven, and reconstructed series carry assumptions.
* **Portugal and Spain:** much Portuguese slave trade ran directly between Brazil and Africa, so port-based exposure may mismeasure benefit.
* **Small-N Caribbean units** limit statistical power.
* **Compounding sensitivity** for long-horizon transfer valuations (Section 11.1).
* **Politicization risk.** Results may be used selectively by any party; the guardrails mitigate but cannot prevent this.
* **Legal-doctrine boundary.** The study cannot resolve intertemporal-law, standing or attribution disputes.
* **Interpretive risk.** Quantitative framing can obscure the human dimension, so human cost is reported separately and not offset against economic estimates.

# 23. Conclusion

Adding up slave-trade profits and comparing them with European GDP does not demonstrate causation. Nor does subtracting plantation output from the economy, because resources would have been redeployed and prices would have adjusted. The defensible question is counterfactual and comparative:

```
European development with the historical system
        minus
European development under a specified replacement world
```

estimated for several replacement worlds, decomposed across interacting mechanisms without forcing additivity, and checked against non-European comparators. The existing literature already establishes several links (scale of the value chains, local effects on port cities and industrializing regions, long-run harm in Africa). None of it alone establishes that Atlantic slavery was the largest single driver of European divergence. This program is designed to determine whether that stronger claim can be supported, and to report clearly if it cannot.

It does so within stated limits. The study estimates economic effects, not legal liability or moral standing, and it is designed so that its results, whichever way they fall, can be used as inputs to the wider debate without being mistaken for answers to it.

# References

**Cited in the original draft** (bibliographic details carried over; the specific figures attributed to these papers have not been independently re-verified and should be checked against the sources):

* Derenoncourt, E. (2025). *Atlantic Slavery's Impact on European and British Economic Development*. Journal of Historical Political Economy, 5(1), 1–19.
* Heblich, S., Redding, S. J., & Voth, H.-J. (2022, rev. 2023). *Slavery and the British Industrial Revolution*. NBER Working Paper 30451.
* Nunn, N. (2008). The Long-Term Effects of Africa's Slave Trades. *Quarterly Journal of Economics*, 123(1), 139–176.
* Rönnbäck, K. (2018). On the economic importance of the slave plantation complex to the British economy during the eighteenth century: a value-added approach. *Journal of Global History*, 13(3), 309–327.

**Literature to engage with** (bibliographic details to be verified before submission):

* Williams, E. (1944). *Capitalism and Slavery*; Engerman, S. (1972). Comment on the Williams thesis; Inikori, J. (2002). *Africans and the Industrial Revolution in England*.
* Pomeranz, K. (2000). *The Great Divergence*; Allen, R. (2009). *The British Industrial Revolution in Global Perspective*.
* Acemoglu, D., Johnson, S., & Robinson, J. (2005). The Rise of Europe: Atlantic Trade, Institutional Change, and Economic Growth.
* Nunn, N., & Wantchekon, L. (2011). The Slave Trade and the Origins of Mistrust in Africa.
* Engerman, S., & Sokoloff, K. on factor endowments and economic development in the Americas.
* Davis, L., & Huttenback, R. (1986). *Mammon and the Pursuit of Empire*; O'Brien, P. on the costs and benefits of empire.
* Callaway, B., & Sant'Anna, P. (2021); Sun, L., & Abraham, S. (2021) on staggered-treatment estimators; Shapley, L. (1953) on value allocation.

**Context sources for Section 0** (accessed 3 October 2026; details as reported; the resolution's full text has not been reviewed for this document and should be read before submission):

* American Society of International Law, "UN General Assembly Adopts Resolution on the Transatlantic Slave Trade" (asil.org/ilib).
* NBC News, "U.S. is one of three countries to vote against U.N. resolution calling slavery a 'crime against humanity'" (March 2026).
* Al Jazeera, "UN passes resolution naming slave trade 'gravest crime against humanity'" (25 March 2026).
* Human Rights Watch, "Landmark UN Resolution on the Slave Trade" (30 March 2026).
* African Union Commission, statement on adoption of A/80/L.48 (au.int).
* CARICOM, "CARICOM Endorses Revised Ten-Point Reparations Manifesto" and "From Resolution to Action: CARICOM's Third Reparations Conference Sets Global Agenda" (caricom.org).

**To be verified before use (cited from general knowledge):** UN Basic Principles on the Right to a Remedy and Reparation (General Assembly resolution 60/147, 2005); Durban Declaration and Programme of Action (2001); the Legacies of British Slavery database (UCL) as a source for compensation records; archival sources on the Haitian indemnity; the 1833 compensation figures and the structure of the apprenticeship system.