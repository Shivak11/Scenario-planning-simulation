'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Force, PESTCategory } from '@/lib/types'
import { PEST_LABELS } from '@/lib/types'
import { RotateCw, Sparkles, Target, Scale } from 'lucide-react'

interface FlippableForceCardProps {
  force: Force
  onImpactChange: (value: number) => void
  onUncertaintyChange: (value: number) => void
  industry?: string | null
  focalIssue?: string | null
}

const CATEGORY_COLORS: Record<PESTCategory, { bg: string; text: string; border: string; gradient: string }> = {
  P: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600 to-amber-700',
  },
  E: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600 to-amber-700',
  },
  S: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600 to-amber-700',
  },
  T: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600 to-amber-700',
  },
  En: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600 to-amber-700',
  },
  L: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600 to-amber-700',
  },
}

const CATEGORY_ICONS: Record<PESTCategory, string> = {
  P: '🏛️',
  E: '📊',
  S: '👥',
  T: '💻',
  En: '🌿',
  L: '⚖️',
}

// Rating descriptions for visual clarity (dark theme)
const IMPACT_LEVELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Not Rated', color: 'text-slate-500' },
  1: { label: 'Minimal', color: 'text-slate-400' },
  2: { label: 'Low', color: 'text-slate-300' },
  3: { label: 'Moderate', color: 'text-gold-400' },
  4: { label: 'High', color: 'text-gold-400' },
  5: { label: 'Critical', color: 'text-gold-300' },
}

const UNCERTAINTY_LEVELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Not Rated', color: 'text-slate-500' },
  1: { label: 'Predictable', color: 'text-slate-400' },
  2: { label: 'Likely', color: 'text-slate-300' },
  3: { label: 'Uncertain', color: 'text-gold-400' },
  4: { label: 'Volatile', color: 'text-gold-400' },
  5: { label: 'Wild Card', color: 'text-gold-300' },
}

export function FlippableForceCard({
  force,
  onImpactChange,
  onUncertaintyChange,
  industry,
  focalIssue,
}: FlippableForceCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const colors = CATEGORY_COLORS[force.category]

  const openChatGpt = () => {
    const prompt = `Analyze this driving force for scenario planning:

Force: ${force.name}
Category: ${PEST_LABELS[force.category]}
${industry ? `Industry: ${industry}` : ''}
${focalIssue ? `Focal Issue: ${focalIssue}` : ''}

Questions:
1. What are the possible directions this force could take in the next 5-10 years?
2. What signals should we watch for to see which direction it's heading?
3. How would the extreme versions (high vs low) of this force affect the focal issue?
4. What are common misconceptions about this force?`

    window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
  }

  return (
    <div
      className="relative h-[260px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side - Compact View with Sliders */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl border-2 bg-slate-800 p-3 flex flex-col',
            colors.border
          )}
          style={{ backfaceVisibility: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Category Badge & Flip Hint */}
          <div className="flex items-start justify-between mb-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full',
                colors.bg,
                colors.text
              )}
            >
              <span>{CATEGORY_ICONS[force.category]}</span>
              {PEST_LABELS[force.category]}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsFlipped(true)
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 bg-gold-500/10 px-2 py-1 rounded-full transition-colors"
            >
              <RotateCw className="w-3 h-3" />
              Flip for details
            </button>
          </div>

          {/* Force Name */}
          <h4 className="font-semibold text-white text-base mb-2 leading-tight">
            {force.name}
          </h4>

          {/* Short Description */}
          <p className="text-xs text-slate-400 mb-4 line-clamp-2 flex-shrink-0">
            {force.description.slice(0, 100)}...
          </p>

          {/* Sliders Section */}
          <div className="mt-auto space-y-4">
            {/* Impact Slider */}
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <Target className="w-3.5 h-3.5" />
                  Impact
                </span>
                <span className={cn('font-semibold', IMPACT_LEVELS[force.impact].color)}>
                  {IMPACT_LEVELS[force.impact].label}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={force.impact}
                onChange={(e) => onImpactChange(parseInt(e.target.value))}
                className="w-full h-2.5 bg-gradient-to-r from-slate-700 via-gold-900/50 to-gold-600 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-slate-900
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-gold-400
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>

            {/* Uncertainty Slider */}
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <Scale className="w-3.5 h-3.5" />
                  Uncertainty
                </span>
                <span className={cn('font-semibold', UNCERTAINTY_LEVELS[force.uncertainty].color)}>
                  {UNCERTAINTY_LEVELS[force.uncertainty].label}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={force.uncertainty}
                onChange={(e) => onUncertaintyChange(parseInt(e.target.value))}
                className="w-full h-2.5 bg-gradient-to-r from-slate-700 via-gold-900/50 to-gold-600 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-gold-500
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-slate-900
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>

        </div>

        {/* Back Side - Full Description & Context */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl border-2 bg-slate-800 overflow-hidden',
            colors.border
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Gradient Header */}
          <div className={cn('bg-gradient-to-r p-3 text-white', colors.gradient)}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium opacity-80 flex items-center gap-1">
                {CATEGORY_ICONS[force.category]} {PEST_LABELS[force.category]}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(false)
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white bg-white/20 px-2 py-1 rounded-full transition-colors"
              >
                <RotateCw className="w-3 h-3" />
                Flip to rate
              </button>
            </div>
            <h4 className="font-semibold text-base mt-1 leading-tight">{force.name}</h4>
          </div>

          {/* Content */}
          <div className="p-3 overflow-y-auto max-h-[120px]">
            <p className="text-sm text-slate-300 leading-relaxed">
              {force.description}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700 bg-slate-800 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                openChatGpt()
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 bg-gold-500/10 px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Deep dive with ChatGPT
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Compact display for selected forces (used in later phases)
interface ForceChipProps {
  force: Force
  onClick?: () => void
}

export function ForceChip({ force, onClick }: ForceChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 bg-gold-500/20 text-gold-400 border border-gold-500/30"
    >
      <span>{CATEGORY_ICONS[force.category]}</span>
      <span className="max-w-[150px] truncate">{force.name}</span>
    </button>
  )
}
