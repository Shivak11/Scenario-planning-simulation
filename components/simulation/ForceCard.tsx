'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Force, PESTCategory } from '@/lib/types'
import { PEST_LABELS } from '@/lib/types'

interface ForceCardProps {
  force: Force
  onImpactChange: (value: number) => void
  onUncertaintyChange: (value: number) => void
  compact?: boolean
}

const CATEGORY_COLORS: Record<PESTCategory, { bg: string; text: string; border: string }> = {
  P: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  E: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  S: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  T: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  En: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  L: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
}

export function ForceCard({
  force,
  onImpactChange,
  onUncertaintyChange,
  compact = false,
}: ForceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const colors = CATEGORY_COLORS[force.category]

  // Calculate visual emphasis based on impact and uncertainty
  const emphasis = (force.impact + force.uncertainty) / 10
  const isHighPriority = force.impact >= 4 && force.uncertainty >= 4

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'transition-all duration-200',
          isHighPriority && 'ring-2 ring-navy-900/20',
          colors.border
        )}
        style={{
          opacity: 0.5 + emphasis * 0.5,
        }}
      >
        <CardContent className={cn('p-4', compact && 'p-3')}>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1">
              <span
                className={cn(
                  'inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2',
                  colors.bg,
                  colors.text
                )}
              >
                {PEST_LABELS[force.category]}
              </span>
              <h4 className="font-medium text-navy-900 text-sm leading-tight">
                {force.name}
              </h4>
            </div>
            {isHighPriority && (
              <span className="text-xs bg-navy-900 text-white px-2 py-0.5 rounded-full">
                Key
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-navy-500 mb-4 line-clamp-2">
            {force.description}
          </p>

          {/* Sliders */}
          <div className="space-y-3">
            {/* Impact Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-navy-500">Impact</span>
                <span className="font-medium text-navy-900">{force.impact}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={force.impact}
                onChange={(e) => onImpactChange(parseInt(e.target.value))}
                className="w-full h-2 bg-navy-100 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-navy-900
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>

            {/* Uncertainty Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-navy-500">Uncertainty</span>
                <span className="font-medium text-navy-900">{force.uncertainty}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={force.uncertainty}
                onChange={(e) => onUncertaintyChange(parseInt(e.target.value))}
                className="w-full h-2 bg-navy-100 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-navy-900
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>

          {/* Visual indicator dots */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-100">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-navy-400 mr-1">Impact</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    n <= force.impact ? 'bg-navy-900' : 'bg-navy-200'
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-navy-400 mr-1">Uncertain</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    n <= force.uncertainty ? 'bg-gold-500' : 'bg-navy-200'
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
