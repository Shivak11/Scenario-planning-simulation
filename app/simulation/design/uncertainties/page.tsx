'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PEST_LABELS, type PESTCategory, type Force } from '@/lib/types'
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Home,
} from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'

// Rating label mappings
const IMPACT_LABELS: Record<number, string> = {
  0: 'Not Rated',
  1: 'Minimal',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Critical',
}

const UNCERTAINTY_LABELS: Record<number, string> = {
  0: 'Not Rated',
  1: 'Predictable',
  2: 'Likely',
  3: 'Uncertain',
  4: 'Volatile',
  5: 'Wild Card',
}

const CATEGORY_COLORS: Record<PESTCategory, string> = {
  P: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  E: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  S: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  T: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  En: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  L: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
}

export default function UncertaintiesPage() {
  const router = useRouter()
  const [showHomeConfirm, setShowHomeConfirm] = useState(false)
  const [selectedForceId, setSelectedForceId] = useState<string | null>(null)

  const {
    forces,
    xAxis,
    yAxis,
    selectedForces,
    setXAxis,
    setYAxis,
    selectForce,
    deselectForce,
    setCurrentStep,
  } = useSimulationStore()

  useEffect(() => {
    setCurrentStep('uncertainties')
  }, [setCurrentStep])

  // Filter forces to only show "critical uncertainties" (rated AND high impact + high uncertainty)
  const criticalForces = useMemo(
    () =>
      forces
        .filter((f) => f.impact > 0 && f.uncertainty > 0 && f.impact >= 3 && f.uncertainty >= 3)
        .sort((a, b) => b.impact + b.uncertainty - (a.impact + a.uncertainty)),
    [forces]
  )

  // Calculate orthogonality score
  const orthogonality = useMemo(() => {
    if (!xAxis || !yAxis) return 0
    let score = xAxis.category !== yAxis.category ? 60 : 30
    const impactDiff = Math.abs(xAxis.impact - yAxis.impact)
    const uncertDiff = Math.abs(xAxis.uncertainty - yAxis.uncertainty)
    score += impactDiff * 5 + uncertDiff * 5
    return Math.min(100, score)
  }, [xAxis, yAxis])

  const handleForceClick = (force: Force) => {
    // Toggle selection state
    if (selectedForceId === force.id) {
      setSelectedForceId(null)
    } else {
      setSelectedForceId(force.id)
    }
  }

  const handleSetAxis = (axis: 'x' | 'y', force: Force) => {
    // Auto-add to selected forces if not there
    if (!selectedForces.some((f) => f.id === force.id)) {
      selectForce(force)
    }

    // If already assigned to the other axis, clear it
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

    // Clear selection state after assigning
    setSelectedForceId(null)
  }

  const handleContinue = () => {
    if (xAxis && yAxis) {
      setCurrentStep('axes')
      router.push('/simulation/design/axes')
    }
  }

  const handleGoHome = () => {
    setShowHomeConfirm(true)
  }

  const confirmGoHome = () => {
    router.push('/')
  }

  // Home confirmation modal
  const HomeConfirmModal = () => (
    <AnimatePresence>
      {showHomeConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowHomeConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm mx-4 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Leave simulation?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Going home will reset all your progress. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHomeConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmGoHome}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Leave
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div>
      <HomeConfirmModal />

      {/* Progress bar + Navigation - Design phase layout */}
      <div className="flex items-center gap-4 mb-4">
        {/* Design phase progress: uncertainties is step 2 of 4 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 2 ? 'bg-gold-500' : i === 2 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">2/4</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push('/simulation/design/forces')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!xAxis || !yAxis}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              xAxis && yAxis
                ? 'text-slate-900 bg-gold-500 hover:bg-gold-400'
                : 'text-slate-500 bg-slate-700 cursor-not-allowed'
            )}
          >
            Define Axes
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Explanation Header */}
          <div className="bg-gradient-to-r from-gold-500/10 to-slate-800/50 rounded-xl p-4 border border-gold-500/30">
            <h2 className="font-semibold text-white mb-1">Select Your Scenario Axes</h2>
            <p className="text-sm text-slate-300">
              Below are forces rated <strong className="text-gold-400">high on both impact AND uncertainty</strong>—your{' '}
              <em>critical uncertainties</em>. Choose two that can move independently to form your scenario matrix.
            </p>
          </div>

          {/* Axis Selection Panel */}
          <div className="grid grid-cols-2 gap-4">
            {/* X-Axis */}
            <div
              className={cn(
                'border-2 border-dashed rounded-xl p-4 transition-colors',
                xAxis ? 'border-gold-500/50 bg-gold-500/10' : 'border-slate-600 bg-slate-800'
              )}
            >
              <div className="text-xs font-medium text-gold-400 mb-2">X-AXIS (Horizontal)</div>
              {xAxis ? (
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full mr-2', CATEGORY_COLORS[xAxis.category])}>
                      {PEST_LABELS[xAxis.category]}
                    </span>
                    <span className="font-medium text-white text-sm">{xAxis.name}</span>
                  </div>
                  <button
                    onClick={() => setXAxis(null)}
                    className="p-1 hover:bg-gold-500/20 rounded flex-shrink-0 text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Click a force below, then "Set as X-Axis"</p>
              )}
            </div>

            {/* Y-Axis */}
            <div
              className={cn(
                'border-2 border-dashed rounded-xl p-4 transition-colors',
                yAxis ? 'border-gold-500/50 bg-gold-500/10' : 'border-slate-600 bg-slate-800'
              )}
            >
              <div className="text-xs font-medium text-gold-400 mb-2">Y-AXIS (Vertical)</div>
              {yAxis ? (
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full mr-2', CATEGORY_COLORS[yAxis.category])}>
                      {PEST_LABELS[yAxis.category]}
                    </span>
                    <span className="font-medium text-white text-sm">{yAxis.name}</span>
                  </div>
                  <button
                    onClick={() => setYAxis(null)}
                    className="p-1 hover:bg-gold-500/20 rounded flex-shrink-0 text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Click a force below, then "Set as Y-Axis"</p>
              )}
            </div>
          </div>

          {/* Orthogonality Check */}
          {xAxis && yAxis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Orthogonality Check</span>
                <span
                  className={cn(
                    'text-sm font-bold px-2 py-0.5 rounded-full',
                    orthogonality >= 70
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : orthogonality >= 40
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                  )}
                >
                  {orthogonality}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${orthogonality}%` }}
                  className={cn(
                    'h-full rounded-full',
                    orthogonality >= 70 ? 'bg-emerald-500' : orthogonality >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  )}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {orthogonality >= 70
                  ? 'Excellent! These forces can move independently, creating four genuinely different futures.'
                  : orthogonality >= 40
                    ? 'Moderate. Check if these forces tend to move together or can vary independently.'
                    : 'These forces may be too correlated. Consider selecting from different PEST categories.'}
              </p>
            </motion.div>
          )}

          {/* Available Critical Uncertainties */}
          <div className="space-y-3">
            <h3 className="font-medium text-white">
              Critical Uncertainties ({criticalForces.length})
            </h3>

            {criticalForces.length === 0 ? (
              <div className="text-center py-10 bg-slate-800 rounded-xl border border-slate-700">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                <p className="text-slate-400">No forces rated 3+ on both Impact and Uncertainty.</p>
                <p className="text-sm text-slate-500 mt-1">Go back to Forces and adjust your ratings.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/simulation/design/forces')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forces
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {criticalForces.map((force) => {
                  const isXAxis = xAxis?.id === force.id
                  const isYAxis = yAxis?.id === force.id
                  const isSelected = selectedForceId === force.id

                  return (
                    <motion.div
                      key={force.id}
                      layout
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        'cursor-pointer rounded-xl border-2 p-3 transition-all',
                        isXAxis && 'ring-2 ring-gold-500 bg-gold-500/10 border-gold-500/50',
                        isYAxis && 'ring-2 ring-gold-500 bg-gold-500/10 border-gold-500/50',
                        isSelected && !isXAxis && !isYAxis && 'ring-2 ring-gold-400 border-gold-400/50',
                        !isSelected && !isXAxis && !isYAxis && 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      )}
                      onClick={() => handleForceClick(force)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={cn(
                                'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
                                CATEGORY_COLORS[force.category]
                              )}
                            >
                              {PEST_LABELS[force.category]}
                            </span>
                            {(isXAxis || isYAxis) && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gold-500 text-slate-900">
                                {isXAxis ? 'X-Axis' : 'Y-Axis'}
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-white text-sm">{force.name}</h4>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-slate-400">
                            Impact: <span className="font-semibold text-slate-300">{IMPACT_LABELS[force.impact]}</span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Uncertainty:{' '}
                            <span className="font-semibold text-slate-300">{UNCERTAINTY_LABELS[force.uncertainty]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Show axis assignment buttons when selected (and not already assigned) */}
                      {isSelected && !isXAxis && !isYAxis && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex gap-2 mt-3 pt-2 border-t border-slate-700"
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
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
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
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                            )}
                          >
                            {yAxis ? 'Y-Axis Set' : 'Set as Y-Axis'}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Learning Sidebar - Tabbed */}
        <div className="lg:col-span-1">
          <LearningSidebar
            defaultTab="guide"
            tabs={[
              {
                id: 'guide',
                label: 'Guide',
                icon: BookOpen,
                content: (
                  <div>
                    <h4 className="font-medium text-white mb-3">Why Two Uncertainties?</h4>
                    <p className="text-sm text-slate-400 mb-3">
                      The 2×2 matrix is the "sweet spot" for scenario planning:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li>• <strong className="text-slate-300">3 scenarios</strong> become "good/bad/middle"</li>
                      <li>• <strong className="text-slate-300">5+ scenarios</strong> become unmanageable</li>
                      <li>• <strong className="text-slate-300">4 scenarios</strong> force uncomfortable combinations</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: 'example',
                label: 'Example',
                icon: Building,
                content: (
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">What is Orthogonality?</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      Ask: "If Axis A goes HIGH, does it push Axis B in a particular direction?"
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-gold-500/10 border border-gold-500/30 rounded-lg">
                        <span className="text-gold-400 font-medium">If No:</span>
                        <span className="text-gold-400/80 ml-1">Great! Your axes are orthogonal.</span>
                      </div>
                      <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <span className="text-amber-400 font-medium">If Yes:</span>
                        <span className="text-amber-400/80 ml-1">They're correlated—pick different forces.</span>
                      </div>
                    </div>
                    <a
                      href="https://chat.openai.com/?q=Explain%20the%202x2%20scenario%20matrix%20methodology.%20Why%20do%20scenario%20planners%20use%20exactly%204%20scenarios%3F%20What%20does%20orthogonality%20mean%20and%20why%20does%20it%20matter%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Learn more about 2×2 matrices
                    </a>
                  </div>
                ),
              },
              {
                id: 'tips',
                label: 'Tips',
                icon: Lightbulb,
                content: (
                  <div>
                    <h4 className="font-medium text-gold-400 mb-3">Selection Tips</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li>• Click any force to select it, then assign it to X or Y axis</li>
                      <li>• Choose forces from different PEST categories for better orthogonality</li>
                      <li>• The orthogonality score helps you pick independent forces</li>
                      <li>• You can clear an axis and reassign a different force</li>
                    </ul>
                  </div>
                ),
              },
            ] as LearningTab[]}
          />
        </div>
      </div>
    </div>
  )
}
