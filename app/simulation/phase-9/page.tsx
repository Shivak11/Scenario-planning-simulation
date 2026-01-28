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
  Plus,
  Trash2,
  Lightbulb,
  Target,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateId } from '@/lib/utils'
import type { ActionItem } from '@/lib/types'

// Timeline options
const TIMELINE_OPTIONS = [
  { value: 'Q1', label: 'Q1 2025', description: 'Next 3 months' },
  { value: 'Q2', label: 'Q2 2025', description: '3-6 months' },
  { value: 'Q3', label: 'Q3 2025', description: '6-9 months' },
  { value: 'Q4', label: 'Q4 2025', description: '9-12 months' },
]

// Budget options
const BUDGET_OPTIONS = [
  { value: 'low', label: '₹10L-50L', description: 'Small initiative' },
  { value: 'medium', label: '₹50L-2Cr', description: 'Significant investment' },
  { value: 'high', label: '₹2Cr+', description: 'Major strategic bet' },
]

// Owner options
const OWNER_OPTIONS = [
  { value: 'c-suite', label: 'C-Suite', description: 'CEO/CXO ownership' },
  { value: 'director', label: 'Director', description: 'Senior leadership' },
  { value: 'manager', label: 'Manager', description: 'Middle management' },
  { value: 'external', label: 'External', description: 'Consultant/Partner' },
]

export default function Phase9Page() {
  const router = useRouter()
  const {
    setPhase,
    completePhase,
    scenarios,
    responseAssignments,
    actions,
    setActions,
    industry,
    focalIssue,
  } = useSimulationStore()

  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(true)
  const [showTriggers, setShowTriggers] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)

  useEffect(() => {
    setPhase(9)
  }, [setPhase])

  // Get actionable scenarios (Priority Action or Timely Action)
  const actionableScenarios = scenarios.filter(
    (s) =>
      responseAssignments[s.id] === 'priority-action' ||
      responseAssignments[s.id] === 'timely-action'
  )

  // Get actions for a specific scenario
  const getActionsForScenario = (scenarioId: string) =>
    actions.filter((a) => a.scenarioId === scenarioId)

  const addAction = (scenarioId: string) => {
    const newAction: ActionItem = {
      id: generateId(),
      scenarioId,
      description: '',
      timeline: 'Q2',
      budgetRange: 'medium',
      owner: 'director',
      selected: true,
    }
    setActions([...actions, newAction])
  }

  const updateAction = (actionId: string, updates: Partial<ActionItem>) => {
    setActions(
      actions.map((a) => (a.id === actionId ? { ...a, ...updates } : a))
    )
  }

  const deleteAction = (actionId: string) => {
    setActions(actions.filter((a) => a.id !== actionId))
  }

  const handleContinue = () => {
    completePhase(9)
    setPhase(10)
    router.push('/simulation/phase-10')
  }

  // Check if we have at least some actions
  const hasActions = actions.length > 0

  // Generate AI suggestions inline
  const generateAISuggestions = async (scenario: typeof scenarios[0]) => {
    setGeneratingFor(scenario.id)

    // Simulate AI generation with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isPriority = responseAssignments[scenario.id] === 'priority-action'

    // Context-aware suggestions based on scenario and industry
    const suggestions: Omit<ActionItem, 'id'>[] = [
      {
        scenarioId: scenario.id,
        description: `Form a cross-functional task force to assess ${scenario.name.toLowerCase()} implications. Conduct gap analysis of current capabilities vs. required readiness. Deliver a 30-day action roadmap.`,
        timeline: isPriority ? 'Q1' : 'Q2',
        budgetRange: 'low',
        owner: 'c-suite',
        selected: true,
      },
      {
        scenarioId: scenario.id,
        description: `Commission external research on ${industry || 'market'} responses to similar scenarios. Interview 10+ industry peers for best practices. Synthesize findings into strategic options memo.`,
        timeline: isPriority ? 'Q1' : 'Q2',
        budgetRange: 'low',
        owner: 'director',
        selected: true,
      },
      {
        scenarioId: scenario.id,
        description: `Develop contingency playbook with 3 response levels (watch, prepare, act). Define clear triggers for each escalation level. Test with leadership team simulation.`,
        timeline: isPriority ? 'Q2' : 'Q3',
        budgetRange: 'medium',
        owner: 'director',
        selected: true,
      },
    ]

    // Add generated actions to state
    const newActions = suggestions.map((s) => ({
      ...s,
      id: generateId(),
    }))

    setActions([...actions, ...newActions])
    setGeneratingFor(null)
  }

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <p className="text-navy-600">
          Define concrete action items for your Priority Action and Timely Action scenarios.
          Good actions are specific, owned, and trigger-based.
        </p>

        {actionableScenarios.length === 0 ? (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
            <p className="text-amber-800 font-medium mb-2">No Actionable Scenarios</p>
            <p className="text-sm text-amber-700">
              You haven't assigned any scenarios to Priority Action or Timely Action.
              Go back to Phase 8 to assign response strategies.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {actionableScenarios.map((scenario) => {
              const isExpanded = expandedScenario === scenario.id
              const scenarioActions = getActionsForScenario(scenario.id)
              const isPriority = responseAssignments[scenario.id] === 'priority-action'

              return (
                <div
                  key={scenario.id}
                  className={cn(
                    'rounded-xl border-2 overflow-hidden',
                    isPriority ? 'border-red-300' : 'border-orange-300'
                  )}
                >
                  {/* Header */}
                  <button
                    className={cn(
                      'w-full p-4 text-left flex items-center justify-between',
                      isPriority ? 'bg-red-50' : 'bg-orange-50'
                    )}
                    onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isPriority ? 'text-red-600' : 'text-orange-600'}>
                        {isPriority ? '🔴' : '🟠'}
                      </span>
                      <div>
                        <div className="font-semibold text-navy-800">{scenario.name}</div>
                        <div className="text-xs text-navy-500">
                          {isPriority ? 'Priority Action' : 'Timely Action'} •{' '}
                          {scenarioActions.length} action{scenarioActions.length !== 1 && 's'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {scenarioActions.length > 0 && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-navy-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-navy-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white space-y-4">
                          {/* Actions List */}
                          {scenarioActions.map((action, index) => (
                            <div
                              key={action.id}
                              className="bg-gray-50 rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-navy-700">
                                  Action #{index + 1}
                                </span>
                                <button
                                  onClick={() => deleteAction(action.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Description */}
                              <div>
                                <label className="text-xs text-navy-500 mb-1 block">
                                  What action should we take?
                                </label>
                                <textarea
                                  value={action.description}
                                  onChange={(e) =>
                                    updateAction(action.id, { description: e.target.value })
                                  }
                                  placeholder="Be specific: 'Form cross-functional AI governance committee with Legal, Tech, and Product leads...'"
                                  className="w-full p-2 text-sm border border-navy-200 rounded-lg resize-none h-20 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                                />
                              </div>

                              {/* Options Grid */}
                              <div className="grid grid-cols-3 gap-3">
                                {/* Timeline */}
                                <div>
                                  <label className="text-xs text-navy-500 mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Timeline
                                  </label>
                                  <select
                                    value={action.timeline}
                                    onChange={(e) =>
                                      updateAction(action.id, {
                                        timeline: e.target.value as ActionItem['timeline'],
                                      })
                                    }
                                    className="w-full p-2 text-sm border border-navy-200 rounded-lg"
                                  >
                                    {TIMELINE_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Budget */}
                                <div>
                                  <label className="text-xs text-navy-500 mb-1 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Budget
                                  </label>
                                  <select
                                    value={action.budgetRange}
                                    onChange={(e) =>
                                      updateAction(action.id, {
                                        budgetRange: e.target.value as ActionItem['budgetRange'],
                                      })
                                    }
                                    className="w-full p-2 text-sm border border-navy-200 rounded-lg"
                                  >
                                    {BUDGET_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Owner */}
                                <div>
                                  <label className="text-xs text-navy-500 mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Owner
                                  </label>
                                  <select
                                    value={action.owner}
                                    onChange={(e) =>
                                      updateAction(action.id, {
                                        owner: e.target.value as ActionItem['owner'],
                                      })
                                    }
                                    className="w-full p-2 text-sm border border-navy-200 rounded-lg"
                                  >
                                    {OWNER_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Add Action Button */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => addAction(scenario.id)}
                              className="flex-1 py-3 border-2 border-dashed border-navy-200 rounded-lg text-sm text-navy-600 hover:border-navy-300 hover:bg-navy-50 transition-colors flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Action Item
                            </button>
                            <button
                              onClick={() => generateAISuggestions(scenario)}
                              disabled={generatingFor === scenario.id}
                              className={cn(
                                'px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-700 transition-colors flex items-center gap-2',
                                generatingFor === scenario.id
                                  ? 'opacity-70 cursor-wait'
                                  : 'hover:bg-amber-100'
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  'w-4 h-4',
                                  generatingFor === scenario.id && 'animate-spin'
                                )}
                              />
                              {generatingFor === scenario.id
                                ? 'Generating...'
                                : 'Get AI Suggestions'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-8')}>
            ← Back
          </Button>
          <Button onClick={handleContinue}>
            Complete & Review
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Action Canvas Guide */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">✅ What Makes a Good Action?</div>
                <div className="text-xs opacity-80">Vague vs Specific comparison</div>
              </div>
              {showGuide ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Bad Example */}
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="text-xs font-bold text-red-700 mb-1">❌ VAGUE (Bad)</div>
                    <p className="text-xs text-red-600 italic">
                      "Prepare for AI regulation"
                    </p>
                  </div>

                  {/* Good Example */}
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs font-bold text-green-700 mb-1">✅ SPECIFIC (Good)</div>
                    <div className="text-xs text-green-700 space-y-1">
                      <p>
                        <strong>What:</strong> Conduct AI system audit across all products
                      </p>
                      <p>
                        <strong>Who:</strong> CTO + Legal Head jointly own
                      </p>
                      <p>
                        <strong>When:</strong> Complete by March 2025
                      </p>
                      <p>
                        <strong>Budget:</strong> ₹25L for external consultant
                      </p>
                      <p>
                        <strong>Output:</strong> Gap analysis report + remediation roadmap
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>Key principle:</strong> Actions should be TRIGGERED by scenario
                      signals, not executed blindly.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trigger-Based Planning */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setShowTriggers(!showTriggers)}
            className="w-full px-4 py-3 text-left border-b border-navy-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-navy-900">🎯 Define Your Triggers</div>
                <div className="text-xs text-navy-500">When to act on each action</div>
              </div>
              {showTriggers ? (
                <ChevronUp className="w-4 h-4 text-navy-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-navy-400" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showTriggers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <p className="text-xs text-navy-600">
                    Every action should have three types of signals:
                  </p>

                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="text-xs font-bold text-yellow-800 mb-1">
                      1. EARLY WARNING SIGNAL
                    </div>
                    <p className="text-xs text-yellow-700">
                      "What would tell us this scenario is becoming likely?"
                      <br />
                      <em>Example: "AI Bill gets Cabinet approval"</em>
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="text-xs font-bold text-orange-800 mb-1">
                      2. EXECUTION TRIGGER
                    </div>
                    <p className="text-xs text-orange-700">
                      "At what point do we actually act?"
                      <br />
                      <em>Example: "Bill introduced in Lok Sabha"</em>
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs font-bold text-gray-800 mb-1">3. ABORT SIGNAL</div>
                    <p className="text-xs text-gray-700">
                      "What would tell us to stop/pivot?"
                      <br />
                      <em>Example: "Industry body negotiates exemptions"</em>
                    </p>
                  </div>

                  <a
                    href={`https://chat.openai.com/?q=${encodeURIComponent(
                      'Explain the concept of "real options" in strategic planning. Cover: 1) What are real options and how do they differ from financial options, 2) How to define trigger-based actions in scenario planning, 3) The difference between early warning signals, execution triggers, and abort signals, 4) Examples of real options thinking in corporate strategy.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Learn about real options in strategic planning →
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Tip */}
        <div className="bg-navy-50 rounded-lg p-3 text-xs text-navy-600">
          <strong>Tip:</strong> Start with 2-3 high-impact actions per scenario. You can always
          add more later, but too many actions dilutes focus.
        </div>
      </div>
    </div>
  )
}
