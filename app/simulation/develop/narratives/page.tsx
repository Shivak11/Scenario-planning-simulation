'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Home, Sparkles, ExternalLink } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { cn } from '@/lib/utils'

export default function NarrativesPage() {
  const router = useRouter()
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)

  const {
    scenarios,
    xAxis,
    yAxis,
    xAxisLabels,
    yAxisLabels,
    focalIssue,
    industry,
    updateScenario,
    setCurrentStep,
  } = useSimulationStore()

  useEffect(() => {
    setCurrentStep('narratives')
  }, [setCurrentStep])

  const openChatGptForScenario = (scenarioName: string, quadrant: string) => {
    const xLevel = quadrant.includes('L') ? xAxisLabels.low : xAxisLabels.high
    const yLevel = quadrant.startsWith('T') ? yAxisLabels.high : yAxisLabels.low

    const prompt = `Help me write a vivid scenario narrative for strategic planning.

Context:
- Industry: ${industry || 'Not specified'}
- Focal Issue: ${focalIssue || 'Not specified'}
- Scenario Name: "${scenarioName}"
- X-Axis: ${xAxis?.name || 'X-Axis'} → ${xLevel}
- Y-Axis: ${yAxis?.name || 'Y-Axis'} → ${yLevel}

Write a 2-3 paragraph narrative that:
1. Describes what this world looks like in 5-10 years
2. Includes specific events, trends, and conditions
3. Explains how we got here from today
4. Paints a vivid, memorable picture

Keep it neutral - this isn't a "good" or "bad" scenario, just a plausible future.`

    window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
  }

  const QUADRANT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    TL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    TR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    BL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    BR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
  }

  const handleNarrativeChange = (scenarioId: string, narrative: string) => {
    updateScenario(scenarioId, { narrative })
  }

  const allNarrativesFilled = scenarios.every(s => s.narrative && s.narrative.trim().length > 50)

  const handleGoHome = () => {
    if (window.confirm('Going home will reset all your progress. Continue?')) {
      router.push('/')
    }
  }

  return (
    <div>
      {/* Progress bar + Navigation - Develop phase layout */}
      <div className="flex items-center gap-4 mb-4">
        {/* Develop phase progress: narratives is step 1 of 3 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 1 ? 'bg-gold-500' : i === 1 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">1/3</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push('/simulation/design/matrix')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={() => router.push('/simulation/develop/impact')}
            disabled={!allNarrativesFilled}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              allNarrativesFilled
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
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h2 className="font-semibold text-white mb-1">Write Your Scenario Narratives</h2>
            <p className="text-sm text-slate-400">
              For each scenario, write a vivid narrative describing what this world looks like.
              Think about the key events, trends, and conditions that define this future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((scenario) => {
              const colors = QUADRANT_COLORS[scenario.quadrant] || QUADRANT_COLORS.TL
              const isExpanded = expandedScenario === scenario.id

              return (
                <div
                  key={scenario.id}
                  className={cn(
                    'rounded-xl border-2 p-4',
                    colors.bg,
                    colors.border
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={cn('font-semibold', colors.text)}>{scenario.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openChatGptForScenario(scenario.name, scenario.quadrant)}
                        className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI help
                      </button>
                      <span className={cn('text-xs px-2 py-1 rounded-full', colors.bg, colors.text, 'font-medium')}>
                        {scenario.quadrant}
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={scenario.narrative || ''}
                    onChange={(e) => handleNarrativeChange(scenario.id, e.target.value)}
                    placeholder={`Describe the "${scenario.name}" world...`}
                    className={cn(
                      'w-full px-3 py-2 border border-slate-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-800 text-slate-200 placeholder:text-slate-500 transition-all',
                      isExpanded ? 'h-40' : 'h-24'
                    )}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">
                      {(scenario.narrative || '').length} chars
                    </span>
                    <div className="flex items-center gap-2">
                      {(scenario.narrative || '').length > 50 && (
                        <span className="text-xs text-gold-400">✓ Good</span>
                      )}
                      <button
                        onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                        className="text-xs text-slate-400 hover:text-slate-300"
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
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
                    <h4 className="font-medium text-white mb-3">Writing Vivid Narratives</h4>
                    <p className="text-sm text-slate-400 mb-3">
                      A good scenario narrative isn't a forecast—it's a story that helps your team
                      mentally "live" in that future.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center gap-2">
                        <span className="text-gold-400">✓</span> Use present tense ("In this world, companies are...")
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gold-400">✓</span> Include specific details and examples
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gold-400">✓</span> Stay neutral—no "good" or "bad" judgment
                      </li>
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
                    <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 -m-4 mb-3 px-4 py-3 border-b border-gold-500/30">
                      <div className="font-semibold text-gold-400 text-sm">Shell's Scenario Stories</div>
                      <div className="text-xs text-slate-400">How the masters write narratives</div>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg text-xs">
                      <span className="text-slate-300 font-medium">"Mountains":</span>
                      <span className="text-slate-400 ml-1">"In Mountains, incumbent power holds firm.
                      Governments maintain tight control over energy policy..."</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg text-xs">
                      <span className="text-slate-300 font-medium">"Oceans":</span>
                      <span className="text-slate-400 ml-1">"Oceans sees market forces reshape the energy landscape.
                      Entrepreneurs and new players disrupt..."</span>
                    </div>
                    <a
                      href="https://chat.openai.com/?q=Tell%20me%20about%20Shell%27s%20scenario%20narratives%20for%20%22Mountains%22%20and%20%22Oceans%22.%20How%20did%20they%20write%20these%20vivid%20stories%3F%20Give%20me%20tips%20for%20writing%20compelling%20scenario%20narratives."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Explore Shell's narrative style
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
                    <h4 className="font-medium text-gold-400 mb-3">Writing Tips</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li>• Start with "In this world..." to set the scene</li>
                      <li>• Mention 2-3 specific events that led here</li>
                      <li>• Describe daily life—how do people/businesses behave?</li>
                      <li>• Keep it to 2-3 paragraphs max</li>
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
