'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSimulationStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Focus, Search, Compass, Layers, Target } from 'lucide-react'

const tabs = [
  { id: 'what', label: 'What is Scenario Planning' },
  { id: 'creators', label: 'From the creators' },
  { id: 'journey', label: 'Your Journey Ahead' },
]

const tabContent = {
  what: {
    title: 'A discipline for seeing multiple futures',
    content: (
      <div className="space-y-3 text-left">
        <p>
          Scenario planning is not about predicting the future—it&apos;s about expanding the range of futures you can perceive and prepare for. Born at RAND Corporation in the 1950s and refined at Royal Dutch Shell during the oil crises, this discipline helps organizations navigate turbulent times.
        </p>
        <p>
          Unlike forecasting that extrapolates past trends, scenario planning embraces uncertainty. By constructing multiple plausible futures, leaders develop peripheral vision to spot early signals of change and respond decisively when the unexpected occurs.
        </p>
        <p>
          The power lies not in the scenarios themselves, but in what they do to your thinking. As Pierre Wack observed: the goal is to change the mental models of decision-makers. Leaders who have genuinely inhabited multiple futures make different—and better—decisions in the present.
        </p>
        <p className="text-gold-400 font-semibold border-l-2 border-gold-500 pl-3 text-xs">
          Shell anticipated both the 1973 and 1979 oil shocks using this approach—years ahead of competitors.
        </p>
      </div>
    ),
  },
  creators: {
    title: 'Standing on the shoulders of futurists',
    content: (
      <div className="space-y-3 text-left">
        <p>
          This simulation draws from Peter Schwartz&apos;s{' '}
          <a
            href="https://www.amazon.in/Art-Long-View-Planning-Uncertain/dp/0385267320?s=bazaar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 underline underline-offset-2"
          >
            The Art of the Long View
          </a>
          . Schwartz led Shell&apos;s legendary scenario team before founding Global Business Network, codifying a methodology used by Fortune 500 companies and governments worldwide.
        </p>
        <p>
          The lineage traces from Herman Kahn at RAND—who first brought &quot;scenarios&quot; into strategic analysis—to Pierre Wack at Shell, who transformed it into a business discipline. Schwartz carried this forward, democratizing the methodology for wider audiences.
        </p>
        <p>
          We&apos;ve adapted Schwartz&apos;s eight-step process into an interactive, AI-augmented experience. The core principles remain faithful: identify your focal issue, scan for driving forces, isolate critical uncertainties, and pressure-test your strategies against multiple futures.
        </p>
        <p className="text-gold-400 font-semibold border-l-2 border-gold-500 pl-3 text-xs">
          The best scenarios prepare your mind for what might happen—so you&apos;re never caught by surprise.
        </p>
      </div>
    ),
  },
  journey: {
    title: 'Four phases to strategic clarity',
    content: (
      <div className="space-y-3 text-left">
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Discover</h4>
            <p className="text-xs text-slate-400"> You will understand what a strategic question is and how to frame it. Then you will learn how to scan your environment for forces that affect your decisions using the PEST framework.</p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
            <Compass className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Design</h4>
            <p className="text-xs text-slate-400">You will then understand the concept of 'critical uncertainties' and build your 2×2 scenario matrix.</p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Develop</h4>
            <p className="text-xs text-slate-400">Then, you will craft 'scenario narratives' - imagined future of your organization if the scenarios come true and assess organizational impact and risks.</p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Decide</h4>
            <p className="text-xs text-slate-400">This would help you define strategic responses, early warning indicators, and draft concrete action plans - before (and if) the scenarios ever come true.</p>
          </div>
        </div>

        <p className="text-gold-400 font-semibold border-l-2 border-gold-500 pl-3 text-xs mt-4">
          By the end, you&apos;ll emerge with a mental model that&apos;s prepared for uncertainty—not paralyzed by it.
        </p>
      </div>
    ),
  },
}

export default function Home() {
  const router = useRouter()
  const resetSimulation = useSimulationStore((state) => state.resetSimulation)
  const [activeTab, setActiveTab] = useState<'what' | 'creators' | 'journey'>('what')

  const handleStart = () => {
    resetSimulation()
    router.push('/simulation/discover/pre-read')
  }

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-800 rounded-2xl mb-4 border border-slate-700">
            <Focus className="w-7 h-7 text-gold-400" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold mb-2 tracking-tight">
            <span className="text-slate-100">The Art of </span>
            <span className="text-gold-400">Thinking the Unthinkable</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 leading-relaxed">
            Learn strategic foresight and the art of seeing multiple futures
          </p>
        </div>

        {/* Tabbed Pre-Read Panel */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-6">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'what' | 'creators' | 'journey')}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-gold-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base font-semibold text-slate-100 mb-3">
                  {tabContent[activeTab].title}
                </h3>
                <div className="text-slate-300 text-sm leading-relaxed">
                  {tabContent[activeTab].content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={handleStart} className="text-base px-10 py-5 h-auto">
            Get ready to see the future
          </Button>

          {/* Credits */}
          <p className="mt-4 text-xs text-slate-500">
            Based on{' '}
            <a
              href="https://www.amazon.in/Art-Long-View-Planning-Uncertain/dp/0385267320?s=bazaar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 hover:text-gold-400 underline underline-offset-2"
            >
              The Art of the Long View
            </a>
            {' '}by Peter Schwartz
          </p>
        </div>
      </motion.div>
    </main>
  )
}
