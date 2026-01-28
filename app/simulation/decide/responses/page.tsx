'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, ExternalLink, GripVertical, RotateCcw, Target, Clock, Shield, Eye, Pause, Home } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { cn } from '@/lib/utils'
import { RESPONSE_TYPES, type ResponseType } from '@/lib/types'

// Icon mapping for response types (Lucide components)
const RESPONSE_ICONS: Record<string, React.ReactNode> = {
  'target': <Target className="w-5 h-5 text-gold-400" />,
  'clock': <Clock className="w-5 h-5 text-gold-400" />,
  'shield': <Shield className="w-5 h-5 text-gold-400" />,
  'eye': <Eye className="w-5 h-5 text-gold-400" />,
  'pause': <Pause className="w-5 h-5 text-slate-400" />,
}

export default function ResponsesPage() {
  const router = useRouter()
  const { scenarios, responseAssignments, setResponseAssignment, setCurrentStep } = useSimulationStore()
  const [draggedScenario, setDraggedScenario] = useState<string | null>(null)
  const [hoveredBucket, setHoveredBucket] = useState<ResponseType | null>(null)

  useEffect(() => {
    setCurrentStep('responses')
  }, [setCurrentStep])

  // Get unassigned scenarios
  const unassignedScenarios = scenarios.filter(s => !responseAssignments[s.id])

  // Get scenarios assigned to each bucket
  const getAssignedScenarios = (responseType: ResponseType) =>
    scenarios.filter(s => responseAssignments[s.id] === responseType)

  const allScenariosAssigned = scenarios.every(s => responseAssignments[s.id])

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, scenarioId: string) => {
    setDraggedScenario(scenarioId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedScenario(null)
    setHoveredBucket(null)
  }

  const handleDragOver = (e: React.DragEvent, responseType: ResponseType) => {
    e.preventDefault()
    setHoveredBucket(responseType)
  }

  const handleDragLeave = () => {
    setHoveredBucket(null)
  }

  const handleDrop = (e: React.DragEvent, responseType: ResponseType) => {
    e.preventDefault()
    if (draggedScenario) {
      setResponseAssignment(draggedScenario, responseType)
    }
    setDraggedScenario(null)
    setHoveredBucket(null)
  }

  // Reset all assignments
  const handleResetAll = () => {
    useSimulationStore.setState({ responseAssignments: {} })
  }

  const QUADRANT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    TL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    TR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    BL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
    BR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
  }

  return (
    <div>
      {/* Top Navigation Bar with Mini Progress */}
      <div className="flex items-center gap-4 mb-4">
        {/* Decide phase progress: responses is step 1 of 3 */}
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

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={() => router.push('/simulation/develop/risk')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/simulation/decide/actions')}
            disabled={!allScenariosAssigned}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h2 className="font-semibold text-white mb-1">Sort Scenarios by Strategic Response</h2>
          <p className="text-sm text-slate-400">
            Drag each scenario into the response bucket that fits best. Think about probability, impact, and your risk profile.
          </p>
        </div>

        {/* Unassigned Scenarios */}
        <div className="bg-slate-800/30 rounded-xl p-4 border border-dashed border-slate-600 min-h-[100px]">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            {unassignedScenarios.length > 0 ? 'Drag scenarios to buckets below' : 'All scenarios assigned ✓'}
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {unassignedScenarios.map((scenario) => {
                const colors = QUADRANT_COLORS[scenario.quadrant] || QUADRANT_COLORS.TL
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, scenario.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'px-4 py-3 rounded-lg cursor-grab active:cursor-grabbing transition-all',
                      'border-2 flex items-center gap-2 select-none',
                      colors.bg, colors.border,
                      draggedScenario === scenario.id && 'opacity-50 scale-95'
                    )}
                  >
                    <GripVertical className="w-4 h-4 text-slate-400" />
                    <span className={cn('font-medium', colors.text)}>{scenario.name}</span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Response Buckets - 2 columns on this side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESPONSE_TYPES.map((response) => {
            const assignedScenarios = getAssignedScenarios(response.id)
            const isHovered = hoveredBucket === response.id

            return (
              <motion.div
                key={response.id}
                onDragOver={(e) => handleDragOver(e, response.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, response.id)}
                className={cn(
                  'rounded-xl border-2 border-dashed p-4 transition-all min-h-[140px]',
                  isHovered
                    ? 'border-gold-500 bg-gold-500/10 scale-[1.02]'
                    : 'border-slate-700 bg-slate-800/50',
                  assignedScenarios.length > 0 && 'border-solid'
                )}
              >
                {/* Bucket Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-slate-700/50">
                    {RESPONSE_ICONS[response.icon] || <Target className="w-5 h-5 text-gold-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{response.name}</div>
                    <p className="text-xs text-slate-400 leading-snug">{response.description}</p>
                  </div>
                </div>

                {/* Drop zone indicator */}
                {assignedScenarios.length === 0 && !isHovered && (
                  <div className="flex items-center justify-center h-12 text-slate-600 text-xs">
                    Drop scenarios here
                  </div>
                )}

                {/* Assigned Scenarios */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {assignedScenarios.map((scenario) => {
                      const colors = QUADRANT_COLORS[scenario.quadrant] || QUADRANT_COLORS.TL
                      return (
                        <motion.div
                          key={scenario.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, scenario.id)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            'px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing',
                            'border flex items-center gap-2 text-sm',
                            colors.bg, colors.border, colors.text,
                            draggedScenario === scenario.id && 'opacity-50'
                          )}
                        >
                          <GripVertical className="w-3 h-3 opacity-50" />
                          <span className="font-medium truncate">{scenario.name}</span>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className={cn(
            'px-3 py-1 rounded-full',
            allScenariosAssigned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
          )}>
            {scenarios.length - unassignedScenarios.length} of {scenarios.length} sorted
          </div>
          {(scenarios.length - unassignedScenarios.length) > 0 && (
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Learning Sidebar - Right Side */}
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
                  <h4 className="font-medium text-gold-400 mb-3">Sorting Tips</h4>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li>• <strong className="text-slate-300">Priority Action:</strong> High probability + high impact</li>
                    <li>• <strong className="text-slate-300">Safeguard:</strong> Low probability but devastating if it happens</li>
                    <li>• <strong className="text-slate-300">Monitor:</strong> Uncertain, watch for early signals</li>
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
                    <div className="font-semibold text-gold-400 text-sm">Shell's Response Strategy</div>
                    <div className="text-xs text-slate-400">How scenario planning shaped responses</div>
                  </div>

                  <p className="text-xs text-slate-400">
                    When Shell's scenarios predicted oil shocks in the 1970s, they prepared multiple responses:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• <strong className="text-slate-300">Shape</strong> — lobbied policy</li>
                    <li>• <strong className="text-slate-300">Adapt</strong> — flexible capacity</li>
                    <li>• <strong className="text-slate-300">Hedge</strong> — diversified</li>
                  </ul>

                  <a
                    href="https://chat.openai.com/?q=Tell%20me%20about%20Shell's%20scenario%20planning%20in%20the%201970s.%20What%20strategic%20responses%20did%20they%20prepare%20for%20the%20oil%20crisis%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explore Shell's responses on ChatGPT
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
                    You can drag scenarios between buckets to reassign them. Not sure? Start with Monitor and promote later.
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
