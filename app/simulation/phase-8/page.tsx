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
  ExternalLink,
  Lightbulb,
  Zap,
  Clock,
  Shield,
  Eye,
  XCircle,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResponseType } from '@/lib/types'

// Response buckets with detailed information
const RESPONSE_BUCKETS: {
  id: ResponseType
  label: string
  emoji: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  action: string
  icon: typeof Zap
}[] = [
  {
    id: 'priority-action',
    label: 'Priority Action',
    emoji: '🔴',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    description: 'This could happen soon and would change everything',
    action: 'Immediate strategic initiatives, Board-level attention',
    icon: Zap,
  },
  {
    id: 'timely-action',
    label: 'Timely Action',
    emoji: '🟠',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    description: 'High impact but we have time to prepare',
    action: 'Start planning process, Build capabilities',
    icon: Clock,
  },
  {
    id: 'safeguard',
    label: 'Safeguard',
    emoji: '🟡',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    description: 'Could hurt us, need insurance',
    action: 'Hedging strategies, Contingency plans',
    icon: Shield,
  },
  {
    id: 'monitor',
    label: 'Monitor',
    emoji: '🔵',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    description: 'Possible but not urgent',
    action: 'Define early warning signals, Quarterly check-ins',
    icon: Eye,
  },
  {
    id: 'ignore',
    label: 'Ignore',
    emoji: '⚪',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    description: 'Low probability AND low impact',
    action: 'Accept residual risk, Don\'t waste planning energy',
    icon: XCircle,
  },
]

export default function Phase8Page() {
  const router = useRouter()
  const {
    setPhase,
    completePhase,
    scenarios,
    impactAssessments,
    riskProfile,
    responseAssignments,
    setResponseAssignment,
  } = useSimulationStore()

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [showFramework, setShowFramework] = useState(true)
  const [showMatrix, setShowMatrix] = useState(false)

  useEffect(() => {
    setPhase(8)
  }, [setPhase])

  // Check if all scenarios have been assigned
  const allAssigned = scenarios.every((s) => responseAssignments[s.id])

  const handleContinue = () => {
    completePhase(8)
    setPhase(9)
    router.push('/simulation/phase-9')
  }

  const handleAssign = (scenarioId: string, response: ResponseType) => {
    setResponseAssignment(scenarioId, response)
    setSelectedScenario(null)
  }

  // Calculate composite score for a scenario
  const getCompositeScore = (scenarioId: string) => {
    const assessment = impactAssessments[scenarioId]
    if (!assessment) return 0
    return (
      assessment.probability +
      assessment.repercussion +
      assessment.urgency +
      assessment.strategicDisruption
    )
  }

  // Get suggested response based on scores and risk profile
  const getSuggestedResponse = (scenarioId: string): ResponseType => {
    const assessment = impactAssessments[scenarioId]
    if (!assessment) return 'monitor'

    const impactScore = (assessment.repercussion + assessment.strategicDisruption) / 2
    const probabilityScore = assessment.probability
    const riskTolerance = (riskProfile.appetite + riskProfile.capacity) / 2

    // High probability + High impact = Priority or Timely
    if (probabilityScore >= 4 && impactScore >= 4) return 'priority-action'
    if (probabilityScore >= 3 && impactScore >= 4) return 'timely-action'

    // High impact but low probability = Safeguard
    if (impactScore >= 4 && probabilityScore < 3) return 'safeguard'

    // Moderate = Monitor (adjusted by risk tolerance)
    if (impactScore >= 3 || probabilityScore >= 3) {
      if (riskTolerance < 3) return 'safeguard'
      return 'monitor'
    }

    // Low everything = Ignore
    return 'ignore'
  }

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <p className="text-navy-600">
          Assign each scenario to a response bucket based on its impact scores and your
          risk profile. This determines how much attention and resources each future deserves.
        </p>

        {/* Response Buckets */}
        <div className="grid grid-cols-5 gap-2">
          {RESPONSE_BUCKETS.map((bucket) => {
            const Icon = bucket.icon
            const assignedScenarios = scenarios.filter(
              (s) => responseAssignments[s.id] === bucket.id
            )

            return (
              <div
                key={bucket.id}
                className={cn(
                  'rounded-xl border-2 p-3 min-h-[180px] transition-all',
                  bucket.bgColor,
                  bucket.borderColor
                )}
              >
                <div className="text-center mb-3">
                  <Icon className={cn('w-5 h-5 mx-auto mb-1', bucket.color)} />
                  <div className={cn('text-xs font-bold', bucket.color)}>{bucket.label}</div>
                </div>

                {/* Assigned scenarios */}
                <div className="space-y-2">
                  {assignedScenarios.map((scenario) => (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg p-2 shadow-sm border border-white/50 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedScenario(scenario.id)}
                    >
                      <div className="text-xs font-medium text-navy-800 truncate">
                        {scenario.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Unassigned Scenarios */}
        <div className="bg-white rounded-xl border border-navy-200 p-4">
          <h3 className="font-medium text-navy-900 mb-3">
            {scenarios.filter((s) => !responseAssignments[s.id]).length > 0
              ? 'Click a scenario to assign it:'
              : 'All scenarios assigned ✓'}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {scenarios.map((scenario) => {
              const isAssigned = !!responseAssignments[scenario.id]
              const isSelected = selectedScenario === scenario.id
              const compositeScore = getCompositeScore(scenario.id)
              const suggestedResponse = getSuggestedResponse(scenario.id)
              const suggestedBucket = RESPONSE_BUCKETS.find((b) => b.id === suggestedResponse)

              return (
                <motion.div
                  key={scenario.id}
                  className={cn(
                    'rounded-lg border-2 p-3 cursor-pointer transition-all',
                    isAssigned
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : isSelected
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300'
                      : 'bg-white border-navy-200 hover:border-navy-300'
                  )}
                  onClick={() => !isAssigned && setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-navy-800">{scenario.name}</span>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        compositeScore >= 14
                          ? 'bg-red-100 text-red-700'
                          : compositeScore >= 10
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      )}
                    >
                      {compositeScore}/20
                    </span>
                  </div>

                  {isAssigned ? (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Check className="w-3 h-3" />
                      Assigned to {RESPONSE_BUCKETS.find((b) => b.id === responseAssignments[scenario.id])?.label}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-navy-500">
                      <Lightbulb className="w-3 h-3" />
                      Suggested: <span className={suggestedBucket?.color}>{suggestedBucket?.label}</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Assignment Panel */}
        <AnimatePresence>
          {selectedScenario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl border-2 border-indigo-300 p-4 shadow-lg"
            >
              <h3 className="font-medium text-navy-900 mb-3">
                Assign "{scenarios.find((s) => s.id === selectedScenario)?.name}" to:
              </h3>
              <div className="flex gap-2">
                {RESPONSE_BUCKETS.map((bucket) => (
                  <button
                    key={bucket.id}
                    onClick={() => handleAssign(selectedScenario, bucket.id)}
                    className={cn(
                      'flex-1 p-3 rounded-lg border-2 transition-all hover:scale-105',
                      bucket.bgColor,
                      bucket.borderColor
                    )}
                  >
                    <div className={cn('text-xs font-bold', bucket.color)}>{bucket.emoji}</div>
                    <div className={cn('text-xs font-medium mt-1', bucket.color)}>
                      {bucket.label}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedScenario(null)}
                className="mt-3 text-xs text-navy-500 hover:text-navy-700"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Message */}
        {!allAssigned && (
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Assign all {scenarios.length} scenarios to response buckets before continuing.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-7')}>
            ← Back
          </Button>
          <Button onClick={handleContinue} disabled={!allAssigned}>
            Continue to Action Planning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Response Framework */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setShowFramework(!showFramework)}
            className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">🎯 The 5-Bucket Framework</div>
                <div className="text-xs opacity-80">How to choose response types</div>
              </div>
              {showFramework ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showFramework && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {RESPONSE_BUCKETS.map((bucket) => {
                    const Icon = bucket.icon
                    return (
                      <div
                        key={bucket.id}
                        className={cn(
                          'rounded-lg p-3 border',
                          bucket.bgColor,
                          bucket.borderColor
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span>{bucket.emoji}</span>
                          <span className={cn('text-sm font-bold', bucket.color)}>
                            {bucket.label}
                          </span>
                        </div>
                        <p className={cn('text-xs mb-1', bucket.color.replace('700', '600'))}>
                          "{bucket.description}"
                        </p>
                        <p className="text-xs text-navy-500">→ {bucket.action}</p>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decision Matrix Helper */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="w-full px-4 py-3 text-left border-b border-navy-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-navy-900">📊 How to Assign Responses</div>
                <div className="text-xs text-navy-500">Impact × Probability matrix</div>
              </div>
              {showMatrix ? (
                <ChevronUp className="w-4 h-4 text-navy-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-navy-400" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showMatrix && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  {/* Simple 2x2 */}
                  <div className="grid grid-cols-2 gap-1 mb-3">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <div className="text-xs font-bold text-blue-700">MONITOR</div>
                      <div className="text-[10px] text-blue-600">High prob, Low impact</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-center">
                      <div className="text-xs font-bold text-red-700">PRIORITY</div>
                      <div className="text-[10px] text-red-600">High prob, High impact</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-xs font-bold text-gray-600">IGNORE</div>
                      <div className="text-[10px] text-gray-500">Low prob, Low impact</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded text-center">
                      <div className="text-xs font-bold text-amber-700">SAFEGUARD</div>
                      <div className="text-[10px] text-amber-600">Low prob, High impact</div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <p className="text-xs text-indigo-800">
                      <strong>+ Factor in your RISK PROFILE:</strong>
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                      High appetite → shift toward action
                      <br />
                      Low capacity → shift toward safeguard
                    </p>
                  </div>

                  <a
                    href={`https://chat.openai.com/?q=${encodeURIComponent(
                      'Explain how to assign scenarios to response categories in strategic scenario planning. Cover: 1) The difference between Priority Action, Timely Action, Safeguard, Monitor, and Ignore responses, 2) How to factor in probability vs impact, 3) How organizational risk appetite affects response selection, 4) Examples of each response type with real company examples.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-3"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Learn more about scenario response strategies →
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Tip */}
        <div className="bg-navy-50 rounded-lg p-3 text-xs text-navy-600">
          <strong>Tip:</strong> Don't assign everything to "Priority Action." Strategic focus
          means making hard choices about where to invest attention and resources.
        </div>
      </div>
    </div>
  )
}
