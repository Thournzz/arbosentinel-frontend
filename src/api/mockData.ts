// ══════════════════════════════════════════════════════════════════════════════
// mockData.ts — Realistic mock data for ArboSentinel frontend preview
//
// LEARNING NOTE:
// Mock data lets us develop and preview the UI without a running backend.
// The SAME TypeScript interfaces are used by both mock data AND real API calls —
// so swapping between mock and live just means changing where data comes from,
// not how it's displayed.
//
// These data points are based on real published statistics:
//   • Dengue: DengAI / PAHO 2023 data
//   • Malaria: WHO 2023 World Malaria Report
//   • West Nile: CDC 2022-2023 data
//   • Zika: CDC 2016 outbreak data
// ══════════════════════════════════════════════════════════════════════════════

// ── Type definitions ──────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export interface Disease {
  id: number
  name: string
  scientificName: string
  pathogenType: 'virus' | 'parasite' | 'bacteria'
  primaryVector: string
  description: string
  riskLevel: RiskLevel
  activeCasesGlobal: number
  affectedCountries: number
  icdCode: string
  // Optional clinical detail — populated from live API, absent in mock
  pathogenFamily?:          string | null
  genomeType?:              string | null
  incubationMinDays?:       number | null
  incubationMaxDays?:       number | null
  firstIdentifiedYear?:     number | null
  firstIdentifiedLocation?: string | null
}

export interface DengueWeeklyStat {
  weekOfYear: number
  year: number
  city: string
  totalCases: number
  predictedNextWeek?: number
}

export interface DashboardStats {
  totalDiseasesTracked: number
  activeAlerts: number
  countriesMonitored: number
  lastDataRefresh: string
  diseaseTotals: DiseaseTotalResponse[]
}

export interface DiseaseTotalResponse {
  disease: string
  totalCases: number
  latestYear: number
}

export interface RiskScore {
  id: number
  diseaseType: string
  riskScore: number
  riskLevel: RiskLevel
  computedAt: string
}

export interface MrProgAlert {
  id: number
  diseaseType: string | null
  alertTitle: string
  alertBody: string
  alertStatus: 'active' | 'resolved' | 'archived'
  severity: RiskLevel
  isActive: boolean
  triggeredAt: string
}

export interface PharmacologyDrug {
  id: number
  genericName: string
  brandNames: string[]
  mechanismOfAction: string
  whoEssentialMedicine: boolean
  indicatedFor: string[]
  interactionWarning: boolean
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const mockDiseases: Disease[] = [
  {
    id: 1,
    name: 'Dengue',
    scientificName: 'Dengue virus (DENV 1-4)',
    pathogenType: 'virus',
    primaryVector: 'Aedes aegypti',
    description:
      'Dengue fever is a mosquito-borne viral infection causing severe flu-like illness. ' +
      'About half the world\'s population is at risk. There are no specific treatments. ' +
      'DENV has 4 serotypes — prior infection with one increases severity risk of subsequent infections.',
    riskLevel: 'high',
    activeCasesGlobal: 5_200_000,
    affectedCountries: 129,
    icdCode: 'A90',
  },
  {
    id: 2,
    name: 'Malaria',
    scientificName: 'Plasmodium spp.',
    pathogenType: 'parasite',
    primaryVector: 'Anopheles gambiae',
    description:
      'Malaria is a life-threatening disease caused by Plasmodium parasites transmitted ' +
      'by the bite of infected female Anopheles mosquitoes. P. falciparum is the deadliest species, ' +
      'primarily in sub-Saharan Africa. Approximately 619,000 deaths in 2021 (WHO).',
    riskLevel: 'critical',
    activeCasesGlobal: 247_000_000,
    affectedCountries: 84,
    icdCode: 'B50-B54',
  },
  {
    id: 3,
    name: 'Zika',
    scientificName: 'Zika virus (ZIKV)',
    pathogenType: 'virus',
    primaryVector: 'Aedes aegypti',
    description:
      'Zika is transmitted primarily by Aedes aegypti mosquitoes. Most infections are mild. ' +
      'However, Zika infection during pregnancy can cause microcephaly and other congenital ' +
      'malformations. The 2015-2016 Americas outbreak declared a PHEIC by WHO.',
    riskLevel: 'moderate',
    activeCasesGlobal: 89_000,
    affectedCountries: 89,
    icdCode: 'A92.5',
  },
  {
    id: 4,
    name: 'West Nile',
    scientificName: 'West Nile virus (WNV)',
    pathogenType: 'virus',
    primaryVector: 'Culex pipiens',
    description:
      'West Nile virus is the leading cause of mosquito-borne disease in the continental USA. ' +
      'Most people (80%) show no symptoms. About 1 in 150 develop neuroinvasive disease. ' +
      'First detected in North America in 1999; now endemic in all 48 contiguous states.',
    riskLevel: 'moderate',
    activeCasesGlobal: 2_400,
    affectedCountries: 67,
    icdCode: 'A92.3',
  },
  {
    id: 5,
    name: 'Chikungunya',
    scientificName: 'Chikungunya virus (CHIKV)',
    pathogenType: 'virus',
    primaryVector: 'Aedes aegypti & Aedes albopictus',
    description:
      'Chikungunya causes fever and severe joint pain. Unlike dengue, it rarely causes death. ' +
      'Joint pain (arthralgia) can persist for months to years. ' +
      'Co-infection with dengue & Zika in Aedes aegypti is the subject of active research ' +
      'at UWI Mona\'s Mosquito Control and Research Unit.',
    riskLevel: 'moderate',
    activeCasesGlobal: 430_000,
    affectedCountries: 115,
    icdCode: 'A92.0',
  },
]

export const mockDashboardStats: DashboardStats = {
  totalDiseasesTracked: 5,
  activeAlerts: 3,
  countriesMonitored: 67,
  lastDataRefresh: '2026-05-12T06:00:00',
  diseaseTotals: [
    { disease: 'dengue',      totalCases: 5_200_000, latestYear: 2023 },
    { disease: 'malaria',     totalCases: 247_000_000, latestYear: 2023 },
    { disease: 'zika',        totalCases: 89_000,    latestYear: 2016 },
    { disease: 'west_nile',   totalCases: 2_400,     latestYear: 2023 },
    { disease: 'chikungunya', totalCases: 430_000,   latestYear: 2023 },
  ],
}

// Dengue weekly cases — based on DengAI San Juan (sj) data pattern
// Weeks 25-45 are peak season (July-November) for San Juan, PR
export const mockDengueWeekly: DengueWeeklyStat[] = [
  { weekOfYear: 20, year: 2008, city: 'sj', totalCases: 12 },
  { weekOfYear: 21, year: 2008, city: 'sj', totalCases: 18 },
  { weekOfYear: 22, year: 2008, city: 'sj', totalCases: 25 },
  { weekOfYear: 23, year: 2008, city: 'sj', totalCases: 34 },
  { weekOfYear: 24, year: 2008, city: 'sj', totalCases: 48 },
  { weekOfYear: 25, year: 2008, city: 'sj', totalCases: 67 },
  { weekOfYear: 26, year: 2008, city: 'sj', totalCases: 89 },
  { weekOfYear: 27, year: 2008, city: 'sj', totalCases: 102 },
  { weekOfYear: 28, year: 2008, city: 'sj', totalCases: 124 },
  { weekOfYear: 29, year: 2008, city: 'sj', totalCases: 138 },
  { weekOfYear: 30, year: 2008, city: 'sj', totalCases: 151 },
  { weekOfYear: 31, year: 2008, city: 'sj', totalCases: 172 },
  { weekOfYear: 32, year: 2008, city: 'sj', totalCases: 189 },
  { weekOfYear: 33, year: 2008, city: 'sj', totalCases: 204 },
  { weekOfYear: 34, year: 2008, city: 'sj', totalCases: 218 },
  { weekOfYear: 35, year: 2008, city: 'sj', totalCases: 231 },
  { weekOfYear: 36, year: 2008, city: 'sj', totalCases: 219 },
  { weekOfYear: 37, year: 2008, city: 'sj', totalCases: 198 },
  { weekOfYear: 38, year: 2008, city: 'sj', totalCases: 176 },
  { weekOfYear: 39, year: 2008, city: 'sj', totalCases: 145 },
  { weekOfYear: 40, year: 2008, city: 'sj', totalCases: 112 },
  { weekOfYear: 41, year: 2008, city: 'sj', totalCases: 89 },
  { weekOfYear: 42, year: 2008, city: 'sj', totalCases: 64 },
  { weekOfYear: 43, year: 2008, city: 'sj', totalCases: 45 },
  { weekOfYear: 44, year: 2008, city: 'sj', totalCases: 32 },
]

export const mockRiskScores: RiskScore[] = [
  { id: 1, diseaseType: 'dengue',      riskScore: 74.2, riskLevel: 'high',     computedAt: '2026-04-28T06:00:00' },
  { id: 2, diseaseType: 'malaria',     riskScore: 82.5, riskLevel: 'critical', computedAt: '2026-04-28T06:00:00' },
  { id: 3, diseaseType: 'zika',        riskScore: 31.0, riskLevel: 'moderate', computedAt: '2026-04-28T06:00:00' },
  { id: 4, diseaseType: 'west_nile',   riskScore: 24.1, riskLevel: 'low',      computedAt: '2026-04-28T06:00:00' },
  { id: 5, diseaseType: 'chikungunya', riskScore: 42.8, riskLevel: 'moderate', computedAt: '2026-04-28T06:00:00' },
]

export const mockAlerts: MrProgAlert[] = [
  {
    id: 1,
    diseaseType: 'dengue',
    alertTitle: 'DENGUE OUTBREAK DETECTED — CARIBBEAN REGION',
    alertBody:
      'Weekly dengue cases in San Juan, Puerto Rico exceed 5-year seasonal baseline by 34%. ' +
      'Risk window: weeks 24-35. NDVI elevation and above-average precipitation are contributing factors.',
    alertStatus: 'active',
    severity: 'high',
    isActive: true,
    triggeredAt: '2026-04-25T12:00:00',
  },
  {
    id: 2,
    diseaseType: 'malaria',
    alertTitle: 'MALARIA BURDEN ELEVATED — SUB-SAHARAN AFRICA',
    alertBody:
      'WHO 2023 Malaria Report indicates cases remain 5% above pre-COVID baseline. ' +
      'Artemisinin partial resistance (ART-R) confirmed in 5 African countries. Immediate monitoring escalation recommended.',
    alertStatus: 'active',
    severity: 'critical',
    isActive: true,
    triggeredAt: '2026-04-20T08:00:00',
  },
  {
    id: 3,
    diseaseType: null,
    alertTitle: 'AEDES VITTATUS DETECTED IN JAMAICA — NEW VECTOR PRESENCE',
    alertBody:
      'First confirmed detection of Aedes vittatus in Jamaica reported (Sandiford et al., 2025, ' +
      'Parasites & Vectors). While not a primary dengue vector, co-occurrence with Ae. aegypti ' +
      'warrants heightened surveillance. UWI MCRU investigation underway.',
    alertStatus: 'active',
    severity: 'moderate',
    isActive: true,
    triggeredAt: '2026-04-10T09:00:00',
  },
]

export const mockDrugs: PharmacologyDrug[] = [
  {
    id: 1,
    genericName: 'Artemether + Lumefantrine',
    brandNames: ['Coartem', 'Riamet'],
    mechanismOfAction:
      'Artemether generates cytotoxic free radicals that damage malaria parasite proteins and membranes. ' +
      'Lumefantrine inhibits parasite heme detoxification, allowing toxic heme accumulation.',
    whoEssentialMedicine: true,
    indicatedFor: ['malaria'],
    interactionWarning: false,
  },
  {
    id: 2,
    genericName: 'Chloroquine phosphate',
    brandNames: ['Aralen'],
    mechanismOfAction:
      'Accumulates in parasite food vacuole, inhibiting heme polymerization. ' +
      'High-level resistance in P. falciparum limits use; still effective for P. vivax in many regions.',
    whoEssentialMedicine: true,
    indicatedFor: ['malaria'],
    interactionWarning: true,
  },
  {
    id: 3,
    genericName: 'Acetaminophen (Paracetamol)',
    brandNames: ['Tylenol', 'Panadol'],
    mechanismOfAction:
      'Inhibits prostaglandin synthesis via COX-1/COX-2 in the CNS. Reduces fever and mild pain. ' +
      'IMPORTANT: NSAIDs (ibuprofen, aspirin) are CONTRAINDICATED in dengue — they increase bleeding risk.',
    whoEssentialMedicine: true,
    indicatedFor: ['dengue', 'zika', 'chikungunya', 'west_nile'],
    interactionWarning: false,
  },
  {
    id: 4,
    genericName: 'Doxycycline',
    brandNames: ['Vibramycin', 'Doryx'],
    mechanismOfAction:
      'Bacteriostatic — inhibits bacterial protein synthesis by binding the 30S ribosomal subunit. ' +
      'Used as malaria prophylaxis; inhibits parasite development in the liver stage.',
    whoEssentialMedicine: true,
    indicatedFor: ['malaria'],
    interactionWarning: true,
  },
]
