'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Building, Lightbulb, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LearningTabId = 'guide' | 'example' | 'tips'

export interface LearningTab {
  id: LearningTabId
  label: string
  icon: LucideIcon
  content: React.ReactNode
}

interface LearningSidebarProps {
  tabs: LearningTab[]
  defaultTab?: LearningTabId
  className?: string
}

// Default icons for each tab type
const DEFAULT_ICONS: Record<LearningTabId, LucideIcon> = {
  guide: BookOpen,
  example: Building,
  tips: Lightbulb,
}

export function LearningSidebar({ tabs, defaultTab, className }: LearningSidebarProps) {
  // Use defaultTab if provided, otherwise use first tab
  const [activeTab, setActiveTab] = useState<LearningTabId>(
    defaultTab || tabs[0]?.id || 'guide'
  )

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)

  if (tabs.length === 0) return null

  return (
    <div className={cn('bg-slate-800 rounded-xl border border-slate-700 overflow-hidden', className)}>
      {/* Tab Bar */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon || DEFAULT_ICONS[tab.id]
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset',
                isActive
                  ? 'text-gold-400 bg-slate-700/50'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active Tab Indicator */}
      <div className="relative h-0.5 bg-slate-700">
        <motion.div
          className="absolute top-0 h-full bg-gold-400"
          initial={false}
          animate={{
            left: `${(tabs.findIndex((t) => t.id === activeTab) / tabs.length) * 100}%`,
            width: `${100 / tabs.length}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Content Area */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTabContent?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Export commonly used icons for convenience
export { BookOpen, Building, Lightbulb }
