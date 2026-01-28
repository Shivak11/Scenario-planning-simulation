'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '@/lib/store'
import { FlippableForceCard } from '@/components/simulation/FlippableForceCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PEST_LABELS, type PESTCategory } from '@/lib/types'
import {
  ArrowRight,
  Loader2,
  Plus,
  Sparkles,
  ExternalLink,
  Home,
} from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { DIFFERENTIAL_IMPACT_PROMPT } from '@/lib/prompts'

type FilterCategory = PESTCategory

export default function ForcesPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterCategory>('P')
  const [showAddForce, setShowAddForce] = useState(false)
  const [newForceName, setNewForceName] = useState('')
  const [newForceDesc, setNewForceDesc] = useState('')
  const [newForceCategory, setNewForceCategory] = useState<PESTCategory>('T')
  const [error, setError] = useState<string | null>(null)
  const [showHomeConfirm, setShowHomeConfirm] = useState(false)

  const {
    industry,
    organizationType,
    modifiers,
    focalIssue,
    strategicQuestion,
    forces,
    isGeneratingForces,
    setForces,
    updateForceRating,
    addCustomForce,
    setIsGeneratingForces,
    setCurrentStep,
  } = useSimulationStore()

  useEffect(() => {
    setCurrentStep('forces')
  }, [setCurrentStep])

  // Auto-generate forces after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (forces.length === 0 && !isGeneratingForces && (strategicQuestion || focalIssue)) {
        generateForces()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [strategicQuestion, focalIssue])

  const generateForces = async () => {
    setIsGeneratingForces(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-forces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          organizationType,
          modifiers,
          strategicQuestion: strategicQuestion || focalIssue,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.forces && data.forces.length > 0) {
          setForces(data.forces)
        } else {
          setError('No forces generated. Please try again.')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Failed to generate forces. Please try again.')
      }
    } catch (err) {
      console.error('Error generating forces:', err)
      setError('Network error. Please check your connection and try again.')
    }

    setIsGeneratingForces(false)
  }

  const handleAddCustomForce = () => {
    if (newForceName.trim() && newForceDesc.trim()) {
      addCustomForce({
        name: newForceName.trim(),
        description: newForceDesc.trim(),
        category: newForceCategory,
        impact: 0,
        uncertainty: 0,
      })
      setNewForceName('')
      setNewForceDesc('')
      setShowAddForce(false)
    }
  }

  const handleContinue = () => {
    setCurrentStep('uncertainties')
    router.push('/simulation/design/uncertainties')
  }

  const filteredForces = forces.filter((f) => f.category === filter)

  // Count forces that qualify as "critical uncertainties" (rated AND high impact + high uncertainty)
  const criticalForcesCount = forces.filter(
    (f) => f.impact > 0 && f.uncertainty > 0 && f.impact >= 3 && f.uncertainty >= 3
  ).length

  // Count how many forces have been rated
  const ratedForcesCount = forces.filter(
    (f) => f.impact > 0 && f.uncertainty > 0
  ).length

  const CATEGORY_COLORS: Record<PESTCategory, string> = {
    P: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    E: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    S: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    T: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    En: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    L: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
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

  // Progress bar component for Design phase (4 steps: forces, uncertainties, axes, matrix)
  const DesignProgressBar = ({ current, total }: { current: number; total: number }) => (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 w-6 rounded-full transition-colors',
              i < current ? 'bg-gold-500' : i === current ? 'bg-gold-400' : 'bg-slate-600'
            )}
          />
        ))}
      </div>
      <span className="text-[10px] text-slate-500">
        {current}/{total}
      </span>
    </div>
  )

  // Design phase step: forces is step 1 of 4
  const designPhaseStep = 1
  const designPhaseTotal = 4

  return (
    <div>
      <HomeConfirmModal />
      {/* Progress bar + Navigation - Design phase layout */}
      <div className="flex items-center gap-4 mb-4">
        <DesignProgressBar current={designPhaseStep} total={designPhaseTotal} />

        {/* Nav buttons - NO back button (first step of Design phase) */}
        <div className="flex items-center gap-2 ml-auto">
          {forces.length > 0 && !isGeneratingForces && (
            <button
              onClick={handleContinue}
              disabled={criticalForcesCount < 2}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                criticalForcesCount >= 2
                  ? 'text-slate-900 bg-gold-500 hover:bg-gold-400'
                  : 'text-slate-500 bg-slate-700 cursor-not-allowed'
              )}
            >
              Select Uncertainties
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
      </div>

      {/* Rating progress info */}
      {forces.length > 0 && (
        <p className="text-sm text-slate-400 mb-4">
          {ratedForcesCount < forces.length ? (
            <>Rate all forces to identify critical uncertainties. <span className="text-gold-400 font-medium">{ratedForcesCount}/{forces.length}</span> rated.</>
          ) : criticalForcesCount > 0 ? (
            <><span className="text-gold-400 font-medium">{criticalForcesCount}</span> critical uncertainties identified (high impact + high uncertainty).</>
          ) : (
            <>All forces rated. Adjust ratings to identify critical uncertainties (impact ≥3 AND uncertainty ≥3).</>
          )}
        </p>
      )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Focal Issue Reference */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                Your Focal Issue
              </div>
              <p className="text-slate-200 font-medium">
                {focalIssue || strategicQuestion || 'Not defined'}
              </p>
            </div>

          {/* Loading State */}
          {isGeneratingForces && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
              <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
              <p className="text-slate-200 font-medium">Scanning the environment...</p>
              <p className="text-slate-400 text-sm">Generating PESTEL forces with AI</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isGeneratingForces && forces.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-800 rounded-xl border-2 border-dashed border-slate-700">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-white mb-2">Ready to Scan the Environment</h3>
              <p className="text-slate-400 text-center max-w-md mb-6">
                Click below to generate AI-powered driving forces across Political, Economic, Social, and Technological dimensions.
              </p>
              <Button onClick={generateForces} size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate PEST Forces
              </Button>
            </div>
          )}

          {/* Forces Grid */}
          {!isGeneratingForces && forces.length > 0 && (
            <>
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {(['P', 'E', 'S', 'T'] as PESTCategory[]).map((cat) => {
                  const count = forces.filter((f) => f.category === cat).length
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        filter === cat
                          ? 'bg-gold-500 text-slate-900'
                          : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                      )}
                    >
                      {PEST_LABELS[cat]} ({count})
                    </button>
                  )
                })}
              </div>

              {/* Forces Grid */}
              <motion.div layout className="grid gap-5 grid-cols-1 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredForces.map((force) => (
                    <motion.div
                      key={force.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <FlippableForceCard
                        force={force}
                        onImpactChange={(value) => updateForceRating(force.id, 'impact', value)}
                        onUncertaintyChange={(value) => updateForceRating(force.id, 'uncertainty', value)}
                        industry={industry}
                        focalIssue={focalIssue || strategicQuestion}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Add Custom Force */}
              <div className="pt-4">
                {!showAddForce ? (
                  <Button variant="outline" onClick={() => setShowAddForce(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Force
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-4"
                  >
                    <h4 className="font-medium text-white">Add Custom Force</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Name</label>
                        <input
                          type="text"
                          value={newForceName}
                          onChange={(e) => setNewForceName(e.target.value)}
                          placeholder="e.g., Labor Union Resurgence"
                          className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Category</label>
                        <select
                          value={newForceCategory}
                          onChange={(e) => setNewForceCategory(e.target.value as PESTCategory)}
                          className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                        >
                          <option value="P">Political</option>
                          <option value="E">Economic</option>
                          <option value="S">Social</option>
                          <option value="T">Technological</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">Description</label>
                      <textarea
                        value={newForceDesc}
                        onChange={(e) => setNewForceDesc(e.target.value)}
                        placeholder="Describe the force and why it matters..."
                        className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-500"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddCustomForce}
                        disabled={!newForceName.trim() || !newForceDesc.trim()}
                      >
                        Add Force
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowAddForce(false)}>
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Sidebar - Tabbed Learning Content */}
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
                    <h4 className="font-medium text-white mb-3">How to Rate Forces</h4>
                    <p className="text-sm text-slate-400 mb-3">
                      Rate each force on two dimensions: <span className="text-gold-400">Impact</span> (how much it affects your business) and <span className="text-gold-400">Uncertainty</span> (how unpredictable its trajectory is).
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Impact = </span>
                        <span className="text-slate-400">"What if this happens?"</span>
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Uncertainty = </span>
                        <span className="text-slate-400">"Can we predict this?"</span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'example',
                label: 'Example',
                icon: Building,
                content: (
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Rating "AI Disruption"</h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">Chegg (EdTech)</span>
                          <span className="text-gold-400 font-semibold">Critical Impact</span>
                        </div>
                        <div className="text-slate-500">Stock crashed 48% when ChatGPT disrupted homework help</div>
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">Amul (Dairy)</span>
                          <span className="text-slate-500 font-semibold">Low Impact</span>
                        </div>
                        <div className="text-slate-500">Milk demand unchanged; AI only optimizes logistics</div>
                      </div>
                    </div>
                    <a
                      href={`https://chat.openai.com/?q=${encodeURIComponent(DIFFERENTIAL_IMPACT_PROMPT)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      See more differential impact examples
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
                    <h4 className="font-medium text-gold-400 mb-3">Rating Tips</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li>• Forces with high impact AND high uncertainty become "critical uncertainties"</li>
                      <li>• You need at least 2 critical uncertainties to continue</li>
                      <li>• Click any card to flip and see AI-generated details</li>
                      <li>• Add custom forces if something important is missing</li>
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
