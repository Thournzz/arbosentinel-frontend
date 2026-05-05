// ══════════════════════════════════════════════════════════════════════════════
// YELLOW layer — ArboSentinel API service
// All backend calls live here. Pages import from this file, never fetch directly.
//
// LEARNING NOTE — DTO mapping pattern:
// Spring Boot DTOs and React interfaces don't always share the same shape.
// We map them HERE in the API layer — not in the component. Components only
// see clean, typed frontend interfaces. The mapping logic is testable in isolation.
//
// Fields that have no equivalent in the API response (activeCasesGlobal,
// affectedCountries, icdCode) are filled from a static reference table.
// These are epidemiological constants from WHO/CDC, not live counts.
// Live counts come from the mv_disease_totals materialised view via /dashboard/stats.
// ══════════════════════════════════════════════════════════════════════════════

import { apiFetch, apiPost } from './apiClient'
import type {
  Disease,
  DashboardStats,
  MrProgAlert,
  RiskLevel,
} from './mockData'

// ── Raw Spring Boot DTO shapes ────────────────────────────────────────────────
// These mirror the Java record classes exactly.

interface ApiDiseaseDto {
  id: number
  diseaseType: string
  commonName: string
  pathogenFamily: string | null
  pathogenSpecies: string | null
  genomeType: string | null
  structure: string | null
  transmissionRoute: string | null
  firstIdentifiedYear: number | null
  firstIdentifiedLocation: string | null
  whoClassification: string | null
  incubationMinDays: number | null
  incubationMaxDays: number | null
  treatmentSummary: string | null
}

interface ApiDashboardDto {
  diseaseTotals: Array<{
    disease: string
    totalCases: number
    latestYear: number | null
  }>
  totalUnresolvedFlags: number
  totalFailedIngestions: number
}

interface ApiAlertDto {
  id: number
  diseaseType: string | null
  alertStatus: string
  alertMessage: string | null
  regionName: string | null
  triggeredAt: string | null
  expiresAt: string | null
}

// Richer shape from /api/pharmacology/drugs — more detail than mock
export interface ApiPharmDrug {
  id: number
  genericName: string
  drugClass: string | null
  mechanismOfAction: string | null
  dosingAdult: string | null
  dosingPediatric: string | null
  keyInteractions: string | null
  contraindications: string | null
  whoEssentialMedicine: boolean
  interactionWarning: boolean
  // indications null from list endpoint — populated by /drugs/disease/{id}
  indications: null
}

// ── Static reference data ─────────────────────────────────────────────────────
// Fields the API doesn't return (epidemiological constants, not live counts)

type DiseaseMeta = {
  icdCode: string
  riskLevel: RiskLevel
  activeCasesGlobal: number
  affectedCountries: number
  pathogenType: 'virus' | 'parasite' | 'bacteria'
}

const DISEASE_META: Record<string, DiseaseMeta> = {
  dengue:       { icdCode: 'A90',      riskLevel: 'high',     activeCasesGlobal: 5_200_000,   affectedCountries: 129, pathogenType: 'virus'    },
  malaria:      { icdCode: 'B50-B54',  riskLevel: 'critical', activeCasesGlobal: 247_000_000, affectedCountries: 84,  pathogenType: 'parasite' },
  zika:         { icdCode: 'A92.5',    riskLevel: 'moderate', activeCasesGlobal: 89_000,      affectedCountries: 89,  pathogenType: 'virus'    },
  west_nile:    { icdCode: 'A92.3',    riskLevel: 'moderate', activeCasesGlobal: 2_400,       affectedCountries: 67,  pathogenType: 'virus'    },
  chikungunya:  { icdCode: 'A92.0',    riskLevel: 'moderate', activeCasesGlobal: 430_000,     affectedCountries: 115, pathogenType: 'virus'    },
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapDisease(dto: ApiDiseaseDto): Disease {
  const meta = DISEASE_META[dto.diseaseType] ?? {
    icdCode: '', riskLevel: 'moderate' as RiskLevel,
    activeCasesGlobal: 0, affectedCountries: 0, pathogenType: 'virus' as const,
  }

  // Build description from available fields
  const parts: string[] = []
  if (dto.whoClassification) parts.push(dto.whoClassification)
  if (dto.treatmentSummary)  parts.push(dto.treatmentSummary)
  const description = parts.join(' — ') || 'No description available.'

  return {
    id:               dto.id,
    name:             dto.commonName,
    scientificName:   dto.pathogenSpecies ?? dto.diseaseType,
    pathogenType:     meta.pathogenType,
    primaryVector:    dto.transmissionRoute ?? 'Mosquito bite',
    description,
    riskLevel:        meta.riskLevel,
    activeCasesGlobal: meta.activeCasesGlobal,
    affectedCountries: meta.affectedCountries,
    icdCode:          meta.icdCode,
  }
}

function mapAlert(dto: ApiAlertDto): MrProgAlert {
  // Use raw string from API for severity derivation (can be any value from backend)
  const rawStatus = (dto.alertStatus ?? '').toLowerCase()

  // Derive severity from the raw status string
  const severity: RiskLevel =
    rawStatus === 'critical' ? 'critical'
    : rawStatus === 'high'   ? 'high'
    : rawStatus === 'active' ? 'moderate'
    : 'low'

  // Map raw status to our union type, defaulting to 'active' for unknown values
  const validStatuses: MrProgAlert['alertStatus'][] = ['active', 'resolved', 'archived']
  const alertStatus: MrProgAlert['alertStatus'] =
    validStatuses.includes(rawStatus as MrProgAlert['alertStatus'])
      ? (rawStatus as MrProgAlert['alertStatus'])
      : 'active'

  return {
    id:          dto.id,
    diseaseType: dto.diseaseType ?? null,
    alertTitle:  dto.alertMessage?.slice(0, 60) ?? 'System Alert',
    alertBody:   dto.alertMessage ?? '',
    alertStatus,
    severity,
    isActive:    rawStatus === 'active',
    triggeredAt: dto.triggeredAt ?? new Date().toISOString(),
  }
}

function mapDrug(dto: {
  id: number
  drugName: string
  drugClass: string | null
  mechanismOfAction: string | null
  dosingAdult: string | null
  dosingPediatric: string | null
  keyInteractions: string | null
  contraindications: string | null
  whoEssentialMedicine: boolean
  interactionWarning: boolean
}): ApiPharmDrug {
  return {
    id:                  dto.id,
    genericName:         dto.drugName,
    drugClass:           dto.drugClass,
    mechanismOfAction:   dto.mechanismOfAction,
    dosingAdult:         dto.dosingAdult,
    dosingPediatric:     dto.dosingPediatric,
    keyInteractions:     dto.keyInteractions,
    contraindications:   dto.contraindications,
    whoEssentialMedicine: dto.whoEssentialMedicine ?? false,
    interactionWarning:  dto.interactionWarning ?? false,
    indications:         null,
  }
}

// ── Public API functions ──────────────────────────────────────────────────────

/** GET /api/diseases — all 5 tracked arboviruses */
export async function fetchDiseases(): Promise<Disease[]> {
  const dtos = await apiFetch<ApiDiseaseDto[]>('/api/diseases')
  return dtos.map(mapDisease)
}

/** GET /api/dashboard/stats — aggregated counts from materialised view */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const dto = await apiFetch<ApiDashboardDto>('/api/dashboard/stats')
  return {
    totalDiseasesTracked: 5,
    activeAlerts:         0,  // filled after fetchAlerts()
    countriesMonitored:   67,
    lastDataRefresh:      new Date().toISOString(),
    diseaseTotals:        dto.diseaseTotals.map(d => ({
      disease:     d.disease,
      totalCases:  d.totalCases,
      latestYear:  d.latestYear ?? 0,
    })),
  }
}

/** GET /api/alerts — active Mr. Prog alerts */
export async function fetchAlerts(): Promise<MrProgAlert[]> {
  const dtos = await apiFetch<ApiAlertDto[]>('/api/alerts')
  return dtos.map(mapAlert)
}

// Raw shape returned by GET /api/pharmacology/drugs
type RawDrugDto = Parameters<typeof mapDrug>[0]

/** GET /api/pharmacology/drugs — all drugs with full clinical detail */
export async function fetchDrugs(): Promise<ApiPharmDrug[]> {
  const dtos = await apiFetch<RawDrugDto[]>('/api/pharmacology/drugs')
  return dtos.map(mapDrug)
}

// ── ML Prediction ─────────────────────────────────────────────────────────────

export interface MlPredictionResult {
  id:                number | null
  diseaseType:       string | null
  weekOfYear:        number
  predictedCases:    number
  riskScore:         number
  confidencePercent: number | null
  modelVersion:      string | null
}

/**
 * POST /api/ml/run/dengue — run the GBR dengue prediction via Spring Boot → Python FastAPI
 * All params sent as query strings (@RequestParam on the Java side).
 */
export async function fetchDenguePrediction(params: {
  city: string
  weekOfYear: number
  avgTempC: number
  precipMm: number
  humidityPct: number
  ndviNe: number
}): Promise<MlPredictionResult> {
  return apiPost<MlPredictionResult>('/api/ml/run/dengue', {
    city:        params.city,
    weekOfYear:  params.weekOfYear,
    avgTempC:    params.avgTempC,
    precipMm:    params.precipMm,
    humidityPct: params.humidityPct,
    ndviNe:      params.ndviNe,
  })
}

// ── West Nile ─────────────────────────────────────────────────────────────────

export interface WnvAnnualRow {
  id:            number
  year:          number
  reportedCases: number
}

export interface WnvHospRow {
  id:                    number
  year:                  number
  neuroinvasiveCases:    number | null
  nonNeuroinvasiveCases: number | null
}

/** GET /api/westnile/annual — all years (1999–2024) */
export async function fetchWestNileAnnual(): Promise<WnvAnnualRow[]> {
  return apiFetch<WnvAnnualRow[]>('/api/westnile/annual')
}

/** GET /api/westnile/hospitalizations — neuroinvasive vs non-neuroinvasive breakdown */
export async function fetchWestNileHospitalizations(): Promise<WnvHospRow[]> {
  return apiFetch<WnvHospRow[]>('/api/westnile/hospitalizations')
}
