# Reusable Component Patterns

This document tracks reusable component patterns and UI elements used throughout the Strategic Futures Lab simulation.

---

## 1. Drag and Drop Sorting

**Location:** `app/simulation/decide/responses/page.tsx`

**Purpose:** Allow users to sort scenarios into response buckets through intuitive drag-and-drop.

**Key Implementation Details:**
- Uses native HTML5 Drag and Drop API
- State managed with `useState` for `draggedScenario` and `hoveredBucket`
- Visual feedback on hover with scale and color changes
- Framer Motion `AnimatePresence` for smooth entry/exit animations

**Core Functions:**
```tsx
const handleDragStart = (e: React.DragEvent, scenarioId: string) => {
  setDraggedScenario(scenarioId)
  e.dataTransfer.effectAllowed = 'move'
}

const handleDrop = (e: React.DragEvent, responseType: ResponseType) => {
  e.preventDefault()
  if (draggedScenario) {
    setResponseAssignment(draggedScenario, responseType)
  }
  setDraggedScenario(null)
  setHoveredBucket(null)
}
```

**Draggable Item Styling:**
```tsx
className={cn(
  'px-4 py-3 rounded-lg cursor-grab active:cursor-grabbing transition-all',
  'border-2 flex items-center gap-2 select-none',
  colors.bg, colors.border,
  draggedScenario === scenario.id && 'opacity-50 scale-95'
)}
```

**Drop Zone Styling:**
```tsx
className={cn(
  'rounded-xl border-2 border-dashed p-4 transition-all min-h-[180px]',
  isHovered
    ? 'border-gold-500 bg-gold-500/10 scale-[1.02]'
    : 'border-slate-700 bg-slate-800/50',
  assignedScenarios.length > 0 && 'border-solid'
)}
```

---

## 2. Progress Counter with Reset

**Location:** `app/simulation/decide/responses/page.tsx`

**Purpose:** Show progress (X of Y sorted) with option to reset.

**Implementation:**
```tsx
<div className="flex items-center justify-center gap-3 text-sm">
  <div className={cn(
    'px-3 py-1 rounded-full',
    allScenariosAssigned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
  )}>
    {scenarios.length - unassignedScenarios.length} of {scenarios.length} sorted
  </div>
  {(scenarios.length - unassignedScenarios.length) > 0 && (
    <button
      onClick={handleResetAll}
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
    >
      <RotateCcw className="w-3 h-3" />
      Reset
    </button>
  )}
</div>
```

---

## 3. ChatGPT Exploration Links

**Location:** Multiple pages (context, forces, impact, responses, etc.)

**Purpose:** Provide contextual "deep dive" links to ChatGPT for learning.

**Standard Pattern:**
```tsx
<a
  href={`https://chat.openai.com/?q=${encodeURIComponent(explorePrompt)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
>
  <ExternalLink className="w-3 h-3" />
  {linkText}
</a>
```

**Example with MicroCase:**
```tsx
interface MicroCase {
  company: string
  story: string
  explorePrompt: string
  exploreLinkText: string
}
```

---

## 4. Quadrant Color System

**Location:** Multiple scenario-related pages

**Purpose:** Consistent color coding for 4 scenario quadrants.

**Design Decision:** All quadrants use unified gold styling for visual consistency across the app. This creates a cohesive look that aligns with the premium dark theme + gold accent design system.

**Implementation:**
```tsx
const QUADRANT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  TL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
  TR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
  BL: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
  BR: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400' },
}
```

**Note:** Scenarios are distinguished by their names and positions in the matrix, not by color. This simplifies the visual hierarchy and keeps focus on the content.

---

## 5. Range Slider with Labels

**Location:** `app/simulation/develop/impact/page.tsx`, `app/simulation/develop/risk/page.tsx`

**Purpose:** Interactive assessment sliders with percentage display.

**Implementation:**
```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <div>
      <span className="font-medium text-slate-200">{dim.label}</span>
      <p className="text-xs text-slate-400">{dim.shortDesc}</p>
    </div>
    <span className="text-lg font-bold text-gold-400">{value}%</span>
  </div>
  <input
    type="range"
    min="0"
    max="100"
    value={value}
    onChange={(e) => handleSliderChange(dim.key, parseInt(e.target.value))}
    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700
      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:w-4
      [&::-webkit-slider-thumb]:h-4
      [&::-webkit-slider-thumb]:bg-gold-500
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:cursor-pointer
      [&::-webkit-slider-thumb]:shadow-lg"
  />
  <div className="flex justify-between text-xs text-slate-500">
    <span>{dim.lowLabel}</span>
    <span>{dim.highLabel}</span>
  </div>
</div>
```

---

## 6. Lucide Icon Mapping

**Location:** `app/simulation/decide/responses/page.tsx`

**Purpose:** Map string icon names to Lucide React components.

**Implementation:**
```tsx
import { Target, Clock, Shield, Eye, Pause } from 'lucide-react'

const RESPONSE_ICONS: Record<string, React.ReactNode> = {
  'target': <Target className="w-5 h-5 text-gold-400" />,
  'clock': <Clock className="w-5 h-5 text-gold-400" />,
  'shield': <Shield className="w-5 h-5 text-gold-400" />,
  'eye': <Eye className="w-5 h-5 text-gold-400" />,
  'pause': <Pause className="w-5 h-5 text-slate-400" />,
}

// Usage:
{RESPONSE_ICONS[iconName] || <DefaultIcon />}
```

---

## 7. Learning Sidebar (Tabbed)

**Location:** `components/simulation/LearningSidebar.tsx`

**Used in:**
- `app/simulation/discover/context/page.tsx` (inline version with same styling)
- `app/simulation/design/forces/page.tsx`
- `app/simulation/design/axes/page.tsx`
- `app/simulation/design/uncertainties/page.tsx`
- `app/simulation/design/matrix/page.tsx`
- `app/simulation/develop/narratives/page.tsx`
- `app/simulation/develop/impact/page.tsx`
- `app/simulation/develop/risk/page.tsx`
- `app/simulation/decide/responses/page.tsx`
- `app/simulation/decide/actions/page.tsx`
- `app/simulation/decide/report/page.tsx`

**Purpose:** Compact tabbed container for educational content in sidebars. Replaces multiple stacked cards with a single tabbed interface to reduce vertical space usage.

**IMPORTANT:** All sidebar implementations (including inline versions) MUST use the same standardized styling:
- Tab labels: **Guide**, **Example**, **Tips** (not "Why this matters", "Real case", "Quick tip")
- Icons in tabs: `BookOpen`, `Building`, `Lightbulb`
- Active state: `text-gold-400 bg-slate-700/50`
- Inactive state: `text-slate-400 hover:text-slate-300 hover:bg-slate-700/30`
- Tab indicator: Gold bar below tabs (`bg-gold-400`)

**Tab Categories:**
| Tab ID | Icon | Content Type |
|--------|------|--------------|
| `guide` | `BookOpen` | Explanatory content, how-to guides |
| `example` | `Building` | Real-world case studies with ChatGPT links |
| `tips` | `Lightbulb` | Pro tips and quick guidance |

**Props:**
```tsx
interface LearningTab {
  id: 'guide' | 'example' | 'tips'
  label: string
  icon: LucideIcon
  content: React.ReactNode
}

interface LearningSidebarProps {
  tabs: LearningTab[]
  defaultTab?: 'guide' | 'example' | 'tips'
  className?: string
}
```

**Usage:**
```tsx
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'

<LearningSidebar
  defaultTab="guide"
  tabs={[
    {
      id: 'guide',
      label: 'Guide',
      icon: BookOpen,
      content: <GuideContent />,
    },
    {
      id: 'example',
      label: 'Example',
      icon: Building,
      content: <ExampleContent />,
    },
    {
      id: 'tips',
      label: 'Tips',
      icon: Lightbulb,
      content: <TipsContent />,
    },
  ] as LearningTab[]}
/>
```

**Features:**
- Animated gold underline indicator follows active tab
- Smooth content transitions with Framer Motion
- Responsive: tab labels hidden on small screens (icons only)
- Keyboard accessible with focus ring

---

## 8. Scenario Tab Navigation

**Location:** `app/simulation/develop/impact/page.tsx`

**Purpose:** Tab-based navigation between scenarios.

**Implementation:**
```tsx
<div className="flex gap-2 overflow-x-auto pb-2">
  {scenarios.map((scenario) => {
    const colors = QUADRANT_COLORS[scenario.quadrant]
    const isActive = scenario.id === activeScenario
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
        {isAssessed && <span className="ml-1 text-emerald-400">✓</span>}
      </button>
    )
  })}
</div>
```

---

## Design System Colors

### Primary Palette
- **Background:** `slate-900` (base), `slate-800` (cards), `slate-700` (borders)
- **Text:** `white` (headings), `slate-200` (body), `slate-400` (secondary), `slate-500` (muted)
- **Accent:** `gold-400`, `gold-500` (interactive elements)
- **Success:** `emerald-400`, `emerald-500` (completion indicators)

### Quadrant Colors (for scenarios)
All quadrants use unified gold styling for visual consistency:
- All: Gold (`gold-500`) - `bg-gold-500/10`, `border-gold-500/30`, `text-gold-400`

Scenarios are distinguished by their names and matrix positions, not by color.

---

## Animation Patterns

### Framer Motion Entry/Exit
```tsx
<AnimatePresence>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

### Slide Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
>
```

---

## 9. Page Header Pattern (Top Navigation)

**Location:** All simulation pages

**Purpose:** Consistent header with mini progress bar and navigation buttons at the top of every page.

**Implementation:**
```tsx
<div className="flex items-center gap-4 mb-4">
  {/* Mini progress bar */}
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'h-1 w-6 rounded-full transition-colors',
            i < currentStep ? 'bg-gold-500' :
            i === currentStep ? 'bg-gold-400' :
            'bg-slate-600'
          )}
        />
      ))}
    </div>
    <span className="text-[10px] text-slate-500">{currentStep}/{totalSteps}</span>
  </div>

  {/* Navigation buttons - ALL THREE REQUIRED */}
  <div className="flex items-center gap-2 ml-auto">
    <Button variant="ghost" size="sm" onClick={() => router.push(backUrl)}>
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back
    </Button>
    <Button size="sm" onClick={() => router.push(nextUrl)} disabled={!canContinue}>
      Continue
      <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
    <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
      <Home className="w-4 h-4" />
    </Button>
  </div>
</div>
```

**Phase Step Counts:**
| Phase | Steps | Sub-steps |
|-------|-------|-----------|
| Discover | 4 | pre-read, context, focal-issue, forces |
| Design | 4 | uncertainties, axes, matrix (shows 4/4) |
| Develop | 3 | narratives, impact, risk |
| Decide | 3 | responses, actions, report |

**Key Points:**
- Progress bar shows completion within current phase (not overall journey)
- All three buttons (Back, Continue/Action, Home) are required
- Navigation is at the TOP, not bottom, to reduce scrolling
- Back button uses `variant="ghost"`, Continue uses default (filled)
