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
  Lightbulb,
  Flame,
  Shield,
  Building2,
  Rocket,
  Landmark,
  Factory,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Risk profile archetypes in the 2x2 matrix
const RISK_ARCHETYPES = {
  daredevil: {
    name: 'Daredevil',
    position: { appetite: 'high', capacity: 'low' },
    description: 'High risk willingness, but limited ability to survive failures',
    examples: 'Early-stage startups, bootstrapped ventures',
    advice: 'Consider building more runway before big bets',
    color: 'red',
    icon: Flame,
    gridPosition: 'top-left',
  },
  marketMaker: {
    name: 'Market Maker',
    position: { appetite: 'high', capacity: 'high' },
    description: 'Can afford big bets and willing to take them',
    examples: 'Reliance, Tata, well-funded unicorns',
    advice: 'Position to shape industry, not just respond',
    color: 'green',
    icon: Rocket,
    gridPosition: 'top-right',
  },
  cautiousSurvivor: {
    name: 'Cautious Survivor',
    position: { appetite: 'low', capacity: 'low' },
    description: 'Must play safe due to limited resources',
    examples: 'SMEs, family businesses in transition',
    advice: 'Focus on monitoring, build capacity first',
    color: 'amber',
    icon: Shield,
    gridPosition: 'bottom-left',
  },
  steadyExpander: {
    name: 'Steady Expander',
    position: { appetite: 'low', capacity: 'high' },
    description: 'Could take more risk but chooses stability',
    examples: 'PSUs, large banks, established MNCs',
    advice: 'May be missing opportunities to innovate',
    color: 'blue',
    icon: Landmark,
    gridPosition: 'bottom-right',
  },
}

// Appetite level labels
const APPETITE_LABELS: Record<number, { label: string; description: string }> = {
  1: { label: 'Very Conservative', description: 'Avoid risk at all costs' },
  2: { label: 'Conservative', description: 'Prefer proven approaches' },
  3: { label: 'Moderate', description: 'Selective risk-taking' },
  4: { label: 'Aggressive', description: 'Embrace calculated risks' },
  5: { label: 'Very Aggressive', description: 'First-mover mentality' },
}

// Capacity level labels
const CAPACITY_LABELS: Record<number, { label: string; description: string }> = {
  1: { label: 'Very Limited', description: 'One failure could be existential' },
  2: { label: 'Limited', description: 'Can absorb small setbacks' },
  3: { label: 'Moderate', description: 'Reasonable buffer for risks' },
  4: { label: 'Substantial', description: 'Well-capitalized, diversified' },
  5: { label: 'Very Substantial', description: 'Can weather major storms' },
}

export default function Phase7Page() {
  const router = useRouter()
  const { setPhase, completePhase, riskProfile, setRiskProfile } = useSimulationStore()

  const [showSpectrum, setShowSpectrum] = useState(true)
  const [showDeepDive, setShowDeepDive] = useState(false)
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null)

  useEffect(() => {
    setPhase(7)
  }, [setPhase])

  const handleContinue = () => {
    completePhase(7)
    setPhase(8)
    router.push('/simulation/phase-8')
  }

  const handleAppetiteChange = (value: number) => {
    setRiskProfile({ ...riskProfile, appetite: value })
  }

  const handleCapacityChange = (value: number) => {
    setRiskProfile({ ...riskProfile, capacity: value })
  }

  // Determine which archetype the user falls into
  const getCurrentArchetype = () => {
    const highAppetite = riskProfile.appetite >= 4
    const highCapacity = riskProfile.capacity >= 4

    if (highAppetite && highCapacity) return 'marketMaker'
    if (highAppetite && !highCapacity) return 'daredevil'
    if (!highAppetite && highCapacity) return 'steadyExpander'
    return 'cautiousSurvivor'
  }

  const currentArchetype = RISK_ARCHETYPES[getCurrentArchetype()]

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <p className="text-navy-600">
          Understanding your organization's risk profile helps calibrate which scenarios
          require action vs. monitoring. Assess both your willingness and ability to take risks.
        </p>

        {/* Risk Profile Sliders */}
        <div className="bg-white rounded-xl border border-navy-200 p-6 space-y-8">
          {/* Risk Appetite */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900">Risk Appetite</h3>
                <p className="text-sm text-navy-500">
                  How much risk do we <em>want</em> to take?
                </p>
              </div>
            </div>

            <div className="pl-13">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={riskProfile.appetite}
                onChange={(e) => handleAppetiteChange(parseFloat(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between mt-2 text-xs text-navy-500">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
              <div className="mt-3 bg-orange-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">
                    {APPETITE_LABELS[Math.round(riskProfile.appetite)].label}
                  </span>
                  <span className="text-lg font-bold text-orange-600">{riskProfile.appetite}</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  {APPETITE_LABELS[Math.round(riskProfile.appetite)].description}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Capacity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900">Risk Capacity</h3>
                <p className="text-sm text-navy-500">
                  How much risk <em>can</em> we survive?
                </p>
              </div>
            </div>

            <div className="pl-13">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={riskProfile.capacity}
                onChange={(e) => handleCapacityChange(parseFloat(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between mt-2 text-xs text-navy-500">
                <span>Limited</span>
                <span>Substantial</span>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    {CAPACITY_LABELS[Math.round(riskProfile.capacity)].label}
                  </span>
                  <span className="text-lg font-bold text-blue-600">{riskProfile.capacity}</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  {CAPACITY_LABELS[Math.round(riskProfile.capacity)].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Position Card */}
        <motion.div
          key={getCurrentArchetype()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-xl border-2 p-6',
            currentArchetype.color === 'red' && 'bg-red-50 border-red-300',
            currentArchetype.color === 'green' && 'bg-green-50 border-green-300',
            currentArchetype.color === 'amber' && 'bg-amber-50 border-amber-300',
            currentArchetype.color === 'blue' && 'bg-blue-50 border-blue-300'
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                currentArchetype.color === 'red' && 'bg-red-100',
                currentArchetype.color === 'green' && 'bg-green-100',
                currentArchetype.color === 'amber' && 'bg-amber-100',
                currentArchetype.color === 'blue' && 'bg-blue-100'
              )}
            >
              <currentArchetype.icon
                className={cn(
                  'w-6 h-6',
                  currentArchetype.color === 'red' && 'text-red-600',
                  currentArchetype.color === 'green' && 'text-green-600',
                  currentArchetype.color === 'amber' && 'text-amber-600',
                  currentArchetype.color === 'blue' && 'text-blue-600'
                )}
              />
            </div>
            <div className="flex-1">
              <h3
                className={cn(
                  'font-bold text-lg mb-1',
                  currentArchetype.color === 'red' && 'text-red-800',
                  currentArchetype.color === 'green' && 'text-green-800',
                  currentArchetype.color === 'amber' && 'text-amber-800',
                  currentArchetype.color === 'blue' && 'text-blue-800'
                )}
              >
                Your Profile: "{currentArchetype.name}"
              </h3>
              <p
                className={cn(
                  'text-sm mb-3',
                  currentArchetype.color === 'red' && 'text-red-700',
                  currentArchetype.color === 'green' && 'text-green-700',
                  currentArchetype.color === 'amber' && 'text-amber-700',
                  currentArchetype.color === 'blue' && 'text-blue-700'
                )}
              >
                {currentArchetype.description}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 opacity-60" />
                  <span className="opacity-80">Like: {currentArchetype.examples}</span>
                </div>
              </div>
              <div
                className={cn(
                  'mt-3 p-2 rounded-lg text-xs font-medium',
                  currentArchetype.color === 'red' && 'bg-red-100 text-red-800',
                  currentArchetype.color === 'green' && 'bg-green-100 text-green-800',
                  currentArchetype.color === 'amber' && 'bg-amber-100 text-amber-800',
                  currentArchetype.color === 'blue' && 'bg-blue-100 text-blue-800'
                )}
              >
                💡 {currentArchetype.advice}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-6')}>
            ← Back
          </Button>
          <Button onClick={handleContinue}>
            Continue to Response Strategy
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Risk Spectrum Visualizer */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setShowSpectrum(!showSpectrum)}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">📊 Risk Profile Archetypes</div>
                <div className="text-xs opacity-80">Where companies fit</div>
              </div>
              {showSpectrum ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showSpectrum && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  {/* 2x2 Grid */}
                  <div className="relative">
                    {/* Labels */}
                    <div className="text-center text-xs text-navy-500 mb-2">RISK CAPACITY →</div>

                    <div className="flex">
                      {/* Y-axis label */}
                      <div className="w-6 flex items-center justify-center">
                        <div className="transform -rotate-90 whitespace-nowrap text-xs text-navy-500">
                          APPETITE →
                        </div>
                      </div>

                      {/* Grid */}
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {Object.entries(RISK_ARCHETYPES).map(([key, archetype]) => {
                          const isActive = getCurrentArchetype() === key
                          const isHovered = hoveredArchetype === key

                          return (
                            <motion.div
                              key={key}
                              onMouseEnter={() => setHoveredArchetype(key)}
                              onMouseLeave={() => setHoveredArchetype(null)}
                              className={cn(
                                'p-3 rounded-lg border-2 cursor-pointer transition-all',
                                archetype.color === 'red' && 'bg-red-50 border-red-200',
                                archetype.color === 'green' && 'bg-green-50 border-green-200',
                                archetype.color === 'amber' && 'bg-amber-50 border-amber-200',
                                archetype.color === 'blue' && 'bg-blue-50 border-blue-200',
                                isActive && 'ring-2 ring-offset-1 ring-navy-400',
                                isHovered && 'scale-105'
                              )}
                              style={{
                                gridRow:
                                  archetype.gridPosition.includes('top') ? 1 : 2,
                                gridColumn:
                                  archetype.gridPosition.includes('left') ? 1 : 2,
                              }}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <archetype.icon
                                  className={cn(
                                    'w-3 h-3',
                                    archetype.color === 'red' && 'text-red-600',
                                    archetype.color === 'green' && 'text-green-600',
                                    archetype.color === 'amber' && 'text-amber-600',
                                    archetype.color === 'blue' && 'text-blue-600'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'text-xs font-bold',
                                    archetype.color === 'red' && 'text-red-700',
                                    archetype.color === 'green' && 'text-green-700',
                                    archetype.color === 'amber' && 'text-amber-700',
                                    archetype.color === 'blue' && 'text-blue-700'
                                  )}
                                >
                                  {archetype.name}
                                </span>
                              </div>
                              <p
                                className={cn(
                                  'text-[10px]',
                                  archetype.color === 'red' && 'text-red-600',
                                  archetype.color === 'green' && 'text-green-600',
                                  archetype.color === 'amber' && 'text-amber-600',
                                  archetype.color === 'blue' && 'text-blue-600'
                                )}
                              >
                                {archetype.examples}
                              </p>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Axis labels */}
                    <div className="flex justify-between mt-2 text-[10px] text-navy-400 pl-6">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <p className="text-xs text-navy-500 mt-3">
                    Click any quadrant to learn about response strategies for that profile.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Deep Dive: Appetite vs Capacity */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setShowDeepDive(!showDeepDive)}
            className="w-full px-4 py-3 text-left border-b border-navy-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-navy-900">Why Both Matter</div>
                <div className="text-xs text-navy-500">Appetite vs Capacity explained</div>
              </div>
              {showDeepDive ? (
                <ChevronUp className="w-4 h-4 text-navy-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-navy-400" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showDeepDive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Risk Appetite</span>
                    </div>
                    <p className="text-xs text-orange-700">
                      "How much risk do we WANT to take?" - driven by:
                    </p>
                    <ul className="text-xs text-orange-600 mt-2 space-y-1 pl-4">
                      <li>• Culture & leadership philosophy</li>
                      <li>• History of risk-taking</li>
                      <li>• Competitive ambition</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Risk Capacity</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      "How much risk CAN we survive?" - driven by:
                    </p>
                    <ul className="text-xs text-blue-600 mt-2 space-y-1 pl-4">
                      <li>• Balance sheet strength</li>
                      <li>• Cash runway & reserves</li>
                      <li>• Revenue diversification</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="text-xs font-bold text-red-700 mb-1">⚠️ Mismatch Problem</div>
                    <p className="text-xs text-red-600">
                      <strong>High appetite + Low capacity</strong> = Reckless
                      <br />
                      <span className="opacity-75">(Example: WeWork's aggressive expansion)</span>
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      <strong>Low appetite + High capacity</strong> = Missed opportunities
                      <br />
                      <span className="opacity-75">(Example: Kodak ignoring digital)</span>
                    </p>
                  </div>

                  <a
                    href={`https://chat.openai.com/?q=${encodeURIComponent(
                      'Explain the difference between risk appetite and risk capacity in strategic planning. Cover: 1) How to assess organizational risk appetite (cultural factors, leadership style), 2) How to measure risk capacity (balance sheet metrics, runway), 3) What happens when appetite and capacity are mismatched - give examples like WeWork and Kodak, 4) How to align risk-taking with organizational capacity.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                    How to assess your organization's true risk capacity →
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Tip */}
        <div className="bg-navy-50 rounded-lg p-3 text-xs text-navy-600">
          <strong>Tip:</strong> Be honest about capacity. Organizations often overestimate
          their ability to weather storms. Consider: "If our biggest bet fails, can we survive?"
        </div>
      </div>
    </div>
  )
}
