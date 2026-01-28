'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimulationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Phase10Page() {
  const router = useRouter()
  const {
    setPhase,
    completePhase,
    resetSimulation,
    industry,
    focalIssue,
    xAxis,
    yAxis,
    xAxisLabels,
    yAxisLabels,
    scenarios,
    riskProfile,
    responseAssignments,
    actions,
  } = useSimulationStore()


  useEffect(() => {
    setPhase(10)
    completePhase(10)
  }, [setPhase, completePhase])

  const handleStartOver = () => {
    resetSimulation()
    router.push('/')
  }

  // Count actions by type
  const priorityActionScenarios = scenarios.filter(
    (s) => responseAssignments[s.id] === 'priority-action'
  )
  const timelyActionScenarios = scenarios.filter(
    (s) => responseAssignments[s.id] === 'timely-action'
  )

  // Risk profile label
  const getRiskProfileLabel = () => {
    const highAppetite = riskProfile.appetite >= 4
    const highCapacity = riskProfile.capacity >= 4

    if (highAppetite && highCapacity) return 'Market Maker'
    if (highAppetite && !highCapacity) return 'Daredevil'
    if (!highAppetite && highCapacity) return 'Steady Expander'
    return 'Cautious Survivor'
  }

  // Get risk level labels
  const getRiskAppetiteLevel = () => {
    if (riskProfile.appetite >= 4) return 'high'
    if (riskProfile.appetite >= 3) return 'moderate'
    return 'low'
  }

  const getRiskCapacityLevel = () => {
    if (riskProfile.capacity >= 4) return 'high'
    if (riskProfile.capacity >= 3) return 'moderate'
    return 'low'
  }

  // Get quadrant colors for scenarios
  const getQuadrantColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
      { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
      { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' },
      { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
    ]
    return colors[index] || colors[0]
  }

  // Get response type for scenario
  const getResponseType = (scenarioId: string) => {
    const response = responseAssignments[scenarioId]
    if (response === 'priority-action') return { label: 'Priority Action', color: 'text-red-400', bg: 'bg-red-500/20' }
    if (response === 'timely-action') return { label: 'Timely Action', color: 'text-orange-400', bg: 'bg-orange-500/20' }
    if (response === 'monitor') return { label: 'Monitor', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    return { label: 'Not assigned', color: 'text-slate-400', bg: 'bg-slate-500/20' }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-5xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-serif font-bold mb-2">
          Your Scenario Analysis is Complete!
        </h2>
        <p className="text-white/80">
          You've built a comprehensive strategic foresight framework for your organization.
        </p>
      </div>

      {/* Comprehensive Analysis Report */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-8">
        <h3 className="font-serif text-2xl font-bold text-white mb-6 border-b border-white/20 pb-4">
          Strategic Scenario Analysis Report
        </h3>

        <div className="space-y-8">
          {/* Section 1: The Strategic Question */}
          <section>
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide mb-3">
              1. The Strategic Question
            </h4>
            <p className="text-lg text-slate-200 leading-relaxed">
              Your analysis explored:{' '}
              <span className="text-amber-400 font-bold text-xl">
                "{focalIssue || 'Strategic challenges'}"
              </span>
            </p>
            {industry && (
              <p className="text-slate-400 mt-2">
                Industry context: <span className="text-white">{industry}</span>
              </p>
            )}
          </section>

          {/* Section 2: Critical Uncertainties */}
          <section>
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide mb-3">
              2. Critical Uncertainties
            </h4>
            <p className="text-slate-300 mb-4">
              Two driving forces emerged as the most <span className="text-white font-semibold">uncertain</span> and{' '}
              <span className="text-white font-semibold">impactful</span> for your strategic question:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                <div className="text-xs text-blue-300 uppercase tracking-wide mb-1">X-Axis</div>
                <div className="text-lg font-bold text-blue-300">{xAxis?.name || 'Not defined'}</div>
                <div className="text-xs text-slate-400 mt-2">
                  Range: <span className="text-blue-200">{xAxisLabels?.low || 'Low'}</span> → <span className="text-blue-200">{xAxisLabels?.high || 'High'}</span>
                </div>
              </div>
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                <div className="text-xs text-green-300 uppercase tracking-wide mb-1">Y-Axis</div>
                <div className="text-lg font-bold text-green-300">{yAxis?.name || 'Not defined'}</div>
                <div className="text-xs text-slate-400 mt-2">
                  Range: <span className="text-green-200">{yAxisLabels?.low || 'Low'}</span> → <span className="text-green-200">{yAxisLabels?.high || 'High'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Four Scenarios - 2x2 Quadrant */}
          <section>
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide mb-3">
              3. Your Four Scenarios
            </h4>
            <p className="text-slate-300 mb-4">
              These uncertainties create <span className="text-white font-semibold">four distinct futures</span> to prepare for:
            </p>

            {/* 2x2 Quadrant */}
            <div className="flex gap-4">
              {/* Y-axis label - vertical on left */}
              <div className="flex flex-col justify-center items-center w-6 py-4">
                <span className="text-[10px] text-green-400 whitespace-nowrap">
                  {yAxisLabels?.high || 'High'} ↑
                </span>
                <div className="flex-1 flex items-center justify-center my-2">
                  <span className="transform -rotate-90 whitespace-nowrap text-xs text-green-400 font-medium">
                    {yAxis?.name || 'Y-Axis'}
                  </span>
                </div>
                <span className="text-[10px] text-green-400 whitespace-nowrap">
                  ↓ {yAxisLabels?.low || 'Low'}
                </span>
              </div>

              {/* Grid container */}
              <div className="flex-1">
                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {scenarios.map((scenario, index) => {
                    const response = getResponseType(scenario.id)
                    const scenarioActions = actions.filter((a) => a.scenarioId === scenario.id)
                    const quadrantColors = [
                      'bg-blue-500/30 border-blue-400/50',
                      'bg-green-500/30 border-green-400/50',
                      'bg-amber-500/30 border-amber-400/50',
                      'bg-purple-500/30 border-purple-400/50',
                    ]

                    return (
                      <div
                        key={scenario.id}
                        className={cn(
                          'rounded-xl p-4 border-2',
                          quadrantColors[index]
                        )}
                      >
                        <div className="font-bold text-white mb-2 text-lg">{scenario.name || `Scenario ${index + 1}`}</div>
                        <div className={cn('text-xs px-2 py-1 rounded-full inline-block mb-2', response.bg, response.color)}>
                          {response.label}
                        </div>
                        {scenarioActions.length > 0 && (
                          <div className="text-xs text-slate-400">
                            {scenarioActions.length} action{scenarioActions.length !== 1 && 's'} defined
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* X-axis label */}
                <div className="flex justify-between mt-4 text-xs text-blue-400 px-2">
                  <span>← {xAxisLabels?.low || 'Low'}</span>
                  <span className="text-slate-300 font-medium">{xAxis?.name || 'X-Axis'}</span>
                  <span>{xAxisLabels?.high || 'High'} →</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Risk Profile */}
          <section>
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide mb-3">
              4. Your Risk Profile
            </h4>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="text-lg text-slate-200">
                Your organization is a{' '}
                <span className="text-purple-400 font-bold text-xl">"{getRiskProfileLabel()}"</span>
                {' '}with{' '}
                <span className="text-orange-400 font-semibold">{getRiskAppetiteLevel()} risk appetite</span>
                {' '}and{' '}
                <span className="text-blue-400 font-semibold">{getRiskCapacityLevel()} risk capacity</span>.
              </p>
              <p className="text-slate-400 text-sm mt-3">
                {getRiskProfileLabel() === 'Market Maker' && 'You can afford to make bold strategic bets and are willing to do so. Position to shape your industry, not just respond to it.'}
                {getRiskProfileLabel() === 'Daredevil' && 'You have high ambition but limited buffer. Build capacity before making your biggest bets.'}
                {getRiskProfileLabel() === 'Steady Expander' && 'You have resources but prefer stability. Consider if you\'re missing opportunities to innovate.'}
                {getRiskProfileLabel() === 'Cautious Survivor' && 'Focus on monitoring and building capacity. Avoid strategic bets that could threaten survival.'}
              </p>
            </div>
          </section>

          {/* Section 5: Strategic Response Summary */}
          <section>
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide mb-3">
              5. Strategic Response Summary
            </h4>
            <div className="space-y-4">
              {/* Priority Actions */}
              <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 text-lg">🔴</span>
                  <span className="font-bold text-red-400">Priority Action Required</span>
                </div>
                {priorityActionScenarios.length > 0 ? (
                  <div className="space-y-2">
                    {priorityActionScenarios.map((scenario) => {
                      const scenarioActions = actions.filter((a) => a.scenarioId === scenario.id)
                      return (
                        <div key={scenario.id} className="text-slate-300">
                          <span className="font-semibold text-white">{scenario.name}</span>
                          {scenarioActions.length > 0 ? (
                            <span className="text-slate-400"> — {scenarioActions.length} action{scenarioActions.length !== 1 && 's'} planned</span>
                          ) : (
                            <span className="text-red-300"> — needs action items</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400">No scenarios assigned to Priority Action</p>
                )}
              </div>

              {/* Timely Actions */}
              <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-400 text-lg">🟠</span>
                  <span className="font-bold text-orange-400">Timely Action Needed</span>
                </div>
                {timelyActionScenarios.length > 0 ? (
                  <div className="space-y-2">
                    {timelyActionScenarios.map((scenario) => {
                      const scenarioActions = actions.filter((a) => a.scenarioId === scenario.id)
                      return (
                        <div key={scenario.id} className="text-slate-300">
                          <span className="font-semibold text-white">{scenario.name}</span>
                          {scenarioActions.length > 0 ? (
                            <span className="text-slate-400"> — {scenarioActions.length} action{scenarioActions.length !== 1 && 's'} planned</span>
                          ) : (
                            <span className="text-orange-300"> — needs action items</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400">No scenarios assigned to Timely Action</p>
                )}
              </div>

              {/* Monitor */}
              {scenarios.filter((s) => responseAssignments[s.id] === 'monitor').length > 0 && (
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-lg">🔵</span>
                    <span className="font-bold text-blue-400">Monitor</span>
                  </div>
                  <div className="text-slate-300">
                    {scenarios
                      .filter((s) => responseAssignments[s.id] === 'monitor')
                      .map((s) => s.name)
                      .join(', ')}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 6: How to Use This Analysis */}
          <section className="border-t border-white/20 pt-6">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide mb-4">
              📅 How to Use This Analysis
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
                <div className="font-bold text-blue-400 mb-2">Quarterly</div>
                <p className="text-xs text-slate-300 mb-2">Scenario Health Check</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Review early warning signals</li>
                  <li>• Update probability assessments</li>
                  <li>• Adjust response assignments</li>
                </ul>
              </div>
              <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-4">
                <div className="font-bold text-purple-400 mb-2">Annually</div>
                <p className="text-xs text-slate-300 mb-2">Full Scenario Refresh</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Re-scan for new forces</li>
                  <li>• Test if axes still capture uncertainty</li>
                  <li>• Update narratives</li>
                </ul>
              </div>
              <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-4">
                <div className="font-bold text-amber-400 mb-2">In Meetings</div>
                <p className="text-xs text-slate-300 mb-2">Scenario Stress-Test</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• "How does this perform in each scenario?"</li>
                  <li>• "Which scenario does this bet assume?"</li>
                  <li>• "What would make us regret this?"</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Insight */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <p className="text-slate-300 text-sm italic">
              "The value of scenarios isn't in predicting the future—it's in preparing your organization to{' '}
              <span className="text-white font-semibold">recognize and respond to change faster</span> than competitors."
            </p>
          </div>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button variant="outline" disabled className="opacity-50">
          <Download className="w-4 h-4 mr-2" />
          Export PDF (Coming Soon)
        </Button>
        <Button onClick={handleStartOver}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Analysis
        </Button>
      </div>
    </div>
  )
}
