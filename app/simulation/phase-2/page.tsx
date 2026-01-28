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
  Target,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'

type FilterCategory = 'all' | PESTCategory

// Visual example for rating guide - similar to Duolingo/Chegg pattern
const RATING_EXAMPLE = {
  force: 'Generative AI Disruption',
  impactExample: {
    highImpact: {
      company: 'Chegg (EdTech)',
      outcome: 'Stock crashed 48% in one day when ChatGPT disrupted their core homework help business',
      rating: 5,
    },
    lowImpact: {
      company: 'Amul (Dairy)',
      outcome: 'AI might optimize supply chain, but milk demand and cooperative model remain unchanged',
      rating: 2,
    },
  },
  uncertaintyExample: {
    highUncertainty: {
      question: 'Will AI replace knowledge workers?',
      reason: 'Experts disagree wildly - some say 50% job loss, others say net job creation',
      rating: 5,
    },
    lowUncertainty: {
      question: 'Will AI adoption grow?',
      reason: 'Clear trajectory - every major company investing, regulatory consensus forming',
      rating: 1,
    },
  },
}

// PEST Deep Learning - overview + ChatGPT exploration for each category
interface PESTLearningItem {
  id: PESTCategory
  icon: string
  title: string
  subtitle: string
  bullets: string[]
  chatGptPrompt: string
}

const getPESTDeepLearning = (industry: string | null): PESTLearningItem[] => [
  {
    id: 'P',
    icon: '🏛️',
    title: 'Political Forces',
    subtitle: 'Government, regulation, policy landscape',
    bullets: ['Policy changes & regulatory shifts', 'Election cycles & government priorities', 'Trade policies & taxation'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand POLITICAL forces I should consider:

1. FEDERAL vs STATE DYNAMICS
   - How do central vs state government policies differ for ${industry || 'my industry'}?
   - Which states are more business-friendly for this sector?
   - How does coalition politics create regulatory uncertainty?

2. POLICY & REGULATORY LANDSCAPE
   - What are the key regulations governing ${industry || 'this industry'} in India?
   - What policy changes are being discussed that could impact us?
   - How do bodies like SEBI, RBI, TRAI, CCI affect this industry?

3. GOVERNMENT PRIORITIES & SPENDING
   - What are the current government's priorities (Make in India, Digital India, etc.)?
   - Where is government spending increasing/decreasing?
   - What PLI schemes or incentives exist for ${industry || 'this sector'}?

4. POLITICAL RISK FACTORS
   - How do election cycles (state/central) affect policy continuity?
   - What geopolitical factors (China relations, US ties) matter?
   - How does public sentiment affect regulation?

5. FOR MY SCENARIO PLANNING
   - Which political factors have the MOST UNCERTAIN direction?
   - Which would have HIGHEST IMPACT if they change?
   - What signals should I watch?

Make this practical and specific to ${industry || 'my industry'} in India.`,
  },
  {
    id: 'E',
    icon: '💰',
    title: 'Economic Forces',
    subtitle: 'Macro indicators, capital, consumption',
    bullets: ['Interest rates, inflation, currency', 'Consumer spending & industry cycles', 'Capital availability & investment trends'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand ECONOMIC forces I should consider:

1. MACROECONOMIC INDICATORS
   - How do RBI's interest rate decisions affect ${industry || 'my industry'}?
   - What's the impact of rupee fluctuations on this sector?
   - How does inflation (wholesale vs retail) matter?

2. CONSUMPTION & DEMAND PATTERNS
   - What drives demand in ${industry || 'this industry'}? Which segments?
   - How do urban vs rural, tier-1 vs tier-2/3 patterns differ?
   - What's the elasticity of demand to income/price changes?

3. CAPITAL & INVESTMENT ENVIRONMENT
   - How dependent is ${industry || 'this sector'} on external capital (PE/VC/FDI)?
   - What's the current investment cycle stage?
   - How do credit conditions affect the industry?

4. INDUSTRY-SPECIFIC ECONOMICS
   - What are the key cost drivers and margin pressures?
   - How do input costs (commodities, labor, energy) impact us?
   - What's the competitive dynamics on pricing?

5. FOR MY SCENARIO PLANNING
   - Which economic factors have the MOST UNCERTAIN trajectory?
   - Which would have HIGHEST IMPACT on our strategy?
   - What leading indicators should I track?

Make this practical and specific to ${industry || 'my industry'} in India.`,
  },
  {
    id: 'S',
    icon: '👥',
    title: 'Social Forces',
    subtitle: 'Demographics, culture, behavior',
    bullets: ['Population shifts & urbanization', 'Cultural values & lifestyle changes', 'Workforce evolution & consumer behavior'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand SOCIAL forces I should consider:

1. DEMOGRAPHIC SHIFTS
   - How does India's demographic dividend affect ${industry || 'this industry'}?
   - What's the impact of urbanization and migration patterns?
   - How do regional demographic differences matter?

2. CONSUMER BEHAVIOR & VALUES
   - How are GenZ and millennial preferences changing demand?
   - What's the impact of rising aspirations and premiumization?
   - How do sustainability and ESG concerns affect consumer choices?

3. WORKFORCE & TALENT
   - How is the gig economy reshaping labor in ${industry || 'this sector'}?
   - What skill gaps and talent challenges exist?
   - How do changing work preferences (remote, flexibility) matter?

4. CULTURAL & LIFESTYLE SHIFTS
   - How are digital habits and screen time changing behavior?
   - What's the impact of nuclear families and delayed marriages?
   - How do health and wellness trends affect the industry?

5. FOR MY SCENARIO PLANNING
   - Which social changes have the MOST UNCERTAIN pace or direction?
   - Which would have HIGHEST IMPACT on our business model?
   - What behavioral signals should I watch?

Make this practical and specific to ${industry || 'my industry'} in India.`,
  },
  {
    id: 'T',
    icon: '💻',
    title: 'Technological Forces',
    subtitle: 'Innovation, disruption, infrastructure',
    bullets: ['Disruptive technologies & adoption curves', 'Digital infrastructure & automation', 'R&D trends & emerging tech'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand TECHNOLOGICAL forces I should consider:

1. DISRUPTIVE TECHNOLOGIES
   - Which emerging technologies (AI, blockchain, IoT, etc.) could transform ${industry || 'this industry'}?
   - What's overhyped vs genuinely transformative?
   - What's the realistic adoption timeline in India?

2. DIGITAL INFRASTRUCTURE
   - How does India's digital public infrastructure (UPI, Aadhaar, ONDC) create opportunities or threats?
   - What's the state of connectivity and digital access?
   - How does data regulation (DPDP Act) affect tech strategies?

3. INDUSTRY-SPECIFIC TECH
   - What technology investments are competitors making?
   - What's the build vs buy vs partner landscape?
   - How is automation affecting operations and costs?

4. INNOVATION ECOSYSTEM
   - What's the startup activity in adjacent spaces?
   - What R&D trends from global markets will reach India?
   - How are technology platforms reshaping industry structure?

5. FOR MY SCENARIO PLANNING
   - Which technology trajectories have MOST UNCERTAIN outcomes?
   - Which would have HIGHEST IMPACT on our competitive position?
   - What technology signals should I track?

Make this practical and specific to ${industry || 'my industry'} in India.`,
  },
]

export default function Phase2Page() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterCategory>('all')
  const [showAddForce, setShowAddForce] = useState(false)
  const [newForceName, setNewForceName] = useState('')
  const [newForceDesc, setNewForceDesc] = useState('')
  const [newForceCategory, setNewForceCategory] = useState<PESTCategory>('T')
  const [error, setError] = useState<string | null>(null)
  const [expandedPEST, setExpandedPEST] = useState<PESTCategory | null>(null)

  const {
    industry,
    organizationType,
    challenge,
    customChallenge,
    modifiers,
    strategicQuestion,
    focalIssue,
    forces,
    isGeneratingForces,
    setForces,
    updateForceRating,
    addCustomForce,
    setIsGeneratingForces,
    setPhase,
    completePhase,
  } = useSimulationStore()

  // Set current phase on mount
  useEffect(() => {
    setPhase(2)
  }, [setPhase])

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
          challenge: challenge === 'custom' ? customChallenge : challenge,
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
        impact: 3,
        uncertainty: 3,
      })
      setNewForceName('')
      setNewForceDesc('')
      setShowAddForce(false)
    }
  }

  const handleContinue = () => {
    completePhase(2)
    setPhase(3)
    router.push('/simulation/phase-3')
  }

  const filteredForces = filter === 'all'
    ? forces
    : forces.filter((f) => f.category === filter)

  const highImpactUncertaintyCount = forces.filter(
    (f) => f.impact >= 4 && f.uncertainty >= 4
  ).length

  // Get PEST learning content with industry context
  const pestLearning = getPESTDeepLearning(industry)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Focal Issue Reference */}
        <div className="bg-gradient-to-r from-navy-50 to-indigo-50 rounded-xl p-4 border border-navy-200">
          <div className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">
            Your Focal Issue
          </div>
          <p className="text-navy-800 font-medium">
            {focalIssue || strategicQuestion || 'Not defined'}
          </p>
        </div>

        {/* Stats & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-navy-200 flex items-center gap-2">
            <span className="text-navy-500 text-sm">Forces:</span>
            <span className="font-semibold text-navy-900">{forces.length}</span>
          </div>
          <div
            className={cn(
              'px-4 py-2 rounded-lg border flex items-center gap-2',
              highImpactUncertaintyCount > 0
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-white border-navy-200'
            )}
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-navy-500 text-sm">High Impact + Uncertainty:</span>
            <span className="font-semibold text-navy-900">{highImpactUncertaintyCount}</span>
          </div>
        </div>

        {/* Loading State */}
        {isGeneratingForces && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-navy-200">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-navy-800 font-medium">Scanning the environment...</p>
            <p className="text-navy-500 text-sm">Generating PESTEL forces with AI</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isGeneratingForces && forces.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border-2 border-dashed border-navy-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-navy-900 mb-2">Ready to Scan the Environment</h3>
            <p className="text-navy-500 text-center max-w-md mb-6">
              Click below to generate 16 AI-powered driving forces across Political, Economic, Social, and Technological dimensions.
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
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === 'all'
                    ? 'bg-navy-900 text-white'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                )}
              >
                All ({forces.length})
              </button>
              {(['P', 'E', 'S', 'T'] as PESTCategory[]).map((cat) => {
                const count = forces.filter((f) => f.category === cat).length
                const catColors: Record<string, string> = {
                  P: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
                  E: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
                  S: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
                  T: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
                }
                const catColorsActive: Record<string, string> = {
                  P: 'bg-purple-600 text-white',
                  E: 'bg-emerald-600 text-white',
                  S: 'bg-amber-600 text-white',
                  T: 'bg-blue-600 text-white',
                }
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      filter === cat ? catColorsActive[cat] : catColors[cat]
                    )}
                  >
                    {PEST_LABELS[cat]} ({count})
                  </button>
                )
              })}
            </div>

            {/* Forces Grid - 2 column layout */}
            <motion.div
              layout
              className="grid gap-5 grid-cols-1 md:grid-cols-2"
            >
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
                      onUncertaintyChange={(value) =>
                        updateForceRating(force.id, 'uncertainty', value)
                      }
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
                  className="bg-white rounded-xl border border-navy-200 p-4 space-y-4"
                >
                  <h4 className="font-medium text-navy-900">Add Custom Force</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-navy-600 mb-1 block">Name</label>
                      <input
                        type="text"
                        value={newForceName}
                        onChange={(e) => setNewForceName(e.target.value)}
                        placeholder="e.g., Labor Union Resurgence"
                        className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-navy-600 mb-1 block">Category</label>
                      <select
                        value={newForceCategory}
                        onChange={(e) => setNewForceCategory(e.target.value as PESTCategory)}
                        className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        <option value="P">Political</option>
                        <option value="E">Economic</option>
                        <option value="S">Social</option>
                        <option value="T">Technological</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-navy-600 mb-1 block">Description</label>
                    <textarea
                      value={newForceDesc}
                      onChange={(e) => setNewForceDesc(e.target.value)}
                      placeholder="Describe the force and why it matters..."
                      className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-500"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForce(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-1')}>
            ← Back to Mission Briefing
          </Button>
          <Button
            onClick={handleContinue}
            disabled={forces.length === 0 || isGeneratingForces}
          >
            Continue to Uncertainty Selection
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Right Column - Guidance */}
      <div className="lg:col-span-1 space-y-5">
        {/* Rating Guide - Visual Example */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-white">
            <div className="font-semibold">How to Rate Forces</div>
            <div className="text-xs opacity-80">Learn through example</div>
          </div>

          {/* The Example Force */}
          <div className="p-4 border-b border-navy-100 bg-navy-50">
            <div className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">
              Example Force
            </div>
            <div className="font-semibold text-navy-900">{RATING_EXAMPLE.force}</div>
          </div>

          {/* Impact Explanation */}
          <div className="p-4 border-b border-navy-100">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-navy-600" />
              <span className="font-medium text-navy-900 text-sm">Impact = "What if this happens?"</span>
            </div>

            {/* High Impact */}
            <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-red-700">{RATING_EXAMPLE.impactExample.highImpact.company}</span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  Impact: {RATING_EXAMPLE.impactExample.highImpact.rating}/5
                </span>
              </div>
              <p className="text-xs text-red-700">{RATING_EXAMPLE.impactExample.highImpact.outcome}</p>
            </div>

            {/* Low Impact */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-700">{RATING_EXAMPLE.impactExample.lowImpact.company}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Impact: {RATING_EXAMPLE.impactExample.lowImpact.rating}/5
                </span>
              </div>
              <p className="text-xs text-emerald-700">{RATING_EXAMPLE.impactExample.lowImpact.outcome}</p>
            </div>
          </div>

          {/* Uncertainty Explanation */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-navy-600" />
              <span className="font-medium text-navy-900 text-sm">Uncertainty = "Can we predict this?"</span>
            </div>

            {/* High Uncertainty */}
            <div className="mb-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-purple-700">{RATING_EXAMPLE.uncertaintyExample.highUncertainty.question}</span>
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  Uncertainty: {RATING_EXAMPLE.uncertaintyExample.highUncertainty.rating}/5
                </span>
              </div>
              <p className="text-xs text-purple-700">{RATING_EXAMPLE.uncertaintyExample.highUncertainty.reason}</p>
            </div>

            {/* Low Uncertainty */}
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-teal-700">{RATING_EXAMPLE.uncertaintyExample.lowUncertainty.question}</span>
                <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  Uncertainty: {RATING_EXAMPLE.uncertaintyExample.lowUncertainty.rating}/5
                </span>
              </div>
              <p className="text-xs text-teal-700">{RATING_EXAMPLE.uncertaintyExample.lowUncertainty.reason}</p>
            </div>
          </div>
        </div>

        {/* PEST Deep Learning */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="p-4 border-b border-navy-100">
            <h4 className="font-medium text-navy-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Understanding PEST Forces
            </h4>
            <p className="text-xs text-navy-500 mt-1">
              Click to learn about each category and explore deeply
            </p>
          </div>

          <div className="divide-y divide-navy-100">
            {pestLearning.map((item) => {
              const isExpanded = expandedPEST === item.id
              const catColors: Record<string, string> = {
                P: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
                E: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
                S: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
                T: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
              }

              return (
                <div key={item.id}>
                  <button
                    onClick={() => setExpandedPEST(isExpanded ? null : item.id)}
                    className={cn(
                      'w-full p-3 text-left transition-colors',
                      isExpanded ? catColors[item.id] : 'hover:bg-navy-50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium text-navy-900 text-sm">{item.title}</div>
                          <div className="text-xs text-navy-500">{item.subtitle}</div>
                        </div>
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
                        <div className={cn('px-4 pb-4', catColors[item.id].split(' ')[0])}>
                          <ul className="text-xs text-navy-600 space-y-1 mb-3">
                            {item.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-navy-400">•</span>
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
                            Explore {item.title} deeply →
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
          <strong>Tip:</strong> Click any force card to flip and see details. Use sliders to rate impact and uncertainty.
        </div>
      </div>
    </div>
  )
}
