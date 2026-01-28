'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, MapPin, Compass } from 'lucide-react'
import { useSimulationStore } from '@/lib/store'
import { HomeNav } from '@/components/simulation/HomeNav'

export default function PreReadPage() {
  const router = useRouter()
  const { setCurrentStep, startSession } = useSimulationStore()

  const handleContinue = () => {
    startSession()
    setCurrentStep('context')
    router.push('/simulation/discover/context')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <HomeNav />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Phase Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <Search className="w-4 h-4 text-gold-400" />
            </div>
            <span className="text-gold-400 font-medium text-sm">Phase 1: Discover</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-100 mb-4">
            Before you build, you scout.
          </h1>

          {/* Intro Content */}
          <div className="space-y-4 text-slate-300 leading-relaxed mb-8">
            <p>
              Think of this like the opening moves in a strategy game. Before you construct buildings or train armies, you send scouts to explore the map. You need to know the terrain, spot resources, and identify where threats might emerge.
            </p>
            <p>
              In scenario planning, the <span className="text-gold-400 font-medium">Discover</span> phase is your scouting mission. You&apos;ll define what question you&apos;re really trying to answer, then scan the horizon for the forces—political, economic, social, technological—that could shape your future.
            </p>
          </div>

          {/* What you'll do */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 mb-8">
            <h3 className="text-sm font-semibold text-slate-100 mb-4">In this phase, you&apos;ll:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-400">
                  <span className="text-slate-200">Set your context</span> — Tell us about your industry, organisation type, and who&apos;s doing the planning
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-400">
                  <span className="text-slate-200">Frame your focal question</span> — The specific decision you want to pressure-test against multiple futures
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Search className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-400">
                  <span className="text-slate-200">Scan for driving forces</span> — AI will help you map the PEST forces shaping your world
                </p>
              </div>
            </div>
          </div>

          {/* Golden quote */}
          <p className="text-gold-400 font-semibold border-l-2 border-gold-500 pl-4 text-sm mb-8">
            The quality of your scenarios depends entirely on the quality of your scouting. Take your time here.
          </p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full px-6 py-4 bg-gold-500 hover:bg-gold-400 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Let&apos;s start scouting
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
