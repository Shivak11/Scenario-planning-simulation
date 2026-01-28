# C4 Code Level: Simulation Components

## Overview

- **Name**: Simulation Components Module
- **Description**: React component library for the Strategic Futures Lab scenario planning simulation interface
- **Location**: `/components/simulation`
- **Language**: TypeScript/React
- **Purpose**: Provides reusable, interactive React components for guiding users through a 4-phase scenario planning journey with educational content, research integration, and visualization components

---

## Code Elements

### Components

#### ResearchMission
**File**: `ResearchMission.tsx`

**Purpose**: Manages research activities during scenario planning phases with prompt suggestions and note-taking capabilities.

**Exported Components**:

1. **`ResearchMission(props: ResearchMissionProps): JSX.Element`**
   - **Props**:
     - `missionId: string` - Unique identifier for the research mission
     - `industry?: string | null` - Current industry context for prompt personalization
     - `focalIssue?: string | null` - Current focal issue for prompt personalization
     - `forces?: Array<{ id: string; name: string }>` - Linked forces for context
     - `scenarios?: Array<{ id: string; name: string }>` - Linked scenarios for context
     - `onComplete?: () => void` - Callback when research mission is completed
     - `onSkip?: () => void` - Callback when research mission is skipped
     - `className?: string` - Optional CSS class override
   - **Returns**: Expandable mission card with prompts, ChatGPT integration, and note-saving
   - **State Management**: Uses `useSimulationStore` to persist research notes
   - **Key Features**:
     - Dynamic prompt processing with placeholder replacement (`[INDUSTRY]`, `[FOCAL ISSUE]`, `[FORCE]`, `[AXIS 1]`, `[AXIS 2]`)
     - Copy-to-clipboard functionality for AI prompts
     - Research notes textarea with auto-save to store
     - Expandable/collapsible UI with animation
   - **Dependencies**: `RESEARCH_MISSIONS` from types, `useSimulationStore` from store

2. **`ResearchPromptChip(props: ResearchPromptChipProps): JSX.Element`**
   - **Props**:
     - `prompt: string` - The prompt text to display
     - `variables?: Record<string, string>` - Variables for template substitution
   - **Returns**: Compact, inline prompt chip with copy functionality
   - **Use Case**: Display individual prompts in compact form

3. **`ResearchNotesDisplay(props: ResearchNotesDisplayProps): JSX.Element`**
   - **Props**:
     - `phase: 'focal-issue' | 'forces' | 'scenarios'` - Which phase's notes to display
     - `className?: string` - Optional CSS class override
   - **Returns**: Display of saved research notes for a specific phase
   - **Key Features**: Delete functionality for individual notes, timestamp display, hover reveal

**Internal Functions**:

- `processPrompt(prompt: string): string` - Replaces placeholders in prompts with actual values
- `handleCopy(prompt: string, index: number): Promise<void>` - Copies processed prompt to clipboard
- `handleSaveNotes(): void` - Saves notes to store via `addResearchNote`
- `handleComplete(): void` - Completes mission, auto-saving notes if present

---

#### InsightPanel
**File**: `InsightPanel.tsx`

**Purpose**: Displays contextual educational insights with multiple content types and exploration links.

**Exported Components**:

1. **`InsightPanel(props: InsightPanelProps): JSX.Element`**
   - **Props**:
     - `insights: InsightContent[]` - Array of insight objects to display
     - `className?: string` - Optional CSS class override
     - `collapsible?: boolean` - Whether panel can be collapsed (default: true)
     - `defaultExpanded?: boolean` - Initial expanded state (default: false)
   - **Returns**: Collapsible panel with insights
   - **State Management**: Manages panel expansion state

2. **`CollapsibleInsight(props: CollapsibleInsightProps): JSX.Element`**
   - **Props**:
     - `insight: InsightContent` - Single insight object
     - `defaultExpanded?: boolean` - Initial expansion state
     - `className?: string` - Optional CSS class override
   - **Returns**: Individually collapsible insight card with header and expandable content

**Types**:

```typescript
type InsightType = 'principle' | 'warning' | 'tip' | 'quote' | 'context'

interface InsightContent {
  type: InsightType
  title: string
  content: string | string[]
  source?: string
  expandedContent?: string
  linkText?: string
  linkHref?: string
  chatGptPrompt?: string
}
```

**Internal Function**:

- `InsightCard({ insight }: { insight: InsightContent }): JSX.Element` - Individual insight card renderer
- `openChatGpt(prompt: string): void` - Opens ChatGPT with pre-formatted prompt

**Styling Constants**:

- `INSIGHT_ICONS: Record<InsightType, LucideIcon>` - Icon mapping per insight type
- `INSIGHT_STYLES: Record<InsightType, StyleObject>` - Color and styling per type

**Pre-built Insight Collections**:

- `FOCAL_ISSUE_INSIGHTS: InsightContent[]` - Guidance for focal issue creation
- `INDIAN_PESTEL_INSIGHTS: InsightContent[]` - India-specific PESTEL factors
- `UNCERTAINTY_INSIGHTS: InsightContent[]` - Uncertainty assessment guidance
- `SCENARIO_AXIS_INSIGHTS: InsightContent[]` - 2x2 matrix methodology
- `SCENARIO_NAMING_INSIGHTS: InsightContent[]` - Scenario naming best practices
- `INDUSTRY_SELECTION_INSIGHTS: InsightContent[]` - Industry selection context
- `ORGANIZATION_TYPE_INSIGHTS: InsightContent[]` - Organization structure implications
- `STAKEHOLDER_PERSPECTIVE_INSIGHTS: InsightContent[]` - Perspective-based insights
- `CONTEXT_MODIFIERS_INSIGHTS: InsightContent[]` - Context modifier guidance
- `RESEARCH_MISSION_INSIGHTS: InsightContent[]` - Research importance
- `ENVIRONMENTAL_SCANNING_INSIGHTS: InsightContent[]` - Impact/uncertainty assessment
- `SUMMARY_INSIGHTS: InsightContent[]` - Phase completion guidance

**Deep Learning Content Functions**:

- `getPESTDeepLearning(industry: string | null): DeepLearningItem[]` - Industry-specific PEST exploration
- `SCENARIO_AXIS_DEEP_LEARNING: DeepLearningItem[]` - Axis selection methodology

**Example Comparison Objects**:

- `RATING_IMPACT_EXAMPLE: CompanyComparisonExample`
- `RATING_UNCERTAINTY_EXAMPLE: UncertaintyComparisonExample`
- `ORTHOGONALITY_EXAMPLE: OrthogonalityExample`
- `MODIFIER_IMPACT_EXAMPLE: ModifierImpactExample`

---

#### FlippableForceCard
**File**: `FlippableForceCard.tsx`

**Purpose**: Interactive 3D-flipping card for evaluating and exploring driving forces.

**Exported Components**:

1. **`FlippableForceCard(props: FlippableForceCardProps): JSX.Element`**
   - **Props**:
     - `force: Force` - Force object with name, description, impact, uncertainty ratings
     - `onImpactChange: (value: number) => void` - Callback for impact slider changes
     - `onUncertaintyChange: (value: number) => void` - Callback for uncertainty slider changes
     - `industry?: string | null` - Industry context for ChatGPT prompts
     - `focalIssue?: string | null` - Focal issue context for ChatGPT prompts
   - **Returns**: 3D-flipping card with front side (compact sliders) and back side (full description)
   - **Animation**: Framer Motion 3D flip effect
   - **State**: `isFlipped` boolean for card orientation

2. **`ForceChip(props: ForceChipProps): JSX.Element`**
   - **Props**:
     - `force: Force` - Force object to display
     - `onClick?: () => void` - Optional click handler
   - **Returns**: Compact pill-shaped badge for displaying selected forces

**Internal Functions**:

- `openChatGpt(): void` - Opens ChatGPT with structured force analysis prompt

**Styling Constants**:

- `CATEGORY_COLORS: Record<PESTCategory, ColorObject>` - Dark theme colors per PEST category
- `CATEGORY_ICONS: Record<PESTCategory, string>` - Emoji icons per category
- `IMPACT_LEVELS: Record<number, { label: string; color: string }>` - Impact rating labels
- `UNCERTAINTY_LEVELS: Record<number, { label: string; color: string }>` - Uncertainty labels

---

#### CompactSlider
**File**: `CompactSlider.tsx`

**Purpose**: Reduced-height slider component for space-constrained layouts.

**Exported Function**:

**`CompactSlider(props: CompactSliderProps): JSX.Element`**
- **Props**:
  - `label: string` - Slider label
  - `shortDesc: string` - Brief description displayed inline
  - `value: number` - Current value
  - `onChange: (value: number) => void` - Change callback
  - `lowLabel: string` - Label for low end of range
  - `highLabel: string` - Label for high end of range
  - `min?: number` - Minimum value (default: 0)
  - `max?: number` - Maximum value (default: 100)
  - `step?: number` - Step increment (default: 1)
  - `formatValue?: (value: number) => string` - Custom value formatter (default: `${value}%`)
- **Returns**: Single-line slider with inline label and description
- **Layout**: Label and description left, current value right; slider row with low/high labels

---

#### HomeNav
**File**: `HomeNav.tsx`

**Purpose**: Fixed navigation button to return home from any simulation page.

**Exported Function**:

**`HomeNav(props: HomeNavProps): JSX.Element`**
- **Props**:
  - `className?: string` - Optional CSS class override
- **Returns**: Fixed-position home navigation link with icon
- **Position**: `top-6 left-6` fixed positioning
- **Styling**: Dark backdrop with gold hover effects

---

#### LearningSidebar
**File**: `LearningSidebar.tsx`

**Purpose**: Reusable tabbed sidebar component for educational content on simulation pages.

**Exported Components**:

1. **`LearningSidebar(props: LearningSidebarProps): JSX.Element`**
   - **Props**:
     - `tabs: LearningTab[]` - Array of tab configurations
     - `defaultTab?: LearningTabId` - Initial active tab (default: first tab)
     - `className?: string` - Optional CSS class override
   - **Returns**: Tabbed panel with smooth tab transitions and animated content
   - **State**: `activeTab` for current tab selection
   - **Animation**: Framer Motion for tab indicator and content fade
   - **Key Features**:
     - Spring-animated tab indicator
     - Fade transition between tab content
     - Responsive tab labels (hidden on mobile, shown on larger screens)

**Types**:

```typescript
type LearningTabId = 'guide' | 'example' | 'tips'

interface LearningTab {
  id: LearningTabId
  label: string
  icon: LucideIcon
  content: React.ReactNode
}
```

**Constants**:

- `DEFAULT_ICONS: Record<LearningTabId, LucideIcon>` - Default icons for standard tabs

**Exports**:

- `BookOpen`, `Building`, `Lightbulb` - Commonly used Lucide icons

---

#### ForceCard
**File**: `ForceCard.tsx`

**Purpose**: Card component for displaying and rating driving forces (light theme variant).

**Exported Function**:

**`ForceCard(props: ForceCardProps): JSX.Element`**
- **Props**:
  - `force: Force` - Force object with PEST category and ratings
  - `onImpactChange: (value: number) => void` - Impact slider callback
  - `onUncertaintyChange: (value: number) => void` - Uncertainty slider callback
  - `compact?: boolean` - Compact layout option (default: false)
- **Returns**: Animated card with force details and sliders
- **State**: `isHovered` for hover effects
- **Features**:
  - Visual emphasis based on impact + uncertainty score
  - High-priority indicator for forces with impact >= 4 and uncertainty >= 4
  - Visual indicator dots for impact and uncertainty ratings

**Styling Constants**:

- `CATEGORY_COLORS: Record<PESTCategory, ColorObject>` - Light theme colors per category

---

#### ProgressIndicator
**File**: `ProgressIndicator.tsx`

**Purpose**: Journey progress tracking showing current phase/sub-step position.

**Exported Function**:

**`ProgressIndicator(props: ProgressIndicatorProps): JSX.Element`**
- **Props**:
  - `className?: string` - Optional CSS class override
- **Returns**: Progress bar and phase indicators showing journey progress
- **Dual Support**:
  - Legacy 10-phase route structure (`/phase-N`)
  - New 4-phase structure (`/simulation/{phase}/{sub-step}`)
- **State**: `expandedPhase` for showing/hiding sub-step details
- **Features**:
  - Overall progress bar (13 total sub-steps)
  - Main phase circles with icons
  - Expandable sub-step lists
  - Completion checkmarks
  - Route detection via pathname analysis

**Internal Functions**:

- `useNewRouteStructure(pathname: string | null): RouteInfo` - Detects route structure and extracts phase/step

**Constants Used**:

- `PHASE_ORDER: MainPhase[]` - Correct sequence of phases
- `MAIN_PHASE_CONFIG: Record<MainPhase, PhaseConfig>` - Phase metadata
- `SUB_STEP_CONFIG: Record<SubStep, StepConfig>` - Sub-step metadata
- `PHASE_ICONS: Record<string, LucideIcon>` - Icon mapping for phases

---

#### WisdomPanel
**File**: `WisdomPanel.tsx`

**Purpose**: Displays curated quotes from strategic thinkers with exploration links.

**Exported Components**:

1. **`WisdomPanel(props: WisdomPanelProps): JSX.Element`**
   - **Props**:
     - `category?: WisdomQuote['category'] | 'all'` - Filter quotes by category (default: 'all')
     - `maxQuotes?: number` - Maximum quotes to display (default: 3)
     - `showExploreLinks?: boolean` - Show ChatGPT exploration links (default: true)
     - `className?: string` - Optional CSS class override
     - `defaultCollapsed?: boolean` - Initial collapsed state (default: true)
     - `title?: string` - Panel title
   - **Returns**: Horizontally scrollable quote cards with navigation
   - **State**: `isExpanded`, `currentIndex` for card carousel
   - **Features**: Smooth horizontal scroll, left/right navigation buttons

2. **`LearningCards(props: LearningCardsProps): JSX.Element`**
   - **Props**:
     - `title: string` - Card set title
     - `cards: LearningCard[]` - Array of good/bad example cards
     - `className?: string` - Optional CSS class override
     - `defaultCollapsed?: boolean` - Initial collapsed state (default: true)
   - **Returns**: Reveal-style cards showing good/bad examples
   - **State**: `isExpanded`, `revealedCards` set for tracking revealed cards
   - **Interaction**: Click cards to reveal if they're good or bad examples

3. **`DiscoverPrompts(props: DiscoverPromptsProps): JSX.Element`**
   - **Props**:
     - `prompts: DiscoverPrompt[]` - Array of ChatGPT/Google prompts
     - `className?: string` - Optional CSS class override
     - `title?: string` - Section title (default: 'Go Deeper')
     - `defaultCollapsed?: boolean` - Initial collapsed state (default: true)
   - **Returns**: Expandable list of exploration prompts
   - **Features**: Opens ChatGPT or Google Search based on prompt type

**Types**:

```typescript
interface WisdomQuote {
  id: string
  quote: string
  author: string
  role: string
  context?: string
  chatGptPrompt?: string
  googleQuery?: string
  category: 'strategy' | 'leadership' | 'innovation' | 'planning'
}

interface LearningCard {
  id: string
  title: string
  content: string
  isGood: boolean
  explanation?: string
}

interface DiscoverPrompt {
  label: string
  prompt: string
  type: 'chatgpt' | 'google'
}
```

**Internal Functions**:

- `QuoteCard({ quote, showExploreLinks, onChatGpt, onGoogle }): JSX.Element` - Individual quote card
- `handleScroll(direction: 'left' | 'right'): void` - Smooth horizontal scrolling
- `openChatGpt(prompt: string): void` - Opens ChatGPT with prompt
- `openGoogle(query: string): void` - Opens Google Search

**Wisdom Database**:

- `WISDOM_QUOTES: WisdomQuote[]` - 11+ curated quotes from strategic thinkers:
  - Peter Schwartz (scenario planning pioneer)
  - Steve Jobs (innovation)
  - Andy Grove (strategic inflection points)
  - Sun Tzu (classical strategy)
  - Ratan Tata (Indian leadership)
  - Narayana Murthy (data-driven leadership)
  - Clayton Christensen (disruption)
  - Jeff Bezos (long-term thinking)

**Pre-built Card Collections**:

- `FOCAL_ISSUE_LEARNING_CARDS: LearningCard[]` - Good/bad focal issue examples

---

## Dependencies

### Internal Dependencies

| Dependency | Location | Purpose |
|------------|----------|---------|
| `useSimulationStore` | `@/lib/store` | Zustand store for managing simulation state (research notes, force ratings, etc.) |
| `cn` utility | `@/lib/utils` | Classname merging utility for conditional Tailwind classes |
| `RESEARCH_MISSIONS` | `@/lib/types` | Pre-defined research mission configurations |
| `Force`, `PESTCategory` types | `@/lib/types` | Domain types for forces and categories |
| `PEST_LABELS` | `@/lib/types` | Labels for PESTEL categories |
| `Button` component | `@/components/ui/button` | Base button component |
| `Card`, `CardContent` | `@/components/ui/card` | Base card components |
| `Progress` component | `@/components/ui/progress` | Progress bar component |

### External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | Latest | Core React library |
| `framer-motion` | Latest | Animation library for 3D flip, transitions, expand/collapse |
| `lucide-react` | Latest | Icon library for UI icons (Copy, Check, ChevronDown, etc.) |
| `next` | Latest | Next.js framework (usePathname hook) |

### React Hooks Used

- `useState` - Local component state
- `useRef` - DOM references for scroll containers
- `usePathname` - URL detection for route structure
- `useSimulationStore` - Zustand store hook for global state

---

## Relationships

### Component Hierarchy

```
SimulationPages (consumers)
├── ResearchMission
│   ├── ResearchPromptChip
│   └── ResearchNotesDisplay
├── InsightPanel
│   └── CollapsibleInsight
├── FlippableForceCard
│   └── ForceChip
├── CompactSlider
├── HomeNav
├── LearningSidebar
│   └── (Custom tab content)
├── ForceCard
├── ProgressIndicator
├── WisdomPanel
│   ├── QuoteCard
│   ├── LearningCards
│   └── DiscoverPrompts
└── (Other layout components)
```

### Data Flow

```
User Interaction
    ↓
Component State (useState)
    ↓
Callback Props (onImpactChange, onComplete, etc.)
    ↓
Parent Component / Store (useSimulationStore)
    ↓
Zustand Store State Update
    ↓
Component Re-render with Updated Data
```

### ChatGPT Integration Points

All components that offer AI exploration follow this pattern:

```typescript
const openChatGpt = (prompt: string) => {
  window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
}
```

Used in:
- `FlippableForceCard` - Deep dive on force analysis
- `InsightPanel` - Explore specific concepts
- `WisdomPanel` - Expand on quote context
- `ResearchMission` - Open ChatGPT for mission work

### State Management Integration

Components use `useSimulationStore` for:

**ResearchMission**:
- `addResearchNote(note)` - Persist research findings
- `deleteResearchNote(id)` - Remove notes
- `researchNotes` - Retrieve phase-specific notes

**ProgressIndicator**:
- `completedPhases` - Track which phases are done
- `progress` - Overall journey progress

---

## Code Patterns

### Animation Patterns

**Expand/Collapse Pattern** (used in InsightPanel, WisdomPanel):
```typescript
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>
```

**3D Flip Pattern** (FlippableForceCard):
```typescript
<motion.div
  animate={{ rotateY: isFlipped ? 180 : 0 }}
  transition={{ duration: 0.6, type: 'spring' }}
  style={{ transformStyle: 'preserve-3d' }}
>
  <div style={{ backfaceVisibility: 'hidden' }}>Front</div>
  <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>Back</div>
</motion.div>
```

**Tab Switch Pattern** (LearningSidebar):
```typescript
<motion.div
  animate={{
    left: `${(activeTabIndex / tabCount) * 100}%`,
    width: `${100 / tabCount}%`,
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
/>
```

### Placeholder Substitution Pattern (ResearchMission)

```typescript
const processPrompt = (prompt: string): string => {
  let processed = prompt
  if (industry) processed = processed.replace('[INDUSTRY]', industry)
  if (focalIssue) processed = processed.replace('[FOCAL ISSUE]', focalIssue)
  // ... more replacements
  return processed
}
```

### Conditional Styling Pattern (cn utility)

```typescript
className={cn(
  'base-classes',
  isActive && 'active-state-classes',
  isError && 'error-state-classes',
  customClass
)}
```

---

## Styling Architecture

### Color Scheme

- **Dark Backgrounds**: `slate-800`, `slate-900`, `slate-700`
- **Gold Accents**: `gold-400`, `gold-500`, `gold-300`
- **Category Colors** (dark theme):
  - Political/Economic/Social/Tech/Environmental/Legal: All use `amber-500/20` with `amber-400` text
- **Text Colors**: `slate-100` (headings), `slate-300` (body), `slate-400`/`slate-500` (muted)
- **Semantic Colors**:
  - Success/Completion: `emerald-500`
  - Warning: `amber-500`
  - Links: `gold-400` with `hover:text-gold-300`

### Responsive Design

- Mobile-first approach
- Hidden labels on mobile (`hidden sm:inline`)
- Touch-friendly tap targets (44px minimum)
- Tab navigation adapts to screen size

### Animation Principles

- Framer Motion used throughout
- Spring physics for interactive elements
- 0.2-0.3s duration for most transitions
- 3D transforms for depth perception
- AnimatePresence for enter/exit animations

---

## Notes

1. **ChatGPT Integration**: All ChatGPT links open in new tabs with URL-encoded prompts. The prompts are carefully crafted to guide AI responses toward scenario planning and business strategy contexts.

2. **Copy-to-Clipboard**: ResearchMission uses `navigator.clipboard.writeText()` for modern browser clipboard access with visual feedback (temporary checkmark).

3. **Force Card Variants**: `FlippableForceCard` (dark theme, 3D flip) and `ForceCard` (light theme, standard layout) serve different use cases.

4. **Responsive Tab Labels**: LearningSidebar hides tab labels on mobile to save space, showing only icons.

5. **Dark Theme Consistency**: All components maintain the dark slate + gold aesthetic per CLAUDE.md requirements.

6. **Accessibility**: Components use semantic HTML, focus states, and proper ARIA attributes where applicable.

7. **Route Structure Support**: ProgressIndicator gracefully handles both legacy (`/phase-N`) and new (`/simulation/{phase}/{step}`) route structures via pathname parsing.

8. **Placeholder Expansion**: ResearchMission dynamically expands placeholders based on context - if a user hasn't selected an industry, `[INDUSTRY]` remains literal for the user to fill in.

9. **Learning Content Types**: InsightPanel supports multiple insight types with distinct styling (principle, warning, tip, quote, context) allowing versatile educational content composition.

10. **Scrollable Containers**: WisdomPanel uses smooth horizontal scrolling with hidden scrollbars for a polished experience on cards that exceed viewport width.

