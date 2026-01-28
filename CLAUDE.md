# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Strategic Futures Lab is a scenario planning simulation app inspired by Shell's scenario planning methodology. It guides users through a structured 4-phase journey to analyze strategic uncertainties and develop action plans.

## Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript type checking
```

## Architecture

### 4-Phase Journey Model

The simulation follows a **Discover → Design → Develop → Decide** flow with 13 sub-steps:

| Phase | Sub-steps | Purpose |
|-------|-----------|---------|
| **Discover** | pre-read, context, focal-issue, forces | Frame the strategic question and scan for driving forces |
| **Design** | uncertainties, axes, matrix | Select critical uncertainties and build the 2x2 scenario matrix |
| **Develop** | narratives, impact, risk | Create scenario narratives and assess organizational impact |
| **Decide** | responses, actions, report | Assign response types and develop action plans |

### Route Structure

Routes follow the pattern `/simulation/{phase}/{sub-step}`:
- `/simulation/discover/pre-read` - Introduction
- `/simulation/design/matrix` - Scenario matrix construction
- `/simulation/decide/report` - Final report

The simulation layout (`app/simulation/layout.tsx`) wraps all phase pages with progress tracking and navigation.

### State Management

**Zustand store** (`lib/store.ts`) manages all simulation state with localStorage persistence:

```typescript
// Key state slices
progress: { mainPhase, subStep, completedPhases }  // Journey tracking
industry, organizationType, stakeholderPerspective  // Context setup
forces: Force[]                                      // PEST forces (AI-generated)
xAxis, yAxis                                         // Selected uncertainty axes
scenarios: Scenario[]                                // 4 quadrant scenarios
impactAssessments, responseAssignments, actions      // Decision outputs
```

### Type System

`lib/types.ts` defines the domain model:
- `Force` - Driving forces with PEST category, impact/uncertainty ratings
- `Scenario` - Quadrant-based future scenarios (TL, TR, BL, BR)
- `MainPhase`, `SubStep` - Navigation types with helper functions (`getNextStep`, `getPrevStep`)
- Industry/organization taxonomies are Indianized (BFSI, IT Services, PSU, etc.)

### AI Integration

`app/api/generate-forces/route.ts` calls Claude API to generate 16 PEST forces based on user context:
- Requires `ANTHROPIC_API_KEY` in `.env.local`
- Uses structured prompts for consistent JSON output
- Falls back gracefully on parse errors

### Component Patterns

Key reusable patterns documented in `docs/COMPONENTS.md`:
- **Drag-and-drop sorting** - Native HTML5 DnD for response assignment
- **LearningSidebar** - Tabbed educational content (guide/example/tips) - **ALL sidebar panels MUST use this**
- **Quadrant colors** - All quadrants use gold (`bg-gold-500/10`, `border-gold-500/30`, `text-gold-400`) for visual consistency
- **Progress indicator** - Expandable phase navigation with sub-step visibility

### Learning Content Types

The `LearningSidebar` component (`components/simulation/LearningSidebar.tsx`) supports 5 content types that can be mixed per step. See `docs/learning-sidebar-components.md` for full details.

| Type | Required | Purpose |
|------|----------|---------|
| **Why This Matters** | Yes | Core 2-3 sentence explanation with optional expandable "Learn More" |
| **Mini Article Modal** | No | Full-screen deep-dive article for critical decisions (e.g., Focal Issue step) |
| **Comparison Tiles** | No | Horizontal scrollable tiles comparing options (e.g., org types, stakeholder perspectives) |
| **Real Case (Micro-Case)** | No | Brief case study with ChatGPT exploration link |
| **Quick Tip** | No | One-sentence actionable hint |

**Design principles:**
- Vary content per step—don't use all types everywhere
- Mini articles are for critical learning moments only
- Real cases should teach via the ChatGPT link, not just illustrate
- Tips should be specific, not generic

### LearningSidebar Content Guidelines

**IMPORTANT: ALL sidebar panels on simulation pages MUST use the tabbed LearningSidebar component.**

Do NOT create standalone cards for learning content. Instead, consolidate into the three-tab pattern:

```tsx
import { LearningSidebar, BookOpen, Building, Lightbulb, type LearningTab } from '@/components/simulation/LearningSidebar'

<LearningSidebar
  defaultTab="guide"
  tabs={[
    { id: 'guide', label: 'Guide', icon: BookOpen, content: <GuideContent /> },
    { id: 'example', label: 'Example', icon: Building, content: <ExampleContent /> },
    { id: 'tips', label: 'Tips', icon: Lightbulb, content: <TipsContent /> },
  ] as LearningTab[]}
/>
```

**Tab Structure:**

| Tab | Icon | Purpose | Content Pattern |
|-----|------|---------|-----------------|
| **Guide** | `BookOpen` | Explain the concept | Title + 3-4 sentences + optional checklist |
| **Example** | `Building` | Real-world case study | Header banner + examples + ChatGPT link |
| **Tips** | `Lightbulb` | Practical advice | Title + bullet list of actionable tips |

**Content Length Consistency:**
- All three tabs should have roughly equal content length
- This prevents layout shift when switching tabs
- Target: 3-5 lines of readable text per tab

**Guide Tab:**
- Title should be descriptive (e.g., "Why Labels Matter" not "Understanding labels")
- Main content: 3-4 sentences explaining the concept
- Optional: Good/Bad example boxes using gold/amber colors (see Color Semantics)

**Example Tab:**
- Header banner: `bg-gradient-to-r from-gold-500/20 to-gold-600/20` with title and subtitle
- Real examples in `bg-slate-700/50` boxes
- Always include ChatGPT exploration link at bottom
- Link text should spark curiosity (e.g., "Explore Shell's naming approach")

**Tips Tab:**
- Title in `text-gold-400`
- Bullet list of 3-5 actionable tips
- Tips should be specific, not generic

**ChatGPT Exploration Links:**
- Link text should be curiosity-sparking, not generic
- Good: "Explore how Shell used scenarios to navigate oil geo-politics"
- Bad: "Explore this concept deeper" or "Learn more"
- Prompt should be detailed enough to get a rich, educational response

### Styling

**IMPORTANT: Maintain dark theme with gold accents throughout the app.**

- **Tailwind CSS** with custom gold/navy palette
- **Dark slate backgrounds** (`slate-900`, `slate-800`) - NEVER use white/light backgrounds for panels, cards, or containers
- **Gold accents** for interactive elements, icons, highlights (`gold-400`, `gold-500`) - avoid multi-colored icons; prefer monochromatic gold
- **Text colors on dark backgrounds**: `slate-100` for headings, `slate-300` for body text, `slate-400`/`slate-500` for muted text
- **Links**: `text-gold-400 hover:text-gold-300` on dark backgrounds
- **Borders**: `border-slate-700` on dark backgrounds (not white/light borders)
- Framer Motion for animations (entry/exit, tab indicators)
- `cn()` utility from `lib/utils.ts` for conditional class merging

**Design principle**: The app has a premium, executive feel with dark backgrounds and gold accents. Never deviate to light/white UI patterns.

### Color Semantics (IMPORTANT)

**Precise color usage for specific purposes:**

| Color | Use For | DO NOT Use For |
|-------|---------|----------------|
| **Gold** (`gold-400`, `gold-500`) | Positive examples, "Good:" labels, checkmarks in learning content, interactive accents | - |
| **Amber** (`amber-400`, `amber-500`) | Warnings, "Bad:" labels, things to avoid, caution states | - |
| **Emerald** (`emerald-400`, `emerald-500`) | Completion indicators ONLY (✓ task done, "Named", progress complete) | "Good" in good/bad comparisons |
| **Red** (`red-400`, `red-500`) | Urgency/priority actions, destructive buttons, negative business outcomes in case studies | "Bad" in learning examples |

**Good/Bad Example Pattern:**
```tsx
{/* CORRECT - Gold for good, Amber for bad */}
<div className="p-2 bg-gold-500/10 border border-gold-500/30 rounded-lg">
  <span className="text-gold-400 font-medium">Good:</span>
  <span className="text-gold-400/80 ml-1">"Hyper-regulation" vs "Free market"</span>
</div>
<div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
  <span className="text-amber-400 font-medium">Bad:</span>
  <span className="text-amber-400/80 ml-1">"Low" vs "High"</span>
</div>

{/* WRONG - Do not use emerald/red for good/bad */}
<div className="bg-emerald-500/10 ...">Good:</div>  // ❌ Emerald is for completion only
<div className="bg-red-500/10 ...">Bad:</div>       // ❌ Red is for urgency/priority
```

**Checkmarks in learning content:**
- Use `text-gold-400` for checkmarks (✓) in educational lists
- Reserve `text-emerald-500` only for completion states (e.g., "✓ Named" after user action)

---

## Tone, Voice & Writing Style

### Overall Tone
- **Executive and intellectual** but accessible—not academic or jargon-heavy
- **Confident without being arrogant**—we know this methodology works, backed by Shell's track record
- **Educational but not condescending**—assume the user is intelligent but new to scenario planning
- **Inspiring action**—language should motivate users to engage, not overwhelm them

### Phase Introduction Tone (Game-Guide Style)
For phase intro pages, adopt a **warm, relatable game-guide voice**—like explaining strategy game mechanics:

- Use **strategy game analogies**: "Before you build, you scout", "fog of war", "opening moves", "gathering intelligence"
- **Reassuring and encouraging**: "Don't worry about having all the answers yet"
- **Make abstract concepts tangible**: Compare scenario planning phases to familiar game actions
- Keep it **conversational**: "Let's start scouting" not "Commence strategic analysis"
- **Short paragraphs**, direct address ("you'll"), present tense

### Voice Characteristics
- **Second person ("you")** for journey/instruction content: "You will understand...", "You'll emerge with..."
- **Third person** for historical/conceptual content: "Shell anticipated...", "Leaders who have genuinely inhabited..."
- **Active voice** preferred: "Scenario planning embraces uncertainty" not "Uncertainty is embraced by scenario planning"
- **Present tense** for describing what the methodology does; past tense for historical examples

### Writing Style Patterns

**Titles & Headers:**
- Evocative, not literal: "A discipline for seeing multiple futures" not "What is scenario planning"
- Use metaphors sparingly but effectively: "Standing on the shoulders of futurists"
- Keep concise: 4-8 words ideal

**Body Paragraphs:**
- Lead with the insight, not the context
- Use em-dashes (—) for dramatic pauses or to introduce key contrasts
- Pair abstract concepts with concrete examples (e.g., "mental models" → "Shell anticipated the oil shocks")
- Keep paragraphs to 2-3 sentences max for scanability

**Phase/Step Descriptions (Journey content):**
- Start with "You will..." to orient the learner
- Name the key concept they'll learn in quotes: "'critical uncertainties'", "'scenario narratives'"
- End with the outcome or deliverable

**Golden Quotes (Callout Pattern):**
- Bold, gold text (`text-gold-400 font-semibold`)
- Left border accent (`border-l-2 border-gold-500`)
- Used for:
  - Historical proof points: "Shell anticipated both the 1973 and 1979 oil shocks..."
  - Memorable takeaways: "The best scenarios prepare your mind for what might happen..."
  - Journey promises: "By the end, you'll emerge with a mental model that's prepared for uncertainty..."
- Keep to one sentence, punchy and quotable
- Often use contrast structure: "X—not Y" (e.g., "prepared for uncertainty—not paralyzed by it")

**CTAs (Call to Action):**
- Aspirational, not transactional: "Get ready to see the future" not "Start simulation"
- Imply transformation or journey

### Vocabulary Preferences

| Prefer | Avoid |
|--------|-------|
| "futures" (plural) | "the future" (singular, implies prediction) |
| "mental model" | "mindset" (too casual) |
| "uncertainty" | "risk" (different concept) |
| "methodology" / "discipline" | "tool" / "framework" (too mechanical) |
| "inhabit futures" | "imagine scenarios" |
| "peripheral vision" | "awareness" |
| "driving forces" | "factors" / "trends" |
| "critical uncertainties" | "key unknowns" |

### Reference Style
- Credit sources with hyperlinks, not footnotes
- Name-drop key figures (Pierre Wack, Peter Schwartz, Herman Kahn) to establish credibility
- Reference Shell's track record as proof—it's the canonical success story

---

## Component Patterns (Landing Page)

### Page Header Pattern (REQUIRED for all simulation pages)

Every simulation page MUST have a consistent header with:

1. **Mini Progress Bar** - Shows step progress within the current phase
2. **Navigation Buttons** - Back, Continue/Next, Home (all three required)

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
    <button className="... text-gold-400 ..."><ArrowLeft /> Back</button>
    <button className="... bg-gold-500 ...">Continue <ArrowRight /></button>
    <button className="... text-gold-400 ..."><Home /> Home</button>
  </div>
</div>
```

**Phase step counts:**
- Discover: 4 steps (pre-read, context, focal-issue, forces)
- Design: 4 steps (uncertainties, axes, matrix) - note: matrix shows 4/4
- Develop: 3 steps (narratives=1, impact=2, risk=3)
- Decide: 3 steps (responses, actions, report)

---

### Tabbed Pre-Read Panel
- **Purpose**: Provide context before the journey without requiring scroll
- **Structure**: 3 tabs with consistent height content
  - Tab 1: Concept explanation (what is this?)
  - Tab 2: Credibility/provenance (who created this?)
  - Tab 3: Journey preview (what will I do?)
- **Animation**: Framer Motion `layoutId` for sliding tab indicator, `AnimatePresence` for content fade
- **Sizing**: Ensure all tab content is similar height to prevent layout shift

### Phase Icons (Journey Tab)
- Small icon container: `w-8 h-8 rounded-lg bg-gold-500/10`
- Icon: `w-4 h-4 text-gold-400`
- All icons monochromatic gold—no multi-color
- Icons should be semantic: Search (Discover), Compass (Design), Layers (Develop), Target (Decide)

### Golden Quote Callouts
```tsx
<p className="text-gold-400 font-semibold border-l-2 border-gold-500 pl-3 text-xs">
  Quotable insight here—with em-dash contrast structure.
</p>
```

### CTA Button
- Large, centered: `size="lg" className="text-base px-10 py-5 h-auto"`
- Aspirational copy, not functional
- Followed by subtle credit line with external link

---

## Navigation Principles

- **Single-screen landing**: Everything visible without scroll on standard viewport
- **Progressive disclosure**: Tabs let users choose depth of pre-reading
- **Clear entry point**: One prominent CTA, no competing actions
- **Attribution visible**: Book credit always shown, hyperlinked to Amazon

---

## Phase Introduction Pages

Each major phase (Discover, Design, Develop, Decide) can have a brief intro page before diving into substeps.

### Structure
1. **Phase badge**: Icon + "Phase N: Name" in gold
2. **Evocative title**: Game-guide style hook (e.g., "Before you build, you scout.")
3. **3 paragraphs max**: Explain what this phase is about using game/strategy analogies
4. **"In this phase, you'll:"**: Bulleted list with icons showing 2-3 key activities
5. **Golden quote**: Memorable takeaway about the phase
6. **Full-width CTA button**: Action-oriented, warm copy (e.g., "Let's start scouting")

### Example Copy Patterns
- Discover: Scouting, exploring the map, gathering intelligence, fog of war
- Design: Drafting blueprints, choosing your build order, mapping the terrain
- Develop: Bringing plans to life, building out your base, fleshing out details
- Decide: Committing resources, executing the strategy, making your move
