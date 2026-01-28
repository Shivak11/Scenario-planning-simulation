# C4 Code Level: Project Documentation

## Overview

- **Name**: Strategic Futures Lab - Documentation Layer
- **Description**: Comprehensive documentation of UI component patterns, design systems, content types, and architectural guidelines for the Strategic Futures Lab scenario planning simulation application
- **Location**: `/Users/shivakakkar/Scenario planning/strategic-futures-lab/docs/`
- **Language**: Markdown
- **Purpose**: Provides code-level reference documentation for developers implementing UI components, managing learning content, and maintaining design consistency throughout the simulation experience

---

## Documentation Files

### 1. COMPONENTS.md

**Location**: `/Users/shivakakkar/Scenario planning/strategic-futures-lab/docs/COMPONENTS.md`

**Purpose**: Serves as the primary reference for reusable UI component patterns and design system implementation across the Strategic Futures Lab simulation.

**Key Content Sections**:

#### Component Patterns (9 reusable patterns documented)

1. **Drag and Drop Sorting**
   - Location: `app/simulation/decide/responses/page.tsx`
   - Functions: `handleDragStart(e: React.DragEvent, scenarioId: string): void`, `handleDrop(e: React.DragEvent, responseType: ResponseType): void`
   - State: `draggedScenario: string | null`, `hoveredBucket: BucketType | null`
   - Dependencies: HTML5 Drag and Drop API, Framer Motion `AnimatePresence`

2. **Progress Counter with Reset**
   - Location: `app/simulation/decide/responses/page.tsx`
   - Functions: `handleResetAll(): void`
   - State: `allScenariosAssigned: boolean`
   - UI Elements: Progress display (X of Y sorted), reset button with `RotateCcw` icon

3. **ChatGPT Exploration Links**
   - Pattern: Contextual deep-dive links to OpenAI ChatGPT
   - Used across: Context, forces, impact, responses, actions pages
   - Type: `interface MicroCase { company: string; story: string; explorePrompt: string; exploreLinkText: string }`
   - URL Pattern: `https://chat.openai.com/?q=${encodeURIComponent(explorePrompt)}`

4. **Quadrant Color System**
   - Location: Multiple scenario-related pages
   - Type: `QUADRANT_COLORS: Record<string, { bg: string; border: string; text: string }>`
   - Implementation: All quadrants use unified gold styling (`bg-gold-500/10`, `border-gold-500/30`, `text-gold-400`)
   - Design Decision: Quadrants distinguished by names and matrix positions, not colors

5. **Range Slider with Labels**
   - Location: `app/simulation/develop/impact/page.tsx`, `app/simulation/develop/risk/page.tsx`
   - Purpose: Interactive assessment sliders with percentage display
   - State: `value: number` (0-100)
   - Functions: `handleSliderChange(dim.key: string, value: number): void`
   - Styling: Custom WebKit slider thumb styling with gold accent

6. **Lucide Icon Mapping**
   - Location: `app/simulation/decide/responses/page.tsx`
   - Type: `RESPONSE_ICONS: Record<string, React.ReactNode>`
   - Icons: Target, Clock, Shield, Eye, Pause
   - Color: `text-gold-400` (except Pause: `text-slate-400`)

7. **Learning Sidebar (Tabbed)**
   - Location: `components/simulation/LearningSidebar.tsx`
   - Used in: 11 simulation pages (context, forces, impact, responses, actions, report, etc.)
   - Props: `LearningSidebarProps { tabs: LearningTab[]; defaultTab?: 'guide' | 'example' | 'tips'; className?: string }`
   - Tab Types: `LearningTab { id: 'guide' | 'example' | 'tips'; label: string; icon: LucideIcon; content: React.ReactNode }`
   - Tab Labels (Standardized):
     - `guide`: `BookOpen` icon - Explanatory content
     - `example`: `Building` icon - Real-world case studies
     - `tips`: `Lightbulb` icon - Pro tips and guidance
   - Styling:
     - Active tab: `text-gold-400 bg-slate-700/50`
     - Inactive tab: `text-slate-400 hover:text-slate-300 hover:bg-slate-700/30`
     - Tab indicator: Gold bar below tabs (`bg-gold-400`)
   - Features: Animated gold underline, smooth Framer Motion transitions, responsive (icons only on small screens)

8. **Scenario Tab Navigation**
   - Location: `app/simulation/develop/impact/page.tsx`
   - Purpose: Tab-based navigation between scenarios
   - State: `activeScenario: string`, `isAssessed: boolean`
   - Styling: Active state uses `QUADRANT_COLORS`, inactive state uses slate styling
   - Visual Indicator: Emerald checkmark (`✓`) when scenario is assessed

9. **Page Header Pattern (Top Navigation)**
   - Location: All simulation pages
   - Components: Mini progress bar + navigation buttons (Back, Continue, Home)
   - Progress Bar: 3 visual dots showing phase step completion
   - Navigation Buttons: All three required for consistency
   - Phase Step Counts:
     - Discover: 4 steps (pre-read, context, focal-issue, forces)
     - Design: 4 steps (uncertainties, axes, matrix)
     - Develop: 3 steps (narratives, impact, risk)
     - Decide: 3 steps (responses, actions, report)

#### Design System

**Color Palette**:
- Background: `slate-900` (base), `slate-800` (cards), `slate-700` (borders)
- Text: `white` (headings), `slate-200` (body), `slate-400` (secondary), `slate-500` (muted)
- Accent: `gold-400`, `gold-500` (interactive elements)
- Success: `emerald-400`, `emerald-500` (completion indicators)

**Color Semantics** (precise usage):
- Gold (`gold-400`, `gold-500`): Positive examples, good labels, checkmarks, interactive accents
- Amber (`amber-400`, `amber-500`): Warnings, bad labels, things to avoid
- Emerald (`emerald-400`, `emerald-500`): Completion indicators ONLY (task done, progress complete)
- Red (`red-400`, `red-500`): Urgency/priority actions, destructive buttons, negative outcomes

**Animation Patterns**:
- Framer Motion entry/exit: `initial={{ opacity: 0, scale: 0.9 }}` → `animate={{ opacity: 1, scale: 1 }}` → `exit={{ opacity: 0, scale: 0.9 }}`
- Slide animation: `initial={{ opacity: 0, y: -10 }}` → `animate={{ opacity: 1, y: 0 }}` → `exit={{ opacity: 0, y: 10 }}`

---

### 2. learning-sidebar-components.md

**Location**: `/Users/shivakakkar/Scenario planning/strategic-futures-lab/docs/learning-sidebar-components.md`

**Purpose**: Documents the content types available for the LearningSidebar component, providing guidelines for creating varied, contextual educational content across simulation steps.

**Key Content Types**:

#### 1. Why This Matters (Required)
- Type: `whyItMatters: string` (2-3 sentences) + optional `learnMore?: string`
- Used in: Every step
- Purpose: Foundational context and core explanation

#### 2. Mini Article Modal
- Type: `miniArticle?: { title: string; author: string; readTime: string; buttonText: string; sections: { heading: string; content: string }[] }`
- Best for: Critical learning moments (e.g., Focal Issue step)
- Function: Full-screen deep-dive article for comprehensive guidance before decisions

#### 3. Comparison Tiles
- Type: `comparisonTiles?: { label: string; horizon: string; dynamic: string; icon: string; learnWhyPrompt?: string }[]`
- Best for: Steps with multiple distinct options to compare (Organization Type, Stakeholder Perspective)
- Functionality: Horizontally scrollable with optional ChatGPT "Learn why?" links

#### 4. Real Case (Micro-Case)
- Type: `microCase?: { company: string; story: string; explorePrompt: string; exploreLinkText: string }`
- Best for: Steps where specific case studies illuminate concepts (Industry Selection, Focal Issue)
- Features: Brief case summary with rich ChatGPT exploration link
- Design Principle: Link is the primary learning vehicle, not just illustration

#### 5. Quick Tip
- Type: `tip?: string` (one sentence)
- Best for: Steps where users might make common mistakes or need reminders
- Characteristic: Practical, specific guidance (not generic)

**Content Mix Strategy by Step**:

| Step | Why Matters | Learn More | Mini Article | Comparison Tiles | Real Case | Tip |
|------|-------------|------------|--------------|------------------|-----------|-----|
| Industry | ✓ | ✓ | | | ✓ Shell | ✓ |
| Organization | ✓ | | | ✓ 6 org types | | ✓ |
| Stakeholder | ✓ | ✓ | | ✓ 4 perspectives | | ✓ |
| Focal Issue | ✓ | | ✓ Peter Schwartz style | | ✓ Kodak | ✓ |
| Modifiers | ✓ | ✓ | | | | ✓ |
| Summary | ✓ | ✓ | | | | |

**Design Principles**:
1. Vary content per step—avoid using all types everywhere
2. Real cases should teach via ChatGPT link, not just illustrate
3. Comparison tiles answer specific questions
4. Mini articles reserved for critical decision moments
5. Tips must be practical and specific, not generic

---

## Code Element Relationships

### Component Dependency Map

```
LearningSidebar (Root Component)
├── Uses: BookOpen, Building, Lightbulb (Lucide icons)
├── Props: LearningTab[], defaultTab, className
└── Features:
    ├── Tab state management (activeTab)
    ├── Framer Motion animations
    ├── ChatGPT exploration links
    └── Responsive tab label visibility

Drag and Drop System
├── HTML5 Drag and Drop API
├── State: draggedScenario, hoveredBucket
├── Handlers: handleDragStart, handleDrop
└── Visual Feedback:
    ├── Dragged item: opacity-50 scale-95
    ├── Drop zone hover: border-gold-500, bg-gold-500/10, scale-[1.02]
    └── Animations: Framer Motion AnimatePresence

Page Header Pattern
├── Components:
│   ├── Mini Progress Bar (3 dots)
│   ├── Navigation Buttons: Back, Continue, Home
│   └── Step counter: X/Y format
└── Routes:
    ├── Discover: 4 steps
    ├── Design: 4 steps
    ├── Develop: 3 steps
    └── Decide: 3 steps

Color System Integration
├── QUADRANT_COLORS: Record<string, ColorSet>
├── Palette:
│   ├── Gold: Interactive accents, positives, good examples
│   ├── Amber: Warnings, bad examples
│   ├── Emerald: Completion states only
│   └── Red: Urgency, destructive actions
└── Applied to: Icons, backgrounds, borders, text

Learning Content Pipeline
├── Input: Step-specific LearningSidebarProps
├── Processing:
│   ├── Content type selection (5 types)
│   ├── ChatGPT link generation (MicroCase, ComparisonTiles)
│   └── Tab state management
└── Output: Rendered learning panel with active tab
```

### File Dependencies

**COMPONENTS.md depends on**:
- React/TypeScript syntax knowledge
- Framer Motion animation library
- Tailwind CSS utility classes
- Lucide React icon library
- Native HTML5 Drag and Drop API
- App structure: `app/simulation/` route patterns

**learning-sidebar-components.md depends on**:
- LearningSidebar component API
- LearningTab type definition
- ChatGPT API endpoint integration
- Step taxonomy (Industry, Organization, Stakeholder, etc.)
- Content variation strategies

### External Dependencies Referenced

**Libraries**:
- `framer-motion`: Entry/exit animations, layout transitions, AnimatePresence
- `lucide-react`: Icon components (BookOpen, Building, Lightbulb, Target, Clock, Shield, Eye, Pause, RotateCcw, ExternalLink, ArrowLeft, ArrowRight, Home)
- `class-variance-authority`: cn() utility for conditional class merging
- Tailwind CSS: Dark theme utilities, gold/amber/emerald color palette

**Services**:
- OpenAI ChatGPT: External link generation for exploration prompts
- Next.js routing: Page navigation (Back, Continue, Home buttons)

**Browser APIs**:
- HTML5 Drag and Drop Event API: dragstart, drop, dragover handlers

---

## Design Philosophy & Principles

### Dark Theme + Gold Accent Design System
- **Premium, executive feel**: Dark slate backgrounds never deviate to white/light UI
- **Gold accents for interaction**: All interactive elements, icons, and highlights use gold-400/gold-500
- **Monochromatic icons**: No multi-color icons; all icons use gold or slate coloring

### Learning Content Philosophy
- **Vary content types** to maintain engagement across 13+ simulation steps
- **ChatGPT links as learning vehicle**: Not just supplementary; primary teaching tool for case studies
- **Consistent tab structure**: All sidebars use standardized Guide/Example/Tips pattern
- **Responsive design**: Tab labels hide on small screens, icons remain visible

### Component Reusability
- **Standardized patterns**: Drag-and-drop, sliders, tabs, progress indicators follow consistent patterns
- **Styling consistency**: All components use unified color palette and animation patterns
- **Accessibility**: Keyboard navigation for tabs, focus rings, semantic HTML structure

### Navigation & State Management
- **Phase-based step counting**: Progress tracked within current phase, not overall journey
- **Three-button pattern**: Back, Continue, Home buttons on every page for consistency
- **Progressive disclosure**: Tabs and expandable sections reveal content on demand

---

## Integration Notes

### Component Usage Locations

**LearningSidebar** is implemented in 11 simulation pages:
1. Context (Discover phase)
2. Forces (Discover phase)
3. Narratives (Develop phase)
4. Impact (Develop phase)
5. Risk (Develop phase)
6. Responses (Decide phase)
7. Actions (Decide phase)
8. Report (Decide phase)
9. Uncertainties (Design phase)
10. Axes (Design phase)
11. Matrix (Design phase)

**Page Header Pattern** appears on all simulation pages (13 total routes).

**Drag and Drop** implemented in:
- `/simulation/decide/responses/page.tsx` - For response assignment

**Range Sliders** implemented in:
- `/simulation/develop/impact/page.tsx` - For impact assessment
- `/simulation/develop/risk/page.tsx` - For risk assessment

### State Management Integration

These components integrate with Zustand store (`lib/store.ts`):
- LearningSidebar content varies based on: `industry`, `organizationType`, `stakeholderPerspective`
- Drag-and-drop updates: `responseAssignments` store slice
- Sliders update: `impactAssessments`, risk assessment state
- Tab navigation depends on: `mainPhase`, `subStep` state

### Type System References

**Types defined in `lib/types.ts`**:
- `Force` - PEST category, impact/uncertainty ratings
- `Scenario` - Quadrant positions (TL, TR, BL, BR)
- `MainPhase` - Phase enum with navigation helpers
- `SubStep` - Step enum with getNextStep(), getPrevStep() functions
- `ResponseType` - Response assignment categories
- `LearningTab` - Tab interface for LearningSidebar

---

## Documentation Maintenance Guidelines

### When to Update Documentation

**Update COMPONENTS.md when**:
- New reusable component pattern is created
- Existing component pattern changes (styling, props, behavior)
- Design system colors are modified
- Animation patterns are standardized
- Page header structure changes

**Update learning-sidebar-components.md when**:
- New content types are added to LearningSidebar
- Tab structure changes (label names, icons, order)
- Content mix strategy evolves
- ChatGPT integration patterns change
- Learning content guidelines are refined

### Documentation Standards

1. **Code Snippets**: Include complete working examples with imports
2. **Location References**: Always link to actual file paths in codebase
3. **Type Definitions**: Show TypeScript interfaces for component props
4. **Visual Examples**: Use markdown code blocks with language specification
5. **Link Syntax**: Use proper markdown links to external resources (ChatGPT, Shell references)

---

## Related Documentation Files

**See also**:
- `/Users/shivakakkar/Scenario planning/strategic-futures-lab/CLAUDE.md` - Complete project architecture, state management, and development guidelines
- `/Users/shivakakkar/Scenario planning/strategic-futures-lab/app/` - Implementation of documented components
- `/Users/shivakakkar/Scenario planning/strategic-futures-lab/components/` - Reusable component source code

---

## Summary

The Strategic Futures Lab documentation layer provides comprehensive code-level reference material for developers implementing the 13-step scenario planning simulation. It documents 9 reusable UI component patterns, 5 learning content types, a unified design system with dark theme + gold accents, and integration guidelines with the state management layer. The documentation emphasizes consistency (standardized color semantics, tab structures, animation patterns) while enabling content variation to maintain engagement across the extended user journey.
