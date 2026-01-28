'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSimulationStore } from '@/lib/store'
import { RESEARCH_MISSIONS, type ResearchMission as ResearchMissionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Save,
  Sparkles,
  X,
} from 'lucide-react'

interface ResearchMissionProps {
  missionId: string
  industry?: string | null
  focalIssue?: string | null
  forces?: Array<{ id: string; name: string }>
  scenarios?: Array<{ id: string; name: string }>
  onComplete?: () => void
  onSkip?: () => void
  className?: string
}

export function ResearchMission({
  missionId,
  industry,
  focalIssue,
  forces,
  scenarios,
  onComplete,
  onSkip,
  className,
}: ResearchMissionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  const { addResearchNote } = useSimulationStore()

  const mission = RESEARCH_MISSIONS.find((m) => m.id === missionId)
  if (!mission) return null

  // Replace placeholders in prompts
  const processPrompt = (prompt: string): string => {
    let processed = prompt
    if (industry) {
      processed = processed.replace('[INDUSTRY]', industry)
    }
    if (focalIssue) {
      processed = processed.replace('[FOCAL ISSUE]', focalIssue)
    }
    if (forces && forces.length > 0) {
      processed = processed.replace('[FORCE]', forces[0].name)
    }
    if (scenarios && scenarios.length >= 2) {
      processed = processed.replace('[AXIS 1]', scenarios[0].name)
      processed = processed.replace('[AXIS 2]', scenarios[1].name)
    }
    return processed
  }

  const handleCopy = async (prompt: string, index: number) => {
    await navigator.clipboard.writeText(processPrompt(prompt))
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSaveNotes = () => {
    if (!notes.trim()) return

    setIsSaving(true)

    addResearchNote({
      phase: mission.phase,
      prompt: mission.title,
      content: notes.trim(),
      linkedForceIds: forces?.map((f) => f.id),
      linkedScenarioIds: scenarios?.map((s) => s.id),
    })

    setTimeout(() => {
      setIsSaving(false)
      setHasSaved(true)
    }, 500)
  }

  const handleComplete = () => {
    if (notes.trim() && !hasSaved) {
      handleSaveNotes()
    }
    onComplete?.()
  }

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gold-400 uppercase tracking-wide">
                Research Mission
              </span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-navy-900">{mission.title}</h3>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-indigo-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-indigo-400" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Description */}
              <p className="text-sm text-navy-600">{mission.description}</p>

              {/* Suggested Prompts */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-navy-500 uppercase tracking-wide">
                  Suggested prompts for ChatGPT
                </div>
                <div className="space-y-2">
                  {mission.suggestedPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="group bg-slate-800 rounded-lg border border-indigo-100 p-3 flex items-start justify-between gap-2"
                    >
                      <p className="text-sm text-navy-700 flex-1">
                        {processPrompt(prompt)}
                      </p>
                      <button
                        onClick={() => handleCopy(prompt, index)}
                        className="flex-shrink-0 p-1.5 rounded-md bg-gold-500/10 text-gold-400 hover:bg-indigo-100 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open ChatGPT button */}
              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
              >
                Open ChatGPT
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Research Notes Input */}
              <div className="space-y-2 pt-2 border-t border-indigo-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-navy-500 uppercase tracking-wide">
                    Paste your research insights here
                  </label>
                  {hasSaved && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </div>
                <p className="text-xs text-navy-400">{mission.outputGuidance}</p>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value)
                    setHasSaved(false)
                  }}
                  placeholder="Paste 2-3 key insights from your ChatGPT conversation..."
                  className="w-full p-3 border border-indigo-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold-500 min-h-[100px] bg-slate-800"
                  rows={4}
                />
                {notes.trim() && !hasSaved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    className="border-indigo-200 text-gold-400 hover:bg-gold-500/10"
                  >
                    {isSaving ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save notes
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-navy-500 hover:text-navy-700"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleComplete}
                  size="sm"
                  className="bg-gold-500 hover:bg-gold-600"
                >
                  {notes.trim() ? "I've done my research" : 'Continue without research'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact version for inline display
interface ResearchPromptChipProps {
  prompt: string
  variables?: Record<string, string>
}

export function ResearchPromptChip({ prompt, variables = {} }: ResearchPromptChipProps) {
  const [copied, setCopied] = useState(false)

  const processedPrompt = Object.entries(variables).reduce(
    (p, [key, value]) => p.replace(`[${key}]`, value),
    prompt
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(processedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-500/10 hover:bg-indigo-100 text-gold-400 text-sm rounded-full transition-colors group"
    >
      <MessageSquare className="w-3.5 h-3.5" />
      <span className="max-w-[200px] truncate">{processedPrompt}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  )
}

// Research notes display component
interface ResearchNotesDisplayProps {
  phase: 'focal-issue' | 'forces' | 'scenarios'
  className?: string
}

export function ResearchNotesDisplay({ phase, className }: ResearchNotesDisplayProps) {
  const { researchNotes, deleteResearchNote } = useSimulationStore()
  const phaseNotes = researchNotes.filter((n) => n.phase === phase)

  if (phaseNotes.length === 0) return null

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-xs font-medium text-navy-500 uppercase tracking-wide flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5" />
        Your Research Notes
      </div>
      <div className="space-y-2">
        {phaseNotes.map((note) => (
          <div
            key={note.id}
            className="bg-gold-500/10 border border-indigo-100 rounded-lg p-3 group relative"
          >
            <button
              onClick={() => deleteResearchNote(note.id)}
              className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-indigo-100 transition-all"
            >
              <X className="w-3.5 h-3.5 text-navy-400" />
            </button>
            <p className="text-sm text-navy-700 whitespace-pre-wrap pr-6">{note.content}</p>
            <div className="text-xs text-navy-400 mt-2">
              {new Date(note.timestamp).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
