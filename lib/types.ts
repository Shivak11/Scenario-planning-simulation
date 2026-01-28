// PESTEL Categories (expanded for Indian context)
export type PESTCategory = 'P' | 'E' | 'S' | 'T' | 'En' | 'L'

export const PEST_LABELS: Record<PESTCategory, string> = {
  P: 'Political',
  E: 'Economic',
  S: 'Social',
  T: 'Technological',
  En: 'Environmental',
  L: 'Legal/Regulatory',
}

export const PEST_DESCRIPTIONS: Record<PESTCategory, string> = {
  P: 'Government stability, policy shifts, centre-state dynamics, election cycles',
  E: 'GDP growth, inflation, forex, credit availability, PLI schemes, Make in India',
  S: 'Demographics, urbanisation, tier-2/3 aspirations, workforce expectations',
  T: 'Digital public infra (UPI, ONDC), AI adoption, tech talent availability',
  En: 'ESG mandates, climate risks, energy transition, water scarcity',
  L: 'SEBI, RBI, CCI regulations, labour laws, data protection, GST changes',
}

// Industry Types - Indianized
export interface Industry {
  id: string
  name: string
  icon: string
  description: string
  indianContext?: string
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'bfsi',
    name: 'BFSI',
    icon: 'landmark',
    description: 'Banking, insurance, NBFCs, fintech',
    indianContext: 'RBI-regulated, UPI ecosystem, financial inclusion push'
  },
  {
    id: 'it-services',
    name: 'IT Services & SaaS',
    icon: 'monitor',
    description: 'IT outsourcing, product companies, GCCs',
    indianContext: 'Export-oriented, talent arbitrage, AI disruption concerns'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: 'factory',
    description: 'Auto, auto-ancillary, industrial, electronics',
    indianContext: 'PLI schemes, China+1, EV transition, MSME ecosystem'
  },
  {
    id: 'pharma-healthcare',
    name: 'Pharma & Healthcare',
    icon: 'heart-pulse',
    description: 'Pharma, hospitals, diagnostics, medtech',
    indianContext: 'API dependency, generic powerhouse, Ayushman Bharat'
  },
  {
    id: 'consumer-retail',
    name: 'Consumer & Retail',
    icon: 'shopping-bag',
    description: 'FMCG, D2C, quick commerce, organised retail',
    indianContext: 'Festive quarter cycles, rural vs urban, kiranas vs modern trade'
  },
  {
    id: 'infra-realty',
    name: 'Infrastructure & Real Estate',
    icon: 'building-2',
    description: 'Construction, real estate, logistics, urban infra',
    indianContext: 'Govt capex push, RERA, smart cities, warehousing boom'
  },
  {
    id: 'energy-utilities',
    name: 'Energy & Utilities',
    icon: 'zap',
    description: 'Power, renewables, oil & gas, discoms',
    indianContext: 'Green hydrogen push, discom health, EV charging infra'
  },
  {
    id: 'telecom-media',
    name: 'Telecom & Media',
    icon: 'radio',
    description: 'Telcos, OTT, digital media, gaming',
    indianContext: 'Duopoly dynamics, 5G rollout, content regulation'
  },
  {
    id: 'education',
    name: 'Education & Skilling',
    icon: 'graduation-cap',
    description: 'EdTech, universities, vocational training',
    indianContext: 'NEP 2020, skill India, employability gaps'
  },
  {
    id: 'agri-food',
    name: 'Agri & Food Processing',
    icon: 'wheat',
    description: 'Agritech, food processing, cold chain',
    indianContext: 'Farm reforms, FPOs, supply chain formalisation'
  },
  {
    id: 'conglomerate',
    name: 'Diversified Conglomerate',
    icon: 'building',
    description: 'Multi-sector groups, holding companies',
    indianContext: 'Tata/Reliance/Adani model, capital allocation, succession'
  },
  {
    id: 'psu',
    name: 'PSU / Government Enterprise',
    icon: 'landmark',
    description: 'Central/state PSUs, departmental undertakings',
    indianContext: 'Disinvestment, board autonomy, social obligations'
  },
]

// Organization Types - Indianized
export interface OrganizationType {
  id: string
  name: string
  description: string
  decisionStyle?: string
}

export const ORGANIZATION_TYPES: OrganizationType[] = [
  {
    id: 'family-business',
    name: 'Promoter-led / Family Business',
    description: 'First, second, or third generation family enterprise',
    decisionStyle: 'Long-term orientation, relationship-driven, succession considerations'
  },
  {
    id: 'pe-vc-backed',
    name: 'PE/VC-backed Company',
    description: 'Investor-backed with growth/exit expectations',
    decisionStyle: 'Milestone-driven, board governance, liquidity timelines'
  },
  {
    id: 'mnc-subsidiary',
    name: 'MNC India Subsidiary',
    description: 'Indian arm of global corporation',
    decisionStyle: 'Global-local balance, HQ alignment, India mandate'
  },
  {
    id: 'listed-enterprise',
    name: 'Listed Enterprise',
    description: 'Publicly traded, professional management',
    decisionStyle: 'Quarterly pressures, analyst scrutiny, ESG expectations'
  },
  {
    id: 'startup-scaleup',
    name: 'Startup / Scale-up',
    description: 'Early to growth stage, typically <500 employees',
    decisionStyle: 'Founder-driven, pivoting ability, runway consciousness'
  },
  {
    id: 'psu-govt',
    name: 'PSU / Government Body',
    description: 'Public sector undertaking or government department',
    decisionStyle: 'Policy-driven, CAG oversight, social mandate balance'
  },
]

// Focal Issue Examples - replaces generic Strategic Challenges
export interface FocalIssueTemplate {
  id: string
  category: string
  template: string
  example: string
  goodBecause: string
}

export const FOCAL_ISSUE_TEMPLATES: FocalIssueTemplate[] = [
  {
    id: 'channel-choice',
    category: 'Growth & Market Entry',
    template: 'Should we [channel/market decision] or [alternative]?',
    example: 'Should we acquire a D2C brand or build our own direct channel?',
    goodBecause: 'Specific, actionable, has clear alternatives'
  },
  {
    id: 'capability-build',
    category: 'Capability & Investment',
    template: 'Should we build [capability] in-house or partner/acquire?',
    example: 'Should we build AI/ML capabilities internally or acquire an AI startup?',
    goodBecause: 'Clear investment decision with distinct paths'
  },
  {
    id: 'geography-expansion',
    category: 'Growth & Market Entry',
    template: 'Should we prioritise [market A] or [market B] for expansion?',
    example: 'Should we prioritise tier-2/3 India or Southeast Asia for our next growth phase?',
    goodBecause: 'Resource allocation decision with strategic implications'
  },
  {
    id: 'business-model',
    category: 'Business Model',
    template: 'Should we shift from [current model] to [new model]?',
    example: 'Should we shift from project-based revenue to platform/subscription model?',
    goodBecause: 'Fundamental strategic pivot question'
  },
  {
    id: 'partnership-independence',
    category: 'Partnerships & Ecosystem',
    template: 'Should we deepen [partnership] or build independence?',
    example: 'Should we deepen our reliance on Amazon/Flipkart or invest in owned channels?',
    goodBecause: 'Addresses strategic dependency and control'
  },
  {
    id: 'talent-model',
    category: 'Organisation & Talent',
    template: 'Should we [workforce decision] given [context]?',
    example: 'Should we shift to a GCC model given the talent arbitrage erosion?',
    goodBecause: 'Organisational design with long-term implications'
  },
]

// Context Modifiers - Indianized
export interface ContextModifier {
  id: string
  label: string
  category: 'market' | 'financial' | 'operational' | 'regulatory'
}

export const CONTEXT_MODIFIERS: ContextModifier[] = [
  // Market
  { id: 'pan-india', label: 'Pan-India presence', category: 'market' },
  { id: 'regional-stronghold', label: 'Regional stronghold', category: 'market' },
  { id: 'metro-focused', label: 'Metro-focused', category: 'market' },
  { id: 'tier-2-3-play', label: 'Tier-2/3 expansion play', category: 'market' },
  { id: 'export-oriented', label: 'Export-oriented', category: 'market' },
  { id: 'b2b-focused', label: 'B2B focused', category: 'market' },
  { id: 'b2c-focused', label: 'B2C focused', category: 'market' },

  // Financial
  { id: 'cash-rich', label: 'Cash-rich balance sheet', category: 'financial' },
  { id: 'leveraged', label: 'Leveraged / Working capital intensive', category: 'financial' },
  { id: 'pe-vc-pressure', label: 'PE/VC return expectations', category: 'financial' },
  { id: 'ipo-trajectory', label: 'IPO trajectory', category: 'financial' },

  // Operational
  { id: 'legacy-tech', label: 'Legacy tech stack', category: 'operational' },
  { id: 'digital-native', label: 'Digital native', category: 'operational' },
  { id: 'asset-heavy', label: 'Asset-heavy model', category: 'operational' },
  { id: 'asset-light', label: 'Asset-light model', category: 'operational' },
  { id: 'talent-intensive', label: 'Talent-intensive', category: 'operational' },

  // Regulatory
  { id: 'high-regulation', label: 'Heavily regulated', category: 'regulatory' },
  { id: 'govt-dependent', label: 'Government-dependent', category: 'regulatory' },
  { id: 'pli-beneficiary', label: 'PLI scheme beneficiary', category: 'regulatory' },
]

// Research Notes - for ChatGPT integration
export interface ResearchNote {
  id: string
  phase: 'focal-issue' | 'forces' | 'scenarios'
  prompt: string
  content: string
  timestamp: number
  linkedForceIds?: string[]
  linkedScenarioIds?: string[]
}

// ChatGPT Research Missions
export interface ResearchMission {
  id: string
  phase: 'focal-issue' | 'forces' | 'scenarios'
  title: string
  description: string
  suggestedPrompts: string[]
  outputGuidance: string
}

export const RESEARCH_MISSIONS: ResearchMission[] = [
  {
    id: 'industry-blind-spots',
    phase: 'focal-issue',
    title: 'Industry Blind Spots Research',
    description: 'Before finalising your focal issue, explore what your industry might be missing.',
    suggestedPrompts: [
      'What are the biggest blind spots in the Indian [INDUSTRY] sector that incumbents are ignoring?',
      'What disrupted [SIMILAR INDUSTRY] globally that Indian [INDUSTRY] should learn from?',
      'What are contrarian views about the future of [INDUSTRY] in India?',
    ],
    outputGuidance: 'Paste 2-3 key insights that challenge your assumptions. These will inform how we frame your focal issue.'
  },
  {
    id: 'force-deep-dive',
    phase: 'forces',
    title: 'Deep Dive on Critical Forces',
    description: 'Before selecting your scenario axes, research the forces you find most uncertain.',
    suggestedPrompts: [
      'What are the different ways [FORCE] could play out in India over the next 5-10 years?',
      'What global precedents exist for how [FORCE] transformed an industry?',
      'Who are the key stakeholders that will shape [FORCE] in India and what are their incentives?',
    ],
    outputGuidance: 'For each force you researched, note: (1) Why it\'s uncertain, (2) Extreme possibilities on either end.'
  },
  {
    id: 'scenario-analogies',
    phase: 'scenarios',
    title: 'Real-World Analogies',
    description: 'Find historical or global examples that mirror your scenario logics.',
    suggestedPrompts: [
      'What historical examples exist of industries where [AXIS 1] and [AXIS 2] both shifted dramatically?',
      'Which countries or markets have experienced a scenario similar to [SCENARIO NAME]?',
      'What unexpected events triggered rapid shifts in [RELEVANT DOMAIN]?',
    ],
    outputGuidance: 'Paste 1-2 real examples per scenario. These make your scenarios more plausible and memorable.'
  },
]

// Force (Driving Force)
export interface Force {
  id: string
  name: string
  description: string
  category: PESTCategory
  impact: number        // 1-5
  uncertainty: number   // 1-5
  isCustom: boolean
  aiSuggestedImpact?: number
  aiSuggestedUncertainty?: number
}

// Scenario
export interface Scenario {
  id: string
  name: string
  narrative: string
  quadrant: 'TL' | 'TR' | 'BL' | 'BR'
  timeHorizon: number
  tone: number          // -1 (challenging) to 1 (optimistic)
  complexity: number    // 1-3
  earlySignals: string[]
  keyCapabilities: string[]
}

// Impact Assessment
export interface ImpactScores {
  probability: number       // 1-5
  repercussion: number      // 1-5
  urgency: number           // 1-5
  strategicDisruption: number // 1-5
}

// Risk Profile
export interface RiskProfile {
  appetite: number    // 1-5
  capacity: number    // 1-5
}

// Response Types
export type ResponseType =
  | 'priority-action'
  | 'timely-action'
  | 'safeguard'
  | 'monitor'
  | 'ignore'

export const RESPONSE_LABELS: Record<ResponseType, { label: string; description: string; color: string }> = {
  'priority-action': { label: 'Priority Action', description: 'Take immediate action', color: 'response-priority' },
  'timely-action': { label: 'Timely Action', description: 'Plan action in a reasonable time period', color: 'response-timely' },
  'safeguard': { label: 'Safeguard', description: 'Prepare contingency plans', color: 'response-safeguard' },
  'monitor': { label: 'Monitor', description: 'Scrutinize for early signals', color: 'response-monitor' },
  'ignore': { label: 'Ignore', description: 'No action for now', color: 'response-ignore' },
}

// Response types as an array for UI iteration
// Icons are Lucide icon names (lowercase kebab-case)
export const RESPONSE_TYPES: Array<{ id: ResponseType; name: string; description: string; icon: string }> = [
  { id: 'priority-action', name: 'Priority Action', description: 'High probability + high impact. Requires immediate strategic focus.', icon: 'target' },
  { id: 'timely-action', name: 'Timely Action', description: 'Moderate urgency. Plan and execute within a defined timeframe.', icon: 'clock' },
  { id: 'safeguard', name: 'Safeguard', description: 'Low probability but high impact. Prepare contingency plans.', icon: 'shield' },
  { id: 'monitor', name: 'Monitor', description: 'Watch for early signals. Be ready to escalate.', icon: 'eye' },
  { id: 'ignore', name: 'Ignore', description: 'Low probability and low impact. Deprioritize for now.', icon: 'pause' },
]

// Action Item
export interface ActionItem {
  id: string
  scenarioId: string
  description: string
  timeline: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  budgetRange: 'low' | 'medium' | 'high'
  owner: 'c-suite' | 'director' | 'manager' | 'external'
  selected: boolean
}

// Legacy Phase (kept for backward compatibility)
export type SimulationPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const PHASE_NAMES: Record<SimulationPhase, string> = {
  1: 'Mission Briefing',
  2: 'Environmental Scanning',
  3: 'Critical Uncertainty Selection',
  4: 'Matrix Construction',
  5: 'Scenario Narratives',
  6: 'Impact Assessment',
  7: 'Risk Profile',
  8: 'Response Spectrum',
  9: 'Action Planning',
  10: 'Debrief & Export',
}

// New 4-Phase Journey Structure
export type MainPhase = 'discover' | 'design' | 'develop' | 'decide'

export type SubStep =
  // Discover
  | 'pre-read'
  | 'context'
  | 'focal-issue'
  | 'forces'
  // Design
  | 'uncertainties'
  | 'axes'
  | 'matrix'
  // Develop
  | 'narratives'
  | 'impact'
  | 'risk'
  // Decide
  | 'responses'
  | 'actions'
  | 'report'

export interface PhaseProgress {
  mainPhase: MainPhase
  subStep: SubStep
  completedPhases: MainPhase[]
}

export const MAIN_PHASE_CONFIG: Record<MainPhase, {
  label: string
  description: string
  subSteps: SubStep[]
  icon: string
}> = {
  discover: {
    label: 'Discover',
    description: 'Ground yourself in context and define your focal question',
    subSteps: ['pre-read', 'context', 'focal-issue'],
    icon: 'compass',
  },
  design: {
    label: 'Design',
    description: 'Scan the horizon, map critical uncertainties, and architect your scenario landscape',
    subSteps: ['forces', 'uncertainties', 'axes', 'matrix'],
    icon: 'grid3x3',
  },
  develop: {
    label: 'Develop',
    description: 'Bring each possible future to life through rich narratives',
    subSteps: ['narratives', 'impact', 'risk'],
    icon: 'layers',
  },
  decide: {
    label: 'Decide',
    description: 'Chart your path forward with clarity and conviction',
    subSteps: ['responses', 'actions', 'report'],
    icon: 'target',
  },
}

export const SUB_STEP_CONFIG: Record<SubStep, {
  label: string
  mainPhase: MainPhase
}> = {
  'pre-read': { label: 'Introduction', mainPhase: 'discover' },
  'context': { label: 'Industry & Profile', mainPhase: 'discover' },
  'focal-issue': { label: 'Focal Issue', mainPhase: 'discover' },
  'forces': { label: 'Forces', mainPhase: 'design' },
  'uncertainties': { label: 'Uncertainties', mainPhase: 'design' },
  'axes': { label: 'Axes', mainPhase: 'design' },
  'matrix': { label: 'Matrix', mainPhase: 'design' },
  'narratives': { label: 'Narratives', mainPhase: 'develop' },
  'impact': { label: 'Impact', mainPhase: 'develop' },
  'risk': { label: 'Risk Profile', mainPhase: 'develop' },
  'responses': { label: 'Responses', mainPhase: 'decide' },
  'actions': { label: 'Actions', mainPhase: 'decide' },
  'report': { label: 'Report', mainPhase: 'decide' },
}

// Navigation helpers
export const PHASE_ORDER: MainPhase[] = ['discover', 'design', 'develop', 'decide']

// Actual route-level steps (focal-issue is internal to context page)
const ROUTE_STEPS: SubStep[] = [
  'pre-read', 'context',                      // Discover (ends at Set the Stage)
  'forces', 'uncertainties', 'axes', 'matrix', // Design (starts at Scan the Horizon)
  'narratives', 'impact', 'risk',             // Develop
  'responses', 'actions', 'report'            // Decide
]

export const getNextStep = (current: SubStep): SubStep | null => {
  const currentIndex = ROUTE_STEPS.indexOf(current)
  if (currentIndex === -1) return null  // Step not in route (e.g., focal-issue)
  return currentIndex < ROUTE_STEPS.length - 1 ? ROUTE_STEPS[currentIndex + 1] : null
}

export const getPrevStep = (current: SubStep): SubStep | null => {
  const currentIndex = ROUTE_STEPS.indexOf(current)
  if (currentIndex === -1) return null  // Step not in route (e.g., focal-issue)
  return currentIndex > 0 ? ROUTE_STEPS[currentIndex - 1] : null
}

export const isLastStepOfPhase = (step: SubStep): boolean => {
  const config = SUB_STEP_CONFIG[step]
  const phaseSteps = MAIN_PHASE_CONFIG[config.mainPhase].subSteps
  return phaseSteps[phaseSteps.length - 1] === step
}

export const isFirstStepOfPhase = (step: SubStep): boolean => {
  const config = SUB_STEP_CONFIG[step]
  const phaseSteps = MAIN_PHASE_CONFIG[config.mainPhase].subSteps
  return phaseSteps[0] === step
}
