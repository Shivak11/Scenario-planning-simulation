'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Quote,
  ExternalLink,
  Sparkles,
  HelpCircle,
} from 'lucide-react'

export type InsightType = 'principle' | 'warning' | 'tip' | 'quote' | 'context'

export interface InsightContent {
  type: InsightType
  title: string
  content: string | string[]
  source?: string
  expandedContent?: string
  linkText?: string
  linkHref?: string
  chatGptPrompt?: string  // Pre-rendered ChatGPT prompt
}

interface InsightPanelProps {
  insights: InsightContent[]
  className?: string
  collapsible?: boolean
  defaultExpanded?: boolean  // Changed default to false
}

const INSIGHT_ICONS: Record<InsightType, typeof Lightbulb> = {
  principle: BookOpen,
  warning: AlertTriangle,
  tip: Lightbulb,
  quote: Quote,
  context: BookOpen,
}

const INSIGHT_STYLES: Record<InsightType, { bg: string; border: string; icon: string; title: string }> = {
  principle: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    title: 'text-blue-300',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    title: 'text-amber-300',
  },
  tip: {
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
    icon: 'text-gold-400',
    title: 'text-gold-300',
  },
  quote: {
    bg: 'bg-slate-700/50',
    border: 'border-slate-600',
    icon: 'text-gold-400',
    title: 'text-slate-200',
  },
  context: {
    bg: 'bg-slate-800/50',
    border: 'border-slate-700',
    icon: 'text-slate-400',
    title: 'text-slate-200',
  },
}

function InsightCard({ insight }: { insight: InsightContent }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = INSIGHT_ICONS[insight.type]
  const styles = INSIGHT_STYLES[insight.type]

  const contentArray = Array.isArray(insight.content) ? insight.content : [insight.content]

  const openChatGpt = (prompt: string) => {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
  }

  return (
    <div className={cn('rounded-xl border p-4', styles.bg, styles.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', styles.icon)} />
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-medium text-sm mb-2', styles.title)}>
            {insight.title}
          </h4>

          {insight.type === 'quote' ? (
            <blockquote className="text-sm text-slate-300 italic border-l-2 border-slate-600 pl-3">
              {contentArray[0]}
              {insight.source && (
                <footer className="mt-1 text-xs text-slate-500 not-italic">
                  — {insight.source}
                </footer>
              )}
            </blockquote>
          ) : (
            <div className="space-y-2">
              {contentArray.map((item, index) => (
                <p key={index} className="text-sm text-slate-300">
                  {item}
                </p>
              ))}
            </div>
          )}

          {insight.expandedContent && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  'flex items-center gap-1 text-xs font-medium mt-2 transition-colors',
                  styles.icon,
                  'hover:opacity-80'
                )}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Learn more
                  </>
                )}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-slate-400 mt-2 pt-2 border-t border-slate-700">
                      {insight.expandedContent}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* ChatGPT Explore Link */}
          {insight.chatGptPrompt && (
            <button
              onClick={() => openChatGpt(insight.chatGptPrompt!)}
              className="flex items-center gap-1 text-xs font-medium mt-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Explore on ChatGPT
            </button>
          )}

          {insight.linkText && insight.linkHref && (
            <a
              href={insight.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium mt-2',
                styles.icon,
                'hover:underline'
              )}
            >
              {insight.linkText}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function InsightPanel({
  insights,
  className,
  collapsible = true,
  defaultExpanded = false,  // Changed to false - collapsed by default
}: InsightPanelProps) {
  const [isPanelExpanded, setIsPanelExpanded] = useState(defaultExpanded)

  if (insights.length === 0) return null

  return (
    <div className={cn('space-y-3', className)}>
      {collapsible && (
        <button
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors w-full group"
        >
          <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center group-hover:bg-navy-200 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span>Need guidance?</span>
          <div className="flex-1" />
          {isPanelExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      <AnimatePresence>
        {(isPanelExpanded || !collapsible) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={collapsible ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.3 }}
            className="space-y-3 overflow-hidden"
          >
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Collapsible insight card - individual items collapsed by default
interface CollapsibleInsightProps {
  insight: InsightContent
  defaultExpanded?: boolean
  className?: string
}

export function CollapsibleInsight({
  insight,
  defaultExpanded = false,
  className,
}: CollapsibleInsightProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const Icon = INSIGHT_ICONS[insight.type]
  const styles = INSIGHT_STYLES[insight.type]

  const contentArray = Array.isArray(insight.content) ? insight.content : [insight.content]

  const openChatGpt = (prompt: string) => {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, '_blank')
  }

  return (
    <div className={cn('rounded-xl border overflow-hidden', styles.bg, styles.border, className)}>
      {/* Collapsed header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={cn('w-4 h-4', styles.icon)} />
          <span className={cn('text-sm font-medium', styles.title)}>{insight.title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-navy-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-navy-400" />
        )}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0">
              {insight.type === 'quote' ? (
                <blockquote className="text-sm text-slate-300 italic border-l-2 border-slate-600 pl-3">
                  {contentArray[0]}
                  {insight.source && (
                    <footer className="mt-1 text-xs text-slate-500 not-italic">
                      — {insight.source}
                    </footer>
                  )}
                </blockquote>
              ) : (
                <div className="space-y-2">
                  {contentArray.map((item, index) => (
                    <p key={index} className="text-sm text-slate-300">
                      {item}
                    </p>
                  ))}
                </div>
              )}

              {insight.chatGptPrompt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openChatGpt(insight.chatGptPrompt!)
                  }}
                  className="flex items-center gap-1 text-xs font-medium mt-3 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Explore on ChatGPT
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Pre-built insight collections for different phases
export const FOCAL_ISSUE_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'What Makes a Good Focal Issue?',
    content: [
      'A good focal issue is specific enough to be actionable, yet broad enough to allow exploration of multiple futures.',
      'Bad: "What should our strategy be?" (too vague)',
      'Good: "Should we acquire a D2C brand or build our own digital channel?" (specific, has alternatives)',
    ],
    source: 'The Art of the Long View',
    expandedContent:
      'The focal issue should be a decision you actually need to make, not a general area of concern. It should have real stakes and real alternatives. If there is only one obvious answer, it is not a good focal issue.',
  },
  {
    type: 'warning',
    title: 'Avoid These Common Mistakes',
    content: [
      'Making it too broad ("How do we succeed?")',
      'Making it too narrow ("Should we hire 5 or 10 engineers?")',
      'Framing it as a prediction ("Will AI replace us?")',
    ],
  },
  {
    type: 'tip',
    title: 'Test Your Focal Issue',
    content:
      'Ask yourself: "Could I imagine a scenario where the opposite answer is correct?" If yes, it is a good focal issue. If no, you may be asking a foregone conclusion.',
  },
]

export const INDIAN_PESTEL_INSIGHTS: InsightContent[] = [
  {
    type: 'context',
    title: 'Political Forces in India',
    content: [
      'Coalition dynamics at centre and state level',
      'Centre-state regulatory arbitrage (eg. labour laws, land acquisition)',
      'Election cycles affecting policy continuity',
      'PLI schemes and Make in India incentives',
    ],
  },
  {
    type: 'context',
    title: 'Economic Forces in India',
    content: [
      'Formal vs. informal economy dynamics',
      'Working capital intensity and credit cycles',
      'Import dependency (crude, electronics, APIs)',
      'Rupee volatility and export competitiveness',
    ],
  },
  {
    type: 'context',
    title: 'Social Forces in India',
    content: [
      'Aspirational tier-2/3 consumers',
      'GenZ workforce expectations',
      'Urbanisation and migration patterns',
      'Gig economy and informal employment',
    ],
  },
  {
    type: 'context',
    title: 'Technology Forces in India',
    content: [
      'Digital public infrastructure (UPI, Aadhaar, ONDC)',
      'Low-cost data driving digital adoption',
      'Tech talent availability and cost arbitrage erosion',
      'AI adoption vs. services export model tension',
    ],
  },
]

export const UNCERTAINTY_INSIGHTS: InsightContent[] = [
  {
    type: 'warning',
    title: 'The Uncertainty Trap',
    content:
      'Do not confuse uncertainty with unfamiliarity. Something can be unfamiliar but quite predictable (e.g., regulatory change after policy announcement). True uncertainty means genuinely unpredictable outcomes.',
    source: 'Peter Schwartz',
  },
  {
    type: 'principle',
    title: 'High Impact + High Uncertainty = Strategic Value',
    content:
      'Forces that are both highly impactful AND highly uncertain are the most valuable for scenario planning. Certain forces (no matter how impactful) are facts to plan around, not uncertainties to explore.',
  },
]

export const SCENARIO_AXIS_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'Why Two Axes? Why Four Scenarios?',
    content: [
      '2 forces x 2 poles each = 4 distinct scenarios',
      'Three scenarios tend to become "good/bad/middle"',
      'Four scenarios force you to consider uncomfortable combinations',
    ],
    source: 'The Art of the Long View',
  },
  {
    type: 'warning',
    title: 'Never Assign Probabilities',
    content:
      'Scenario planning is NOT forecasting. Every scenario should be treated as equally plausible. The moment you assign probabilities, you start betting on one future instead of preparing for many.',
    source: 'Peter Schwartz',
  },
  {
    type: 'tip',
    title: 'The Orthogonality Test',
    content:
      'Your two axes should be independent. Ask: "If Axis A goes HIGH, does it automatically push Axis B in a particular direction?" If yes, they are correlated and you should pick different forces.',
  },
]

export const SCENARIO_NAMING_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'Names Matter Enormously',
    content: [
      'Good scenario names are evocative, memorable, and discussable',
      'They become shorthand for complex futures',
      'Bad: "Scenario 1" or "Best Case"',
      'Good: "Monsoon of Disruption" or "Digital Barons"',
    ],
    source: 'Peter Schwartz',
  },
  {
    type: 'tip',
    title: 'Test Your Names',
    content:
      'A good scenario name should be usable in a sentence like: "If we end up in [SCENARIO NAME], we will need to..." If it sounds awkward, refine the name.',
  },
]

// Industry Selection Insights
export const INDUSTRY_SELECTION_INSIGHTS: InsightContent[] = [
  {
    type: 'tip',
    title: 'Choose Your Primary Industry',
    content:
      'If you operate across multiple sectors (e.g., a conglomerate), select the one most relevant to your current strategic question.',
    chatGptPrompt: 'How do diversified conglomerates like Tata or Reliance approach scenario planning across multiple industries?',
  },
  {
    type: 'principle',
    title: 'Industry Boundaries Are Blurring',
    content:
      'Traditional industry definitions are increasingly outdated. A fintech is both finance and technology. An EV company is automotive, energy, and software.',
    source: 'Clayton Christensen on disruption',
    chatGptPrompt: 'What industries are most at risk of disruption from adjacent sectors in India?',
  },
]

// Organization Type Insights
export const ORGANIZATION_TYPE_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'Governance Shapes Time Horizons',
    content: [
      'Family businesses can think in generations',
      'PE/VC-backed companies think in exit timelines',
      'Listed companies face quarterly pressures',
      'PSUs balance commercial and social mandates',
    ],
    chatGptPrompt: 'How do different ownership structures affect strategic planning horizons? Compare family business vs PE-backed vs listed companies.',
  },
  {
    type: 'quote',
    title: 'On Family Business',
    content: 'In a family business, you inherit not just assets but also relationships, reputation, and responsibility.',
    source: 'Aditya Birla on stewardship',
    chatGptPrompt: 'What are the unique strategic challenges faced by Indian family businesses?',
  },
]

// Stakeholder Perspective Insights
export const STAKEHOLDER_PERSPECTIVE_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'Why Perspective Matters',
    content: [
      'A promoter/board thinks in decades and across portfolio',
      'A CEO thinks in 3-5 year strategic cycles',
      'A BU head thinks in annual P&L and competitive moves',
      'A strategy team synthesises across all views',
    ],
    chatGptPrompt: 'How do board-level strategic conversations differ from CEO-level planning in Indian corporates?',
  },
  {
    type: 'tip',
    title: 'Match Scope to Perspective',
    content:
      'A board-level question might be "Should we exit this industry?" while a BU head asks "How do we win in this market segment?"',
  },
]

// Context Modifiers Insights
export const CONTEXT_MODIFIERS_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'What Are Context Modifiers?',
    content:
      'Context modifiers are specific conditions that shape how forces affect your organisation. They help generate more relevant scenarios by adding constraints and characteristics unique to your situation.',
    chatGptPrompt: 'How do contextual factors like being asset-heavy vs asset-light affect strategic options?',
  },
  {
    type: 'tip',
    title: 'Select 2-4 Modifiers',
    content: [
      'Too few modifiers = generic scenarios',
      'Too many modifiers = overly constrained thinking',
      'Choose the ones that most shape your strategic choices',
    ],
  },
  {
    type: 'context',
    title: 'Example: How Modifiers Change Scenarios',
    content: [
      '"Tier-2/3 expansion play" emphasises distribution and affordability',
      '"PE/VC return expectations" adds exit timeline pressure',
      '"Legacy tech stack" highlights digital transformation friction',
      '"Government-dependent" introduces policy cycle sensitivity',
    ],
    chatGptPrompt: 'How do regulatory dependencies affect strategic planning for Indian companies?',
  },
]

// Research Mission Insights
export const RESEARCH_MISSION_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'Why Research Before Planning?',
    content:
      'Scenario planning is only as good as your understanding of the forces at play. External research helps challenge assumptions and surface blind spots.',
    source: 'Peter Schwartz',
    chatGptPrompt: 'What are common blind spots that companies miss in strategic planning?',
  },
  {
    type: 'tip',
    title: 'Look for Contrarian Views',
    content:
      'The most valuable research surfaces perspectives that challenge your current mental models. Seek out views that contradict the industry consensus.',
  },
]

// Environmental Scanning / Forces Insights
export const ENVIRONMENTAL_SCANNING_INSIGHTS: InsightContent[] = [
  {
    type: 'principle',
    title: 'What is Impact?',
    content: [
      'Impact measures how much a force would affect your focal issue IF it materialises',
      'High impact = would fundamentally change your strategic options',
      'Low impact = would be a minor adjustment',
      'Judge impact relative to YOUR organisation, not the industry',
    ],
    chatGptPrompt: 'How do I assess the strategic impact of a force on my business?',
  },
  {
    type: 'principle',
    title: 'What is Uncertainty?',
    content: [
      'Uncertainty is NOT about unfamiliarity - it\'s about unpredictability',
      'High uncertainty = the outcome could genuinely go either way',
      'Low uncertainty = we can reasonably predict the direction',
      'Tip: If experts disagree significantly, it\'s probably high uncertainty',
    ],
    chatGptPrompt: 'What is the difference between uncertainty and risk in strategic planning?',
  },
  {
    type: 'warning',
    title: 'The Certainty Illusion',
    content:
      'We tend to overestimate our ability to predict the future. Just because something "seems obvious" doesn\'t mean it\'s certain. The 2008 financial crisis, COVID-19, and UPI\'s success all surprised most experts.',
    source: 'Nassim Taleb on Black Swans',
    chatGptPrompt: 'What major events in Indian business were widely unexpected by experts?',
  },
  {
    type: 'tip',
    title: 'The 2x2 Sweet Spot',
    content:
      'Forces that are BOTH high impact AND high uncertainty are the most valuable for scenario planning. They create meaningful scenario differentiation.',
  },
]

// Summary Step Insights
export const SUMMARY_INSIGHTS: InsightContent[] = [
  {
    type: 'tip',
    title: 'Ready for the Next Step',
    content:
      'In the next phase, we will scan the environment for forces that could shape how your focal issue plays out. Your context modifiers will help generate relevant forces.',
  },
  {
    type: 'principle',
    title: 'The Foundation is Set',
    content:
      'You\'ve defined your focal issue, context, and perspective. This foundation will guide all subsequent phases. If something feels off, go back and adjust before proceeding.',
  },
]

// =============================================================================
// VISUAL EXAMPLE COMPONENTS - Teach through comparison (Duolingo/Chegg style)
// =============================================================================

// Visual Example: Impact Rating (Phase 2)
export interface CompanyComparisonExample {
  force: string
  highImpact: {
    company: string
    outcome: string
    rating: number
  }
  lowImpact: {
    company: string
    outcome: string
    rating: number
  }
}

export const RATING_IMPACT_EXAMPLE: CompanyComparisonExample = {
  force: 'Generative AI Disruption',
  highImpact: {
    company: 'Chegg (EdTech)',
    outcome: 'Stock crashed 48% in one day when ChatGPT disrupted their core homework help business',
    rating: 5,
  },
  lowImpact: {
    company: 'Amul (Dairy)',
    outcome: 'AI might optimize supply chain, but milk demand and cooperative model remain unchanged',
    rating: 2,
  },
}

// Visual Example: Uncertainty Rating (Phase 2)
export interface UncertaintyComparisonExample {
  highUncertainty: {
    question: string
    reason: string
    rating: number
  }
  lowUncertainty: {
    question: string
    reason: string
    rating: number
  }
}

export const RATING_UNCERTAINTY_EXAMPLE: UncertaintyComparisonExample = {
  highUncertainty: {
    question: 'Will AI replace knowledge workers?',
    reason: 'Experts disagree wildly - some say 50% job loss, others say net job creation',
    rating: 5,
  },
  lowUncertainty: {
    question: 'Will AI adoption grow?',
    reason: 'Clear trajectory - every major company investing, regulatory consensus forming',
    rating: 1,
  },
}

// Visual Example: Orthogonality (Phase 3)
export interface OrthogonalityExample {
  title: string
  goodExample: {
    label: string
    axis1: string
    axis1Category: string
    axis2: string
    axis2Category: string
    explanation: string
    outcome: string
  }
  badExample: {
    label: string
    axis1: string
    axis1Category: string
    axis2: string
    axis2Category: string
    explanation: string
    outcome: string
  }
}

export const ORTHOGONALITY_EXAMPLE: OrthogonalityExample = {
  title: 'Why Orthogonality Matters',
  goodExample: {
    label: 'Good: Independent Axes',
    axis1: 'AI Regulation Strictness',
    axis1Category: 'Political',
    axis2: 'Consumer AI Adoption',
    axis2Category: 'Social',
    explanation: 'Government policy and consumer behavior can move independently. Strict regulation doesn\'t automatically mean low adoption (see: EU with high GDPR + high tech adoption).',
    outcome: '4 genuinely different futures',
  },
  badExample: {
    label: 'Bad: Correlated Axes',
    axis1: 'Tech Lobbying Power',
    axis1Category: 'Political',
    axis2: 'Tech-Friendly Regulation',
    axis2Category: 'Political',
    explanation: 'If tech lobbying is strong, regulation will likely be favorable. These move together, not independently.',
    outcome: 'Really just 2 futures disguised as 4',
  },
}

// Visual Example: Context Modifiers (Phase 1)
export interface ModifierImpactExample {
  force: string
  modifier1: {
    name: string
    company: string
    outcome: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }
  modifier2: {
    name: string
    company: string
    outcome: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }
}

export const MODIFIER_IMPACT_EXAMPLE: ModifierImpactExample = {
  force: 'ChatGPT launches (Nov 2022)',
  modifier1: {
    name: 'AI-Native Business Model',
    company: 'Duolingo',
    outcome: 'Used AI to enhance product, stock rose 60% in 6 months',
    sentiment: 'positive',
  },
  modifier2: {
    name: 'Human-Dependent Service',
    company: 'Chegg',
    outcome: 'Core homework help business disrupted, stock crashed 48% in one day',
    sentiment: 'negative',
  },
}

// =============================================================================
// DEEP LEARNING CONTENT - For ChatGPT Exploration
// =============================================================================

export interface DeepLearningItem {
  id: string
  title: string
  subtitle: string
  content: string[]
  chatGptPrompt: string
}

// Phase 2: PEST Category Deep Learning
export const getPESTDeepLearning = (industry: string | null): DeepLearningItem[] => [
  {
    id: 'political',
    title: 'Political Forces',
    subtitle: 'Government, regulation, policy landscape',
    content: ['Policy changes & regulatory shifts', 'Election cycles & government priorities', 'Trade policies & taxation'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand POLITICAL forces I should consider:

1. FEDERAL vs STATE DYNAMICS
   - How do central vs state government policies differ for ${industry || 'my industry'}?
   - Which states are more business-friendly for this sector?

2. POLICY & REGULATORY LANDSCAPE
   - What are the key regulations governing ${industry || 'this industry'} in India?
   - How do bodies like SEBI, RBI, TRAI, CCI affect this industry?

3. GOVERNMENT PRIORITIES & SPENDING
   - What PLI schemes or incentives exist for ${industry || 'this sector'}?

4. FOR MY SCENARIO PLANNING
   - Which political factors have the MOST UNCERTAIN direction?
   - Which would have HIGHEST IMPACT if they change?

Make this practical and specific to ${industry || 'my industry'} in India.`,
  },
  {
    id: 'economic',
    title: 'Economic Forces',
    subtitle: 'Macro indicators, capital, consumption',
    content: ['Interest rates, inflation, currency', 'Consumer spending & industry cycles', 'Capital availability & investment trends'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand ECONOMIC forces I should consider:

1. MACROECONOMIC INDICATORS - RBI rates, rupee, inflation
2. CONSUMPTION PATTERNS - Urban/rural, tier-1/2/3 differences
3. CAPITAL ENVIRONMENT - PE/VC/FDI dependency, credit conditions
4. INDUSTRY ECONOMICS - Cost drivers, margin pressures

For scenario planning: Which economic factors are most UNCERTAIN and most IMPACTFUL?

Make this practical for ${industry || 'my industry'} in India.`,
  },
  {
    id: 'social',
    title: 'Social Forces',
    subtitle: 'Demographics, culture, behavior',
    content: ['Population shifts & urbanization', 'Cultural values & lifestyle changes', 'Workforce evolution & consumer behavior'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand SOCIAL forces I should consider:

1. DEMOGRAPHICS - India's demographic dividend, urbanization, migration
2. CONSUMER BEHAVIOR - GenZ/millennial preferences, premiumization, sustainability
3. WORKFORCE - Gig economy, talent challenges, remote work
4. CULTURAL SHIFTS - Digital habits, family structures, health/wellness

For scenario planning: Which social changes are most UNCERTAIN and most IMPACTFUL?

Make this practical for ${industry || 'my industry'} in India.`,
  },
  {
    id: 'technological',
    title: 'Technological Forces',
    subtitle: 'Innovation, disruption, infrastructure',
    content: ['Disruptive technologies & adoption curves', 'Digital infrastructure & automation', 'R&D trends & emerging tech'],
    chatGptPrompt: `I'm doing scenario planning for a company in ${industry || 'my industry'} in India.
Help me deeply understand TECHNOLOGICAL forces I should consider:

1. DISRUPTIVE TECH - AI, blockchain, IoT - what's real vs hype for this industry?
2. DIGITAL INFRASTRUCTURE - UPI, Aadhaar, ONDC, DPDP Act implications
3. INDUSTRY TECH - Competitor investments, automation, build vs buy
4. INNOVATION ECOSYSTEM - Startups, global R&D trends reaching India

For scenario planning: Which technology trajectories are most UNCERTAIN and most IMPACTFUL?

Make this practical for ${industry || 'my industry'} in India.`,
  },
]

// Phase 3: Scenario Axis Selection Deep Learning
export const SCENARIO_AXIS_DEEP_LEARNING: DeepLearningItem[] = [
  {
    id: 'orthogonality',
    title: 'The Orthogonality Test',
    subtitle: 'Ensuring your axes create distinct futures',
    content: [
      'Ask: "If Axis A goes HIGH, does it push Axis B in a particular direction?"',
      'If yes → axes are correlated → pick different forces',
      'If no → axes are orthogonal → good choice!',
    ],
    chatGptPrompt: `I'm building a 2x2 scenario matrix. Help me understand orthogonality:

1. What does it mean for two scenario axes to be "orthogonal"?
2. How do I test if my chosen axes are independent or correlated?
3. Give me examples of commonly-used correlated axis pairs that seem orthogonal but aren't
4. What happens to scenario quality when axes are correlated?
5. How do I find genuinely independent axes in my industry?

Make this practical with real business examples.`,
  },
  {
    id: 'whyfour',
    title: 'Why Four Scenarios?',
    subtitle: 'The power of the 2x2 matrix',
    content: [
      'Three scenarios become "good / bad / middle" - the middle absorbs all attention',
      'Five+ scenarios become unmanageable - can\'t hold them in mind',
      'Four forces you to consider uncomfortable combinations',
    ],
    chatGptPrompt: `Explain the 2x2 scenario matrix methodology:

1. Why do scenario planners prefer 4 scenarios over 3 or 5?
2. What is the psychological advantage of 4 distinct quadrants?
3. How do Shell, military strategists, and governments use 2x2 scenarios?
4. What are the limitations of the 2x2 approach?
5. When might you need more than 4 scenarios?

Include examples from famous scenario planning exercises.`,
  },
  {
    id: 'selection',
    title: 'Selecting Your Two Forces',
    subtitle: 'Criteria for axis selection',
    content: [
      'Both must be HIGH IMPACT - would change your strategic options',
      'Both must be HIGH UNCERTAINTY - could genuinely go either way',
      'They should be from DIFFERENT categories if possible',
    ],
    chatGptPrompt: `Help me select the best two forces for my scenario axes:

1. What criteria should I use to select forces for scenario axes?
2. How do I prioritize between multiple high-impact, high-uncertainty forces?
3. Should I always pick forces from different PEST categories?
4. What if my most important forces are from the same category?
5. How do experienced scenario planners narrow down to just two forces?

Give me a practical decision framework.`,
  },
]
