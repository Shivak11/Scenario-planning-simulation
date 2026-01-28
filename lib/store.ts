import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Force,
  Scenario,
  ImpactScores,
  RiskProfile,
  ResponseType,
  ActionItem,
  SimulationPhase,
  ResearchNote,
  MainPhase,
  SubStep,
  PhaseProgress,
} from './types'
import { MAIN_PHASE_CONFIG, SUB_STEP_CONFIG, getNextStep, getPrevStep, isLastStepOfPhase } from './types'
import { generateId } from './utils'

// Stakeholder perspectives influence language and scope
export type StakeholderPerspective =
  | 'board-promoter'    // Board/Promoter level
  | 'ceo-md'            // CEO/MD level
  | 'bu-head'           // Business Unit Head
  | 'strategy-team'     // Strategy/Planning team

export const STAKEHOLDER_LABELS: Record<StakeholderPerspective, { label: string; description: string }> = {
  'board-promoter': {
    label: 'Board / Promoter',
    description: 'Portfolio decisions, capital allocation, succession, governance'
  },
  'ceo-md': {
    label: 'CEO / Managing Director',
    description: 'Enterprise strategy, organisation design, stakeholder management'
  },
  'bu-head': {
    label: 'Business Unit Head',
    description: 'P&L ownership, competitive positioning, operational excellence'
  },
  'strategy-team': {
    label: 'Strategy / Planning Team',
    description: 'Analysis, options development, decision support'
  },
}

interface SimulationState {
  // Legacy phase tracking (kept for backward compatibility)
  currentPhase: SimulationPhase
  completedPhases: SimulationPhase[]

  // New 4-phase journey tracking
  progress: PhaseProgress

  // Session metadata
  sessionStartTime: number | null
  lastSaveTime: number | null

  // Phase 1: Context (Act I)
  industry: string | null
  organizationType: string | null
  stakeholderPerspective: StakeholderPerspective | null

  // Focal Issue (refined from challenge)
  focalIssue: string | null
  focalIssueRefinement: string | null  // User's additional context
  timeHorizon: number  // Years (3-15)

  // Legacy fields for backwards compatibility
  challenge: string | null
  customChallenge: string | null
  modifiers: string[]
  strategicQuestion: string | null

  // Research Notes (ChatGPT integration)
  researchNotes: ResearchNote[]

  // Phase 2-3: Forces
  forces: Force[]
  selectedForces: Force[]
  xAxis: Force | null
  yAxis: Force | null
  xAxisLabels: { low: string; high: string }
  yAxisLabels: { low: string; high: string }

  // Phase 4-5: Scenarios
  scenarios: Scenario[]

  // Phase 6-7: Assessment
  impactAssessments: Record<string, ImpactScores>
  riskProfile: RiskProfile

  // Phase 8-9: Response
  responseAssignments: Record<string, ResponseType>
  actions: ActionItem[]

  // Loading states
  isGeneratingForces: boolean
  isGeneratingScenarios: boolean
  isGeneratingFocalIssues: boolean

  // Legacy Actions
  setPhase: (phase: SimulationPhase) => void
  completePhase: (phase: SimulationPhase) => void

  // New Progress Actions
  setCurrentStep: (step: SubStep) => void
  goToNextStep: () => void
  goToPrevStep: () => void
  completeMainPhase: (phase: MainPhase) => void
  canNavigateToStep: (step: SubStep) => boolean

  // Session actions
  startSession: () => void
  saveProgress: () => void

  // Phase 1 actions (Act I: Framing)
  setIndustry: (industry: string) => void
  setOrganizationType: (type: string) => void
  setStakeholderPerspective: (perspective: StakeholderPerspective) => void
  setFocalIssue: (issue: string) => void
  setFocalIssueRefinement: (refinement: string) => void
  setTimeHorizon: (years: number) => void

  // Legacy Phase 1 actions (for backwards compatibility)
  setChallenge: (challenge: string) => void
  setCustomChallenge: (challenge: string) => void
  toggleModifier: (modifier: string) => void
  setStrategicQuestion: (question: string) => void

  // Research Notes actions (ChatGPT integration)
  addResearchNote: (note: Omit<ResearchNote, 'id' | 'timestamp'>) => void
  updateResearchNote: (noteId: string, content: string) => void
  deleteResearchNote: (noteId: string) => void
  linkNoteToForce: (noteId: string, forceId: string) => void
  linkNoteToScenario: (noteId: string, scenarioId: string) => void

  // Phase 2-3 actions
  setForces: (forces: Force[]) => void
  updateForceRating: (forceId: string, field: 'impact' | 'uncertainty', value: number) => void
  addCustomForce: (force: Omit<Force, 'id' | 'isCustom'>) => void
  selectForce: (force: Force) => void
  deselectForce: (forceId: string) => void
  setXAxis: (force: Force | null) => void
  setYAxis: (force: Force | null) => void
  setAxisLabels: (axis: 'x' | 'y', labels: { low: string; high: string }) => void

  // Phase 4-5 actions
  setScenarios: (scenarios: Scenario[]) => void
  updateScenario: (scenarioId: string, updates: Partial<Scenario>) => void

  // Phase 6-7 actions
  setImpactAssessment: (scenarioId: string, scores: ImpactScores) => void
  updateImpactScore: (scenarioId: string, field: keyof ImpactScores, value: number) => void
  setRiskProfile: (profile: RiskProfile) => void

  // Phase 8-9 actions
  setResponseAssignment: (scenarioId: string, response: ResponseType) => void
  setActions: (actions: ActionItem[]) => void
  toggleActionSelection: (actionId: string) => void

  // Loading state actions
  setIsGeneratingForces: (isGenerating: boolean) => void
  setIsGeneratingScenarios: (isGenerating: boolean) => void
  setIsGeneratingFocalIssues: (isGenerating: boolean) => void

  // Reset
  resetSimulation: () => void
}

const initialState = {
  currentPhase: 1 as SimulationPhase,
  completedPhases: [] as SimulationPhase[],

  // New 4-phase journey tracking
  progress: {
    mainPhase: 'discover' as MainPhase,
    subStep: 'pre-read' as SubStep,
    completedPhases: [] as MainPhase[],
  },

  // Session metadata
  sessionStartTime: null as number | null,
  lastSaveTime: null as number | null,

  // Act I: Framing
  industry: null as string | null,
  organizationType: null as string | null,
  stakeholderPerspective: null as StakeholderPerspective | null,
  focalIssue: null as string | null,
  focalIssueRefinement: null as string | null,
  timeHorizon: 5,  // Default 5 years

  // Legacy fields
  challenge: null as string | null,
  customChallenge: null as string | null,
  modifiers: [] as string[],
  strategicQuestion: null as string | null,

  // Research notes
  researchNotes: [] as ResearchNote[],

  // Act II: Mapping
  forces: [] as Force[],
  selectedForces: [] as Force[],
  xAxis: null as Force | null,
  yAxis: null as Force | null,
  xAxisLabels: { low: '', high: '' },
  yAxisLabels: { low: '', high: '' },

  // Act III: Scenarios
  scenarios: [] as Scenario[],

  // Act IV: Action
  impactAssessments: {} as Record<string, ImpactScores>,
  riskProfile: { appetite: 3, capacity: 3 },
  responseAssignments: {} as Record<string, ResponseType>,
  actions: [] as ActionItem[],

  // Loading states
  isGeneratingForces: false,
  isGeneratingScenarios: false,
  isGeneratingFocalIssues: false,
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPhase: (phase) => set({ currentPhase: phase }),

      completePhase: (phase) =>
        set((state) => ({
          completedPhases: state.completedPhases.includes(phase)
            ? state.completedPhases
            : [...state.completedPhases, phase],
        })),

      // New Progress Actions
      setCurrentStep: (step) =>
        set((state) => ({
          progress: {
            ...state.progress,
            mainPhase: SUB_STEP_CONFIG[step].mainPhase,
            subStep: step,
          },
        })),

      goToNextStep: () =>
        set((state) => {
          const nextStep = getNextStep(state.progress.subStep)
          if (!nextStep) return state
          return {
            progress: {
              ...state.progress,
              mainPhase: SUB_STEP_CONFIG[nextStep].mainPhase,
              subStep: nextStep,
            },
          }
        }),

      goToPrevStep: () =>
        set((state) => {
          const prevStep = getPrevStep(state.progress.subStep)
          if (!prevStep) return state
          return {
            progress: {
              ...state.progress,
              mainPhase: SUB_STEP_CONFIG[prevStep].mainPhase,
              subStep: prevStep,
            },
          }
        }),

      completeMainPhase: (phase) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedPhases: state.progress.completedPhases.includes(phase)
              ? state.progress.completedPhases
              : [...state.progress.completedPhases, phase],
          },
          lastSaveTime: Date.now(),
        })),

      canNavigateToStep: (step) => {
        const state = get()
        const targetPhase = SUB_STEP_CONFIG[step].mainPhase
        const currentPhase = state.progress.mainPhase

        // Can always go back within completed phases
        if (state.progress.completedPhases.includes(targetPhase)) return true

        // Can navigate within current phase
        if (targetPhase === currentPhase) return true

        // Can go to first step of next phase if current is complete
        const phaseOrder: MainPhase[] = ['discover', 'design', 'develop', 'decide']
        const currentIndex = phaseOrder.indexOf(currentPhase)
        const targetIndex = phaseOrder.indexOf(targetPhase)

        if (targetIndex === currentIndex + 1) {
          // Check if current phase is complete
          return state.progress.completedPhases.includes(currentPhase)
        }

        return false
      },

      // Session actions
      startSession: () => set({ sessionStartTime: Date.now() }),
      saveProgress: () => set({ lastSaveTime: Date.now() }),

      // Phase 1 actions (Act I: Framing)
      setIndustry: (industry) => set({ industry }),
      setOrganizationType: (organizationType) => set({ organizationType }),
      setStakeholderPerspective: (stakeholderPerspective) => set({ stakeholderPerspective }),
      setFocalIssue: (focalIssue) => set({ focalIssue }),
      setFocalIssueRefinement: (focalIssueRefinement) => set({ focalIssueRefinement }),
      setTimeHorizon: (timeHorizon) => set({ timeHorizon }),

      // Legacy Phase 1 actions
      setChallenge: (challenge) => set({ challenge }),
      setCustomChallenge: (customChallenge) => set({ customChallenge }),
      toggleModifier: (modifier) =>
        set((state) => ({
          modifiers: state.modifiers.includes(modifier)
            ? state.modifiers.filter((m) => m !== modifier)
            : [...state.modifiers, modifier],
        })),
      setStrategicQuestion: (strategicQuestion) => set({ strategicQuestion }),

      // Research Notes actions (ChatGPT integration)
      addResearchNote: (note) =>
        set((state) => ({
          researchNotes: [
            ...state.researchNotes,
            { ...note, id: generateId(), timestamp: Date.now() },
          ],
        })),
      updateResearchNote: (noteId, content) =>
        set((state) => ({
          researchNotes: state.researchNotes.map((n) =>
            n.id === noteId ? { ...n, content, timestamp: Date.now() } : n
          ),
        })),
      deleteResearchNote: (noteId) =>
        set((state) => ({
          researchNotes: state.researchNotes.filter((n) => n.id !== noteId),
        })),
      linkNoteToForce: (noteId, forceId) =>
        set((state) => ({
          researchNotes: state.researchNotes.map((n) =>
            n.id === noteId
              ? { ...n, linkedForceIds: [...(n.linkedForceIds || []), forceId] }
              : n
          ),
        })),
      linkNoteToScenario: (noteId, scenarioId) =>
        set((state) => ({
          researchNotes: state.researchNotes.map((n) =>
            n.id === noteId
              ? { ...n, linkedScenarioIds: [...(n.linkedScenarioIds || []), scenarioId] }
              : n
          ),
        })),

      // Phase 2-3 actions
      setForces: (forces) => set({ forces }),
      updateForceRating: (forceId, field, value) =>
        set((state) => ({
          forces: state.forces.map((f) =>
            f.id === forceId ? { ...f, [field]: value } : f
          ),
        })),
      addCustomForce: (force) =>
        set((state) => ({
          forces: [...state.forces, { ...force, id: generateId(), isCustom: true }],
        })),
      selectForce: (force) =>
        set((state) => ({
          selectedForces: state.selectedForces.find((f) => f.id === force.id)
            ? state.selectedForces
            : [...state.selectedForces, force],
        })),
      deselectForce: (forceId) =>
        set((state) => ({
          selectedForces: state.selectedForces.filter((f) => f.id !== forceId),
          xAxis: state.xAxis?.id === forceId ? null : state.xAxis,
          yAxis: state.yAxis?.id === forceId ? null : state.yAxis,
        })),
      setXAxis: (force) => set({ xAxis: force }),
      setYAxis: (force) => set({ yAxis: force }),
      setAxisLabels: (axis, labels) =>
        set((state) => ({
          [axis === 'x' ? 'xAxisLabels' : 'yAxisLabels']: labels,
        })),

      // Phase 4-5 actions
      setScenarios: (scenarios) => set({ scenarios }),
      updateScenario: (scenarioId, updates) =>
        set((state) => ({
          scenarios: state.scenarios.map((s) =>
            s.id === scenarioId ? { ...s, ...updates } : s
          ),
        })),

      // Phase 6-7 actions
      setImpactAssessment: (scenarioId, scores) =>
        set((state) => ({
          impactAssessments: { ...state.impactAssessments, [scenarioId]: scores },
        })),
      updateImpactScore: (scenarioId, field, value) =>
        set((state) => ({
          impactAssessments: {
            ...state.impactAssessments,
            [scenarioId]: {
              ...state.impactAssessments[scenarioId],
              [field]: value,
            },
          },
        })),
      setRiskProfile: (riskProfile) => set({ riskProfile }),

      // Phase 8-9 actions
      setResponseAssignment: (scenarioId, response) =>
        set((state) => ({
          responseAssignments: { ...state.responseAssignments, [scenarioId]: response },
        })),
      setActions: (actions) => set({ actions }),
      toggleActionSelection: (actionId) =>
        set((state) => ({
          actions: state.actions.map((a) =>
            a.id === actionId ? { ...a, selected: !a.selected } : a
          ),
        })),

      // Loading states
      setIsGeneratingForces: (isGeneratingForces) => set({ isGeneratingForces }),
      setIsGeneratingScenarios: (isGeneratingScenarios) => set({ isGeneratingScenarios }),
      setIsGeneratingFocalIssues: (isGeneratingFocalIssues: boolean) => set({ isGeneratingFocalIssues }),

      // Reset
      resetSimulation: () => set(initialState),
    }),
    {
      name: 'strategic-futures-lab',
      partialize: (state) => ({
        // Only persist essential data, not loading states
        currentPhase: state.currentPhase,
        completedPhases: state.completedPhases,

        // New 4-phase progress
        progress: state.progress,

        // Session metadata
        sessionStartTime: state.sessionStartTime,
        lastSaveTime: state.lastSaveTime,

        // Act I: Framing
        industry: state.industry,
        organizationType: state.organizationType,
        stakeholderPerspective: state.stakeholderPerspective,
        focalIssue: state.focalIssue,
        focalIssueRefinement: state.focalIssueRefinement,
        timeHorizon: state.timeHorizon,

        // Legacy fields
        challenge: state.challenge,
        customChallenge: state.customChallenge,
        modifiers: state.modifiers,
        strategicQuestion: state.strategicQuestion,

        // Research notes
        researchNotes: state.researchNotes,

        // Act II: Mapping
        forces: state.forces,
        selectedForces: state.selectedForces,
        xAxis: state.xAxis,
        yAxis: state.yAxis,
        xAxisLabels: state.xAxisLabels,
        yAxisLabels: state.yAxisLabels,

        // Act III: Scenarios
        scenarios: state.scenarios,

        // Act IV: Action
        impactAssessments: state.impactAssessments,
        riskProfile: state.riskProfile,
        responseAssignments: state.responseAssignments,
        actions: state.actions,
      }),
    }
  )
)

// Computed selectors
export const useHighImpactUncertaintyForces = () =>
  useSimulationStore((state) =>
    state.forces.filter((f) => f.impact >= 3 && f.uncertainty >= 3)
  )

export const useTotalImpact = (scenarioId: string) =>
  useSimulationStore((state) => {
    const assessment = state.impactAssessments[scenarioId]
    if (!assessment) return 0
    return (
      assessment.probability +
      assessment.repercussion +
      assessment.urgency +
      assessment.strategicDisruption
    )
  })

export const useTotalRiskTolerance = () =>
  useSimulationStore((state) => state.riskProfile.appetite + state.riskProfile.capacity)
