# Learning Sidebar Components

This document describes the content types available for the Learning Sidebar in Phase 1 of the scenario planning simulation.

## Overview

The `LearningSidebar` component supports multiple content types that can be mixed and matched per step. Not all content types should be used on every step - vary them for relevance.

## Content Types

### 1. Why This Matters (Required)
The core explanation section that appears on every step.

```typescript
whyItMatters: string  // Brief explanation (2-3 sentences)
learnMore?: string    // Expandable deeper insight (optional)
```

**Best for:** Every step - provides foundational context.

---

### 2. Mini Article Modal
A full-screen article that users can read for deep-dive content. Appears as a button at the bottom of "Why this matters" card.

```typescript
miniArticle?: {
  title: string           // Article title
  author: string          // Attribution (can be "In the style of X")
  readTime: string        // e.g., "3 min"
  buttonText: string      // e.g., "Read before you choose →"
  sections: {
    heading: string
    content: string
  }[]
}
```

**Best for:** Critical learning moments (e.g., Focal Issue step) where users need comprehensive guidance before making a decision.

---

### 3. Comparison Tiles
Horizontally scrollable tiles for comparing options at a glance. Each tile can have a "Learn why?" ChatGPT link.

```typescript
comparisonTiles?: {
  label: string           // e.g., "Family Business"
  horizon: string         // e.g., "20-50+ years"
  dynamic: string         // e.g., "Succession, legacy"
  icon: string            // Emoji
  learnWhyPrompt?: string // ChatGPT prompt for deep dive
}[]
```

**Best for:** Steps with multiple distinct options to compare (Organization Type, Stakeholder Perspective).

---

### 4. Real Case (Micro-Case)
A brief real-world example with a ChatGPT exploration link.

```typescript
microCase?: {
  company: string         // e.g., "Shell vs Nokia"
  story: string           // 2-3 sentence case summary
  explorePrompt: string   // Rich ChatGPT prompt (5+ questions)
  exploreLinkText: string // Link text, e.g., "Explore how Shell invented scenario planning →"
}
```

**Best for:** Steps where a specific case study illuminates the concept (Industry Selection, Focal Issue).

---

### 5. Quick Tip
A short actionable hint.

```typescript
tip?: string  // One sentence practical guidance
```

**Best for:** Steps where users might make common mistakes or need a quick reminder.

---

## Content Mix by Step

| Step | Why Matters | Learn More | Mini Article | Comparison Tiles | Real Case | Tip |
|------|-------------|------------|--------------|------------------|-----------|-----|
| Industry | ✓ | ✓ | | | ✓ Shell | ✓ |
| Organization | ✓ | | | ✓ 6 org types | | ✓ |
| Stakeholder | ✓ | ✓ | | ✓ 4 perspectives | | ✓ |
| Focal Issue | ✓ | | ✓ Peter Schwartz style | | ✓ Kodak | ✓ |
| Modifiers | ✓ | ✓ | | | | ✓ |
| Summary | ✓ | ✓ | | | | |

## Design Principles

1. **Vary content per step** - Don't use all types everywhere
2. **Real cases should teach, not just illustrate** - The takeaway IS the ChatGPT link
3. **Comparison tiles answer specific questions** - e.g., "How do planning horizons differ?"
4. **Mini articles are for critical decisions** - Use sparingly
5. **Tips are practical, not generic** - "Test: Could the opposite be true?"

## Example Usage

```typescript
const LEARNING_CONTENT: Record<Step, LearningSidebarProps> = {
  'focal-issue': {
    title: 'Focal Issue',
    whyItMatters: 'The focal issue is THE decision you\'re exploring...',
    miniArticle: {
      title: 'The Art of Framing Your Focal Issue',
      author: 'In the style of Peter Schwartz',
      readTime: '3 min',
      buttonText: 'Read before you choose →',
      sections: [
        { heading: 'What is a Focal Issue?', content: '...' },
        // ...
      ]
    },
    microCase: {
      company: 'Kodak',
      story: 'Kodak asked "How do we sell more film?"...',
      explorePrompt: 'Tell me the tragic strategic story of Kodak...',
      exploreLinkText: 'Explore how Kodak\'s wrong question killed them →',
    },
    tip: 'Test: Could you imagine scenarios where the opposite answer is correct?',
  },
}
```
