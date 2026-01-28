/**
 * PROMPTS.TS - Centralized Prompt Management
 *
 * All AI prompts used in the Strategic Futures Lab are defined here.
 * Edit this file to test and iterate on prompts without touching component code.
 *
 * PROMPT CATEGORIES:
 * 1. API Prompts - Used in server-side API routes (Claude API)
 * 2. ChatGPT Prompts - Used in client-side links for deep learning
 */

// =============================================================================
// API PROMPTS - Server-side Claude API calls
// =============================================================================

interface GenerateForcesContext {
  industryName: string
  orgTypeName: string
  challenge: string
  strategicQuestion: string
  modifierLabels?: string
}

/**
 * System prompt for generating PEST forces via Claude API
 * Used in: /api/generate-forces/route.ts
 */
export function buildGenerateForcesPrompt(context: GenerateForcesContext): string {
  const { industryName, orgTypeName, challenge, strategicQuestion, modifierLabels } = context

  return `You are a strategic foresight expert conducting a PEST analysis for scenario planning.

Context:
- Industry: ${industryName}
- Organization Type: ${orgTypeName}
- Strategic Challenge: ${challenge}
- Strategic Question: ${strategicQuestion}
${modifierLabels ? `- Context Modifiers: ${modifierLabels}` : ''}

Generate 16 driving forces (4 per PEST category) that could significantly impact this organization over the next 5-10 years. These forces will be used to build scenario planning axes.

Requirements for each force:
- Name: Short, memorable title (3-5 words, e.g., "AI Talent Shortage", "Carbon Pricing Expansion")
- Description: One clear sentence explaining the force and why it matters
- Category: P (Political), E (Economic), S (Social), or T (Technological)
- suggestedImpact: 1-5 (how much this could affect the organization)
- suggestedUncertainty: 1-5 (how unpredictable the trajectory is)

Focus on forces that are:
- Genuinely uncertain (not predetermined trends)
- Relevant to this specific industry and context
- Capable of creating materially different futures depending on how they unfold
- Mix of near-term (3-5 years) and longer-term (5-10 years) forces

Return ONLY a valid JSON object with a "forces" key containing an array of exactly 16 force objects. No markdown, no explanation, just the JSON.

Example format:
{
  "forces": [
    {
      "name": "AI Regulation Tightening",
      "description": "Governments worldwide are considering stricter AI regulations that could limit deployment in sensitive sectors.",
      "category": "P",
      "suggestedImpact": 4,
      "suggestedUncertainty": 4
    }
  ]
}`
}

// =============================================================================
// CHATGPT PROMPTS - Client-side deep learning links
// =============================================================================

/**
 * Prompt for exploring differential impact examples
 * Used in: /simulation/design/forces/page.tsx (Example tab)
 */
export const DIFFERENTIAL_IMPACT_PROMPT = `Show me 5 examples where the SAME macro force (AI, regulation, etc.) had OPPOSITE effects on two different companies. For each, explain why their business model made the difference.`

/**
 * Political forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildPoliticalForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm doing scenario planning for a company in ${industryText} in India.
Help me deeply understand POLITICAL forces I should consider:

1. FEDERAL vs STATE DYNAMICS
   - How do central vs state government policies differ for ${industryText}?
   - Which states are more business-friendly for this sector?
   - How does coalition politics create regulatory uncertainty?

2. POLICY & REGULATORY LANDSCAPE
   - What are the key regulations governing ${industryText} in India?
   - What policy changes are being discussed that could impact us?
   - How do bodies like SEBI, RBI, TRAI, CCI affect this industry?

3. GOVERNMENT PRIORITIES & SPENDING
   - What are the current government's priorities (Make in India, Digital India, etc.)?
   - Where is government spending increasing/decreasing?
   - What PLI schemes or incentives exist for ${industryText}?

4. POLITICAL RISK FACTORS
   - How do election cycles (state/central) affect policy continuity?
   - What geopolitical factors (China relations, US ties) matter?
   - How does public sentiment affect regulation?

5. FOR MY SCENARIO PLANNING
   - Which political factors have the MOST UNCERTAIN direction?
   - Which would have HIGHEST IMPACT if they change?
   - What signals should I watch?

Make this practical and specific to ${industryText} in India.`
}

/**
 * Economic forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildEconomicForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm doing scenario planning for a company in ${industryText} in India.
Help me deeply understand ECONOMIC forces I should consider:

1. MACROECONOMIC INDICATORS
   - How do RBI's interest rate decisions affect ${industryText}?
   - What's the impact of rupee fluctuations on this sector?
   - How does inflation (wholesale vs retail) matter?

2. CONSUMPTION & DEMAND PATTERNS
   - What drives demand in ${industryText}? Which segments?
   - How do urban vs rural, tier-1 vs tier-2/3 patterns differ?
   - What's the elasticity of demand to income/price changes?

3. CAPITAL & INVESTMENT ENVIRONMENT
   - How dependent is ${industryText} on external capital (PE/VC/FDI)?
   - What's the current investment cycle stage?
   - How do credit conditions affect the industry?

4. INDUSTRY-SPECIFIC ECONOMICS
   - What are the key cost drivers and margin pressures?
   - How do input costs (commodities, labor, energy) impact us?
   - What's the competitive dynamics on pricing?

5. FOR MY SCENARIO PLANNING
   - Which economic factors have the MOST UNCERTAIN trajectory?
   - Which would have HIGHEST IMPACT on our strategy?
   - What leading indicators should I track?

Make this practical and specific to ${industryText} in India.`
}

/**
 * Social forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildSocialForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm doing scenario planning for a company in ${industryText} in India.
Help me deeply understand SOCIAL forces I should consider:

1. DEMOGRAPHIC SHIFTS
   - How does India's demographic dividend affect ${industryText}?
   - What's the impact of urbanization and migration patterns?
   - How do regional demographic differences matter?

2. CONSUMER BEHAVIOR & VALUES
   - How are GenZ and millennial preferences changing demand?
   - What's the impact of rising aspirations and premiumization?
   - How do sustainability and ESG concerns affect consumer choices?

3. WORKFORCE & TALENT
   - How is the gig economy reshaping labor in ${industryText}?
   - What skill gaps and talent challenges exist?
   - How do changing work preferences (remote, flexibility) matter?

4. CULTURAL & LIFESTYLE SHIFTS
   - How are digital habits and screen time changing behavior?
   - What's the impact of nuclear families and delayed marriages?
   - How do health and wellness trends affect the industry?

5. FOR MY SCENARIO PLANNING
   - Which social changes have the MOST UNCERTAIN pace or direction?
   - Which would have HIGHEST IMPACT on our business model?
   - What behavioral signals should I watch?

Make this practical and specific to ${industryText} in India.`
}

/**
 * Technological forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildTechnologicalForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm doing scenario planning for a company in ${industryText} in India.
Help me deeply understand TECHNOLOGICAL forces I should consider:

1. DISRUPTIVE TECHNOLOGIES
   - Which emerging technologies (AI, blockchain, IoT, etc.) could transform ${industryText}?
   - What's overhyped vs genuinely transformative?
   - What's the realistic adoption timeline in India?

2. DIGITAL INFRASTRUCTURE
   - How does India's digital public infrastructure (UPI, Aadhaar, ONDC) create opportunities or threats?
   - What's the state of connectivity and digital access?
   - How does data regulation (DPDP Act) affect tech strategies?

3. INDUSTRY-SPECIFIC TECH
   - What technology investments are competitors making?
   - What's the build vs buy vs partner landscape?
   - How is automation affecting operations and costs?

4. INNOVATION ECOSYSTEM
   - What's the startup activity in adjacent spaces?
   - What R&D trends from global markets will reach India?
   - How are technology platforms reshaping industry structure?

5. FOR MY SCENARIO PLANNING
   - Which technology trajectories have MOST UNCERTAIN outcomes?
   - Which would have HIGHEST IMPACT on our competitive position?
   - What technology signals should I track?

Make this practical and specific to ${industryText} in India.`
}

// =============================================================================
// PEST PROMPT BUILDERS - Helper to get all PEST prompts
// =============================================================================

import type { PESTCategory } from './types'

export interface PESTLearningItem {
  id: PESTCategory
  icon: string
  title: string
  subtitle: string
  bullets: string[]
  chatGptPrompt: string
}

/**
 * Get all PEST deep learning items with prompts
 * Used in: /simulation/phase-2/page.tsx
 */
export function getPESTDeepLearning(industry: string | null): PESTLearningItem[] {
  return [
    {
      id: 'P',
      icon: '🏛️',
      title: 'Political Forces',
      subtitle: 'Government, regulation, policy landscape',
      bullets: [
        'Policy changes & regulatory shifts',
        'Election cycles & government priorities',
        'Trade policies & taxation',
      ],
      chatGptPrompt: buildPoliticalForcesPrompt(industry),
    },
    {
      id: 'E',
      icon: '💰',
      title: 'Economic Forces',
      subtitle: 'Macro indicators, capital, consumption',
      bullets: [
        'Interest rates, inflation, currency',
        'Consumer spending & industry cycles',
        'Capital availability & investment trends',
      ],
      chatGptPrompt: buildEconomicForcesPrompt(industry),
    },
    {
      id: 'S',
      icon: '👥',
      title: 'Social Forces',
      subtitle: 'Demographics, culture, behavior',
      bullets: [
        'Population shifts & urbanization',
        'Cultural values & lifestyle changes',
        'Workforce evolution & consumer behavior',
      ],
      chatGptPrompt: buildSocialForcesPrompt(industry),
    },
    {
      id: 'T',
      icon: '💻',
      title: 'Technological Forces',
      subtitle: 'Innovation, disruption, infrastructure',
      bullets: [
        'Disruptive technologies & adoption curves',
        'Digital infrastructure & automation',
        'R&D trends & emerging tech',
      ],
      chatGptPrompt: buildTechnologicalForcesPrompt(industry),
    },
  ]
}
