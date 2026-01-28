'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generateId } from '@/lib/utils'
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react'

// Famous Example: Shell's Scenario Planning
const SHELL_EXAMPLE = {
  title: "Learn from the Masters: Shell's Scenario Planning",
  intro: "In 1972, Shell's planners created scenarios that predicted the oil crisis - when others didn't.",
  insight: "Their secret? Evocative scenario names that stuck:",
  goodNames: [
    { name: 'The Greening of Russia', why: 'Paints a vivid picture' },
    { name: 'World of Internal Markets', why: 'Describes a system' },
    { name: 'Sustainable World', why: 'Aspirational, memorable' },
  ],
  badNames: [
    { name: 'Scenario A', why: 'Generic, forgettable' },
    { name: 'High Growth Case', why: 'Just a variable, not a world' },
    { name: 'Best Case', why: 'Judgmental, biased' },
  ],
  principles: [
    'Memorable - you can recall them in a meeting',
    'Evocative - paint a mental picture',
    'Neutral - no "good" or "bad" judgment',
  ],
  chatGptPrompt: `Explain Shell's scenario planning methodology from the 1970s:

1. How did Pierre Wack develop the scenario planning approach at Shell?
2. What were the famous scenarios that predicted the 1973 oil crisis?
3. Why did Shell outperform other oil companies during the crisis?
4. How do good scenario names contribute to strategic thinking?
5. What are examples of famous scenario names from Shell and other organizations?

Include specific examples and explain why evocative naming matters for scenario adoption.`,
}

// Naming Guide - Good vs Bad comparison
const NAMING_GUIDE = {
  title: 'How to Name Your Quadrants',
  examples: [
    {
      good: { name: 'Digital Fortress', reason: 'Evocative, memorable, paints a picture' },
      bad: { name: 'High Regulation + High Adoption', reason: 'Just restates the axes, not memorable' },
    },
    {
      good: { name: 'Wild West', reason: 'Instantly understood, culturally resonant' },
      bad: { name: 'Scenario 3', reason: 'Generic, forgettable' },
    },
    {
      good: { name: 'Monsoon of Disruption', reason: 'Metaphorical, Indian context' },
      bad: { name: 'Worst Case', reason: 'Judgmental, creates bias' },
    },
  ],
  test: 'Can you say "If we end up in [NAME], we need to..." in a strategy meeting?',
}

// Quadrant position mapping - TL/TR/BL/BR format
const QUADRANT_POSITIONS = [
  { id: 'TL', row: 0, col: 0, xLevel: 'low', yLevel: 'high', label: 'Low X + High Y' },
  { id: 'TR', row: 0, col: 1, xLevel: 'high', yLevel: 'high', label: 'High X + High Y' },
  { id: 'BL', row: 1, col: 0, xLevel: 'low', yLevel: 'low', label: 'Low X + Low Y' },
  { id: 'BR', row: 1, col: 1, xLevel: 'high', yLevel: 'low', label: 'High X + Low Y' },
]

export default function Phase4Page() {
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
    setAxisLabels,
    setScenarios,
    setPhase,
    completePhase,
  } = useSimulationStore()

  useEffect(() => {
    setPhase(4)
  }, [setPhase])

  const handleXLabelChange = (level: 'low' | 'high', value: string) => {
    setAxisLabels('x', { ...xAxisLabels, [level]: value })
  }

  const handleYLabelChange = (level: 'low' | 'high', value: string) => {
    setAxisLabels('y', { ...yAxisLabels, [level]: value })
  }

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

    // Create the 4 scenarios
    const scenarios = QUADRANT_POSITIONS.map((pos) => ({
      id: generateId(),
      name: scenarioNames[pos.id],
      quadrant: pos.id as 'TL' | 'TR' | 'BL' | 'BR',
      narrative: '',
      timeHorizon: 5,  // Default 5 years, will be adjusted in Phase 5
      tone: 0,         // Neutral
      complexity: 2,   // Medium
      earlySignals: [],
      keyCapabilities: [],
    }))

    setScenarios(scenarios)
    completePhase(4)
    setPhase(5)
    router.push('/simulation/phase-5')
  }

  const openChatGpt = (prompt: string) => {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-50 to-indigo-50 rounded-xl p-4 border border-navy-200">
          <h2 className="font-semibold text-navy-900 mb-1">Build Your 2x2 Scenario Matrix</h2>
          <p className="text-sm text-navy-600">
            Name the extremes of each axis and give each quadrant an evocative, memorable name.
          </p>
        </div>

        {/* Axis Labels Section */}
        <div className="bg-white rounded-xl border border-navy-200 p-5 space-y-6">
          <h3 className="font-medium text-navy-900">Step 1: Name Your Axis Extremes</h3>

          {/* X-Axis Labels */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">X</span>
              <span className="font-medium text-navy-800">{xAxis?.name || 'X-Axis'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-10">
              <div>
                <label className="text-xs text-navy-500 mb-1 block">Low end (left side)</label>
                <input
                  type="text"
                  value={xAxisLabels.low}
                  onChange={(e) => handleXLabelChange('low', e.target.value)}
                  placeholder="e.g., Laissez-faire"
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-navy-500 mb-1 block">High end (right side)</label>
                <input
                  type="text"
                  value={xAxisLabels.high}
                  onChange={(e) => handleXLabelChange('high', e.target.value)}
                  placeholder="e.g., Strict Oversight"
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Y-Axis Labels */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">Y</span>
              <span className="font-medium text-navy-800">{yAxis?.name || 'Y-Axis'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-10">
              <div>
                <label className="text-xs text-navy-500 mb-1 block">Low end (bottom)</label>
                <input
                  type="text"
                  value={yAxisLabels.low}
                  onChange={(e) => handleYLabelChange('low', e.target.value)}
                  placeholder="e.g., Skeptical"
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-navy-500 mb-1 block">High end (top)</label>
                <input
                  type="text"
                  value={yAxisLabels.high}
                  onChange={(e) => handleYLabelChange('high', e.target.value)}
                  placeholder="e.g., Enthusiastic"
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Matrix with Scenario Names */}
        <div className="bg-white rounded-xl border border-navy-200 p-5">
          <h3 className="font-medium text-navy-900 mb-4">Step 2: Name Your Four Scenarios</h3>

          {/* Matrix Container */}
          <div className="flex gap-4">
            {/* Y-Axis Label (Vertical) - Fixed alignment */}
            <div className="flex flex-col justify-center items-center w-8 py-8">
              <span className="text-[10px] text-green-600 font-medium whitespace-nowrap">
                {yAxisLabels.high || 'High'}
              </span>
              <div className="flex-1 flex items-center justify-center my-2">
                <span className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-green-700">
                  {yAxis?.name || 'Y-Axis'}
                </span>
              </div>
              <span className="text-[10px] text-green-600 font-medium whitespace-nowrap">
                {yAxisLabels.low || 'Low'}
              </span>
            </div>

            {/* Matrix Grid */}
            <div className="flex-1">
              {/* Y High Label */}
              <div className="text-center mb-2 text-xs text-green-600 font-medium">
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
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-dashed border-navy-200 bg-navy-50'
                    )}
                  >
                    {/* Quadrant Description */}
                    <div className="text-xs text-navy-500 mb-2">
                      {pos.xLevel === 'low' ? xAxisLabels.low || 'Low X' : xAxisLabels.high || 'High X'}
                      {' + '}
                      {pos.yLevel === 'low' ? yAxisLabels.low || 'Low Y' : yAxisLabels.high || 'High Y'}
                    </div>

                    {/* Scenario Name Input */}
                    <input
                      type="text"
                      value={scenarioNames[pos.id]}
                      onChange={(e) => handleScenarioNameChange(pos.id, e.target.value)}
                      placeholder="Name this scenario..."
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center',
                        'border-0 bg-transparent focus:outline-none focus:bg-white',
                        scenarioNames[pos.id] ? 'text-indigo-900' : 'text-navy-400'
                      )}
                    />

                    {/* Validation indicator */}
                    {scenarioNames[pos.id] && (
                      <div className="text-xs text-emerald-600 text-center mt-1">
                        ✓ Named
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Y Low Label */}
              <div className="text-center mt-2 text-xs text-green-600 font-medium">
                ↓ {yAxisLabels.low || 'Low Y'}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between mt-4 text-xs text-blue-600 font-medium px-4">
                <span>← {xAxisLabels.low || 'Low X'}</span>
                <span className="text-navy-700">{xAxis?.name || 'X-Axis'}</span>
                <span>{xAxisLabels.high || 'High X'} →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-3')}>
            ← Back to Axis Selection
          </Button>
          <Button onClick={handleContinue} disabled={!isComplete}>
            Continue to Scenario Narratives
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Sidebar */}
      <div className="lg:col-span-1 space-y-5">
        {/* Shell Example - Famous Example Showcase */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setExpandedLearning(expandedLearning === 'shell' ? null : 'shell')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-white text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold flex items-center gap-2">
                  <span>🏛️</span> {SHELL_EXAMPLE.title}
                </div>
                <div className="text-xs opacity-80">Real-world case study</div>
              </div>
              {expandedLearning === 'shell' ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {expandedLearning === 'shell' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <p className="text-sm text-navy-700">{SHELL_EXAMPLE.intro}</p>
                  <p className="text-sm text-navy-600 font-medium">{SHELL_EXAMPLE.insight}</p>

                  {/* Good vs Bad Names */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-600">✓ GOOD</div>
                      {SHELL_EXAMPLE.goodNames.map((item, i) => (
                        <div key={i} className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                          <div className="text-xs font-medium text-emerald-800">{item.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-red-600">✗ BAD</div>
                      {SHELL_EXAMPLE.badNames.map((item, i) => (
                        <div key={i} className="bg-red-50 rounded-lg p-2 border border-red-200">
                          <div className="text-xs font-medium text-red-800">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Principles */}
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-amber-800 mb-2">Good names are:</div>
                    <ul className="text-xs text-amber-700 space-y-1">
                      {SHELL_EXAMPLE.principles.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* ChatGPT Link */}
                  <button
                    onClick={() => openChatGpt(SHELL_EXAMPLE.chatGptPrompt)}
                    className="w-full flex items-center justify-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 py-2 bg-indigo-50 rounded-lg"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explore Shell's methodology deeply →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Naming Guide - Visual Comparison */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <button
            onClick={() => setExpandedLearning(expandedLearning === 'naming' ? null : 'naming')}
            className="w-full px-4 py-3 text-left border-b border-navy-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-navy-900">{NAMING_GUIDE.title}</div>
                <div className="text-xs text-navy-500">Good vs bad examples</div>
              </div>
              {expandedLearning === 'naming' ? (
                <ChevronUp className="w-4 h-4 text-navy-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-navy-400" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {expandedLearning === 'naming' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {NAMING_GUIDE.examples.map((example, i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-emerald-600">✓ GOOD:</span>
                          <span className="text-sm font-medium text-emerald-800">"{example.good.name}"</span>
                        </div>
                        <p className="text-xs text-emerald-700">{example.good.reason}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-red-600">✗ BAD:</span>
                          <span className="text-sm font-medium text-red-800">"{example.bad.name}"</span>
                        </div>
                        <p className="text-xs text-red-700">{example.bad.reason}</p>
                      </div>
                    </div>
                  ))}

                  {/* The Test */}
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <div className="text-xs font-medium text-indigo-800 mb-1">🧪 The Test:</div>
                    <p className="text-xs text-indigo-700 italic">{NAMING_GUIDE.test}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Naming Assistance */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-800 mb-2">Need naming inspiration?</p>
              <button
                onClick={() => openChatGpt(`I'm building a 2x2 scenario matrix for scenario planning.

My X-axis is: "${xAxis?.name || '[X-Axis Force]'}"
- Low end: "${xAxisLabels.low || '[low label]'}"
- High end: "${xAxisLabels.high || '[high label]'}"

My Y-axis is: "${yAxis?.name || '[Y-Axis Force]'}"
- Low end: "${yAxisLabels.low || '[low label]'}"
- High end: "${yAxisLabels.high || '[high label]'}"

Help me create evocative, memorable names for each of the 4 quadrants:
1. Low X + High Y (top-left)
2. High X + High Y (top-right)
3. Low X + Low Y (bottom-left)
4. High X + Low Y (bottom-right)

For each quadrant:
- Suggest 3 possible names that are evocative, memorable, and neutral (not "best case" or "worst case")
- The names should paint a mental picture and be usable in a sentence like "If we end up in [NAME], we need to..."
- Use metaphors, cultural references, or vivid imagery

This is for a company in India doing strategic planning.`)}
                className="w-full text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white py-2 px-3 rounded-lg border border-indigo-200"
              >
                Get AI naming suggestions →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-navy-50 rounded-lg p-3 text-xs text-navy-600">
          <strong>Tip:</strong> Start with the extreme labels for your axes, then name each scenario. Good names make scenarios memorable and useful in strategy discussions.
        </div>
      </div>
    </div>
  )
}
