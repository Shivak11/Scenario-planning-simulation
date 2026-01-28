/**
 * PROMPTS.TS - Centralized Prompt Management
 *
 * All AI prompts used in the Strategic Futures Lab are defined here.
 * Edit this file to test and iterate on prompts without touching component code.
 *
 * PROMPT DESIGN PHILOSOPHY:
 * - Expert-level strategic insight that users couldn't write themselves
 * - India-specific context with real examples and regulatory bodies
 * - Structured outputs with clear frameworks
 * - Second-order thinking and non-obvious connections
 * - Actionable for scenario planning, not generic exploration
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

  return `You are a senior partner at a top-tier strategy consulting firm (McKinsey/BCG/Bain level) with 20+ years of experience in strategic foresight and scenario planning. You've advised Fortune 500 companies and have deep expertise in the Shell scenario planning methodology pioneered by Pierre Wack.

CONTEXT FOR THIS ENGAGEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Industry: ${industryName}
• Organization Type: ${orgTypeName}
• Strategic Challenge: ${challenge}
• Focal Question: ${strategicQuestion}
${modifierLabels ? `• Context Modifiers: ${modifierLabels}` : ''}

YOUR TASK:
Generate 16 driving forces (exactly 4 per PEST category) for scenario planning. These forces will be used to construct a 2x2 scenario matrix, so quality is critical.

WHAT MAKES AN EXCELLENT DRIVING FORCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GENUINE UNCERTAINTY: The force could plausibly go in multiple directions. Avoid predetermined trends (e.g., "India's population will grow" is NOT uncertain; "India's demographic dividend translating to productivity gains" IS uncertain).

2. STRATEGIC RELEVANCE: Must directly affect this specific industry and organization type. A force affecting retail won't necessarily affect B2B SaaS the same way.

3. INDEPENDENCE: Forces should be relatively independent of each other. Avoid forces that are essentially the same thing phrased differently.

4. BIPOLARITY POTENTIAL: The best forces can become scenario axes—they have clear "high" and "low" poles that create meaningfully different futures.

5. TIME HORIZON MIX: Include forces across different time horizons:
   - Near-term (2-3 years): Policy changes, market shifts
   - Medium-term (3-5 years): Technology adoption, demographic shifts
   - Long-term (5-10 years): Structural transformations, paradigm shifts

FORCE NAMING PRINCIPLES (Shell methodology):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Use evocative, memorable names (3-5 words)
• Capture the TENSION or UNCERTAINTY, not just the topic
• Good: "AI Talent War Intensifies", "Regulatory Pendulum Swings"
• Bad: "AI Impact", "Government Policy"

RATING CALIBRATION:
━━━━━━━━━━━━━━━━━━
• Impact (1-5): How much could this force reshape the competitive landscape, business model, or value chain for THIS specific organization?
  - 5 = Existential (could make current business model obsolete)
  - 4 = Transformational (requires major strategic pivot)
  - 3 = Significant (meaningful P&L impact, strategic adjustments needed)
  - 2 = Moderate (operational adjustments, some strategic relevance)
  - 1 = Minor (background factor, limited direct impact)

• Uncertainty (1-5): How unpredictable is the trajectory of this force?
  - 5 = Highly contested (experts fundamentally disagree on direction)
  - 4 = Multiple plausible paths (2-3 very different scenarios possible)
  - 3 = Uncertain timing/magnitude (direction clear, but when/how much unclear)
  - 2 = Somewhat predictable (clear trend with some variation)
  - 1 = Near-certain (consensus view, high confidence in trajectory)

CATEGORY GUIDANCE:
━━━━━━━━━━━━━━━━━
P (Political): Government policy, regulation, geopolitics, trade policy, political stability, nationalism vs globalism, state vs center dynamics
E (Economic): Macro indicators, capital flows, consumer spending, inflation, currency, credit cycles, income distribution, industry economics
S (Social): Demographics, values shifts, workforce trends, urbanization, education, health consciousness, trust in institutions, social movements
T (Technological): Emerging tech, adoption curves, digital infrastructure, automation, platform dynamics, tech regulation, innovation ecosystems

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown, no explanation, no preamble.

{
  "forces": [
    {
      "name": "Evocative 3-5 Word Title",
      "description": "One compelling sentence explaining the force, its uncertainty, and why it matters for this specific context.",
      "category": "P",
      "suggestedImpact": 4,
      "suggestedUncertainty": 4
    }
  ]
}

Generate exactly 16 forces (4P, 4E, 4S, 4T). Make each one worthy of a McKinsey engagement.`
}

// =============================================================================
// CHATGPT PROMPTS - Client-side deep learning links
// =============================================================================

/**
 * Prompt for exploring differential impact examples
 * Used in: /simulation/design/forces/page.tsx (Example tab)
 */
export const DIFFERENTIAL_IMPACT_PROMPT = `I'm learning about scenario planning and need to understand a critical concept: why the SAME macro force affects different companies in OPPOSITE ways.

Please analyze 5 real-world examples using this framework:

FOR EACH EXAMPLE, PROVIDE:
━━━━━━━━━━━━━━━━━━━━━━━━━

1. THE MACRO FORCE
   • Name the specific force (e.g., "Rise of Generative AI", "Zero Interest Rate Era Ending")
   • When it emerged and its current trajectory

2. COMPANY A - THE WINNER
   • Company name and brief description
   • Specific outcome (stock price change, market share gain, revenue impact)
   • WHY their business model benefited (be specific about the mechanism)

3. COMPANY B - THE LOSER
   • Company name and brief description
   • Specific outcome (quantify the damage where possible)
   • WHY their business model suffered (the structural vulnerability)

4. THE INSIGHT FOR SCENARIO PLANNING
   • What made the difference? (asset base, customer relationship, cost structure, etc.)
   • How could Company B have anticipated this with scenario planning?
   • What "early warning signals" existed?

EXAMPLES TO INCLUDE (mix of these or similar):
• AI disruption (Chegg vs. Duolingo, or similar)
• Interest rate rises (Growth tech vs. Value stocks)
• COVID-19 (Zoom vs. WeWork, or Peloton's rise and fall)
• Platform shifts (Nokia vs. Apple, or Blockbuster vs. Netflix)
• Regulatory changes (Crypto exchanges, or Indian fintech post-RBI guidelines)

END WITH A SYNTHESIS:
• What patterns do you see across all 5 examples?
• What questions should a strategist ask to determine if their company is "Company A" or "Company B" for any given force?
• How does this inform the scenario planning process?

Make this practical and insightful—I want to internalize this concept deeply.`

/**
 * Political forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildPoliticalForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm conducting scenario planning for a company in ${industryText} in India. I need a DEEP, EXPERT-LEVEL analysis of political forces—the kind a senior government affairs advisor or political risk consultant would provide.

IMPORTANT FRAMING:
I'm not looking for a generic overview. I need actionable intelligence that helps me identify which political forces are (a) highly uncertain in direction and (b) could materially impact my business. These become candidates for scenario planning axes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: THE INDIAN POLITICAL ECONOMY LANDSCAPE FOR ${industryText.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) REGULATORY ARCHITECTURE
   • Which ministries and regulatory bodies govern ${industryText}? (e.g., MeitY, DPIIT, sector-specific regulators)
   • What's the current regulatory philosophy—light touch, prescriptive, or evolving?
   • Recent regulatory actions (last 2-3 years) that signal direction
   • Pending legislation or policy drafts that could reshape the landscape

B) CENTER-STATE DYNAMICS
   • Is ${industryText} a Union, State, or Concurrent list subject?
   • Which states are regulatory leaders vs. laggards for this sector?
   • Examples of state-level policy divergence (e.g., different licensing requirements, incentives)
   • How does GST Council dynamics or inter-state coordination affect the industry?

C) POLITICAL ECONOMY OF THE SECTOR
   • Who are the key political stakeholders (industry associations, unions, consumer groups)?
   • What's the lobbying landscape—who has influence and how is it exercised?
   • Are there politically sensitive aspects (employment, FDI limits, strategic importance)?
   • Historical examples of political intervention in ${industryText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: GEOPOLITICAL FORCES & INDIA'S STRATEGIC POSITIONING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) CHINA+1 AND SUPPLY CHAIN REORIENTATION
   • How is ${industryText} affected by India's China policy and PLI schemes?
   • Opportunities and risks from "Atmanirbhar Bharat" push
   • Are there components/inputs with China dependency that create vulnerability?

B) US-INDIA STRATEGIC PARTNERSHIP
   • Relevant bilateral agreements, tech partnerships, or trade arrangements
   • How do US regulations (export controls, data rules) impact ${industryText}?
   • Opportunities from iCET, defense corridors, or other bilateral initiatives

C) GLOBAL GOVERNANCE & STANDARDS
   • International standards bodies or trade agreements affecting the sector
   • India's stance in multilateral negotiations (WTO, climate, digital governance)
   • Risk of non-tariff barriers or compliance costs from global standards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: ELECTORAL & GOVERNANCE UNCERTAINTY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) ELECTION CYCLE IMPACTS
   • Key upcoming elections (state and national) and their potential impact
   • How have past government changes affected ${industryText}? (specific examples)
   • Policy continuity risks—what's "locked in" vs. what could reverse?

B) BUREAUCRATIC & IMPLEMENTATION FACTORS
   • Quality of implementation machinery for relevant policies
   • Inter-ministerial coordination challenges
   • Role of judiciary in regulatory matters (pending cases, past interventions)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: SCENARIO PLANNING SYNTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your analysis, identify:

A) TOP 3 POLITICAL UNCERTAINTIES FOR SCENARIO PLANNING
   For each, provide:
   • The uncertainty framed as a question (e.g., "Will India adopt...")
   • Why it's genuinely uncertain (competing forces, lack of consensus)
   • The two "poles" (e.g., "Hyper-regulation" vs. "Light-touch governance")
   • Potential impact on ${industryText} under each pole
   • Timeline for resolution or key decision points

B) EARLY WARNING INDICATORS
   • What signals should I monitor to detect which direction we're heading?
   • Key announcements, appointments, or events to watch
   • Data sources and tracking mechanisms

C) STRATEGIC HEDGING OPTIONS
   • How might a company in ${industryText} position itself to be resilient across scenarios?
   • What "no regret" moves make sense regardless of political direction?

Be specific, cite real examples where possible, and make this actionable for a strategy team.`
}

/**
 * Economic forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildEconomicForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm conducting scenario planning for a company in ${industryText} in India. I need a DEEP, EXPERT-LEVEL analysis of economic forces—the kind a chief economist or macro strategist would provide.

IMPORTANT FRAMING:
I'm not looking for Econ 101. I need to understand which economic forces create genuine uncertainty for my industry and could lead to materially different futures. These become candidates for scenario planning axes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: MACRO-FINANCIAL ENVIRONMENT & ${industryText.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) MONETARY POLICY TRANSMISSION
   • How do RBI rate decisions specifically affect ${industryText}? (trace the mechanism)
   • Is demand in this sector interest-rate sensitive? By how much?
   • How does credit availability to the sector change with monetary tightening?
   • Current credit growth rates and NPA concerns specific to ${industryText}

B) CURRENCY & EXTERNAL SECTOR
   • ${industryText}'s exposure to rupee movements (import content, export revenue, foreign competition)
   • How would a 10% rupee depreciation vs. appreciation affect the sector?
   • Dollar-denominated costs or revenues? Hedging practices in the industry?
   • Impact of current account dynamics on the sector

C) INFLATION DYNAMICS
   • Which specific input costs matter most for ${industryText}? (commodity prices, wages, energy, rent)
   • Pass-through capability: can companies raise prices, or are they price-takers?
   • How does consumer inflation affect demand for this sector's products/services?
   • Margin compression history during inflationary periods

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: DEMAND ARCHITECTURE & CONSUMPTION PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) INCOME & WEALTH EFFECTS
   • Which income segments drive demand for ${industryText}? (bottom 50%, middle class, affluent, ultra-HNI)
   • Income elasticity: is this a necessity, aspiration, or luxury category?
   • How does wealth effect (stock market, real estate prices) influence demand?
   • K-shaped recovery implications: which customer segments are thriving vs. struggling?

B) GEOGRAPHIC DEMAND PATTERNS
   • Urban vs. rural demand split and growth trajectories
   • Tier 1 vs. Tier 2/3 city dynamics—where is growth coming from?
   • Regional variations (South vs. North, coastal vs. interior)
   • Urbanization rate and its impact on demand patterns

C) STRUCTURAL DEMAND SHIFTS
   • Is ${industryText} seeing premiumization or value migration?
   • Formalization effects: how does GST, digital payments affect demand visibility?
   • Substitution threats: what could customers switch to if prices rise?
   • Category penetration: what % of addressable market is captured, and growth runway

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: CAPITAL & INVESTMENT CYCLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) INDUSTRY INVESTMENT CYCLE POSITION
   • Where is ${industryText} in its investment cycle? (early growth, mature, consolidation)
   • Recent capex trends: who's investing, who's retrenching?
   • Capacity utilization levels and implications for pricing power
   • M&A activity and consolidation trends

B) CAPITAL AVAILABILITY
   • PE/VC funding trends for ${industryText}—is capital abundant or scarce?
   • Public market appetite: recent IPOs, valuations, investor sentiment
   • FDI flows and foreign investor interest
   • Bank and NBFC lending appetite for the sector

C) COST OF CAPITAL SENSITIVITY
   • How capital-intensive is ${industryText}? (capital employed/revenue ratios)
   • Debt levels in the industry and refinancing risks
   • How would rising cost of capital affect competitive dynamics?
   • Working capital intensity and cash conversion cycles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: INDUSTRY ECONOMICS & COMPETITIVE DYNAMICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) PROFITABILITY STRUCTURE
   • Typical gross margins, operating margins, and ROE in ${industryText}
   • Fixed vs. variable cost structure—operating leverage implications
   • Which players have structural cost advantages and why?
   • Margin trends over last 5 years—improving or compressing?

B) COMPETITIVE INTENSITY
   • Market structure: fragmented, oligopolistic, or monopolistic?
   • Pricing power distribution: who sets prices, who follows?
   • Entry barriers and threat of new entrants
   • Bargaining power with suppliers and customers

C) SCALE & NETWORK EFFECTS
   • Are there economies of scale in ${industryText}? At what point do they plateau?
   • Network effects: does the product/service become more valuable with more users?
   • Winner-take-most dynamics or room for multiple players?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: SCENARIO PLANNING SYNTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your analysis, identify:

A) TOP 3 ECONOMIC UNCERTAINTIES FOR SCENARIO PLANNING
   For each, provide:
   • The uncertainty framed as a question
   • Why it's genuinely uncertain (not a known trend)
   • The two "poles" and what each world looks like
   • Specific impact on ${industryText} under each pole
   • Key indicators that would signal which direction we're heading

B) ECONOMIC SCENARIOS GRID
   • Sketch 2-3 distinct economic scenarios for India over the next 5 years
   • For each scenario, what happens to ${industryText}?
   • Which companies/business models win or lose in each scenario?

C) LEADING INDICATORS TO TRACK
   • Specific data points and their frequency (monthly, quarterly)
   • Thresholds that would signal a regime change
   • Sources for tracking (RBI, NSO, industry bodies)

Be quantitative where possible, use real data, and make this actionable for strategy.`
}

/**
 * Social forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildSocialForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm conducting scenario planning for a company in ${industryText} in India. I need a DEEP, EXPERT-LEVEL analysis of social forces—the kind a cultural anthropologist or consumer insights expert would provide.

IMPORTANT FRAMING:
Social forces are often underestimated in scenario planning because they move slowly—until they don't. I need to identify which social shifts create genuine uncertainty and could reshape my industry. These become candidates for scenario planning axes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: DEMOGRAPHIC DEEP DIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) THE DEMOGRAPHIC DIVIDEND QUESTION
   • India's working-age population is growing—but is this automatically good for ${industryText}?
   • The uncertainty: Will this dividend translate to productivity, consumption, or social strain?
   • Employment generation capacity of ${industryText}—job creator or job destroyer?
   • Skill match: does the workforce have what ${industryText} needs?

B) GENERATIONAL COHORT ANALYSIS
   Break down by cohort with specific relevance to ${industryText}:

   • Gen Z (born 1997-2012): Digital natives, entering workforce now
     - How do their consumption patterns differ for ${industryText}?
     - What do they value that older generations didn't? (authenticity, sustainability, experience)
     - Their relationship with brands, institutions, and traditional marketing

   • Millennials (born 1981-1996): Prime earning years, family formation
     - Spending priorities as they age (housing, education, health)
     - Their evolution from early adopters to mainstream consumers
     - Parenting styles and how they influence household consumption

   • Gen X & Boomers: Wealth holders, decision-makers in organizations
     - How do they make B2B purchasing decisions in ${industryText}?
     - Their digital adoption trajectory and remaining friction points
     - Retirement planning and wealth transfer implications

C) URBANIZATION & MIGRATION PATTERNS
   • Not just rural-to-urban: What about reverse migration, smaller towns, satellite cities?
   • The "aspirational district" phenomenon—how Tier 2/3 cities are leapfrogging
   • Implications for distribution, pricing, and product localization in ${industryText}
   • Regional migration patterns and their impact on labor markets

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: VALUES, ATTITUDES & CULTURAL SHIFTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) THE TRUST LANDSCAPE
   • Trust in institutions: government, corporations, media, experts—how is it shifting?
   • Implications for ${industryText}: does your sector benefit from or suffer from trust deficits?
   • Rise of peer recommendations, influencers, and community-based trust
   • Skepticism of "big" and affinity for "authentic"—real trend or urban myth?

B) INDIVIDUALISM VS. COLLECTIVISM
   • India's traditional collectivist culture meeting global individualist influences
   • How does this tension manifest in consumption patterns for ${industryText}?
   • Family decision-making structures: who really decides purchases?
   • The "we" to "me" shift: how far has it gone, and will it reverse?

C) SUSTAINABILITY & CONSCIOUS CONSUMPTION
   • Beyond greenwashing: where is genuine behavior change happening?
   • Willingness to pay premium for sustainability in different categories
   • The say-do gap: stated preferences vs. revealed behavior
   • ESG as employer brand: does it affect talent attraction for ${industryText}?

D) HEALTH, WELLNESS & RISK PERCEPTION
   • Post-COVID permanent shifts vs. temporary pandemic effects
   • Mental health awareness and its implications for products, workplaces, marketing
   • Prevention vs. treatment mindset shift
   • How health consciousness affects ${industryText} specifically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: WORK, EDUCATION & LIFESTYLE TRANSFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) THE FUTURE OF WORK IN INDIA
   • Remote/hybrid work: temporary adjustment or permanent restructuring?
   • Gig economy scale: what % of workforce, which demographics, which sectors?
   • Multiple income streams as norm: implications for financial products, time use
   • Geographic arbitrage: will talent stay distributed or re-concentrate?

B) EDUCATION & SKILL FORMATION
   • Credentialism vs. skill-based hiring: which way is India moving?
   • The EdTech boom and bust: what's real, what's hype?
   • Vocational training and blue-collar skill development
   • Lifelong learning: aspiration vs. reality in Indian context

C) LIFESTYLE & TIME USE PATTERNS
   • Screen time reallocation: what's gaining, what's losing attention?
   • Leisure spending patterns: experiences vs. products
   • Convenience economy: how far will India go on the "pay to save time" spectrum?
   • Family structures: joint families, nuclear families, single-person households—trends

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: SOCIAL MOVEMENTS & INFLECTION POINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) EMERGING SOCIAL MOVEMENTS
   • What movements could gain momentum and affect ${industryText}?
   • Consumer activism: boycotts, cancel culture, ethical consumption demands
   • Labor movements and worker rights—especially in gig/platform contexts
   • Regional identity and language movements

B) POTENTIAL SOCIAL TIPPING POINTS
   • What slow-building social changes could suddenly accelerate?
   • Historical examples in India where social change surprised business
   • Early signals that a tipping point is approaching

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: SCENARIO PLANNING SYNTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your analysis, identify:

A) TOP 3 SOCIAL UNCERTAINTIES FOR SCENARIO PLANNING
   For each, provide:
   • The uncertainty framed as a question (e.g., "Will Indian consumers...")
   • Why it's genuinely uncertain—not a predetermined trend
   • The two "poles" and what each world looks like
   • Specific impact on ${industryText} under each pole
   • What would need to happen for each pole to materialize

B) BEHAVIORAL INDICATORS TO TRACK
   • What observable behaviors (not survey responses) signal direction?
   • Data sources: government statistics, industry data, social media signals
   • How to distinguish signal from noise in social trends

C) CONTRARIAN PERSPECTIVES
   • What's the "conventional wisdom" about social trends affecting ${industryText}?
   • What's the contrarian case? What if the consensus is wrong?
   • Historical examples where social forecasts were badly off

Make this vivid with examples, be contrarian where warranted, and connect everything back to ${industryText}.`
}

/**
 * Technological forces deep learning prompt
 * Used in: /simulation/phase-2/page.tsx
 */
export function buildTechnologicalForcesPrompt(industry: string | null): string {
  const industryText = industry || 'my industry'

  return `I'm conducting scenario planning for a company in ${industryText} in India. I need a DEEP, EXPERT-LEVEL analysis of technological forces—the kind a CTO, venture capitalist, or technology strategy consultant would provide.

IMPORTANT FRAMING:
Technology is often overhyped in the short term and underestimated in the long term. I need to cut through the hype and identify which technological forces create genuine uncertainty for my industry. These become candidates for scenario planning axes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: TECHNOLOGY IMPACT ASSESSMENT FOR ${industryText.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) THE VALUE CHAIN DISRUPTION MAP
   Map each stage of ${industryText}'s value chain and assess technology disruption potential:

   • R&D / Product Development: What tech is changing how products are conceived and designed?
   • Sourcing / Procurement: AI in supplier selection, blockchain in provenance, automation in ordering?
   • Production / Operations: Automation, IoT, predictive maintenance, quality control?
   • Distribution / Logistics: Last-mile innovation, inventory optimization, demand sensing?
   • Marketing / Sales: Personalization, attribution, channel shifts, AI in sales?
   • Customer Service: Automation, self-service, AI agents, experience management?
   • Support Functions: Finance automation, HR tech, legal tech?

   For each: What's the disruption potential (1-5)? What's the timeline? Who's leading adoption?

B) THE BUILD VS. BUY VS. PARTNER QUESTION
   • Which technologies should ${industryText} players build in-house?
   • Where does buying/licensing make sense?
   • Where are partnerships or ecosystems the right model?
   • What are the risks of each approach?

C) TECHNOLOGY INVESTMENT LANDSCAPE
   • What are leading players in ${industryText} investing in? (specific examples)
   • Where is VC/PE money flowing for tech adjacent to ${industryText}?
   • What's the technology capex trend—increasing or rationalizing?
   • Build vs. buy activity: recent tech acquisitions in the space

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: EMERGING TECHNOLOGY DEEP DIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For EACH of the following, analyze specifically for ${industryText}:

A) ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
   • Current AI applications in ${industryText}—what's in production, not just pilots?
   • Generative AI specifically: threat, opportunity, or both?
   • The "AI-native competitor" scenario: what would a company built from scratch with AI look like?
   • Data moats: who has the data advantage in this industry?
   • AI talent war: is ${industryText} competing effectively for AI talent?

B) CLOUD, EDGE & COMPUTE INFRASTRUCTURE
   • Cloud adoption maturity in ${industryText}—where on the journey?
   • Edge computing relevance: latency requirements, data sovereignty needs?
   • Compute cost trends and their impact on what's economically viable
   • India-specific: GCP/AWS/Azure + Indian cloud players + government cloud

C) CONNECTIVITY & IOT
   • 5G implications specific to ${industryText}—beyond the generic hype
   • IoT density: how many connected devices per transaction/customer/process?
   • Industrial IoT vs. consumer IoT relevance
   • India's connectivity landscape: what's possible in tier 2/3 vs. metros?

D) BLOCKCHAIN & WEB3 (REALISTIC ASSESSMENT)
   • Cut through the hype: what blockchain/DLT use cases actually make sense for ${industryText}?
   • Supply chain provenance, smart contracts, tokenization—which are real?
   • Regulatory clarity (or lack thereof) in India
   • What would need to be true for blockchain to matter?

E) OTHER RELEVANT TECHNOLOGIES
   • Industry-specific technologies that don't fit above categories
   • Hardware innovations, materials science, biotech if relevant
   • Automation and robotics applications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: INDIA'S DIGITAL INFRASTRUCTURE & ECOSYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) DIGITAL PUBLIC INFRASTRUCTURE (DPI)
   • UPI: How does ${industryText} leverage or compete with UPI's ubiquity?
   • Aadhaar/eKYC: Identity verification implications, regulatory requirements
   • ONDC: Will open commerce networks disrupt or enable ${industryText}?
   • Account Aggregator: Data democratization impact on the sector
   • DigiLocker, CoWIN learnings: What other DPI might emerge?

B) DATA REGULATION LANDSCAPE
   • DPDP Act: Compliance requirements and operational implications for ${industryText}
   • Data localization: where India is vs. where it's heading
   • Sector-specific data regulations (if applicable)
   • Cross-border data flows: restrictions and workarounds

C) INNOVATION ECOSYSTEM
   • Startup activity adjacent to ${industryText}: who's innovating?
   • Academia-industry linkages: are they working?
   • Government R&D initiatives relevant to the sector
   • Global tech trends that will reach India—and when

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: TECHNOLOGY-DRIVEN COMPETITIVE DYNAMICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) PLATFORM & NETWORK EFFECTS
   • Are there winner-take-most dynamics in ${industryText} driven by technology?
   • Platform players encroaching on the space (Amazon, Reliance, Tata Digital)
   • Data network effects: does more data compound into better products?
   • API economy: is ${industryText} becoming a platform or getting platformed?

B) TECHNOLOGY-ENABLED BUSINESS MODEL INNOVATION
   • New business models that technology makes possible in ${industryText}
   • Subscription, usage-based, freemium, marketplace models—what's gaining traction?
   • Bundling/unbundling dynamics enabled by technology
   • The "as-a-Service" trend: where is it heading in this industry?

C) TALENT & CAPABILITY IMPLICATIONS
   • What technology skills will ${industryText} need in 5 years?
   • Build internally vs. acquire vs. outsource
   • The "two-speed IT" challenge: legacy modernization while innovating
   • Vendor lock-in risks and multi-cloud/multi-vendor strategies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: SCENARIO PLANNING SYNTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your analysis, identify:

A) TOP 3 TECHNOLOGY UNCERTAINTIES FOR SCENARIO PLANNING
   For each, provide:
   • The uncertainty framed as a question (e.g., "Will AI achieve...")
   • Why it's genuinely uncertain—not the typical tech determinism
   • The two "poles" and what the world looks like under each
   • Specific impact on ${industryText} competitive dynamics under each pole
   • What would need to be true for each scenario to unfold

B) THE CONTRARIAN VIEW
   • What's the consensus tech narrative for ${industryText}?
   • What could make that consensus wrong?
   • Historical examples of tech predictions that missed badly for this sector

C) TECHNOLOGY SIGNALS TO MONITOR
   • Leading indicators that would signal which scenario is unfolding
   • Specific metrics, announcements, or milestones to track
   • How to distinguish hype cycles from real adoption curves

D) STRATEGIC TECHNOLOGY BETS
   • Given the uncertainty, what "no regret" technology investments make sense?
   • What "options" should be kept open through small bets?
   • What "big bets" might be necessary and under what conditions?

Be specific with examples, separate hype from reality, and quantify where possible. Make this actionable for a technology strategy review.`
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
