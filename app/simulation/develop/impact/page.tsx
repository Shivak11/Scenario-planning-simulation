'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Home, ExternalLink } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { CompactSlider } from '@/components/simulation/CompactSlider'
import { cn } from '@/lib/utils'
import type { ImpactScores } from '@/lib/types'

const DIMENSIONS = [
  {
    key: 'probability',
    label: 'Probability',
    shortDesc: 'How likely is this scenario?',
    guidance: 'Consider current trends, historical patterns, and expert opinions. A well-constructed scenario should feel plausible, not predictable.',
    lowLabel: 'Unlikely (<20%)',
    highLabel: 'Very likely (>80%)',
  },
  {
    key: 'repercussion',
    label: 'Repercussion',
    shortDesc: 'How severe would the impact be?',
    guidance: 'Assess impact on revenue, operations, talent, reputation, and competitive position. Consider second-order effects.',
    lowLabel: 'Minor adjustments',
    highLabel: 'Existential threat',
  },
  {
    key: 'urgency',
    label: 'Urgency',
    shortDesc: 'How soon might this occur?',
    guidance: 'When would you need to start preparing? Early signals may require immediate attention even if full impact is years away.',
    lowLabel: '5+ years out',
    highLabel: 'Imminent (<1 year)',
  },
  {
    key: 'strategicDisruption',
    label: 'Strategic Disruption',
    shortDesc: 'How much would it change your strategy?',
    guidance: 'Would this require pivoting your business model, entering new markets, or fundamentally rethinking your value proposition?',
    lowLabel: 'Stay the course',
    highLabel: 'Complete pivot',
  },
]

export default function ImpactPage() {
  const router = useRouter()
  const { scenarios, impactAssessments, updateImpactScore, setCurrentStep } = useSimulationStore()
  const [activeScenario, setActiveScenario] = useState(scenarios[0]?.id || '')

  useEffect(() => {
    setCurrentStep('impact')
  }, [setCurrentStep])

  const currentScenario = scenarios.find(s => s.id === activeScenario)

  const handleSliderChange = (dimension: string, value: number) => {
    if (currentScenario) {
      updateImpactScore(currentScenario.id, dimension as keyof ImpactScores, value)
    }
  }

  // Scenarios are considered assessed - sliders have sensible defaults
  // The user can always adjust and the values are meaningful at 50%
  const allScenariosAssessed = scenarios.length > 0

  const handleGoHome = () => {
    if (window.confirm('Going home will reset all your progress. Continue?')) {
      router.push('/')
    }
  }

  const QUADRANT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    TL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    TR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    BL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    BR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
  }

  return (
    <div>
      {/* Progress bar + Navigation - Develop phase layout */}
      <div className="flex items-center gap-4 mb-4">
        {/* Develop phase progress: impact is step 2 of 3 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 2 ? 'bg-gold-500' : i === 2 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">2/3</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push('/simulation/develop/narratives')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={() => router.push('/simulation/develop/risk')}
            disabled={!allScenariosAssessed}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              allScenariosAssessed
                ? 'text-slate-900 bg-gold-500 hover:bg-gold-400'
                : 'text-slate-500 bg-slate-700 cursor-not-allowed'
            )}
          >
            Continue
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
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h2 className="font-semibold text-white mb-1">Assess Scenario Impact</h2>
          <p className="text-sm text-slate-400">
            For each scenario, rate its probability, potential repercussions, urgency, and strategic disruption.
          </p>
        </div>

        {/* Scenario Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {scenarios.map((scenario) => {
            const colors = QUADRANT_COLORS[scenario.quadrant] || QUADRANT_COLORS.TL
            const isActive = scenario.id === activeScenario
            const isAssessed = impactAssessments[scenario.id]?.probability > 0

            return (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  isActive
                    ? `${colors.bg} ${colors.border} border-2 ${colors.text}`
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                )}
              >
                {scenario.name}
                {isAssessed && <span className="ml-1 text-emerald-400">✓</span>}
              </button>
            )
          })}
        </div>

        {/* Assessment Panel */}
        {currentScenario && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
            <div className="mb-2">
              <h3 className="font-semibold text-white">{currentScenario.name}</h3>
            </div>

            {DIMENSIONS.map((dim) => {
              const scores = impactAssessments[currentScenario.id]
              const value = scores?.[dim.key as keyof ImpactScores] || 50

              return (
                <CompactSlider
                  key={dim.key}
                  label={dim.label}
                  shortDesc={dim.shortDesc}
                  value={value}
                  onChange={(v) => handleSliderChange(dim.key, v)}
                  lowLabel={dim.lowLabel}
                  highLabel={dim.highLabel}
                />
              )
            })}
          </div>
        )}

        </div>

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
                  <h4 className="font-medium text-white mb-3">Quick Reference</h4>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li><span className="text-gold-400 font-medium">Probability</span> — How likely? (0-100%)</li>
                    <li><span className="text-gold-400 font-medium">Repercussion</span> — How severe? (Minor → Existential)</li>
                    <li><span className="text-gold-400 font-medium">Urgency</span> — How soon? (5+ years → Imminent)</li>
                    <li><span className="text-gold-400 font-medium">Disruption</span> — Strategy change? (Stay course → Pivot)</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 mt-3 italic">
                    Tip: Avoid rating everything at 50% — differentiate!
                  </p>
                </div>
              ),
            },
            {
              id: 'example',
              label: 'Example',
              icon: Building,
              content: (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 -m-4 mb-3 px-4 py-3 border-b border-gold-500/30">
                    <div className="font-semibold text-gold-400 text-sm">Chegg vs Duolingo</div>
                    <div className="text-xs text-slate-400">How assessment drives strategic response</div>
                  </div>

                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Scenario: "AI Disrupts Education"
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="text-xs font-semibold text-amber-400">Chegg's Assessment</span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-amber-400/80 my-2">
                      <span>Probability: 90%</span>
                      <span>Repercussion: 95%</span>
                      <span>Urgency: 100%</span>
                      <span>Disruption: 90%</span>
                    </div>
                    <p className="text-xs text-amber-400/80">Outcome: Too late to respond. Stock crashed 48% in one day.</p>
                  </div>

                  <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/30">
                    <span className="text-xs font-semibold text-gold-400">Duolingo's Assessment</span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-gold-400/80 my-2">
                      <span>Probability: 90%</span>
                      <span>Repercussion: 40%</span>
                      <span>Urgency: 70%</span>
                      <span>Disruption: 60%</span>
                    </div>
                    <p className="text-xs text-gold-400/80">Outcome: Integrated AI into product. Stock rose 60%.</p>
                  </div>

                  <a
                    href="https://chat.openai.com/?q=Compare%20how%20Chegg%20and%20Duolingo%20assessed%20and%20responded%20to%20AI%20disruption.%20What%20made%20their%20strategic%20assessments%20different%3F%20How%20should%20companies%20assess%20scenario%20impact%20to%20avoid%20Chegg's%20fate%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explore this comparison on ChatGPT
                  </a>
                </div>
              ),
            },
            {
              id: 'tips',
              label: 'Tips',
              icon: Lightbulb,
              content: (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gold-400 mb-2">Why This Matters</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Impact assessment helps prioritize which scenarios deserve the most strategic attention.
                      High probability + high repercussion = immediate planning priority.
                      Low probability + high disruption = "black swan" requiring contingency plans.
                    </p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <strong className="text-slate-300 text-xs">Pro Tip:</strong>
                    <p className="text-slate-400 text-xs mt-1">
                      Avoid the "middle ground" trap. If everything is rated 50%, you haven't differentiated. Push yourself to make choices.
                    </p>
                  </div>
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
