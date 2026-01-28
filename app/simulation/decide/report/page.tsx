'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Download, RefreshCw, Check, ArrowLeft, Home, ExternalLink } from 'lucide-react'
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'
import { INDUSTRIES, ORGANIZATION_TYPES, RESPONSE_TYPES } from '@/lib/types'

export default function ReportPage() {
  const router = useRouter()
  const reportRef = useRef<HTMLDivElement>(null)

  const {
    industry,
    organizationType,
    focalIssue,
    timeHorizon,
    xAxis,
    yAxis,
    xAxisLabels,
    yAxisLabels,
    scenarios,
    actions,
    riskProfile,
    responseAssignments,
    setCurrentStep,
    completeMainPhase,
  } = useSimulationStore()

  useEffect(() => {
    setCurrentStep('report')
    completeMainPhase('decide')
  }, [setCurrentStep, completeMainPhase])

  const industryName = industry?.startsWith('custom:')
    ? industry.replace('custom:', '')
    : INDUSTRIES.find(i => i.id === industry)?.name || industry

  const orgTypeName = ORGANIZATION_TYPES.find(o => o.id === organizationType)?.name || organizationType

  const getRiskLabel = (value: number) => {
    if (value >= 4) return 'high'
    if (value >= 3) return 'moderate'
    return 'low'
  }

  const QUADRANT_COLORS: Record<string, string> = {
    TL: 'bg-gold-500/20',
    TR: 'bg-gold-500/20',
    BL: 'bg-gold-500/20',
    BR: 'bg-gold-500/20',
  }

  return (
    <div>
      {/* Top Navigation Bar with Mini Progress */}
      <div className="flex items-center gap-4 mb-4">
        {/* Decide phase progress: report is step 3 of 3 */}
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

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={() => router.push('/simulation/decide/actions')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button size="sm" onClick={() => router.push('/')}>
            <RefreshCw className="w-4 h-4 mr-1" />
            New Analysis
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Report */}
        <div className="lg:col-span-2">
          <div
            ref={reportRef}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white space-y-6"
          >
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-700">
              <h1 className="text-2xl font-bold mb-1">Strategic Scenario Analysis Report</h1>
              <p className="text-sm text-slate-400">
                Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Section 1: Context & Focal Issue Combined */}
            <div>
              <h2 className="text-lg font-semibold text-gold-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-xs">1</span>
                Strategic Context
              </h2>
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <p className="text-sm text-slate-300">
                  <span className="text-white font-medium">{orgTypeName}</span> in{' '}
                  <span className="text-white font-medium">{industryName}</span>,{' '}
                  <span className="text-white font-medium">{timeHorizon}-year</span> horizon
                </p>
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Focal Issue:</p>
                  <p className="text-sm text-gold-400 font-medium">"{focalIssue}"</p>
                </div>
              </div>
            </div>

            {/* Section 2: Scenario Matrix (Compact) */}
            <div>
              <h2 className="text-lg font-semibold text-gold-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-xs">2</span>
                Scenario Matrix
              </h2>

              <div className="flex items-stretch gap-2">
                {/* Y-Axis Name */}
                <div className="flex items-center justify-center w-6 flex-shrink-0">
                  <span className="transform -rotate-90 whitespace-nowrap text-xs text-gold-400 font-medium">
                    {yAxis?.name}
                  </span>
                </div>

                {/* Matrix */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    {scenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className={cn(
                          'p-3 rounded-lg flex items-center justify-center min-h-[70px]',
                          QUADRANT_COLORS[scenario.quadrant]
                        )}
                      >
                        <h3 className="font-medium text-gold-400 text-center text-sm">{scenario.name}</h3>
                      </div>
                    ))}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px] text-gold-400/70">← {xAxisLabels.low}</span>
                    <span className="text-xs text-gold-400 font-medium">{xAxis?.name}</span>
                    <span className="text-[10px] text-gold-400/70">{xAxisLabels.high} →</span>
                  </div>
                </div>

                {/* Y-Axis Values */}
                <div className="flex flex-col justify-between py-3 w-16 flex-shrink-0 text-right">
                  <span className="text-[10px] text-gold-400/70">↑ {yAxisLabels.high}</span>
                  <span className="text-[10px] text-gold-400/70">{yAxisLabels.low} ↓</span>
                </div>
              </div>
            </div>

            {/* Section 3: Risk Profile (Compact) */}
            <div>
              <h2 className="text-lg font-semibold text-gold-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-xs">3</span>
                Risk Profile
              </h2>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-300">
                  <span className="text-gold-400 font-medium">{getRiskLabel(riskProfile.appetite)} risk appetite</span>
                  {' '}•{' '}
                  <span className="text-gold-400 font-medium">{getRiskLabel(riskProfile.capacity)} strategic capacity</span>
                </p>
              </div>
            </div>

            {/* Section 4: Strategic Responses & Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gold-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-xs">4</span>
                Responses & Actions
              </h2>

              <div className="space-y-3">
                {scenarios.map((scenario) => {
                  const scenarioActions = actions.filter(a => a.scenarioId === scenario.id)
                  const responseType = RESPONSE_TYPES.find(r => r.id === responseAssignments[scenario.id])

                  return (
                    <div key={scenario.id} className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-white text-sm">{scenario.name}</h3>
                        <span className="text-xs text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">
                          {responseType?.name}
                        </span>
                      </div>

                      {scenarioActions.length > 0 && (
                        <ul className="space-y-1 text-xs text-slate-300">
                          {scenarioActions.map((action) => (
                            <li key={action.id} className="flex items-start gap-2">
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                              {action.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Download Button */}
            <div className="pt-4 border-t border-slate-700">
              <Button className="w-full bg-gold-500 hover:bg-gold-400 text-slate-900">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
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
                    <h4 className="font-medium text-gold-400 mb-3">How to Use Your Report</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-gold-400">•</span>
                        <span><strong className="text-slate-300">Review quarterly</strong> — Revisit scenarios as new information emerges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold-400">•</span>
                        <span><strong className="text-slate-300">Monitor signals</strong> — Watch for early indicators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold-400">•</span>
                        <span><strong className="text-slate-300">Trigger decisions</strong> — Use "If X, then Y" framing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold-400">•</span>
                        <span><strong className="text-slate-300">Update actions</strong> — Refine as environment evolves</span>
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
                      <div className="font-semibold text-gold-400 text-sm">Shell's Scenario Reports</div>
                      <div className="text-xs text-slate-400">How reports drove strategic decisions</div>
                    </div>

                    <p className="text-xs text-slate-400">
                      Shell's scenario reports weren't filed away—they became living documents that executives referenced in every strategic meeting.
                    </p>

                    <div className="bg-slate-700/50 rounded-lg p-2 text-xs">
                      <span className="text-gold-400 font-medium">Key practice:</span>
                      <span className="text-slate-300 ml-1">Monthly "signal tracking" sessions to spot scenario indicators</span>
                    </div>

                    <a
                      href="https://chat.openai.com/?q=How%20did%20Shell%20use%20their%20scenario%20planning%20reports%20in%20practice%3F%20What%20made%20their%20reports%20effective%20for%20decision-making%3F%20How%20did%20they%20track%20signals%20and%20update%20their%20strategies%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Explore Shell's report practices
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
                    <h4 className="font-medium text-gold-400 mb-3">Presenting to Stakeholders</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li>• Lead with the <strong className="text-slate-300">focal issue</strong>, not the methodology</li>
                      <li>• Use scenario <strong className="text-slate-300">names as shorthand</strong> in discussions</li>
                      <li>• Focus on <strong className="text-slate-300">actions</strong>, not predictions</li>
                      <li>• Invite stakeholders to <strong className="text-slate-300">challenge assumptions</strong></li>
                      <li>• Schedule <strong className="text-slate-300">follow-up reviews</strong> before leaving the room</li>
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
