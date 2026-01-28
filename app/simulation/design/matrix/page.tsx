'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generateId } from '@/lib/utils'
import { ArrowRight, ArrowLeft, Home, Sparkles, ExternalLink } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'

const QUADRANT_POSITIONS = [
  { id: 'TL', row: 0, col: 0, xLevel: 'low', yLevel: 'high', label: 'Low X + High Y' },
  { id: 'TR', row: 0, col: 1, xLevel: 'high', yLevel: 'high', label: 'High X + High Y' },
  { id: 'BL', row: 1, col: 0, xLevel: 'low', yLevel: 'low', label: 'Low X + Low Y' },
  { id: 'BR', row: 1, col: 1, xLevel: 'high', yLevel: 'low', label: 'High X + Low Y' },
]

export default function MatrixPage() {
  const router = useRouter()
  const [expandedLearning, setExpandedLearning] = useState<string | null>('shell')
  const [scenarioNames, setScenarioNames] = useState<Record<string, string>>({
    TL: '',
    TR: '',
    BL: '',
    BR: '',
  })

  const {
    xAxis,
    yAxis,
    xAxisLabels,
    yAxisLabels,
    setScenarios,
    setCurrentStep,
    completeMainPhase,
  } = useSimulationStore()

  useEffect(() => {
    setCurrentStep('matrix')
  }, [setCurrentStep])

  const handleScenarioNameChange = (quadrantId: string, name: string) => {
    setScenarioNames((prev) => ({ ...prev, [quadrantId]: name }))
  }

  const isComplete =
    xAxisLabels.low.trim() !== '' &&
    xAxisLabels.high.trim() !== '' &&
    yAxisLabels.low.trim() !== '' &&
    yAxisLabels.high.trim() !== '' &&
    Object.values(scenarioNames).every((name) => name.trim() !== '')

  const handleContinue = () => {
    if (!isComplete || !xAxis || !yAxis) return

    const scenarios = QUADRANT_POSITIONS.map((pos) => ({
      id: generateId(),
      name: scenarioNames[pos.id],
      quadrant: pos.id as 'TL' | 'TR' | 'BL' | 'BR',
      narrative: '',
      timeHorizon: 5,
      tone: 0,
      complexity: 2,
      earlySignals: [],
      keyCapabilities: [],
    }))

    setScenarios(scenarios)
    completeMainPhase('design')
    setCurrentStep('narratives')
    router.push('/simulation/develop/narratives')
  }

  const openChatGpt = (prompt: string) => {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
  }

  const handleGoHome = () => {
    if (window.confirm('Going home will reset all your progress. Continue?')) {
      router.push('/')
    }
  }

  return (
    <div>
      {/* Progress bar + Navigation - Design phase layout */}
      <div className="flex items-center gap-4 mb-4">
        {/* Design phase progress: matrix is step 4 of 4 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 4 ? 'bg-gold-500' : i === 4 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">4/4</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push('/simulation/design/axes')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!isComplete}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              isComplete
                ? 'text-slate-900 bg-gold-500 hover:bg-gold-400'
                : 'text-slate-500 bg-slate-700 cursor-not-allowed'
            )}
          >
            Continue to Develop
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
          <h2 className="font-semibold text-white mb-1">Name Your Four Scenarios</h2>
          <p className="text-sm text-slate-400">
            Give each quadrant an evocative, memorable name that captures the world it represents.
          </p>
        </div>

        {/* 2x2 Matrix */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex gap-4">
            {/* Y-Axis Label */}
            <div className="flex flex-col justify-center items-center w-6 py-8">
              <span className="text-[9px] text-gold-400 font-medium truncate max-w-[80px] -rotate-90 origin-center">
                {yAxisLabels.high || 'High'} ↑
              </span>
              <div className="flex-1 flex items-center justify-center my-2">
                <span className="transform -rotate-90 text-xs font-medium text-gold-400 truncate max-w-[200px]">
                  {yAxis?.name || 'Y-Axis'}
                </span>
              </div>
              <span className="text-[9px] text-gold-400 font-medium truncate max-w-[80px] -rotate-90 origin-center">
                ↓ {yAxisLabels.low || 'Low'}
              </span>
            </div>

            {/* Matrix Grid */}
            <div className="flex-1">
              <div className="text-center mb-2 text-xs text-gold-400 font-medium truncate">
                {yAxisLabels.high || 'High Y'} ↑
              </div>

              <div className="grid grid-cols-2 gap-3">
                {QUADRANT_POSITIONS.map((pos) => (
                  <motion.div
                    key={pos.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: QUADRANT_POSITIONS.indexOf(pos) * 0.1 }}
                    className={cn(
                      'aspect-[4/3] rounded-xl border-2 p-4 flex flex-col',
                      scenarioNames[pos.id]
                        ? 'border-gold-500/50 bg-gold-500/10'
                        : 'border-dashed border-slate-700 bg-slate-800'
                    )}
                  >
                    <div className="text-xs text-slate-400 mb-2 line-clamp-2">
                      {pos.xLevel === 'low' ? xAxisLabels.low || 'Low X' : xAxisLabels.high || 'High X'}
                      {' + '}
                      {pos.yLevel === 'low' ? yAxisLabels.low || 'Low Y' : yAxisLabels.high || 'High Y'}
                    </div>

                    <input
                      type="text"
                      value={scenarioNames[pos.id]}
                      onChange={(e) => handleScenarioNameChange(pos.id, e.target.value)}
                      placeholder="Name this scenario..."
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center',
                        'border-0 bg-transparent focus:outline-none focus:bg-slate-800',
                        scenarioNames[pos.id] ? 'text-gold-400' : 'text-slate-500'
                      )}
                    />

                    {scenarioNames[pos.id] && (
                      <div className="text-xs text-gold-400 text-center mt-1">✓ Named</div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-2 text-xs text-gold-400 font-medium truncate">
                ↓ {yAxisLabels.low || 'Low Y'}
              </div>

              <div className="flex justify-between mt-4 text-xs text-gold-400 font-medium px-4">
                <span className="truncate max-w-[100px]">← {xAxisLabels.low || 'Low X'}</span>
                <span className="text-slate-300 truncate max-w-[150px]">{xAxis?.name || 'X-Axis'}</span>
                <span className="truncate max-w-[100px]">{xAxisLabels.high || 'High X'} →</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        {/* AI Naming Suggestions - stays separate */}
        <div className="bg-slate-800 rounded-xl border border-gold-500/30 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gold-400 mb-2">Need naming inspiration?</p>
              <button
                onClick={() => openChatGpt(`I'm building a 2x2 scenario matrix for scenario planning.

My X-axis is: "${xAxis?.name || '[X-Axis Force]'}"
- Low end: "${xAxisLabels.low || '[low label]'}"
- High end: "${xAxisLabels.high || '[high label]'}"

My Y-axis is: "${yAxis?.name || '[Y-Axis Force]'}"
- Low end: "${yAxisLabels.low || '[low label]'}"
- High end: "${yAxisLabels.high || '[high label]'}"

Help me create evocative, memorable names for each of the 4 quadrants.`)}
                className="w-full text-xs font-medium text-slate-900 bg-gold-500 hover:bg-gold-400 py-2 px-3 rounded-lg"
              >
                Get AI naming suggestions
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Learning Sidebar */}
        <LearningSidebar
          defaultTab="guide"
          tabs={[
            {
              id: 'guide',
              label: 'Guide',
              icon: BookOpen,
              content: (
                <div>
                  <h4 className="font-medium text-white mb-3">Good Scenario Names Are:</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-gold-400">✓</span> Memorable - you can recall them in a meeting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold-400">✓</span> Evocative - paint a mental picture
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold-400">✓</span> Neutral - no "good" or "bad" judgment
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
                    <div className="font-semibold text-gold-400 text-sm">Shell's Famous Scenarios</div>
                    <div className="text-xs text-slate-400">Names that shaped boardroom decisions</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">"Scramble"</span>
                      <span className="text-slate-400 ml-1">– chaotic response to energy crisis</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">"Blueprints"</span>
                      <span className="text-slate-400 ml-1">– coordinated policy-driven transition</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">"Mountains"</span>
                      <span className="text-slate-400 ml-1">– locked-in status quo dominates</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">"Oceans"</span>
                      <span className="text-slate-400 ml-1">– fluid, market-driven change</span>
                    </div>
                  </div>

                  <a
                    href="https://chat.openai.com/?q=Tell%20me%20about%20Shell%27s%20famous%20scenario%20names%20like%20%22Scramble%22%20and%20%22Blueprints%22.%20Why%20were%20these%20names%20so%20effective%3F%20Give%20me%20more%20examples%20of%20memorable%20scenario%20names%20from%20corporate%20strategy."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explore Shell's naming approach
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
                  <h4 className="font-medium text-gold-400 mb-3">Naming Tips</h4>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• Test: "If we end up in [NAME], we need to..." – does it flow?</li>
                    <li>• Avoid dates or numbers – "2030 World" sounds like a forecast</li>
                    <li>• Use metaphors from nature, history, or culture</li>
                    <li>• Names should work in headlines and conversations</li>
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
