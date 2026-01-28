'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowDown,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit3,
  ExternalLink,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Check,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react'

// TUNA framework items
const TUNA_ITEMS = [
  {
    letter: 'T',
    title: 'Trends',
    question: 'Does it extend current observable trends?',
    description: 'Good narratives build on real, measurable movements already underway.',
  },
  {
    letter: 'U',
    title: 'Uncertainties',
    question: 'Does it explore the "what ifs"?',
    description: 'Each scenario should represent a different resolution of key uncertainties.',
  },
  {
    letter: 'N',
    title: 'Novelties',
    question: 'Does it include surprising but plausible developments?',
    description: 'The best scenarios contain unexpected elements that make people say "I hadn\'t thought of that."',
  },
  {
    letter: 'A',
    title: 'Assumptions',
    question: 'Are underlying assumptions explicit?',
    description: 'Make visible what you\'re taking for granted about how the world works.',
  },
]

// Quadrant position helper - TL/TR/BL/BR format
const QUADRANT_LABELS: Record<string, { x: 'low' | 'high'; y: 'low' | 'high'; position: string }> = {
  TL: { x: 'low', y: 'high', position: 'Top-Left' },
  TR: { x: 'high', y: 'high', position: 'Top-Right' },
  BL: { x: 'low', y: 'low', position: 'Bottom-Left' },
  BR: { x: 'high', y: 'low', position: 'Bottom-Right' },
}

// Time horizon options
const TIME_HORIZONS = [
  { value: 3, label: '3 Years', description: 'Near-term, tactical' },
  { value: 5, label: '5 Years', description: 'Medium-term, strategic' },
  { value: 10, label: '10 Years', description: 'Long-term, transformational' },
]

export default function Phase5Page() {
  const router = useRouter()
  const {
    setPhase,
    completePhase,
    scenarios,
    updateScenario,
    xAxis,
    yAxis,
    xAxisLabels,
    yAxisLabels,
    industry,
    focalIssue,
    timeHorizon,
    setTimeHorizon,
  } = useSimulationStore()

  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const [editingScenario, setEditingScenario] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showTunaTest, setShowTunaTest] = useState(false)
  const [tunaChecks, setTunaChecks] = useState<Record<string, boolean>>({})
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState(timeHorizon || 5)

  useEffect(() => {
    setPhase(5)
  }, [setPhase])

  // Check if all scenarios have narratives
  const allNarrativesComplete = scenarios.every((s) => s.narrative && s.narrative.length > 50)

  const handleContinue = () => {
    completePhase(5)
    setPhase(6)
    router.push('/simulation/phase-6')
  }

  const startEditing = (scenarioId: string, currentNarrative: string) => {
    setEditingScenario(scenarioId)
    setEditContent(currentNarrative)
  }

  const saveEdit = (scenarioId: string) => {
    updateScenario(scenarioId, { narrative: editContent })
    setEditingScenario(null)
    setEditContent('')
  }

  const cancelEdit = () => {
    setEditingScenario(null)
    setEditContent('')
  }

  const handleTimeHorizonChange = (years: number) => {
    setSelectedTimeHorizon(years)
    setTimeHorizon(years)
  }

  // Build ChatGPT prompt for narrative generation
  const buildNarrativePrompt = (scenario: typeof scenarios[0]) => {
    const quadrant = QUADRANT_LABELS[scenario.quadrant]
    const xLabel = quadrant.x === 'high' ? xAxisLabels.high : xAxisLabels.low
    const yLabel = quadrant.y === 'high' ? yAxisLabels.high : yAxisLabels.low

    return encodeURIComponent(
      `I'm doing scenario planning for ${industry || 'my organization'} focused on: "${focalIssue || 'strategic challenges'}".

I need a rich, vivid narrative for a scenario called "${scenario.name}" with these conditions:
- ${xAxis?.name || 'X-Axis'}: ${xLabel} (${quadrant.x})
- ${yAxis?.name || 'Y-Axis'}: ${yLabel} (${quadrant.y})

Time horizon: ${selectedTimeHorizon} years from now

Please write a 2-3 paragraph narrative that:
1. Opens with a specific, dated event or announcement that signals this world
2. Describes how daily life/business operations look different
3. Names specific actors, technologies, or policies (even if fictional)
4. Includes concrete numbers and statistics
5. Shows cause-effect chains between developments
6. Ends with an implication for strategic planning

Make it vivid and specific, not generic. Use the TUNA framework: include observable Trends, resolved Uncertainties, surprising Novelties, and explicit Assumptions.`
    )
  }

  return (
    <div className="flex gap-8">
      {/* Main Content - Left Side */}
      <div className="flex-1 space-y-6">
        <p className="text-navy-600">
          Transform your scenario names into rich, plausible narratives. Good narratives are
          specific, vivid, and help teams "live" in each possible future.
        </p>

        {/* Time Horizon Selector */}
        <div className="bg-white rounded-xl border border-navy-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-navy-500" />
            <span className="text-sm font-medium text-navy-700">Narrative Time Horizon</span>
          </div>
          <div className="flex gap-2">
            {TIME_HORIZONS.map((horizon) => (
              <button
                key={horizon.value}
                onClick={() => handleTimeHorizonChange(horizon.value)}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  selectedTimeHorizon === horizon.value
                    ? 'bg-gold-50 border-gold-300 ring-1 ring-gold-300'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-semibold text-navy-800">{horizon.label}</div>
                <div className="text-xs text-navy-500">{horizon.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-4">
          {scenarios.map((scenario) => {
            const quadrant = QUADRANT_LABELS[scenario.quadrant]
            const isExpanded = expandedScenario === scenario.id
            const isEditing = editingScenario === scenario.id
            const hasNarrative = scenario.narrative && scenario.narrative.length > 0

            return (
              <motion.div
                key={scenario.id}
                className="bg-white rounded-xl border border-navy-200 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-navy-50 transition-colors"
                  onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                        hasNarrative
                          ? 'bg-green-100 text-green-700'
                          : 'bg-navy-100 text-navy-600'
                      }`}
                    >
                      {hasNarrative ? <CheckCircle2 className="w-5 h-5" /> : quadrant.position[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-navy-800">{scenario.name}</div>
                      <div className="text-xs text-navy-500">
                        {xAxisLabels[quadrant.x]} {xAxis?.name || 'X'} ×{' '}
                        {yAxisLabels[quadrant.y]} {yAxis?.name || 'Y'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasNarrative && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        Narrative ready
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-navy-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-navy-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 border-t border-navy-100 pt-4">
                        {isEditing ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full h-48 p-3 text-sm border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-300 focus:border-gold-300 resize-none"
                              placeholder="Write your scenario narrative here..."
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => saveEdit(scenario.id)}>
                                <Check className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : hasNarrative ? (
                          // Display Mode
                          <div className="space-y-3">
                            <p className="text-sm text-navy-700 leading-relaxed whitespace-pre-wrap">
                              {scenario.narrative}
                            </p>
                            <div className="flex justify-between items-center pt-2 border-t border-navy-100">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(scenario.id, scenario.narrative || '')}
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <a
                                href={`https://chat.openai.com/?q=${buildNarrativePrompt(scenario)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-navy-500 hover:text-navy-700"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Regenerate with ChatGPT
                              </a>
                            </div>
                          </div>
                        ) : (
                          // Empty State - Generate
                          <div className="text-center py-6">
                            <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Sparkles className="w-6 h-6 text-gold-600" />
                            </div>
                            <p className="text-sm text-navy-600 mb-4">
                              Generate a rich narrative for this scenario using AI
                            </p>
                            <div className="flex justify-center gap-3">
                              <a
                                href={`https://chat.openai.com/?q=${buildNarrativePrompt(scenario)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Generate with ChatGPT
                              </a>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(scenario.id, '')}
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Write / Paste
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Validation Message */}
        {!allNarrativesComplete && (
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Complete narratives for all four scenarios before continuing. Each narrative should
              be at least a few sentences describing what this future looks like.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-200">
          <Button variant="ghost" onClick={() => router.push('/simulation/phase-4')}>
            ← Back
          </Button>
          <Button onClick={handleContinue} disabled={!allNarrativesComplete}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Sidebar - Right Side */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Before/After Transformer */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-800">
              What Makes a Good Narrative?
            </span>
          </div>

          {/* Before */}
          <div className="bg-white/60 rounded-lg p-3 mb-2 border border-red-200">
            <div className="flex items-center gap-1 mb-2">
              <X className="w-3 h-3 text-red-500" />
              <span className="text-xs font-medium text-red-700">BEFORE (Vague)</span>
            </div>
            <p className="text-xs text-navy-600 italic">
              "In this scenario, regulation is high and adoption is low. Companies struggle.
              The market is difficult."
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-2">
            <ArrowDown className="w-4 h-4 text-violet-400" />
          </div>

          {/* After */}
          <div className="bg-white/60 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-1 mb-2">
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-green-700">AFTER (Vivid)</span>
            </div>
            <p className="text-xs text-navy-600 italic">
              "By 2028, the AI Accountability Act requires algorithmic audits for any
              customer-facing AI. Compliance costs hit ₹2Cr annually. Meanwhile, consumer
              trust surveys show 68% prefer human service. Startups pivot to 'human-in-loop'
              models. Legacy players like TCS gain ground..."
            </p>
          </div>

          {/* Key Differences */}
          <div className="mt-3 pt-3 border-t border-violet-200">
            <p className="text-xs font-medium text-violet-700 mb-2">Key differences:</p>
            <ul className="text-xs text-navy-600 space-y-1">
              <li className="flex items-start gap-1">
                <span className="text-violet-400">•</span>
                Specific year and regulation name
              </li>
              <li className="flex items-start gap-1">
                <span className="text-violet-400">•</span>
                Concrete numbers (₹2Cr, 68%)
              </li>
              <li className="flex items-start gap-1">
                <span className="text-violet-400">•</span>
                Named actors (TCS, startups)
              </li>
              <li className="flex items-start gap-1">
                <span className="text-violet-400">•</span>
                Cause-effect chains
              </li>
            </ul>
          </div>
        </div>

        {/* TUNA Test Checklist */}
        <div className="bg-white rounded-xl border border-navy-200 p-4">
          <button
            onClick={() => setShowTunaTest(!showTunaTest)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-navy-600" />
              <span className="text-sm font-semibold text-navy-800">
                The TUNA Test
              </span>
            </div>
            {showTunaTest ? (
              <ChevronUp className="w-4 h-4 text-navy-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-navy-400" />
            )}
          </button>

          <AnimatePresence>
            {showTunaTest && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 pt-3 border-t border-navy-100"
              >
                <p className="text-xs text-navy-600 mb-3">
                  Check your narrative against this framework:
                </p>
                <div className="space-y-3">
                  {TUNA_ITEMS.map((item) => (
                    <div
                      key={item.letter}
                      className="flex items-start gap-2 group"
                    >
                      <button
                        onClick={() =>
                          setTunaChecks((prev) => ({
                            ...prev,
                            [item.letter]: !prev[item.letter],
                          }))
                        }
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          tunaChecks[item.letter]
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-navy-100 text-navy-600 border border-navy-200 hover:border-navy-300'
                        }`}
                      >
                        {tunaChecks[item.letter] ? <Check className="w-3 h-3" /> : item.letter}
                      </button>
                      <div>
                        <div className="text-xs font-medium text-navy-700">
                          {item.title}
                        </div>
                        <div className="text-xs text-navy-500">{item.question}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deep Dive Link */}
                <div className="mt-4 pt-3 border-t border-navy-100">
                  <a
                    href={`https://chat.openai.com/?q=${encodeURIComponent(
                      'Explain the TUNA framework (Trends, Uncertainties, Novelties, Assumptions) for evaluating scenario planning narratives. How do military strategists and corporate planners use it? Give examples of each element.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-navy-500 hover:text-navy-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    How strategists write narratives →
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Tips */}
        <div className="bg-gold-50 rounded-xl border border-gold-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-semibold text-gold-800">Quick Tips</span>
          </div>
          <ul className="text-xs text-gold-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">→</span>
              <span>Start narratives with a specific dated event: "In March 2027..."</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">→</span>
              <span>Include real company names or realistic fictional ones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">→</span>
              <span>Add statistics even if estimated (makes it feel real)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">→</span>
              <span>End with "Meanwhile..." to show interconnections</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
