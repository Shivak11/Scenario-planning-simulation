'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Plus, X, Sparkles, Loader2, ExternalLink, Home } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { cn, generateId } from '@/lib/utils'
import type { ActionItem } from '@/lib/types'

export default function ActionsPage() {
  const router = useRouter()
  const { scenarios, actions, setActions, responseAssignments, setCurrentStep } = useSimulationStore()
  const [activeScenario, setActiveScenario] = useState(scenarios[0]?.id || '')
  const [newAction, setNewAction] = useState('')
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)

  useEffect(() => {
    setCurrentStep('actions')
  }, [setCurrentStep])

  const currentScenario = scenarios.find(s => s.id === activeScenario)
  const scenarioActions = actions.filter(a => a.scenarioId === activeScenario)

  const handleAddAction = () => {
    if (newAction.trim() && currentScenario) {
      const newActionItem: ActionItem = {
        id: generateId(),
        scenarioId: currentScenario.id,
        description: newAction.trim(),
        timeline: 'Q1',
        budgetRange: 'medium',
        owner: 'director',
        selected: true,
      }
      setActions([...actions, newActionItem])
      setNewAction('')
    }
  }

  const handleRemoveAction = (actionId: string) => {
    setActions(actions.filter(a => a.id !== actionId))
  }

  const generateAISuggestions = async () => {
    if (!currentScenario) return
    setGeneratingFor(currentScenario.id)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const suggestions = [
      `Monitor early signals of ${currentScenario.name}`,
      `Build capabilities for responding to ${currentScenario.name}`,
      `Identify partnerships that would be valuable in ${currentScenario.name}`,
    ]

    const newActions: ActionItem[] = suggestions.map((desc) => ({
      id: generateId(),
      scenarioId: currentScenario.id,
      description: desc,
      timeline: 'Q2' as const,
      budgetRange: 'medium' as const,
      owner: 'director' as const,
      selected: true,
    }))

    setActions([...actions, ...newActions])
    setGeneratingFor(null)
  }

  const hasEnoughActions = scenarios.every(s =>
    actions.filter(a => a.scenarioId === s.id).length >= 1
  )

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
        {/* Decide phase progress: actions is step 2 of 3 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-6 rounded-full transition-colors',
                  i < 2 ? 'bg-gold-500' : i === 2 ? 'bg-gold-400' : 'bg-slate-600'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">2/3</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={() => router.push('/simulation/decide/responses')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/simulation/decide/report')}
            disabled={!hasEnoughActions}
          >
            View Report
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h2 className="font-semibold text-white mb-1">Define Concrete Actions</h2>
          <p className="text-sm text-slate-400">
            For each scenario, define specific actions your organization should take.
          </p>
        </div>

        {/* Scenario Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {scenarios.map((scenario) => {
            const colors = QUADRANT_COLORS[scenario.quadrant] || QUADRANT_COLORS.TL
            const isActive = scenario.id === activeScenario
            const actionCount = actions.filter(a => a.scenarioId === scenario.id).length

            return (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  isActive
                    ? `${colors.bg} ${colors.border} border-2 ${colors.text}`
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                )}
              >
                {scenario.name}
                {actionCount > 0 && (
                  <span className="ml-1 text-xs bg-slate-800/50 px-1.5 rounded">{actionCount}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Actions List */}
        {currentScenario && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
            <div className="mb-4">
              <h3 className="font-semibold text-white">{currentScenario.name}</h3>
              <p className="text-sm text-slate-400">{responseAssignments[currentScenario.id] || 'No'} response</p>
            </div>

            {/* Existing Actions */}
            <div className="space-y-2">
              {scenarioActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-sm text-slate-200">{action.description}</span>
                  <button
                    onClick={() => handleRemoveAction(action.id)}
                    className="p-1 hover:bg-slate-700 rounded"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Action */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                placeholder="Add an action..."
                className="flex-1 px-3 py-2 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Button size="sm" onClick={handleAddAction} disabled={!newAction.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* AI Suggestions */}
            <button
              onClick={generateAISuggestions}
              disabled={generatingFor === currentScenario.id}
              className="w-full py-2 text-sm font-medium text-gold-400 hover:text-gold-300 hover:bg-gold-500/20 bg-gold-500/10 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {generatingFor === currentScenario.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get AI Suggestions
                </>
              )}
            </button>
          </div>
        )}

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
                  <h4 className="font-medium text-white mb-3">Good Actions Are:</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Specific and measurable
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Have a clear owner
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Time-bound
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Aligned with response type
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
                    <div className="font-semibold text-gold-400 text-sm">Shell's 1970s Actions</div>
                    <div className="text-xs text-slate-400">How scenarios became strategy</div>
                  </div>

                  <div className="text-xs text-slate-300 mb-2 pb-2 border-b border-slate-700">
                    Their scenario: <span className="text-gold-400 font-medium">"What if OPEC restricts oil supply?"</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-gold-400 font-medium">Monitor:</span>
                      <span className="text-slate-300 ml-1">"Track OPEC meeting outcomes and member tensions"</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-gold-400 font-medium">Build:</span>
                      <span className="text-slate-300 ml-1">"Develop flexible refining capacity for crude variations"</span>
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-gold-400 font-medium">Partner:</span>
                      <span className="text-slate-300 ml-1">"Establish relationships with alternative energy startups"</span>
                    </div>
                  </div>

                  <a
                    href="https://chat.openai.com/?q=What%20specific%20actions%20did%20Shell%20take%20after%20their%201970s%20scenario%20planning%3F%20How%20did%20they%20turn%20scenario%20insights%20into%20concrete%20strategic%20moves%3F%20What%20monitoring%20systems%20and%20capabilities%20did%20they%20build%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Learn how Shell turned scenarios into action
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
                  <h4 className="font-medium text-gold-400 mb-3">Think in Categories</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    For each scenario, ask yourself:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• What should we <strong className="text-slate-300">monitor</strong> for early signals?</li>
                    <li>• What capabilities should we <strong className="text-slate-300">build</strong> now?</li>
                    <li>• What relationships should we <strong className="text-slate-300">cultivate</strong>?</li>
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
