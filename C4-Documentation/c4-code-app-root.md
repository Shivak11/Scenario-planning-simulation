# C4 Code Level: App Root

## Overview

- **Name**: App Root Layer
- **Description**: Root application configuration and landing page for the Strategic Futures Lab simulation platform
- **Location**: `/app/` directory at project root
- **Language**: TypeScript/React (Next.js 14 App Router)
- **Purpose**: Provides the HTML document structure, global styling system, and the landing page that introduces users to scenario planning methodology and directs them into the simulation journey

## Code Elements

### Root Layout Component

**File**: `/app/layout.tsx` (Server Component)

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element
```

**Location**: `/app/layout.tsx:9-21`

**Description**:
The root layout component serves as the HTML document shell for the entire application. It wraps all pages with metadata configuration, global styles, and a consistent layout structure. This is the entry point that Next.js uses to render all routes.

**Key Responsibilities**:
- Exports Next.js `Metadata` object with site title and description
- Imports and applies global CSS styles
- Wraps `children` with `<html>` and `<body>` tags
- Applies root-level styling: dark theme with navy-to-white gradient background (`min-h-screen bg-gradient-to-b from-white to-navy-50`)
- Sets language attribute to English (`lang="en"`)

**Dependencies**:
- `next` - Metadata type import
- `./globals.css` - Global stylesheet

**Call Graph**:
- Receives child pages as React nodes (provided by Next.js routing)
- Renders layout wrapper for all pages in the application
- Returns JSX structure with metadata and styled body

---

### Landing Page Component

**File**: `/app/page.tsx` (Client Component)

```typescript
export default function Home(): JSX.Element
```

**Location**: `/app/page.tsx:116-222`

**Description**:
The landing page serves as the application's public-facing entry point. It introduces the Strategic Futures Lab platform, explains scenario planning methodology, and provides a tabbed educational interface before users begin the simulation journey. This is a client component that manages interactive state.

**Key Responsibilities**:
- Displays the application branding (title, subtitle, logo)
- Manages three-tab tabbed interface for educational pre-read content:
  - Tab 1 ("What is Scenario Planning"): Explains the discipline
  - Tab 2 ("From the creators"): Provides historical context and methodology lineage
  - Tab 3 ("Your Journey Ahead"): Previews the four-phase simulation structure
- Handles user navigation to the simulation journey
- Applies dark theme styling with framer-motion animations

**State Management**:
- `activeTab`: State variable tracking which tab is currently displayed (values: 'what' | 'creators' | 'journey')

**Navigation**:
- Uses Next.js `useRouter` hook to navigate to `/simulation/discover/pre-read` when "Start" button is clicked
- Resets simulation state before navigation via Zustand store

**Dependencies**:
- React hooks: `useState`, `useRouter` (Next.js)
- `@/components/ui/button` - Button component
- `@/lib/store` - Zustand store for state management
- `framer-motion` - Animation library (motion, AnimatePresence)
- `lucide-react` - Icon library (Focus, Search, Compass, Layers, Target icons)

**Rendered Elements**:
1. **Brand Section** (lines 134-150):
   - Focus icon in rounded container
   - H1 heading with bicolor text: "The Art of" (slate) + "Thinking the Unthinkable" (gold)
   - Subtitle describing the app value proposition

2. **Tabbed Panel** (lines 152-197):
   - Tab headers with active indicator animation
   - Tab content displayed with fade animation
   - Content varies by tab (see tabContent object, lines 16-114)

3. **Call-to-Action Section** (lines 199-218):
   - Large primary button triggering simulation start
   - Credit line with external link to book source

**Animation Details**:
- Page entry: Fade-in and slide-up animation (lines 128-131)
- Tab indicator: Spring animation with `layoutId="activeTab"` (lines 168-172)
- Tab content: AnimatePresence with staggered fade (lines 180-194)

**Event Handlers**:
- `handleStart()`: Resets simulation store and navigates to pre-read page

---

### Tab Content Structure

**Object**: `tabContent` (lines 16-114)

Defines three tab sections with static content:

```typescript
const tabContent: Record<'what' | 'creators' | 'journey', {
  title: string,
  content: JSX.Element
}>
```

**Tab 1 - "What is Scenario Planning"**:
- Title: "A discipline for seeing multiple futures"
- Content: 4 paragraphs explaining scenario planning history (RAND, Shell), methodology, and psychological impact
- Callout quote: Shell's success anticipating oil shocks

**Tab 2 - "From the creators"**:
- Title: "Standing on the shoulders of futurists"
- Content: 3 paragraphs tracing lineage (Kahn → Wack → Schwartz) and describing methodology adaptation
- Includes hyperlink to "The Art of the Long View" book
- Callout quote: About preparing the mind for surprises

**Tab 3 - "Your Journey Ahead"**:
- Title: "Four phases to strategic clarity"
- Content: 4 labeled sections with icons describing the journey:
  - **Discover** (Search icon): Understanding strategic questions and PEST framework
  - **Design** (Compass icon): Learning critical uncertainties and 2×2 matrix
  - **Develop** (Layers icon): Crafting narratives and assessing impact
  - **Decide** (Target icon): Defining responses and action plans
- Callout quote: About emerging with a prepared mental model

---

### Global CSS File

**File**: `/app/globals.css`

**Location**: `/app/globals.css:1-93`

**Description**:
The global stylesheet configures Tailwind CSS, defines CSS custom properties for the design system, imports fonts, and establishes global component classes used throughout the application.

**Key Components**:

1. **Font Imports** (lines 1):
   - Google Fonts: `Inter` (sans-serif, weights 400-700) for body text
   - Google Fonts: `Playfair Display` (serif, weights 400-700) for headings

2. **Tailwind Directives** (lines 3-5):
   - `@tailwind base`: Resets and base styles
   - `@tailwind components`: Component classes
   - `@tailwind utilities`: Utility classes

3. **CSS Custom Properties** (lines 7-30):
   - Root-level color scheme variables for light theme
   - Variables: background, foreground, card, primary, secondary, accent, destructive, border, input, ring, radius
   - Gold accent color: HSL(38, 92%, 50%)
   - Primary navy blue: HSL(210, 60%, 20%)

4. **Base Layer Overrides** (lines 32-42):
   - Reset all borders to navy-200
   - Body styling: white background, navy text, sans-serif font
   - Heading styling: serif font, semibold weight, tight tracking

5. **Component Layer Classes** (lines 44-72):
   - `.card-executive`: White card with navy border and hover shadow
   - `.btn-primary`: Navy button with white text
   - `.btn-secondary`: Light navy button with navy text
   - `.btn-gold`: Gold button with white text
   - `.phase-container`: Max-width container for phase pages
   - `.slider-track`: Navy background track for sliders
   - `.slider-thumb`: Navy circular thumb for sliders

6. **Custom Scrollbar Styling** (lines 74-92):
   - Width: 8px
   - Track: Light slate background (#f1f5f9)
   - Thumb: Medium slate (#94a3b8) with hover darkening to #64748b
   - Border radius: 4px

**Tailwind Configuration Dependency**:
- Requires `tailwind.config.ts` to extend color palette with custom colors (gold, navy, slate)
- Extends default theme with project-specific color names

**Design System**:
- Primary color scheme: Navy blue (corporate/executive feel) with gold accents
- Typography: Serif (Playfair Display) for headings, sans-serif (Inter) for body
- Spacing and sizing: Standard Tailwind scale
- Shadow and transition defaults applied at utility level

---

## Dependencies

### Internal Dependencies

| Element | Type | Purpose | Location |
|---------|------|---------|----------|
| `Button` component | UI Component | Primary call-to-action button | `@/components/ui/button` |
| Zustand store | State Management | Simulation state and reset function | `@/lib/store` |
| `useSimulationStore` | Hook | Access and manage simulation state | `@/lib/store` |
| `/app/globals.css` | Stylesheet | Global styles and design system | Imported in `layout.tsx` |
| `useRouter` | Next.js Hook | Client-side navigation to simulation | `next/navigation` |
| Icons (5 total) | Icon Library | Visual branding and journey indicators | `lucide-react` |

### External Dependencies

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| `next` | 14.2.20 | App Router framework, metadata, routing | Metadata type, useRouter, RootLayout pattern |
| `react` | ^18.3.1 | UI library foundation | JSX, React.ReactNode typing |
| `react-dom` | ^18.3.1 | React DOM rendering | Implicit through Next.js |
| `framer-motion` | ^11.15.0 | Animation library | `motion`, `AnimatePresence` components |
| `lucide-react` | ^0.469.0 | Icon library | `Focus`, `Search`, `Compass`, `Layers`, `Target` |
| `zustand` | ^5.0.2 | State management | `useSimulationStore` for state persistence |
| `tailwindcss` | ^3.4.17 | CSS utility framework | Class-based styling (via globals.css) |
| `@radix-ui/*` | Various | Headless UI primitives | Base components for button and other UI |
| `class-variance-authority` | ^0.7.1 | Component variant patterns | Used in Button component implementation |
| `clsx` / `tailwind-merge` | Various | Utility functions | Used in `cn()` utility for class merging |

---

## Architecture & Design Patterns

### Routing Structure

```
/                          → Home (landing page with tabs)
  ↓ onClick → handleStart()
/simulation/discover/pre-read  → Start of 4-phase journey
```

The landing page is the application root; users must complete the onboarding flow before entering the simulation.

### Component Hierarchy

```
RootLayout (Server Component)
├── Metadata (exported)
├── Global Styles (imported)
└── {children} (pages routed by Next.js)
    └── Home (Client Component)
        ├── motion.div (wrapper for page animation)
        ├── Brand Section
        ├── Tabbed Panel
        │   ├── Tab Headers (buttons)
        │   ├── motion.div (tab indicator)
        │   ├── Tab Content
        │   │   └── Icons (from lucide-react)
        │   └── AnimatePresence (fade animation)
        └── CTA Section
            └── Button (UI component)
```

### State Flow

```
Home Component
├── useState(activeTab) → Local tab selection state
├── useRouter() → Navigation to simulation
├── useSimulationStore().resetSimulation() → Clear previous session
└── handleStart()
    └── router.push('/simulation/discover/pre-read')
```

### Styling Architecture

**Global CSS** (`globals.css`):
- Tailwind directives (@tailwind base, components, utilities)
- CSS custom properties for color scheme
- Utility classes (.btn-primary, .card-executive, etc.)
- Font imports and base element styling

**Page Styling**:
- Uses Tailwind utility classes directly in JSX
- Dark theme: `bg-slate-900` (page background), `slate-100/300/400` (text)
- Gold accents: `text-gold-400`, `border-gold-500`
- Responsive classes available through Tailwind

**Component Styling**:
- `Button` component from `@/components/ui/button` inherits theme
- Framer Motion classes for animations (opacity, y-translation)
- No inline styles; all class-based approach

---

## Data Flow & Interaction

### User Journey on Landing Page

1. **Page Load**:
   - RootLayout renders with metadata and global styles
   - Home component mounts
   - Initial state: `activeTab = 'what'`
   - Page animation triggers (fade-in, slide-up)

2. **Tab Interaction**:
   - User clicks tab header → `setActiveTab(newTab)`
   - Tab indicator animates to new position (spring animation)
   - Content fades out, new content fades in
   - No page reload; state remains in component

3. **Starting Simulation**:
   - User clicks "Get ready to see the future" button
   - `handleStart()` executes:
     - `resetSimulation()` clears Zustand store
     - `router.push('/simulation/discover/pre-read')` navigates to simulation
   - Router transitions to discovery phase

### Animation Details

**Page Entry Animation**:
- Type: Fade-in + slide-up
- Duration: 0.6 seconds
- Effect: `opacity: 0 → 1`, `y: 20px → 0`

**Tab Indicator Animation**:
- Type: Spring animation with layout animation ID
- Stiffness: 500, Damping: 30
- Effect: Gold bar slides under active tab

**Content Fade Animation**:
- Type: AnimatePresence with mode="wait"
- Initial: `opacity: 0, y: 10px`
- Animate: `opacity: 1, y: 0`
- Exit: `opacity: 0, y: -10px`
- Duration: 0.2 seconds

---

## Accessibility & UX Considerations

### Semantic HTML
- Uses `<html lang="en">` for language declaration
- Proper heading hierarchy (h1 → h3 within tabs)
- External links have `target="_blank"` and `rel="noopener noreferrer"`

### Visual Design
- High contrast: Gold on slate-900 background
- Large, readable text sizes
- Button size="lg" for accessible touch targets
- Focus states inherited from Radix UI Button component

### Responsive Considerations
- `max-w-2xl` container constrains width on large screens
- `px-6` horizontal padding adapts for smaller screens
- Tailwind responsive utilities available (sm:, md:, lg: prefixes)

---

## Error Handling & Edge Cases

### Navigation Handling
- `useRouter` from `next/navigation` ensures client-side navigation
- If store is unavailable, `resetSimulation()` call could fail gracefully
  - Zustand store is initialized at app load (see `/lib/store.ts`)
  - No explicit error handling in page component; assumes store availability

### External Links
- Book links use `target="_blank"` to prevent navigation away
- `rel="noopener noreferrer"` prevents security issues with cross-origin links

---

## Code Quality & Type Safety

### TypeScript Usage

**RootLayout**:
```typescript
{
  children: React.ReactNode
}
```
- Properly typed children prop
- Return type implicit (JSX.Element)

**Home Component**:
```typescript
const [activeTab, setActiveTab] = useState<'what' | 'creators' | 'journey'>('what')
```
- Explicit union type for activeTab state
- Prevents invalid tab values

**Tab Content**:
```typescript
const tabs = [
  { id: 'what', label: 'What is Scenario Planning' },
  // ...
]
```
- Tab objects have string literal types
- Content object keys match tab IDs for type safety

### No External Type Imports
- Uses built-in React types (React.ReactNode, JSX.Element)
- Zustand types inferred from store definition
- Framer Motion types imported implicitly through component usage

---

## Performance Considerations

### Optimization Techniques

1. **Server Component for Layout**:
   - Root layout is a Server Component by default
   - Metadata is server-rendered, reducing client-side overhead

2. **Client Component for Interactivity**:
   - Home page is a Client Component ('use client')
   - Isolated to this page; other static pages can be server-rendered

3. **CSS Strategy**:
   - Global styles loaded once for entire application
   - Tailwind CSS produces optimized build with only used utilities
   - Component classes help reduce CSS duplication

4. **Animation Performance**:
   - Framer Motion uses GPU-accelerated transforms (opacity, y-translation)
   - No layout shifts during animations (opacity and transform only)
   - `layoutId` prevents unnecessary re-renders during tab switches

5. **Code Splitting**:
   - Button and store imports are asynchronous
   - lucide-react icons are tree-shakeable; only imported icons bundled
   - Framer Motion animations don't block initial paint

### Bundle Size Impact
- **layout.tsx**: Minimal server component
- **page.tsx**: Client component, ~2KB (estimated with deps)
- **globals.css**: ~3KB (Tailwind + custom styles)
- **Icons**: 5 icons from lucide-react (~2KB total when tree-shaken)

---

## Testing Considerations

### Key Testable Elements

1. **Metadata Export**:
   - Assert `metadata.title === 'Strategic Futures Lab'`
   - Assert description includes "AI-powered scenario planning"

2. **Tab Switching**:
   - Render Home component
   - Click each tab; assert `activeTab` state updates
   - Assert correct content renders for each tab

3. **Navigation**:
   - Mock `useRouter`
   - Click "Get ready to see the future" button
   - Assert `router.push('/simulation/discover/pre-read')` called
   - Assert `resetSimulation()` called before navigation

4. **Animations**:
   - Mock Framer Motion or render with animation enabled
   - Verify motion.div and AnimatePresence components render

5. **Accessibility**:
   - Tab headers should be focusable (buttons)
   - Links should announce as links (semantic HTML)
   - Color contrast ratios should meet WCAG AA

---

## Integration Points with Rest of App

### Inbound
- Entry point for all users (root route `/`)
- Provides visual introduction and education before simulation

### Outbound
- Navigates to `/simulation/discover/pre-read` (first phase of journey)
- Resets Zustand store state (`useSimulationStore().resetSimulation()`)
- Imports Button component from shared UI library (`@/components/ui/button`)

### Data Contracts
- **Store Contract**: Assumes `useSimulationStore` has `resetSimulation()` method
- **Navigation Contract**: Assumes route `/simulation/discover/pre-read` exists
- **Component Contract**: Button component accepts `size="lg"` and `onClick` props

---

## Notes

### Design Decisions
1. **Client Component for Home**: Necessary for tab state management and animations; could be optimized with server-side rendering if tabs were pre-selected
2. **Framer Motion**: Chosen for smooth, spring-based animations that feel premium and executive
3. **Tabbed Format**: Allows users to self-select depth of pre-reading without scrolling
4. **Golden Quote Pattern**: Establishes credibility by attributing historical success to methodology

### Future Enhancements
- Internationalization (i18n) support for metadata and content
- Analytics tracking for tab interaction and button clicks
- Mobile optimization for smaller viewports
- Accessibility audit for WCAG 2.1 AA compliance
- Server-side tab preference based on user profile

### Known Limitations
- Tab content is static; no dynamic content or API calls
- No error boundary or fallback UI if store/router unavailable
- No loading state for initial page render (implicit in Next.js)
- Animation performance not tested on low-end devices

