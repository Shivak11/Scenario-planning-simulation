'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Target,
  Zap,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Impact dimensions with descriptions
const IMPACT_DIMENSIONS = [
  {
    id: 'probability',
    label: 'Probability',
    description: 'How likely is this scenario to unfold?',
    icon: Target,
    color: 'indigo',
  },
  {
    id: 'repercussion',
    label: 'Repercussion',
    description: 'Impact on current business operations',
    icon: TrendingUp,
    color: 'amber',
  },
  {
    id: 'urgency',
    label: 'Urgency',
    description: 'How soon might this scenario materialize?',
    icon: Clock,
    color: 'rose',
  },
  {
    id: 'strategicDisruption',
    label: 'Disruption',
    description: 'Degree of strategic change required',
    icon: Zap,
    color: 'violet',
  },
] as const

// Assessment questions for each dimension
const ASSESSMENT_GUIDES = {
  probability: {
    title: 'Probability Assessment',
    color: 'indigo',
    questions: [
      { question: 'Are the driving forces already in motion?', yesAdd: 20, noAdd: -10 },
      { question: 'Do multiple independent trends point this way?', yesAdd: 15, noAdd: -10 },
      { question: 'Are there powerful actors pushing for this outcome?', yesAdd: 10, noAdd: 0 },
    ],
    startScore: 50,
  },
  repercussion: {
    title: 'Repercussion Assessment',
    color: 'amber',
    questions: [
      { question: 'Would this scenario affect your core revenue streams?', yesAdd: 20, noAdd: -5 },
      { question: 'Would it require significant operational changes?', yesAdd: 15, noAdd: -5 },
      { question: 'Would key customer relationships be impacted?', yesAdd: 15, noAdd: 0 },
    ],
    startScore: 50,
  },
  urgency: {
    title: 'Urgency Assessment',
    color: 'rose',
    questions: [
      { question: 'Are early signals already visible today?', yesAdd: 20, noAdd: -10 },
      { question: 'Could this scenario materialize within 2 years?', yesAdd: 20, noAdd: -10 },
      { question: 'Would delayed response significantly increase costs?', yesAdd: 10, noAdd: 0 },
    ],
    startScore: 50,
  },
  strategicDisruption: {
    title: 'Disruption Assessment',
    color: 'violet',
    questions: [
      { question: 'Would this require fundamental business model changes?', yesAdd: 25, noAdd: -10 },
      { question: 'Would current competitive advantages become irrelevant?', yesAdd: 20, noAdd: -5 },
      { question: 'Would new capabilities or partnerships be essential?', yesAdd: 10, noAdd: 0 },
    ],
    startScore: 50,
  },
} as const

type DimensionKey = keyof typeof ASSESSMENT_GUIDES

// Score descriptions
const SCORE_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very High',
}

export default function Phase6Page() {
  const router = useRouter()
  const {
    setPhase,
    completePhase,
    scenarios,
    impactAssessments,
    setImpactAssessment,
    updateImpactScore,
  } = useSimulationStore()

  const [expandedScenario, setExpandedScenario] = useState<string | null>(
    scenarios[0]?.id || null
  )
  const [activeGuide, setActiveGuide] = useState<DimensionKey | null>(null)
  const [guideScenarioId, setGuideScenarioId] = useState<string | null>(null)
  const [guideStep, setGuideStep] = useState(0)
  const [guideScore, setGuideScore] = useState(50)

  useEffect(() => {
    setPhase(6)
    // Initialize impact assessments for any scenarios that don't have them
    scenarios.forEach((scenario) => {
      if (!impactAssessments[scenario.id]) {
        setImpactAssessment(scenario.id, {
          probability: 3,
          repercussion: 3,
          urgency: 3,
          strategicDisruption: 3,
        })
      }
    })
  }, [setPhase, scenarios, impactAssessments, setImpactAssessment])

  // Check if all assessments are complete (all have been touched)
  const allAssessmentsComplete = scenarios.every(
    (s) => impactAssessments[s.id] !== undefined
  )

  const handleContinue = () => {
    completePhase(6)
    setPhase(7)
    router.push('/simulation/phase-7')
  }

  const handleScoreChange = (
    scenarioId: string,
    dimension: keyof typeof impactAssessments[string],
    value: number
  ) => {
    updateImpactScore(scenarioId, dimension, value)
  }

  const calculateComposite = (scenarioId: string) => {
    const assessment = impactAssessments[scenarioId]
    if (!assessment) return 0
    return Math.round(
      ((assessment.probability +
        assessment.repercussion +
        assessment.urgency +
        assessment.strategicDisruption) /
        20) *
        100
    )
  }

  const startAssessmentGuide = (scenarioId: string, dimension: DimensionKey) => {
    setGuideScenarioId(scenarioId)
    setActiveGuide(dimension)
    setGuideStep(0)
    setGuideScore(ASSESSMENT_GUIDES[dimension].startScore)
  }

  const handleGuideAnswer = (isYes: boolean) => {
    if (!activeGuide) return
    const guide = ASSESSMENT_GUIDES[activeGuide]
    const question = guide.questions[guideStep]

    const adjustment = isYes ? question.yesAdd : question.noAdd
    const newScore = Math.max(5, Math.min(95, guideScore + adjustment))
    setGuideScore(newScore)

    if (guideStep < guide.questions.length - 1) {
      setGuideStep(guideStep + 1)
    } else {
      // Convert percentage to 1-5 scale
      const scaledScore = Math.round((newScore / 100) * 5)
      const clampedScore = Math.max(1, Math.min(5, scaledScore))
      if (guideScenarioId) {
        updateImpactScore(guideScenarioId, activeGuide, clampedScore)
      }
      setActiveGuide(null)
    }
  }

  const closeGuide = () => {
    setActiveGuide(null)
    setGuideScenarioId(null)
  }

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <p className="text-navy-600">
          Rate each scenario on four dimensions to understand which futures demand
          attention now and which can be monitored over time.
        </p>

        {/* Impact Matrix */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_repeat(4,80px)_80px] gap-2 p-4 bg-navy-50 border-b border-navy-200 text-xs font-medium text-navy-600">
            <div>Scenario</div>
            {IMPACT_DIMENSIONS.map((dim) => (
              <div key={dim.id} className="text-center">
                {dim.label}
              </div>
            ))}
            <div className="text-center text-navy-800">Score</div>
          </div>

          {/* Scenario Rows */}
          {scenarios.map((scenario) => {
            const assessment = impactAssessments[scenario.id]
            const composite = calculateComposite(scenario.id)
            const isExpanded = expandedScenario === scenario.id

            return (
              <div key={scenario.id} className="border-b border-navy-100 last:border-b-0">
                {/* Summary Row */}
                <div
                  className="grid grid-cols-[1fr_repeat(4,80px)_80px] gap-2 p-4 items-center cursor-pointer hover:bg-navy-50 transition-colors"
                  onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy-800">{scenario.name}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-navy-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-navy-400" />
                    )}
                  </div>

                  {/* Score Bars */}
                  {IMPACT_DIMENSIONS.map((dim) => {
                    const value = assessment?.[dim.id] || 3
                    return (
                      <div key={dim.id} className="flex justify-center">
                        <div className="w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              dim.color === 'indigo' && 'bg-indigo-500',
                              dim.color === 'amber' && 'bg-amber-500',
                              dim.color === 'rose' && 'bg-rose-500',
                              dim.color === 'violet' && 'bg-violet-500'
                            )}
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}

                  {/* Composite Score */}
                  <div className="text-center">
                    <span
                      className={cn(
                        'inline-block px-2 py-1 rounded-full text-xs font-bold',
                        composite >= 70
                          ? 'bg-red-100 text-red-700'
                          : composite >= 50
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      )}
                    >
                      {composite}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4 bg-gray-50">
                        {IMPACT_DIMENSIONS.map((dim) => {
                          const value = assessment?.[dim.id] || 3
                          const Icon = dim.icon

                          return (
                            <div key={dim.id} className="flex items-center gap-4">
                              <div className="w-32 flex items-center gap-2">
                                <Icon
                                  className={cn(
                                    'w-4 h-4',
                                    dim.color === 'indigo' && 'text-indigo-500',
                                    dim.color === 'amber' && 'text-amber-500',
                                    dim.color === 'rose' && 'text-rose-500',
                                    dim.color === 'violet' && 'text-violet-500'
                                  )}
                                />
                                <span className="text-sm text-navy-700">{dim.label}</span>
                              </div>

                              {/* Slider */}
                              <div className="flex-1 flex items-center gap-3">
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={value}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      scenario.id,
                                      dim.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className={cn(
                                    'w-full h-2 rounded-full appearance-none cursor-pointer',
                                    dim.color === 'indigo' && 'accent-indigo-500',
                                    dim.color === 'amber' && 'accent-amber-500',
                                    dim.color === 'rose' && 'accent-rose-500',
                                    dim.color === 'violet' && 'accent-violet-500'
                                  )}
                                />
                                <span className="w-20 text-xs text-navy-600">
                                  {SCORE_LABELS[value]}
                                </span>
                              </div>

                              {/* Assessment Guide trigger for all dimensions */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startAssessmentGuide(scenario.id, dim.id as DimensionKey)
                                }}
                                className={cn(
                                  'text-xs flex items-center gap-1 hover:opacity-80',
                                  dim.color === 'indigo' && 'text-indigo-600',
                                  dim.color === 'amber' && 'text-amber-600',
                                  dim.color === 'rose' && 'text-rose-600',
                                  dim.color === 'violet' && 'text-violet-600'
                                )}
                              >
                                <HelpCircle className="w-3 h-3" />
                                Guide
                              </button>
                            </div>
                          )
                        })}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-5')}>
            ← Back
          </Button>
          <Button onClick={handleContinue} disabled={!allAssessmentsComplete}>
            Continue to Risk Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Active Assessment Guide */}
        {activeGuide && guideScenarioId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-2 border-navy-300 shadow-lg overflow-hidden"
          >
            <div
              className={cn(
                'px-4 py-3 text-white',
                activeGuide === 'probability' && 'bg-gradient-to-r from-indigo-500 to-indigo-600',
                activeGuide === 'repercussion' && 'bg-gradient-to-r from-amber-500 to-amber-600',
                activeGuide === 'urgency' && 'bg-gradient-to-r from-rose-500 to-rose-600',
                activeGuide === 'strategicDisruption' && 'bg-gradient-to-r from-violet-500 to-violet-600'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{ASSESSMENT_GUIDES[activeGuide].title}</div>
                <button onClick={closeGuide} className="text-white/80 hover:text-white">
                  ✕
                </button>
              </div>
              <div className="text-xs opacity-80">
                {scenarios.find((s) => s.id === guideScenarioId)?.name}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Progress */}
              <div className="flex gap-1">
                {ASSESSMENT_GUIDES[activeGuide].questions.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full',
                      i <= guideStep
                        ? activeGuide === 'probability' ? 'bg-indigo-500' :
                          activeGuide === 'repercussion' ? 'bg-amber-500' :
                          activeGuide === 'urgency' ? 'bg-rose-500' : 'bg-violet-500'
                        : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>

              {/* Current Question */}
              <div
                className={cn(
                  'rounded-lg p-4',
                  activeGuide === 'probability' && 'bg-indigo-50',
                  activeGuide === 'repercussion' && 'bg-amber-50',
                  activeGuide === 'urgency' && 'bg-rose-50',
                  activeGuide === 'strategicDisruption' && 'bg-violet-50'
                )}
              >
                <p className="text-sm font-medium text-navy-900 mb-4">
                  Q{guideStep + 1}: {ASSESSMENT_GUIDES[activeGuide].questions[guideStep].question}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleGuideAnswer(true)}
                    className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleGuideAnswer(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Running Score */}
              <div className="text-center">
                <div
                  className={cn(
                    'text-2xl font-bold',
                    activeGuide === 'probability' && 'text-indigo-600',
                    activeGuide === 'repercussion' && 'text-amber-600',
                    activeGuide === 'urgency' && 'text-rose-600',
                    activeGuide === 'strategicDisruption' && 'text-violet-600'
                  )}
                >
                  {guideScore}%
                </div>
                <div className="text-xs text-navy-500">Current estimate</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dimension Quick Reference Cards (shown when no guide is active) */}
        {!activeGuide && (
          <>
            {/* Probability Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-800">Probability</span>
              </div>
              <p className="text-xs text-indigo-700 mb-2">
                How likely is this scenario to unfold? Consider: driving forces in motion,
                converging trends, and powerful actors pushing for this outcome.
              </p>
              <div className="text-[10px] text-indigo-600 bg-white/60 rounded p-2">
                💡 Never assign 0% or 100%. All scenarios must remain "possible."
              </div>
            </div>

            {/* Repercussion Card */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">Repercussion</span>
              </div>
              <p className="text-xs text-amber-700 mb-2">
                Impact on YOUR operations. Consider: revenue streams at risk, operational
                changes needed, and customer relationship effects.
              </p>
              <div className="text-[10px] text-amber-600 bg-white/60 rounded p-2">
                💡 Rate for YOUR company, not the industry average.
              </div>
            </div>

            {/* Urgency Card */}
            <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl border border-rose-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-semibold text-rose-800">Urgency</span>
              </div>
              <p className="text-xs text-rose-700 mb-2">
                How soon might this materialize? Look for: early signals visible today,
                timeline to manifestation, and cost of delayed response.
              </p>
              <div className="text-[10px] text-rose-600 bg-white/60 rounded p-2">
                💡 High urgency = early signals already visible.
              </div>
            </div>

            {/* Disruption Card */}
            <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl border border-violet-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-semibold text-violet-800">Disruption</span>
              </div>
              <p className="text-xs text-violet-700 mb-2">
                Degree of strategic change required. Consider: business model changes needed,
                current advantages becoming irrelevant, new capabilities required.
              </p>
              <div className="text-[10px] text-violet-600 bg-white/60 rounded p-2">
                💡 High disruption = fundamental transformation needed.
              </div>
            </div>
          </>
        )}

        {/* Quick Tip */}
        <div className="bg-navy-50 rounded-lg p-3 text-xs text-navy-600">
          <strong>Tip:</strong> Click "Guide" next to any slider for step-by-step assessment
          help. Rate each scenario independently before comparing.
        </div>
      </div>
    </div>
  )
}
