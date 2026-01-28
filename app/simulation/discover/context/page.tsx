'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore, STAKEHOLDER_LABELS, type StakeholderPerspective } from '@/lib/store'
import {
  INDUSTRIES,
  ORGANIZATION_TYPES,
  CONTEXT_MODIFIERS,
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  RefreshCw,
  Edit3,
  Check,
  Plus,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ExternalLink,
  Building,
  Lightbulb,
  ChevronDown,
  X,
  BookOpen,
  Landmark,
  Monitor,
  Factory,
  HeartPulse,
  ShoppingBag,
  Building2,
  Zap,
  Radio,
  GraduationCap,
  Wheat,
  Users,
  TrendingUp,
  Globe,
  BarChart3,
  Rocket,
  Home,
  LucideIcon,
} from 'lucide-react'

// Map icon names to Lucide components
const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  landmark: Landmark,
  monitor: Monitor,
  factory: Factory,
  'heart-pulse': HeartPulse,
  'shopping-bag': ShoppingBag,
  'building-2': Building2,
  zap: Zap,
  radio: Radio,
  'graduation-cap': GraduationCap,
  wheat: Wheat,
  building: Building,
}

// Icon map for organization tiles
const ORG_ICONS: Record<string, LucideIcon> = {
  family: Users,
  pe: TrendingUp,
  mnc: Globe,
  listed: BarChart3,
  startup: Rocket,
  psu: Landmark,
}

type Step =
  | 'industry'
  | 'organization'
  | 'stakeholder'
  | 'focal-issue'
  | 'modifiers'
  | 'summary'

interface GeneratedFocalIssue {
  id: string
  issue: string
  rationale: string
  isGood: boolean
  whyGoodOrBad: string
}

interface ComparisonTile {
  label: string
  horizon: string
  dynamic: string
  icon: string
  learnWhyPrompt?: string
}

interface MiniArticle {
  title: string
  author: string
  readTime: string
  sections: { heading: string; content: string }[]
  buttonText: string
}

interface JourneyRecap {
  industry: string
  organization: string
  stakeholder: string
  focalIssue: string
  modifiers: string[]
  nextStep: string
}

interface LearningSidebarProps {
  title: string
  whyItMatters: string
  learnMore?: string
  learnMorePrompt?: string
  learnMoreLinkText?: string
  microCase?: {
    company: string
    story: string
    explorePrompt: string
    exploreLinkText: string
  }
  comparisonTiles?: ComparisonTile[]
  miniArticle?: MiniArticle
  tip?: string
  journeyRecap?: JourneyRecap
}

type SidebarTab = 'guide' | 'example' | 'tips'

const sidebarTabs = [
  { id: 'guide' as const, label: 'Guide', icon: BookOpen },
  { id: 'example' as const, label: 'Example', icon: Building },
  { id: 'tips' as const, label: 'Tips', icon: Lightbulb },
]

function LearningSidebar({ title, whyItMatters, learnMore, learnMorePrompt, learnMoreLinkText, microCase, comparisonTiles, miniArticle, tip, journeyRecap }: LearningSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('guide')
  const [showArticle, setShowArticle] = useState(false)

  // If journeyRecap is provided, render the timeline visualization instead
  if (journeyRecap) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          {/* Vertical Timeline */}
          <div className="space-y-0">
            {/* Industry */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-gold-500/30" />
                <div className="w-0.5 h-full bg-slate-600 min-h-[32px]" />
              </div>
              <div className="pb-3">
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Industry</div>
                <div className="text-sm text-slate-200">{journeyRecap.industry}</div>
              </div>
            </div>

            {/* Organization */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-gold-500/30" />
                <div className="w-0.5 h-full bg-slate-600 min-h-[32px]" />
              </div>
              <div className="pb-3">
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Organization</div>
                <div className="text-sm text-slate-200">{journeyRecap.organization}</div>
              </div>
            </div>

            {/* Perspective */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-gold-500/30" />
                <div className="w-0.5 h-full bg-slate-600 min-h-[32px]" />
              </div>
              <div className="pb-3">
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Perspective</div>
                <div className="text-sm text-slate-200">{journeyRecap.stakeholder}</div>
              </div>
            </div>

            {/* Focal Issue */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-gold-500/30" />
                {journeyRecap.modifiers.length > 0 && (
                  <div className="w-0.5 h-full bg-slate-600 min-h-[32px]" />
                )}
              </div>
              <div className={journeyRecap.modifiers.length > 0 ? 'pb-3' : ''}>
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Focal Issue</div>
                <div className="text-sm text-slate-200 leading-snug">"{journeyRecap.focalIssue}"</div>
              </div>
            </div>

            {/* Modifiers (only if present) */}
            {journeyRecap.modifiers.length > 0 && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-gold-500/30" />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Modifiers</div>
                  <div className="flex flex-wrap gap-1">
                    {journeyRecap.modifiers.map((mod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] font-medium bg-gold-500/20 text-gold-300 rounded-full border border-gold-500/30"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Step Teaser */}
          <div className="mt-auto pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
              <span>Next: <span className="text-slate-300">{journeyRecap.nextStep}</span></span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Determine available tabs
  const hasExampleTab = Boolean(microCase || comparisonTiles)
  const hasTipsTab = Boolean(tip)

  // Filter tabs based on available content
  const availableTabs = sidebarTabs.filter(tab => {
    if (tab.id === 'guide') return true
    if (tab.id === 'example') return hasExampleTab
    if (tab.id === 'tips') return hasTipsTab
    return false
  })

  // Tab content configuration
  const tabContent = {
    guide: {
      title: title || 'Understanding the context',
      content: (
        <div className="space-y-3 text-left">
          <p>{whyItMatters}</p>
          {learnMore && (
            <p className="text-slate-400 text-xs">{learnMore}</p>
          )}
          {learnMorePrompt && (
            <a
              href={`https://chat.openai.com/?q=${encodeURIComponent(learnMorePrompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              {learnMoreLinkText || 'Explore this concept deeper'}
            </a>
          )}
          {miniArticle && (
            <button
              onClick={() => setShowArticle(true)}
              className="text-gold-400 hover:text-gold-300 font-medium text-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {miniArticle.buttonText} ({miniArticle.readTime})
            </button>
          )}
        </div>
      ),
    },
    example: {
      title: microCase ? microCase.company : 'Industry examples',
      content: (
        <div className="space-y-3 text-left">
          {microCase && (
            <>
              <p>{microCase.story}</p>
              <a
                href={`https://chat.openai.com/?q=${encodeURIComponent(microCase.explorePrompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-medium"
              >
                <ExternalLink className="w-3 h-3" />
                {microCase.exploreLinkText}
              </a>
            </>
          )}
          {comparisonTiles && !microCase && (
            <div className="grid grid-cols-2 gap-2">
              {comparisonTiles.slice(0, 4).map((tile, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 rounded-lg border border-slate-700 p-2.5"
                >
                  <div className="text-xs font-medium text-slate-200">{tile.label}</div>
                  <div className="text-xs text-gold-400 font-medium">{tile.horizon}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{tile.dynamic}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    tips: {
      title: 'Pro tip',
      content: (
        <div className="text-left">
          <p className="text-gold-400 font-semibold border-l-2 border-gold-500 pl-3 text-xs">
            {tip}
          </p>
        </div>
      ),
    },
  }

  return (
    <>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Tab Bar - matching reusable component style */}
        <div className="flex border-b border-slate-700">
          {availableTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset',
                  isActive
                    ? 'text-gold-400 bg-slate-700/50'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active Tab Indicator */}
        <div className="relative h-0.5 bg-slate-700">
          <motion.div
            className="absolute top-0 h-full bg-gold-400"
            initial={false}
            animate={{
              left: `${(availableTabs.findIndex((t) => t.id === activeTab) / availableTabs.length) * 100}%`,
              width: `${100 / availableTabs.length}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Tab Content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-slate-100 mb-2">
                {tabContent[activeTab].title}
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed">
                {tabContent[activeTab].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mini Article Modal */}
      <AnimatePresence>
        {showArticle && miniArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowArticle(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-900 text-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{miniArticle.title}</h2>
                    <span className="text-xs text-slate-400">{miniArticle.readTime} read</span>
                  </div>
                  <button
                    onClick={() => setShowArticle(false)}
                    className="p-1.5 hover:bg-slate-800/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh] prose prose-sm prose-slate">
                {miniArticle.sections.map((section, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <h3 className="text-base font-semibold text-slate-200 mb-2">{section.heading}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 p-4 bg-slate-800/50">
                <button
                  onClick={() => setShowArticle(false)}
                  className="w-full bg-gold-500 text-white py-2.5 rounded-lg font-medium hover:bg-gold-600 transition-colors"
                >
                  Got it, let's continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const LEARNING_CONTENT: Record<Step, LearningSidebarProps> = {
  industry: {
    title: 'Why industry matters',
    whyItMatters: 'Every industry has its own "scenario vocabulary" - the forces, uncertainties, and disruptions that matter most. A bank worries about regulation, digital disruption, and credit cycles. A manufacturer worries about supply chains, automation, and trade policy. A retailer worries about consumer behavior shifts and channel competition. By selecting your industry, you\'re telling us which forces to prioritize in your scenario exercise.',
    learnMorePrompt: 'How did Shell use scenario planning to understand the geo-politics of oil exploration in the 1970s? Explain how their deep understanding of OPEC dynamics, exploration economics, and energy politics helped them anticipate the 1973 and 1979 oil shocks years before competitors.',
    learnMoreLinkText: 'Explore how Shell used scenarios to navigate oil geo-politics',
    microCase: {
      company: 'Shell vs Nokia',
      story: 'In the 1970s, Shell\'s scenario team understood energy industry forces so deeply that they anticipated both the 1973 and 1979 oil shocks - years before competitors. They weren\'t predicting; they were prepared for multiple futures. Nokia dominated mobile for two decades, but thought as a hardware company in a software-driven disruption. They competed on specs while Apple redefined the game around ecosystems. The lesson: knowing your industry\'s true forces determines whether you see disruption coming.',
      explorePrompt: 'Tell me the detailed story of how Shell invented scenario planning in the 1970s and anticipated the oil shocks. Then contrast this with how Nokia missed smartphone disruption by thinking as a hardware company. What mental models did each company have about their industry?',
      exploreLinkText: 'Explore the Shell vs Nokia story',
    },
    tip: 'If you operate across multiple sectors, pick the ONE most relevant to your current strategic question.',
  },
  organization: {
    title: 'Why ownership structure matters',
    whyItMatters: 'A family business can think in generations; a PE-backed company thinks in exit timelines. A listed company balances quarterly pressures with long-term bets. This fundamentally changes what "long-term" means and what risks you can take. The same strategic opportunity looks very different through each lens.',
    learnMorePrompt: 'How does ownership structure affect strategic planning horizons? Compare family businesses (20-50 year thinking), PE-backed companies (5-7 year exit focus), listed companies (quarterly vs long-term tension), and startups (runway-driven). Give examples of how the same decision plays out differently.',
    learnMoreLinkText: 'Explore how ownership shapes strategy horizons',
    microCase: {
      company: 'Tata vs Flipkart',
      story: 'When e-commerce disrupted retail, Tata (family-controlled) could afford to build Tata Digital slowly over years—thinking generationally. Flipkart (VC-backed) had to grow at breakneck speed to justify valuations—burning cash for market share. Neither approach was wrong; they reflected different ownership realities and risk tolerances.',
      explorePrompt: 'Compare how family-controlled Indian conglomerates like Tata approach digital disruption versus VC-backed startups like Flipkart. How did ownership structure shape their strategic responses to e-commerce? What risks could each take that the other couldn\'t?',
      exploreLinkText: 'Explore how Tata and Flipkart faced disruption differently',
    },
    tip: 'Your ownership structure determines what risks you can afford to take.',
  },
  stakeholder: {
    title: 'Why perspective matters',
    whyItMatters: 'A board asks "Should we be in this business?" A BU head asks "How do we win in this market?" Same company, different scope. Your decision authority determines what questions you can meaningfully address—and what futures you should explore.',
    learnMorePrompt: 'How does stakeholder level affect strategic planning scope? Compare board-level questions (portfolio, M&A, capital allocation) vs business-unit questions (market positioning, capability building) vs functional questions (operational excellence). Why does matching scope to authority matter?',
    learnMoreLinkText: 'Explore how decision authority shapes strategic scope',
    microCase: {
      company: 'Tata Steel: Board vs BU',
      story: 'When Ratan Tata asked "Should we acquire Corus?"—that\'s a board-level question about capital allocation and global positioning. A Tata Steel plant head asking "How do we reduce costs by 15%?"—that\'s a business-unit question about operational excellence. Both are valid scenarios, but they require entirely different forces and uncertainties.',
      explorePrompt: 'How did stakeholder perspective shape strategic decisions at Tata? Compare the board-level Corus acquisition decision with business-unit operational decisions. What different forces and uncertainties mattered at each level?',
      exploreLinkText: 'Explore the Tata Steel case across stakeholder levels',
    },
    tip: 'Pick the level that matches your actual decision-making authority.',
  },
  'focal-issue': {
    title: 'Why the focal issue matters',
    whyItMatters: 'The focal issue is THE decision you\'re exploring. Get this wrong and your scenarios will be interesting but useless. A good focal issue forces you to confront genuine uncertainty—not confirm what you already believe.',
    miniArticle: {
      title: 'The Art of Framing Your Focal Issue',
      author: 'In the style of Peter Schwartz',
      readTime: '3 min',
      buttonText: 'Read before you choose',
      sections: [
        {
          heading: 'What is a Focal Issue?',
          content: 'The focal issue is not a topic, not an area of interest, not even a problem. It is a specific decision that someone in your organisation will actually have to make—and that you genuinely don\'t know the answer to.\n\n"Digital transformation" is not a focal issue. "Should we build or buy our AI capabilities over the next 3 years?" is. The difference: one is a direction, the other is a choice with real alternatives.\n\nPeter Schwartz calls this the "decision that keeps you up at night"—the one where smart people could reasonably disagree, where the stakes are high, and where the right answer depends on how the future unfolds.',
        },
        {
          heading: 'The Anatomy of a Good Focal Issue',
          content: '✓ Specific and actionable — Can you imagine actually making this decision?\n✓ Genuinely uncertain — Do smart people disagree on the answer?\n✓ Consequential — Would getting it wrong seriously hurt you?\n✓ Timely — Do you need to decide within your planning horizon?\n✓ Within your authority — Can YOU actually make this call?\n\nA focal issue like "Should we acquire Company X or build the capability organically?" meets all five criteria. "How do we grow?" meets none.',
        },
        {
          heading: 'The Strategic Scope Test',
          content: 'Your focal issue should match your stakeholder level. A board member asks: "Should we be in this business at all?" A BU head asks: "How do we win in this specific market?" A function head asks: "How do we build this capability?"\n\nMismatch leads to frustration. A BU head can\'t decide corporate portfolio questions. A board member shouldn\'t be choosing CRM vendors. Match your question to your authority.',
        },
        {
          heading: 'Red Flags: Signs of a Bad Focal Issue',
          content: '✗ Too vague: "What should our strategy be?" — This isn\'t a decision, it\'s everything\n✗ Too narrow: "Which vendor for CRM?" — This doesn\'t need scenarios, it needs evaluation\n✗ Predetermined answer: "How do we implement X?" — You\'ve already decided; scenarios won\'t help\n✗ Outside your control: "Will the government change policy?" — You can\'t decide this; you can only respond\n✗ False certainty: "How do we beat competitor Y?" — You\'ve assumed you should compete, not exit or partner',
        },
        {
          heading: 'The Opposite Test',
          content: 'Here\'s the ultimate test: Can you imagine a scenario where the opposite answer would be correct?\n\nIf your focal issue is "Should we expand into rural markets or deepen urban penetration?"—you can imagine futures where either answer wins. That\'s a good focal issue.\n\nIf the opposite seems obviously wrong, you\'re not exploring genuine uncertainty—you\'re seeking confirmation. Reframe until both answers feel plausible.',
        },
      ],
    },
    tip: 'Test: Can you imagine scenarios where the opposite answer is correct?',
  },
  modifiers: {
    title: 'Why context modifiers matter',
    whyItMatters: 'The same industry force affects companies differently. An AI disruption hits an "AI-native" company very differently than a "legacy tech" company. Your modifiers act as filters—without them, you get generic scenarios that miss the specific dynamics of YOUR situation.',
    learnMorePrompt: 'How do company-specific modifiers change scenario planning outcomes? Explain with examples: how would "PE-backed" vs "family business" face the same disruption differently? How do modifiers like "export-dependent" or "regulatory-heavy" change which forces matter most?',
    learnMoreLinkText: 'Explore how modifiers personalize your scenarios',
    microCase: {
      company: 'Duolingo vs Chegg',
      story: 'When ChatGPT launched in Nov 2022, both were edtech companies facing the same disruption. But Duolingo (AI-native, gamified model) used AI to enhance its product—stock rose 60%. Chegg (human-dependent homework service) got disrupted—stock crashed 48% in one day. Same industry, different modifiers, opposite outcomes.',
      explorePrompt: 'Compare how Duolingo and Chegg responded to ChatGPT disruption in late 2022. What business model characteristics (AI-native vs human-dependent) made Duolingo resilient and Chegg vulnerable? What does this teach us about identifying company-specific vulnerability modifiers?',
      exploreLinkText: 'Explore the Duolingo vs Chegg disruption story',
    },
    tip: 'Ask yourself: "If I described my company to an outsider, what 2-3 characteristics would I mention that make our situation unique?"',
  },
  summary: {
    title: 'Mission Briefing',
    whyItMatters: 'You\'ve defined the decision, context, and scope. Next, we\'ll scan for forces that could shape how this plays out.',
  },
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 w-6 rounded-full transition-colors',
              i < current ? 'bg-gold-500' : i === current ? 'bg-gold-400' : 'bg-slate-600'
            )}
          />
        ))}
      </div>
      <span className="text-[10px] text-slate-500">
        {current + 1}/{total}
      </span>
    </div>
  )
}

export default function ContextPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('industry')
  const [generatedIssues, setGeneratedIssues] = useState<GeneratedFocalIssue[]>([])
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [revealedIssues, setRevealedIssues] = useState<Set<string>>(new Set())
  const [customIssue, setCustomIssue] = useState('')
  const [isEditingIssue, setIsEditingIssue] = useState(false)
  const [customIndustry, setCustomIndustry] = useState('')
  const [showCustomIndustry, setShowCustomIndustry] = useState(false)
  const [refinementInput, setRefinementInput] = useState('')
  const [customModifierInput, setCustomModifierInput] = useState('')
  const [customModifiers, setCustomModifiers] = useState<string[]>([])

  const addCustomModifier = () => {
    if (customModifierInput.trim() && !customModifiers.includes(customModifierInput.trim())) {
      setCustomModifiers([...customModifiers, customModifierInput.trim()])
      setCustomModifierInput('')
    }
  }

  const removeCustomModifier = (mod: string) => {
    setCustomModifiers(customModifiers.filter(m => m !== mod))
  }

  const {
    industry,
    organizationType,
    stakeholderPerspective,
    focalIssue,
    focalIssueRefinement,
    timeHorizon,
    modifiers,
    setIndustry,
    setOrganizationType,
    setStakeholderPerspective,
    setFocalIssue,
    setFocalIssueRefinement,
    setTimeHorizon,
    toggleModifier,
    setCurrentStep,
    completeMainPhase,
    isGeneratingFocalIssues,
    setIsGeneratingFocalIssues,
    resetSimulation,
  } = useSimulationStore()

  const stepIndex = ['industry', 'organization', 'stakeholder', 'focal-issue', 'modifiers', 'summary'].indexOf(step)

  useEffect(() => {
    setCurrentStep('context')
  }, [setCurrentStep])

  const generateFocalIssues = async () => {
    setIsGeneratingFocalIssues(true)
    setRevealedIssues(new Set())
    setSelectedIssueId(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const contextualIssues: GeneratedFocalIssue[] = [
      {
        id: '1',
        issue: `Should we invest in building our own ${industry === 'it-services' ? 'AI/ML capabilities' : industry === 'consumer-retail' ? 'D2C platform' : 'digital capabilities'} or partner with specialists?`,
        rationale: 'Build vs buy decision with clear alternatives.',
        isGood: true,
        whyGoodOrBad: 'Specific, actionable, has clear alternatives, forces trade-off thinking.',
      },
      {
        id: '2',
        issue: `Should we prioritise ${industry === 'bfsi' ? 'rural financial inclusion' : 'tier-2/3 expansion'} or deepen metro penetration?`,
        rationale: 'Growth strategy with resource implications.',
        isGood: true,
        whyGoodOrBad: 'Clear choice between two valid paths with different risk-reward profiles.',
      },
      {
        id: '3',
        issue: 'What should our strategy be for the next 5 years?',
        rationale: 'Comprehensive strategic question.',
        isGood: false,
        whyGoodOrBad: 'TOO VAGUE: This is a general inquiry, not a focal issue. Narrow it to a specific decision.',
      },
    ]

    setGeneratedIssues(contextualIssues.sort(() => Math.random() - 0.5))
    setIsGeneratingFocalIssues(false)
  }

  const handleIndustrySelect = (industryId: string) => {
    setIndustry(industryId)
    setShowCustomIndustry(false)
    setStep('organization')
  }

  const handleCustomIndustrySubmit = () => {
    if (customIndustry.trim()) {
      setIndustry(`custom:${customIndustry.trim()}`)
      setStep('organization')
    }
  }

  const handleOrganizationSelect = (orgType: string) => {
    setOrganizationType(orgType)
    setStep('stakeholder')
  }

  // Auto-derive planning horizon from stakeholder perspective
  const STAKEHOLDER_HORIZONS: Record<StakeholderPerspective, number> = {
    'board-promoter': 10,   // Board thinks in decades
    'ceo-md': 7,            // CEO/MD: medium-long term
    'bu-head': 5,           // BU Head: medium term
    'strategy-team': 5,     // Strategy team: analysis horizon
  }

  const handleStakeholderSelect = (perspective: StakeholderPerspective) => {
    setStakeholderPerspective(perspective)
    setTimeHorizon(STAKEHOLDER_HORIZONS[perspective])  // Auto-set based on role
    generateFocalIssues()
    setStep('focal-issue')
  }

  const toggleRevealIssue = (issueId: string) => {
    setRevealedIssues((prev) => {
      const next = new Set(prev)
      next.has(issueId) ? next.delete(issueId) : next.add(issueId)
      return next
    })
  }

  const handleIssueSelect = (issue: GeneratedFocalIssue) => {
    if (!issue.isGood) {
      setRevealedIssues((prev) => new Set(prev).add(issue.id))
      return
    }
    setSelectedIssueId(issue.id)
    setFocalIssue(issue.issue)
  }

  const handleCustomIssue = () => {
    if (customIssue.trim()) {
      setFocalIssue(customIssue.trim())
      setSelectedIssueId('custom')
    }
  }

  const handleRefineIssue = () => {
    if (refinementInput.trim()) {
      setFocalIssueRefinement(refinementInput.trim())
    }
  }

  const handleComplete = () => {
    completeMainPhase('discover')
    setCurrentStep('forces')
    router.push('/simulation/design/forces')
  }

  const groupedModifiers = useMemo(() => {
    const groups: Record<string, typeof CONTEXT_MODIFIERS> = {}
    CONTEXT_MODIFIERS.forEach((mod) => {
      if (!groups[mod.category]) groups[mod.category] = []
      groups[mod.category].push(mod)
    })
    return groups
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  }

  // Step navigation helpers
  const canGoBack = step !== 'industry'
  const canContinue =
    (step === 'focal-issue' && focalIssue) ||
    (step === 'modifiers') ||
    (step === 'summary')

  const handleBack = () => {
    const stepOrder: Step[] = ['industry', 'organization', 'stakeholder', 'focal-issue', 'modifiers', 'summary']
    const currentIndex = stepOrder.indexOf(step)
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1])
    }
  }

  const handleContinue = () => {
    if (step === 'focal-issue') setStep('modifiers')
    else if (step === 'modifiers') setStep('summary')
    else if (step === 'summary') handleComplete()
  }

  const handleGoHome = () => {
    if (window.confirm('Going home will reset all your progress. Continue?')) {
      resetSimulation()
      router.push('/')
    }
  }

  return (
    <div>
      {/* Progress bar + Navigation - all in one row */}
      <div className="flex items-center gap-4 mb-4">
        <ProgressBar current={stepIndex} total={6} />

        {/* All nav buttons side by side - button style */}
        <div className="flex items-center gap-2 ml-auto">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
          {canContinue && (
            <button
              onClick={handleContinue}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-900 bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors"
            >
              {step === 'summary' ? 'Continue' : step === 'modifiers' ? 'Review' : 'Continue'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 bg-slate-800 hover:bg-slate-700 border border-gold-500/30 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
          {step === 'industry' && (
            <motion.div key="industry" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <p className="text-slate-400 text-sm mb-3">Choose the sector that best describes your organisation.</p>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => handleIndustrySelect(ind.id)}
                    className={cn(
                      'text-left p-2.5 rounded-lg border-2 transition-all hover:shadow-md',
                      industry === ind.id
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    )}
                  >
                    <div className="mb-1.5">
                      {(() => {
                        const IconComponent = INDUSTRY_ICONS[ind.icon]
                        return IconComponent ? (
                          <IconComponent className="w-5 h-5 text-gold-400" />
                        ) : (
                          <Building className="w-5 h-5 text-gold-400" />
                        )
                      })()}
                    </div>
                    <div className="font-medium text-white text-xs leading-tight">{ind.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{ind.description}</div>
                  </button>
                ))}

                <button
                  onClick={() => setShowCustomIndustry(true)}
                  className={cn(
                    'text-left p-2.5 rounded-lg border-2 border-dashed transition-all hover:shadow-md',
                    showCustomIndustry
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <Plus className="w-5 h-5 text-slate-400 mb-1.5" />
                  <div className="font-medium text-white text-xs">Other</div>
                  <div className="text-[10px] text-slate-400">Type your own</div>
                </button>
              </div>

              {showCustomIndustry && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      placeholder="e.g., Aerospace, Hospitality, Logistics..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-800"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleCustomIndustrySubmit} disabled={!customIndustry.trim()}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'organization' && (
            <motion.div key="organization" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <p className="text-slate-400 text-sm mb-3">This affects decision timelines and governance dynamics.</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {ORGANIZATION_TYPES.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleOrganizationSelect(org.id)}
                    className={cn(
                      'text-left p-3 rounded-lg border-2 transition-all hover:shadow-md',
                      organizationType === org.id
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    )}
                  >
                    <div className="font-semibold text-white text-sm mb-0.5">{org.name}</div>
                    <div className="text-xs text-slate-400 mb-1">{org.description}</div>
                    {org.decisionStyle && (
                      <div className="text-[10px] text-slate-500 italic">{org.decisionStyle}</div>
                    )}
                  </button>
                ))}
              </div>

            </motion.div>
          )}

          {step === 'stakeholder' && (
            <motion.div key="stakeholder" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <p className="text-slate-400 text-sm mb-3">The scope changes based on who is planning.</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {(Object.entries(STAKEHOLDER_LABELS) as [StakeholderPerspective, typeof STAKEHOLDER_LABELS[StakeholderPerspective]][]).map(
                  ([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleStakeholderSelect(key)}
                      className={cn(
                        'text-left p-3 rounded-lg border-2 transition-all hover:shadow-md',
                        stakeholderPerspective === key
                          ? 'border-gold-500 bg-gold-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <div className="font-semibold text-white text-sm mb-0.5">{value.label}</div>
                      <div className="text-xs text-slate-400">{value.description}</div>
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}

          {step === 'focal-issue' && (
            <motion.div key="focal-issue" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <p className="text-slate-400 text-sm mb-3">
                The focal issue is the <strong className="text-slate-300">specific decision</strong> you're exploring over a <strong className="text-gold-400">{timeHorizon}-year</strong> horizon.
              </p>

              {isGeneratingFocalIssues ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-gold-400 mr-2" />
                  <span className="text-slate-400 text-sm">Generating options...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div
                    className={cn(
                      'rounded-xl border-2 border-dashed p-3 transition-all cursor-pointer',
                      isEditingIssue
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-slate-600 bg-slate-800/50 hover:border-gold-500/60 hover:bg-gold-500/10/50'
                    )}
                    onClick={() => !isEditingIssue && setIsEditingIssue(true)}
                  >
                    {!isEditingIssue ? (
                      <div className="flex items-center gap-2 text-gold-400">
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Write your own focal issue</span>
                      </div>
                    ) : (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={customIssue}
                          onChange={(e) => setCustomIssue(e.target.value)}
                          placeholder="E.g., Should we shift from project-based to subscription model?"
                          className="w-full p-2 border border-gold-500/30 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-800"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleCustomIssue} disabled={!customIssue.trim()} className="h-7 text-xs">
                            Use this
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setIsEditingIssue(false); setCustomIssue('') }} className="h-7 text-xs">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {generatedIssues.slice(0, 5).map((issue) => {
                    const isRevealed = revealedIssues.has(issue.id)
                    const isSelected = selectedIssueId === issue.id

                    return (
                      <motion.div
                        key={issue.id}
                        layout
                        className={cn(
                          'rounded-xl border-2 p-3 transition-all cursor-pointer',
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10'
                            : isRevealed
                            ? issue.isGood
                              ? 'border-gold-500/50 bg-gold-500/5'
                              : 'border-slate-500/50 bg-slate-600/20'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                        )}
                        onClick={() => {
                          if (!isRevealed) toggleRevealIssue(issue.id)
                          else if (issue.isGood) handleIssueSelect(issue)
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                              isSelected
                                ? 'bg-gold-500 text-slate-900'
                                : isRevealed
                                ? issue.isGood
                                  ? 'bg-gold-500/20 text-gold-400'
                                  : 'bg-slate-500/20 text-slate-400'
                                : 'bg-slate-700 text-slate-400'
                            )}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3" />
                            ) : isRevealed ? (
                              issue.isGood ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />
                            ) : (
                              <HelpCircle className="w-2.5 h-2.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm leading-tight">{issue.issue}</p>

                            {isRevealed && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={cn(
                                  'mt-2 pt-2 border-t text-xs',
                                  issue.isGood ? 'border-gold-500/30 text-gold-400' : 'border-slate-500/30 text-slate-400'
                                )}
                              >
                                {issue.whyGoodOrBad}
                                {issue.isGood && !isSelected && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleIssueSelect(issue)
                                    }}
                                    className="mt-3 px-3 py-1.5 text-xs font-medium text-slate-900 bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors flex items-center gap-1.5"
                                  >
                                    <Check className="w-3 h-3" />
                                    Use this issue
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {!isGeneratingFocalIssues && (
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                  <span>Click cards to reveal feedback</span>
                  <button
                    onClick={generateFocalIssues}
                    className="hover:text-slate-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              )}

              {focalIssue && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 bg-gold-500/10 border border-gold-500/30 rounded-lg p-2"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 font-medium text-sm leading-tight">{focalIssue}</p>
                      <input
                        type="text"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        onBlur={handleRefineIssue}
                        placeholder="Add context (optional)..."
                        className="mt-1.5 w-full px-2 py-1 border border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 bg-slate-800/50 text-slate-200 placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {step === 'modifiers' && (
            <motion.div key="modifiers" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <p className="text-slate-400 text-sm mb-3">
                What makes YOUR company different? Select tags that describe your unique position—these filter out generic scenarios and surface forces that actually matter to you.
              </p>

              {Object.entries(groupedModifiers).map(([category, mods]) => (
                <div key={category} className="mb-3">
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {mods.map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() => toggleModifier(mod.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                          modifiers.includes(mod.id)
                            ? 'bg-gold-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        )}
                      >
                        {mod.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mb-3 pt-2 border-t border-slate-700">
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Own Modifiers
                </h3>
                <p className="text-[10px] text-slate-500 mb-2">
                  Something unique about your company? Add it here.
                </p>

                {customModifiers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {customModifiers.map((mod) => (
                      <span
                        key={mod}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-gold-600 text-white flex items-center gap-1"
                      >
                        {mod}
                        <button onClick={() => removeCustomModifier(mod)} className="hover:bg-gold-700 rounded-full p-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customModifierInput}
                    onChange={(e) => setCustomModifierInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomModifier()}
                    placeholder="e.g., First-mover in tier-2 cities..."
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-slate-800"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCustomModifier}
                    disabled={!customModifierInput.trim()}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            </motion.div>
          )}

          {step === 'summary' && (
            <motion.div key="summary" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-4 mb-4 flex-1">
                <div className="prose prose-invert max-w-none">
                  <p className="text-base leading-relaxed mb-2">
                    As the{' '}
                    <span className="text-amber-400 font-semibold">
                      {stakeholderPerspective && STAKEHOLDER_LABELS[stakeholderPerspective]?.label}
                    </span>{' '}
                    of a{' '}
                    <span className="text-amber-400 font-semibold">
                      {ORGANIZATION_TYPES.find((o) => o.id === organizationType)?.name}
                    </span>{' '}
                    in{' '}
                    <span className="text-amber-400 font-semibold">
                      {industry?.startsWith('custom:')
                        ? industry.replace('custom:', '')
                        : INDUSTRIES.find((i) => i.id === industry)?.name}
                    </span>
                    , you're exploring:
                  </p>

                  <div className="bg-slate-800/50 rounded-lg p-3 mb-2">
                    <p className="text-lg font-semibold text-white leading-snug mb-0">
                      "{focalIssue}"
                    </p>
                    <p className="text-slate-400 text-sm mt-1 mb-0">
                      over a <span className="text-white font-medium">{timeHorizon}-year</span> horizon
                    </p>
                  </div>

                  {focalIssueRefinement && (
                    <p className="text-slate-400 text-xs italic border-l-2 border-slate-600 pl-2 mb-0">
                      {focalIssueRefinement}
                    </p>
                  )}

                  {(modifiers.length > 0 || customModifiers.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-slate-400 text-sm mb-2">Your company's defining characteristics:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {modifiers.map((mod) => (
                          <span key={mod} className="px-2.5 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-medium border border-gold-400/30">
                            {CONTEXT_MODIFIERS.find((m) => m.id === mod)?.label}
                          </span>
                        ))}
                        {customModifiers.map((mod) => (
                          <span key={mod} className="px-2.5 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-medium border border-gold-400/30">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <p className="mb-0">Once locked, these selections can't be changed.</p>
                <button
                  onClick={() => {
                    setStep('industry')
                    setCustomModifiers([])
                  }}
                  className="text-slate-400 hover:text-slate-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Start over
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:flex lg:flex-col mt-8">
          <LearningSidebar
            {...LEARNING_CONTENT[step]}
            {...(step === 'summary' ? {
              journeyRecap: {
                industry: industry?.startsWith('custom:')
                  ? industry.replace('custom:', '')
                  : INDUSTRIES.find((i) => i.id === industry)?.name || 'Not selected',
                organization: ORGANIZATION_TYPES.find((o) => o.id === organizationType)?.name || 'Not selected',
                stakeholder: stakeholderPerspective ? STAKEHOLDER_LABELS[stakeholderPerspective]?.label : 'Not selected',
                focalIssue: focalIssue || 'Not defined',
                modifiers: [
                  ...modifiers.map(mod => CONTEXT_MODIFIERS.find((m) => m.id === mod)?.label || mod),
                  ...customModifiers
                ],
                nextStep: 'Scan for driving forces'
              }
            } : {})}
          />
        </div>
      </div>
    </div>
  )
}
