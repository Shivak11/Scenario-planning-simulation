'use client'

interface CompactSliderProps {
  label: string
  shortDesc: string
  value: number
  onChange: (value: number) => void
  lowLabel: string
  highLabel: string
  /** Minimum value (default: 0) */
  min?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Step increment (default: 1) */
  step?: number
  /** Custom value formatter (default: `${value}%`) */
  formatValue?: (value: number) => string
}

/**
 * Compact slider component that reduces vertical height by ~50%
 * Layout: Label · Short desc (inline) | Value on right
 *         lowLabel [========●========] highLabel (all on one line)
 */
export function CompactSlider({
  label,
  shortDesc,
  value,
  onChange,
  lowLabel,
  highLabel,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => `${v}%`,
}: CompactSliderProps) {
  return (
    <div className="space-y-1.5">
      {/* Header row: label + desc + value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-slate-200 text-sm">{label}</span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-xs text-slate-400">{shortDesc}</span>
        </div>
        <span className="text-base font-bold text-gold-400 tabular-nums">{formatValue(value)}</span>
      </div>

      {/* Slider row: lowLabel + slider + highLabel */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 w-20 text-left shrink-0">{lowLabel}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:bg-gold-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <span className="text-[10px] text-slate-500 w-20 text-right shrink-0">{highLabel}</span>
      </div>
    </div>
  )
}
