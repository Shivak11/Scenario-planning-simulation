'use client'

import { usePathname } from 'next/navigation'
import { ProgressIndicator } from '@/components/simulation/ProgressIndicator'
import { PHASE_NAMES, SimulationPhase, SUB_STEP_CONFIG, MAIN_PHASE_CONFIG, MainPhase, SubStep } from '@/lib/types'

// Consistent dark background across all phases (keeps gold accents prominent)
const PHASE_BACKGROUNDS: Record<MainPhase, string> = {
  discover: 'from-slate-900 via-slate-800 to-slate-900',
  design: 'from-slate-900 via-slate-800 to-slate-900',
  develop: 'from-slate-900 via-slate-800 to-slate-900',
  decide: 'from-slate-900 via-slate-800 to-slate-900',
}

// Custom evocative titles for specific pages (overrides default pattern)
const CUSTOM_PAGE_TITLES: Record<string, string> = {
  'design/forces': 'Scan the Horizon',
  'discover/context': 'Set the Stage',
  'design/uncertainties': 'Your Critical Uncertainties',
  'design/axes': 'Define Your Axes',
  'design/matrix': 'Build the Matrix',
  'develop/narratives': 'Craft Your Futures',
  'develop/impact': 'Assess the Impact',
  'develop/risk': 'Map Your Risk Profile',
  'decide/responses': 'Choose Your Response',
  'decide/actions': 'Plan Your Actions',
  'decide/report': 'Your Strategic Playbook',
}

// Step explainers - brief description of what each step accomplishes
const STEP_EXPLAINERS: Record<string, string> = {
  'discover/context': 'Define your industry, organization type, and strategic perspective to frame the scenario planning exercise.',
  'design/forces': 'Identify and rate the driving forces shaping your environment across Political, Economic, Social, and Technological dimensions.',
  'design/uncertainties': 'From your rated forces, select the two critical uncertainties—high impact AND high unpredictability—that will form your scenario axes.',
  'design/axes': 'Label the extremes of each axis. Define what "high" and "low" mean for each uncertainty to create four distinct futures.',
  'design/matrix': 'Your 2×2 matrix creates four scenario quadrants. Each represents a plausible future worth preparing for.',
  'develop/narratives': 'Bring each scenario to life with a vivid narrative. Good scenarios are memorable, internally consistent, and challenging.',
  'develop/impact': 'Assess how each scenario would affect your organization across key dimensions.',
  'develop/risk': 'Map risks and opportunities across all four scenarios to identify robust strategies.',
  'decide/responses': 'Classify your strategic options: Bet Big, Hedge, or Monitor based on scenario analysis.',
  'decide/actions': 'Define concrete actions for each response type with owners, timelines, and triggers.',
  'decide/report': 'Your complete strategic playbook—scenarios, impacts, and action plans in one view.',
}

// Map new routes to titles
const getNewRouteTitle = (pathname: string): string | null => {
  // Match /simulation/{mainPhase}/{subStep}
  const newRouteMatch = pathname?.match(/\/simulation\/(discover|design|develop|decide)\/([a-z-]+)/)
  if (newRouteMatch) {
    const [, mainPhase, subStep] = newRouteMatch
    const routeKey = `${mainPhase}/${subStep}`

    // Check for custom title first
    if (CUSTOM_PAGE_TITLES[routeKey]) {
      return CUSTOM_PAGE_TITLES[routeKey]
    }

    // Fall back to default pattern
    const subStepConfig = SUB_STEP_CONFIG[subStep as SubStep]
    const mainPhaseConfig = MAIN_PHASE_CONFIG[mainPhase as MainPhase]
    if (subStepConfig && mainPhaseConfig) {
      return `${mainPhaseConfig.label}: ${subStepConfig.label}`
    }
  }
  return null
}

// Get step explainer from pathname
const getStepExplainer = (pathname: string): string | null => {
  const newRouteMatch = pathname?.match(/\/simulation\/(discover|design|develop|decide)\/([a-z-]+)/)
  if (newRouteMatch) {
    const [, mainPhase, subStep] = newRouteMatch
    const routeKey = `${mainPhase}/${subStep}`
    return STEP_EXPLAINERS[routeKey] || null
  }
  return null
}

// Get current main phase from pathname
const getCurrentMainPhase = (pathname: string | null): MainPhase => {
  if (!pathname) return 'discover'
  const match = pathname.match(/\/simulation\/(discover|design|develop|decide)/)
  return (match?.[1] as MainPhase) || 'discover'
}

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Check for new route structure first
  const newRouteTitle = getNewRouteTitle(pathname || '')
  const stepExplainer = getStepExplainer(pathname || '')

  // Fall back to legacy phase structure
  const phaseMatch = pathname?.match(/phase-(\d+)/)
  const currentPhase = phaseMatch ? (parseInt(phaseMatch[1], 10) as SimulationPhase) : 1

  // Determine which title to show
  const title = newRouteTitle || PHASE_NAMES[currentPhase]

  // Check if this is the pre-read page (special full-screen layout)
  const isPreRead = pathname?.includes('/discover/pre-read')

  // Get current phase for background color
  const currentMainPhase = getCurrentMainPhase(pathname)
  const phaseBackground = PHASE_BACKGROUNDS[currentMainPhase]

  if (isPreRead) {
    return <>{children}</>
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${phaseBackground}`}>
      {/* Progress Header */}
      <ProgressIndicator />

      {/* Phase Title & Explainer */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <h1 className="font-serif text-3xl font-bold text-white">
          {title}
        </h1>
        {stepExplainer && (
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            {stepExplainer}
          </p>
        )}
      </div>

      {/* Phase Content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  )
}
