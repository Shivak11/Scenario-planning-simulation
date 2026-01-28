'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Home, ExternalLink } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { CompactSlider } from '@/components/simulation/CompactSlider'
import { cn } from '@/lib/utils'

const RISK_DIMENSIONS = [
  { key: 'appetite', label: 'Risk Appetite', description: 'How much risk is your organization willing to take?', low: 'Conservative', high: 'Aggressive' },
  { key: 'capacity', label: 'Strategic Capacity', description: 'How much resource and adaptability can your organization deploy?', low: 'Limited', high: 'Abundant' },
]

export default function RiskPage() {
  const router = useRouter()
  const { riskProfile, setRiskProfile, setCurrentStep, completeMainPhase } = useSimulationStore()

  useEffect(() => {
    setCurrentStep('risk')
  }, [setCurrentStep])

  const handleSliderChange = (dimension: string, value: number) => {
    setRiskProfile({ ...riskProfile, [dimension]: value })
  }

  const isComplete = riskProfile.appetite > 0

  const handleContinue = () => {
    completeMainPhase('develop')
    setCurrentStep('responses')
    router.push('/simulation/decide/responses')
  }

  const handleGoHome = () => {
    if (window.confirm('Going home will reset all your progress. Continue?')) {
      router.push('/')
    }
  }

  return (
    <div>
      {/* Progress bar + Navigation - Develop phase layout */}
      <div className="flex items-center gap-4 mb-4">
        {/* Develop phase progress: risk is step 3 of 3 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 3 ? 'bg-gold-500' : i === 3 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">3/3</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push('/simulation/develop/impact')}
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
            Continue to Decide
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
      <div className="lg:col-span-2 space-y-4">
        {/* Unified card: header + sliders + summary */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
          <div className="mb-2">
            <h2 className="font-semibold text-white">Define Your Risk Profile</h2>
            <p className="text-xs text-slate-400">
              Your profile shapes which strategic responses are appropriate.
            </p>
          </div>

          {RISK_DIMENSIONS.map((dim) => {
            const value = riskProfile[dim.key as keyof typeof riskProfile] || 3

            return (
              <CompactSlider
                key={dim.key}
                label={dim.label}
                shortDesc={dim.description}
                value={value}
                onChange={(v) => handleSliderChange(dim.key, v)}
                lowLabel={dim.low}
                highLabel={dim.high}
                min={1}
                max={5}
                step={1}
                formatValue={(v) => `${v}/5`}
              />
            )
          })}

          {/* Inline Profile Summary */}
          <div className="pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              <span className="text-slate-300 font-medium">Profile:</span>{' '}
              <span className="text-gold-400">
                {riskProfile.appetite >= 4 ? 'High' : riskProfile.appetite >= 3 ? 'Moderate' : 'Low'} risk appetite
              </span>
              {' + '}
              <span className="text-gold-400">
                {riskProfile.capacity >= 4 ? 'High' : riskProfile.capacity >= 3 ? 'Moderate' : 'Limited'} capacity
              </span>
            </p>
          </div>
        </div>

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
                    <li><span className="text-gold-400 font-medium">Risk Appetite</span> — How bold can you be? (Conservative → Aggressive)</li>
                    <li><span className="text-gold-400 font-medium">Strategic Capacity</span> — Can you execute? (Limited → Abundant)</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 mt-3 italic">
                    Tip: Be honest — overestimating leads to unexecutable strategies.
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
                    <div className="font-semibold text-gold-400 text-sm">Netflix vs Blockbuster</div>
                    <div className="text-xs text-slate-400">How risk profile shaped strategic response</div>
                  </div>

                  <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/30">
                    <div className="text-xs font-semibold text-gold-400 mb-1">Netflix (2007)</div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-gold-400/80 mb-2">
                      <span>Risk: High</span>
                      <span>Agile: High</span>
                      <span>Resources: Moderate</span>
                    </div>
                    <p className="text-xs text-gold-400/80">Bet big on streaming when DVD business was thriving. Transformed from DVD rental to global streaming giant.</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="text-xs font-semibold text-amber-400 mb-1">Blockbuster (2007)</div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-amber-400/80 mb-2">
                      <span>Risk: Low</span>
                      <span>Agile: Low</span>
                      <span>Resources: High</span>
                    </div>
                    <p className="text-xs text-amber-400/80">Had resources but low risk appetite. Rejected streaming pivot. Bankrupt by 2010.</p>
                  </div>

                  <a
                    href="https://chat.openai.com/?q=Compare%20Netflix%20and%20Blockbuster's%20risk%20profiles%20in%202007.%20How%20did%20their%20risk%20appetite%2C%20adaptability%2C%20and%20resource%20allocation%20shape%20their%20strategic%20responses%20to%20digital%20disruption%3F%20What%20lessons%20apply%20to%20Indian%20companies%20today%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explore Netflix vs Blockbuster on ChatGPT
                  </a>
                </div>
              ),
            },
            {
              id: 'tips',
              label: 'Tips',
              icon: Lightbulb,
              content: (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <strong className="text-slate-300 text-xs">Pro Tip:</strong>
                  <p className="text-slate-400 text-xs mt-1">
                    Be honest about your profile. Overestimating adaptability or risk appetite leads to strategies you can't execute.
                  </p>
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
