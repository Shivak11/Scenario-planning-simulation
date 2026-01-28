'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PEST_LABELS, type Force, type PESTCategory } from '@/lib/types'
import { ArrowRight, X, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const CATEGORY_COLORS: Record<PESTCategory, string> = {
  P: 'bg-purple-100 text-purple-700 border-purple-200',
  E: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  S: 'bg-amber-100 text-amber-700 border-amber-200',
  T: 'bg-blue-100 text-blue-700 border-blue-200',
  En: 'bg-green-100 text-green-700 border-green-200',
  L: 'bg-rose-100 text-rose-700 border-rose-200',
}

// Visual Example for understanding orthogonality - Duolingo/Chegg style
const ORTHOGONALITY_EXAMPLE = {
  title: 'Why Orthogonality Matters',
  goodExample: {
    label: 'Good: Independent Axes',
    axis1: 'AI Regulation Strictness',
    axis1Category: 'Political',
    axis2: 'Consumer AI Adoption',
    axis2Category: 'Social',
    explanation: 'Government policy and consumer behavior can move independently. Strict regulation doesn\'t automatically mean low adoption (see: EU with high GDPR + high tech adoption).',
    outcome: '4 genuinely different futures',
    color: 'emerald',
  },
  badExample: {
    label: 'Bad: Correlated Axes',
    axis1: 'Tech Lobbying Power',
    axis1Category: 'Political',
    axis2: 'Tech-Friendly Regulation',
    axis2Category: 'Political',
    explanation: 'If tech lobbying is strong, regulation will likely be favorable. These move together, not independently.',
    outcome: 'Really just 2 futures disguised as 4',
    color: 'red',
  },
}

// Deep learning content for scenario construction
const SCENARIO_DEEP_LEARNING = [
  {
    id: 'orthogonality',
    title: 'The Orthogonality Test',
    subtitle: 'Ensuring your axes create distinct futures',
    content: [
      'Ask: "If Axis A goes HIGH, does it push Axis B in a particular direction?"',
      'If yes → axes are correlated → pick different forces',
      'If no → axes are orthogonal → good choice!',
    ],
    chatGptPrompt: `I'm building a 2x2 scenario matrix. Help me understand orthogonality:

1. What does it mean for two scenario axes to be "orthogonal"?
2. How do I test if my chosen axes are independent or correlated?
3. Give me examples of commonly-used correlated axis pairs that seem orthogonal but aren't
4. What happens to scenario quality when axes are correlated?
5. How do I find genuinely independent axes in my industry?

Make this practical with real business examples.`,
  },
  {
    id: 'whyfour',
    title: 'Why Four Scenarios?',
    subtitle: 'The power of the 2x2 matrix',
    content: [
      'Three scenarios become "good / bad / middle" - the middle absorbs all attention',
      'Five+ scenarios become unmanageable - can\'t hold them in mind',
      'Four forces you to consider uncomfortable combinations',
    ],
    chatGptPrompt: `Explain the 2x2 scenario matrix methodology:

1. Why do scenario planners prefer 4 scenarios over 3 or 5?
2. What is the psychological advantage of 4 distinct quadrants?
3. How do Shell, military strategists, and governments use 2x2 scenarios?
4. What are the limitations of the 2x2 approach?
5. When might you need more than 4 scenarios?

Include examples from famous scenario planning exercises.`,
  },
  {
    id: 'selection',
    title: 'Selecting Your Two Forces',
    subtitle: 'Criteria for axis selection',
    content: [
      'Both must be HIGH IMPACT - would change your strategic options',
      'Both must be HIGH UNCERTAINTY - could genuinely go either way',
      'They should be from DIFFERENT categories if possible',
    ],
    chatGptPrompt: `Help me select the best two forces for my scenario axes:

1. What criteria should I use to select forces for scenario axes?
2. How do I prioritize between multiple high-impact, high-uncertainty forces?
3. Should I always pick forces from different PEST categories?
4. What if my most important forces are from the same category?
5. How do experienced scenario planners narrow down to just two forces?

Give me a practical decision framework.`,
  },
]

export default function Phase3Page() {
  const router = useRouter()
  const [expandedLearning, setExpandedLearning] = useState<string | null>(null)
  const [showFullExample, setShowFullExample] = useState(false)

  const {
    forces,
    selectedForces,
    xAxis,
    yAxis,
    selectForce,
    deselectForce,
    setXAxis,
    setYAxis,
    setPhase,
    completePhase,
  } = useSimulationStore()

  useEffect(() => {
    setPhase(3)
  }, [setPhase])

  // Get high impact + high uncertainty forces
  const criticalForces = useMemo(
    () => forces.filter((f) => f.impact >= 3 && f.uncertainty >= 3)
      .sort((a, b) => (b.impact + b.uncertainty) - (a.impact + a.uncertainty)),
    [forces]
  )

  // Calculate orthogonality (simple heuristic: different categories = more orthogonal)
  const orthogonality = useMemo(() => {
    if (!xAxis || !yAxis) return 0

    // Base orthogonality on category difference
    let score = xAxis.category !== yAxis.category ? 60 : 30

    // Adjust based on impact/uncertainty similarity (more different = better)
    const impactDiff = Math.abs(xAxis.impact - yAxis.impact)
    const uncertDiff = Math.abs(xAxis.uncertainty - yAxis.uncertainty)
    score += impactDiff * 5 + uncertDiff * 5

    return Math.min(100, score)
  }, [xAxis, yAxis])

  const handleForceClick = (force: Force) => {
    const isSelected = selectedForces.some((f) => f.id === force.id)
    if (isSelected) {
      deselectForce(force.id)
    } else {
      selectForce(force)
    }
  }

  const handleSetAxis = (axis: 'x' | 'y', force: Force) => {
    // Ensure force is in selected forces
    if (!selectedForces.some((f) => f.id === force.id)) {
      selectForce(force)
    }

    // Clear from other axis if needed
    if (axis === 'x' && yAxis?.id === force.id) {
      setYAxis(null)
    } else if (axis === 'y' && xAxis?.id === force.id) {
      setXAxis(null)
    }

    if (axis === 'x') {
      setXAxis(force)
    } else {
      setYAxis(force)
    }
  }

  const handleContinue = () => {
    if (xAxis && yAxis) {
      completePhase(3)
      setPhase(4)
      router.push('/simulation/phase-4')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-50 to-indigo-50 rounded-xl p-4 border border-navy-200">
          <h2 className="font-semibold text-navy-900 mb-1">Select Your Scenario Axes</h2>
          <p className="text-sm text-navy-600">
            Choose two forces that are <strong>both high impact AND high uncertainty</strong>.
            These will form the X and Y axes of your 2×2 scenario matrix.
          </p>
        </div>

        {/* Axis Selection Panel */}
        <div className="grid grid-cols-2 gap-4">
          {/* X-Axis */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-4 transition-colors',
              xAxis ? 'border-blue-300 bg-blue-50' : 'border-navy-200 bg-navy-50'
            )}
          >
            <div className="text-xs font-medium text-blue-600 mb-2">X-AXIS (Horizontal)</div>
            {xAxis ? (
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full mr-2', CATEGORY_COLORS[xAxis.category])}>
                    {PEST_LABELS[xAxis.category]}
                  </span>
                  <span className="font-medium text-navy-900 text-sm">{xAxis.name}</span>
                </div>
                <button
                  onClick={() => setXAxis(null)}
                  className="p-1 hover:bg-blue-100 rounded flex-shrink-0"
                >
                  <X className="w-4 h-4 text-navy-400" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-navy-400">Click a force below, then "Set as X-Axis"</p>
            )}
          </div>

          {/* Y-Axis */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-4 transition-colors',
              yAxis ? 'border-green-300 bg-green-50' : 'border-navy-200 bg-navy-50'
            )}
          >
            <div className="text-xs font-medium text-green-600 mb-2">Y-AXIS (Vertical)</div>
            {yAxis ? (
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full mr-2', CATEGORY_COLORS[yAxis.category])}>
                    {PEST_LABELS[yAxis.category]}
                  </span>
                  <span className="font-medium text-navy-900 text-sm">{yAxis.name}</span>
                </div>
                <button
                  onClick={() => setYAxis(null)}
                  className="p-1 hover:bg-green-100 rounded flex-shrink-0"
                >
                  <X className="w-4 h-4 text-navy-400" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-navy-400">Click a force below, then "Set as Y-Axis"</p>
            )}
          </div>
        </div>

        {/* Orthogonality Check - only show when both axes selected */}
        {xAxis && yAxis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-navy-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-900">Orthogonality Check</span>
              <span className={cn(
                'text-sm font-bold px-2 py-0.5 rounded-full',
                orthogonality >= 70 ? 'bg-emerald-100 text-emerald-700' :
                orthogonality >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              )}>
                {orthogonality}%
              </span>
            </div>
            <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${orthogonality}%` }}
                className={cn(
                  'h-full rounded-full',
                  orthogonality >= 70 ? 'bg-emerald-500' : orthogonality >= 40 ? 'bg-amber-500' : 'bg-red-500'
                )}
              />
            </div>
            <p className="text-xs text-navy-500 mt-2">
              {orthogonality >= 70
                ? '✓ Excellent! These forces can move independently, creating four genuinely different futures.'
                : orthogonality >= 40
                ? '⚠ Moderate. Check if these forces tend to move together or can vary independently.'
                : '✗ These forces may be too correlated. Consider selecting from different PEST categories.'}
            </p>
          </motion.div>
        )}

        {/* Available Forces */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-navy-900">
              High Impact + High Uncertainty Forces ({criticalForces.length})
            </h3>
          </div>

          {criticalForces.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-navy-200">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 text-navy-300" />
              <p className="text-navy-600">No forces rated 3+ on both Impact and Uncertainty.</p>
              <p className="text-sm text-navy-500">Go back and adjust your ratings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {criticalForces.map((force) => {
                const isSelected = selectedForces.some((f) => f.id === force.id)
                const isXAxis = xAxis?.id === force.id
                const isYAxis = yAxis?.id === force.id

                return (
                  <motion.div
                    key={force.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card
                      className={cn(
                        'cursor-pointer transition-all',
                        isSelected && !isXAxis && !isYAxis && 'ring-2 ring-navy-400',
                        isXAxis && 'ring-2 ring-blue-500 bg-blue-50/50',
                        isYAxis && 'ring-2 ring-green-500 bg-green-50/50'
                      )}
                      onClick={() => handleForceClick(force)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={cn(
                                  'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
                                  CATEGORY_COLORS[force.category]
                                )}
                              >
                                {PEST_LABELS[force.category]}
                              </span>
                              {(isXAxis || isYAxis) && (
                                <span
                                  className={cn(
                                    'text-xs font-bold px-2 py-0.5 rounded-full',
                                    isXAxis ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                                  )}
                                >
                                  {isXAxis ? 'X-Axis' : 'Y-Axis'}
                                </span>
                              )}
                            </div>
                            <h4 className="font-medium text-navy-900 text-sm">
                              {force.name}
                            </h4>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-navy-500">
                              Impact: <span className="font-semibold">{force.impact}</span>
                            </div>
                            <div className="text-xs text-navy-500">
                              Uncertainty: <span className="font-semibold">{force.uncertainty}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick axis assignment buttons - show on click */}
                        {isSelected && !isXAxis && !isYAxis && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex gap-2 mt-3 pt-2 border-t border-navy-100"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetAxis('x', force)
                              }}
                              disabled={!!xAxis}
                              className={cn(
                                'flex-1 text-xs py-1.5 rounded font-medium transition-colors',
                                xAxis
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              )}
                            >
                              {xAxis ? 'X-Axis Set' : 'Set as X-Axis'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetAxis('y', force)
                              }}
                              disabled={!!yAxis}
                              className={cn(
                                'flex-1 text-xs py-1.5 rounded font-medium transition-colors',
                                yAxis
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              )}
                            >
                              {yAxis ? 'Y-Axis Set' : 'Set as Y-Axis'}
                            </button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-2')}>
            ← Back to Environmental Scanning
          </Button>
          <Button onClick={handleContinue} disabled={!xAxis || !yAxis}>
            Continue to Scenario Building
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Right Column - Learning Sidebar */}
      <div className="lg:col-span-1 space-y-5">
        {/* Visual Example - Orthogonality */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-white">
            <div className="font-semibold">{ORTHOGONALITY_EXAMPLE.title}</div>
            <div className="text-xs opacity-80">Learn through comparison</div>
          </div>

          {/* Good Example */}
          <div className="p-4 border-b border-navy-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✓ {ORTHOGONALITY_EXAMPLE.goodExample.label}
              </span>
            </div>
            <div className="space-y-2 mb-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">X</span>
                <span className="text-navy-700">{ORTHOGONALITY_EXAMPLE.goodExample.axis1}</span>
                <span className="text-navy-400">({ORTHOGONALITY_EXAMPLE.goodExample.axis1Category})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Y</span>
                <span className="text-navy-700">{ORTHOGONALITY_EXAMPLE.goodExample.axis2}</span>
                <span className="text-navy-400">({ORTHOGONALITY_EXAMPLE.goodExample.axis2Category})</span>
              </div>
            </div>
            <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded">
              {ORTHOGONALITY_EXAMPLE.goodExample.explanation}
            </p>
            <div className="text-xs font-semibold text-emerald-600 mt-2">
              → {ORTHOGONALITY_EXAMPLE.goodExample.outcome}
            </div>
          </div>

          {/* Bad Example */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                ✗ {ORTHOGONALITY_EXAMPLE.badExample.label}
              </span>
            </div>
            <div className="space-y-2 mb-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">X</span>
                <span className="text-navy-700">{ORTHOGONALITY_EXAMPLE.badExample.axis1}</span>
                <span className="text-navy-400">({ORTHOGONALITY_EXAMPLE.badExample.axis1Category})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Y</span>
                <span className="text-navy-700">{ORTHOGONALITY_EXAMPLE.badExample.axis2}</span>
                <span className="text-navy-400">({ORTHOGONALITY_EXAMPLE.badExample.axis2Category})</span>
              </div>
            </div>
            <p className="text-xs text-red-700 bg-red-50 p-2 rounded">
              {ORTHOGONALITY_EXAMPLE.badExample.explanation}
            </p>
            <div className="text-xs font-semibold text-red-600 mt-2">
              → {ORTHOGONALITY_EXAMPLE.badExample.outcome}
            </div>
          </div>
        </div>

        {/* Deep Learning - Collapsible Sections */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="p-4 border-b border-navy-100">
            <h4 className="font-medium text-navy-900">Scenario Axes Deep Dive</h4>
            <p className="text-xs text-navy-500 mt-1">
              Click to learn more, explore deeply on ChatGPT
            </p>
          </div>

          <div className="divide-y divide-navy-100">
            {SCENARIO_DEEP_LEARNING.map((item) => {
              const isExpanded = expandedLearning === item.id

              return (
                <div key={item.id}>
                  <button
                    onClick={() => setExpandedLearning(isExpanded ? null : item.id)}
                    className={cn(
                      'w-full p-3 text-left transition-colors',
                      isExpanded ? 'bg-indigo-50' : 'hover:bg-navy-50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-navy-900 text-sm">{item.title}</div>
                        <div className="text-xs text-navy-500">{item.subtitle}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-navy-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-navy-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 bg-indigo-50">
                          <ul className="text-xs text-navy-600 space-y-1 mb-3">
                            {item.content.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={`https://chat.openai.com/?q=${encodeURIComponent(item.chatGptPrompt)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Explore deeply on ChatGPT →
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-navy-50 rounded-lg p-3 text-xs text-navy-600">
          <strong>Tip:</strong> Click any force card to select it, then use the buttons to assign it as X or Y axis.
        </div>
      </div>
    </div>
  )
}
