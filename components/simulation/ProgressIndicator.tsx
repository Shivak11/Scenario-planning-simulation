'use client'

import { usePathname } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { PHASE_NAMES, type SimulationPhase, MAIN_PHASE_CONFIG, SUB_STEP_CONFIG, type MainPhase, type SubStep, PHASE_ORDER } from '@/lib/types'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Compass, Grid3X3, Layers, Target, LucideIcon } from 'lucide-react'
import { useState } from 'react'

// Map icon names from types.ts to actual Lucide components
const PHASE_ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  grid3x3: Grid3X3,
  layers: Layers,
  target: Target,
}

interface ProgressIndicatorProps {
  className?: string
}

// Check if we're on the new 4-phase route structure
function useNewRouteStructure(pathname: string | null) {
  if (!pathname) return { isNewStructure: false, mainPhase: null, subStep: null }

  const newRouteMatch = pathname.match(/\/simulation\/(discover|design|develop|decide)\/([a-z-]+)/)
  if (newRouteMatch) {
    return {
      isNewStructure: true,
      mainPhase: newRouteMatch[1] as MainPhase,
      subStep: newRouteMatch[2] as SubStep,
    }
  }

  return { isNewStructure: false, mainPhase: null, subStep: null }
}

export function ProgressIndicator({ className }: ProgressIndicatorProps) {
  const pathname = usePathname()
  const completedPhases = useSimulationStore((state) => state.completedPhases)
  const progress = useSimulationStore((state) => state.progress)
  const [expandedPhase, setExpandedPhase] = useState<MainPhase | null>(null)

  const { isNewStructure, mainPhase, subStep } = useNewRouteStructure(pathname)

  // Legacy phase detection for old routes
  const phaseMatch = pathname?.match(/phase-(\d+)/)
  const legacyPhase = phaseMatch ? (parseInt(phaseMatch[1], 10) as SimulationPhase) : 1

  // If using old route structure, show old indicator
  if (!isNewStructure) {
    const legacyProgress = (legacyPhase / 10) * 100

    return (
      <div className={cn('bg-white border-b border-navy-200', className)}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Progress value={legacyProgress} className="flex-1" />
            <span className="text-sm font-medium text-navy-600">
              Phase {legacyPhase} of 10
            </span>
          </div>

          <div className="flex items-center justify-between">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as SimulationPhase[]).map((phase) => {
              const isCompleted = completedPhases.includes(phase)
              const isCurrent = legacyPhase === phase
              const isPast = legacyPhase > phase

              return (
                <div
                  key={phase}
                  className={cn(
                    'flex flex-col items-center gap-1 transition-all duration-200',
                    isCurrent && 'scale-110'
                  )}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted || isPast
                        ? '#102a43'
                        : isCurrent
                        ? '#243b53'
                        : '#e2e8f0',
                    }}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                      (isCompleted || isPast) && 'text-white',
                      isCurrent && 'text-white ring-4 ring-navy-200',
                      !isCompleted && !isPast && !isCurrent && 'text-navy-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : phase}
                  </motion.div>
                  <span
                    className={cn(
                      'text-[10px] text-center max-w-[60px] leading-tight hidden md:block',
                      isCurrent ? 'text-navy-900 font-medium' : 'text-navy-400'
                    )}
                  >
                    {PHASE_NAMES[phase].split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // New 4-phase indicator
  const currentPhaseIndex = mainPhase ? PHASE_ORDER.indexOf(mainPhase) : 0
  const totalSteps = 13 // Total number of sub-steps
  const currentStepIndex = subStep
    ? [
        'pre-read', 'context', 'focal-issue', 'forces',
        'uncertainties', 'axes', 'matrix',
        'narratives', 'impact', 'risk',
        'responses', 'actions', 'report'
      ].indexOf(subStep)
    : 0
  const newProgress = ((currentStepIndex + 1) / totalSteps) * 100

  return (
    <div className={cn('bg-slate-800/50 border-b border-slate-700/50', className)}>
      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* Progress bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all duration-300"
              style={{ width: `${newProgress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-400">
            {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* 4 Main Phase indicators */}
        <div className="flex items-center justify-between gap-2">
          {PHASE_ORDER.map((phase, index) => {
            const config = MAIN_PHASE_CONFIG[phase]
            const isCompleted = progress.completedPhases.includes(phase)
            const isCurrent = phase === mainPhase
            const isPast = currentPhaseIndex > index
            const isExpanded = expandedPhase === phase

            return (
              <div key={phase} className="flex-1">
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                  className={cn(
                    'w-full flex items-center gap-2 p-2 rounded-lg transition-all',
                    isCurrent && 'bg-gold-500/10 ring-1 ring-gold-500/30',
                    !isCurrent && 'hover:bg-slate-700/50'
                  )}
                >
                  {/* Phase Circle with Icon */}
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted || isPast
                        ? '#f59e0b'
                        : isCurrent
                        ? '#f59e0b'
                        : '#334155',
                    }}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
                      (isCompleted || isPast || isCurrent) && 'text-slate-900',
                      !isCompleted && !isPast && !isCurrent && 'text-slate-500'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      (() => {
                        const IconComponent = PHASE_ICONS[config.icon]
                        return IconComponent ? <IconComponent className="w-4 h-4" /> : index + 1
                      })()
                    )}
                  </motion.div>

                  {/* Phase Info */}
                  <div className="flex-1 text-left hidden sm:block">
                    <div className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-gold-400' : isPast || isCompleted ? 'text-slate-200' : 'text-slate-500'
                    )}>
                      {config.label}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{config.description}</div>
                  </div>

                  {/* Expand indicator */}
                  <ChevronDown className={cn(
                    'w-4 h-4 text-slate-500 transition-transform hidden sm:block',
                    isExpanded && 'rotate-180'
                  )} />
                </button>

                {/* Expanded Sub-steps */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-12 py-2 space-y-1">
                        {config.subSteps.map((step) => {
                          const stepConfig = SUB_STEP_CONFIG[step]
                          const isCurrentStep = step === subStep
                          const isStepCompleted = false // Could track this more granularly

                          return (
                            <div
                              key={step}
                              className={cn(
                                'text-xs py-1 px-2 rounded flex items-center gap-2',
                                isCurrentStep && 'bg-gold-500/20 text-gold-400 font-medium',
                                !isCurrentStep && 'text-slate-500'
                              )}
                            >
                              {isStepCompleted ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <div className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  isCurrentStep ? 'bg-gold-500' : 'bg-slate-600'
                                )} />
                              )}
                              {stepConfig.label}
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
