'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, ExternalLink, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'

export default function AxesPage() {
  const router = useRouter()
  const {
    xAxis,
    yAxis,
    xAxisLabels,
    yAxisLabels,
    setAxisLabels,
    setCurrentStep,
  } = useSimulationStore()

  const [localXLabels, setLocalXLabels] = useState(xAxisLabels)
  const [localYLabels, setLocalYLabels] = useState(yAxisLabels)

  useEffect(() => {
    setCurrentStep('axes')
  }, [setCurrentStep])

  useEffect(() => {
    // Set default labels based on force names
    if (xAxis && !localXLabels.low && !localXLabels.high) {
      setLocalXLabels({ low: `Low ${xAxis.name}`, high: `High ${xAxis.name}` })
    }
    if (yAxis && !localYLabels.low && !localYLabels.high) {
      setLocalYLabels({ low: `Low ${yAxis.name}`, high: `High ${yAxis.name}` })
    }
  }, [xAxis, yAxis])

  const handleContinue = () => {
    setAxisLabels('x', localXLabels)
    setAxisLabels('y', localYLabels)
    router.push('/simulation/design/matrix')
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
        {/* Design phase progress: axes is step 3 of 4 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 3 ? 'bg-gold-500' : i === 3 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">3/4</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push('/simulation/design/uncertainties')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-900 bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors"
          >
            View Matrix
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
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="font-semibold text-white mb-2">Configure Your Axis Labels</h2>
          <p className="text-sm text-slate-400">
            Define what the extremes of each axis mean in your context.
          </p>
        </div>

        {/* X-Axis Labels */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <h3 className="font-medium text-gold-400 mb-4">X-Axis: {xAxis?.name || 'Not selected'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Low End (Left)</label>
              <input
                type="text"
                value={localXLabels.low}
                onChange={(e) => setLocalXLabels({ ...localXLabels, low: e.target.value })}
                placeholder="e.g., Restrictive"
                className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">High End (Right)</label>
              <input
                type="text"
                value={localXLabels.high}
                onChange={(e) => setLocalXLabels({ ...localXLabels, high: e.target.value })}
                placeholder="e.g., Permissive"
                className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Y-Axis Labels */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <h3 className="font-medium text-gold-400 mb-4">Y-Axis: {yAxis?.name || 'Not selected'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Low End (Bottom)</label>
              <input
                type="text"
                value={localYLabels.low}
                onChange={(e) => setLocalYLabels({ ...localYLabels, low: e.target.value })}
                placeholder="e.g., Slow"
                className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">High End (Top)</label>
              <input
                type="text"
                value={localYLabels.high}
                onChange={(e) => setLocalYLabels({ ...localYLabels, high: e.target.value })}
                placeholder="e.g., Rapid"
                className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Learning Sidebar */}
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
                  <h4 className="font-medium text-white mb-3">Why Labels Matter</h4>
                  <p className="text-sm text-slate-400 mb-3">
                    Clear, evocative axis labels make your scenarios memorable and discussable.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-gold-500/10 border border-gold-500/30 rounded-lg">
                      <span className="text-gold-400 font-medium">Good:</span>
                      <span className="text-gold-400/80 ml-1">"Hyper-regulation" vs "Free market"</span>
                    </div>
                    <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-400 font-medium">Bad:</span>
                      <span className="text-amber-400/80 ml-1">"Low" vs "High"</span>
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
                  <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 -m-4 mb-3 px-4 py-3 border-b border-gold-500/30">
                    <div className="font-semibold text-gold-400 text-sm">Famous Scenario Labels</div>
                    <div className="text-xs text-slate-400">From Shell's scenario planning</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">Energy:</span>
                      <span className="text-slate-400 ml-1">"Scramble" vs "Blueprints"</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">Globalization:</span>
                      <span className="text-slate-400 ml-1">"Fortress World" vs "Open Borders"</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300 font-medium">Technology:</span>
                      <span className="text-slate-400 ml-1">"Tech Winter" vs "Cambrian Explosion"</span>
                    </div>
                  </div>

                  <a
                    href="https://chat.openai.com/?q=Help%20me%20create%20evocative%20scenario%20axis%20labels.%20I'm%20building%20a%202x2%20scenario%20matrix.%20What%20makes%20good%20axis%20labels%3F%20Give%20me%20examples%20of%20memorable%20axis%20labels%20from%20famous%20scenario%20planning%20exercises."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Get label suggestions from ChatGPT
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
                  <h4 className="font-medium text-gold-400 mb-3">Label Tips</h4>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• Use concrete, visual language people can picture</li>
                    <li>• Avoid jargon—labels should work in a board meeting</li>
                    <li>• Test: Can you use the label in a sentence naturally?</li>
                    <li>• Example: "In a world of hyper-regulation, we would need to..."</li>
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
