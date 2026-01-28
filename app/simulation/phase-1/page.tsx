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
  Clock,
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
} from 'lucide-react'

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

// Learning sidebar component - contextual, relevant content per step
// Comparison tile for org types
interface ComparisonTile {
  label: string
  horizon: string
  dynamic: string
  icon: string
  learnWhyPrompt?: string // ChatGPT prompt for "Learn why?"
}

// Mini article for deep-dive content
interface MiniArticle {
  title: string
  author: string
  readTime: string
  sections: { heading: string; content: string }[]
  buttonText: string
}

interface LearningSidebarProps {
  title: string
  whyItMatters: string
  learnMore?: string // Expandable deeper insight
  microCase?: {
    company: string
    story: string
    explorePrompt: string // Rich ChatGPT prompt for the takeaway
    exploreLinkText: string // Text that becomes the link
  }
  comparisonTiles?: ComparisonTile[] // Horizontally scrollable comparison tiles
  miniArticle?: MiniArticle // Pop-up article modal
  tip?: string
}

function LearningSidebar({ title, whyItMatters, learnMore, microCase, comparisonTiles, miniArticle, tip }: LearningSidebarProps) {
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [showArticle, setShowArticle] = useState(false)

  return (
    <>
      <div className="space-y-4">
        {/* Why this matters */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium text-sm mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Why this matters
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{whyItMatters}</p>

            {learnMore && (
              <>
                <button
                  onClick={() => setShowLearnMore(!showLearnMore)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2 flex items-center gap-1"
                >
                  {showLearnMore ? 'Show less' : 'Learn more'}
                  <ChevronDown className={cn('w-3 h-3 transition-transform', showLearnMore && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {showLearnMore && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200 leading-relaxed">
                        {learnMore}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Mini Article Button - integrated at bottom */}
          {miniArticle && (
            <button
              onClick={() => setShowArticle(true)}
              className="w-full bg-indigo-50 border-t border-indigo-100 px-4 py-3 text-left hover:bg-indigo-100 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">{miniArticle.buttonText}</span>
                </div>
                <span className="text-xs text-indigo-500">{miniArticle.readTime}</span>
              </div>
            </button>
          )}
        </div>

        {/* Horizontally scrollable comparison tiles */}
        {comparisonTiles && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide px-1">
              Planning horizons at a glance
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-slate-300">
              {comparisonTiles.map((tile, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 bg-white rounded-lg border border-slate-200 p-3 hover:border-indigo-300 transition-colors"
                >
                  <div className="text-lg mb-1">{tile.icon}</div>
                  <div className="text-xs font-semibold text-slate-800 mb-1 leading-tight">{tile.label}</div>
                  <div className="text-xs text-indigo-600 font-medium">{tile.horizon}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">{tile.dynamic}</div>
                  {tile.learnWhyPrompt && (
                    <a
                      href={`https://chat.openai.com/?q=${encodeURIComponent(tile.learnWhyPrompt)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 mt-2 font-medium"
                    >
                      Learn why? <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-world micro-case with ChatGPT takeaway link */}
        {microCase && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-2">
              <Building className="w-4 h-4" />
              Real case: {microCase.company}
            </div>
            <p className="text-sm text-slate-700 mb-3">{microCase.story}</p>

            {/* Takeaway as ChatGPT link */}
            <a
              href={`https://chat.openai.com/?q=${encodeURIComponent(microCase.explorePrompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium group"
            >
              <span className="underline decoration-blue-300 group-hover:decoration-blue-500">
                {microCase.exploreLinkText}
              </span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
            </a>
          </div>
        )}

        {/* Quick tip */}
        {tip && (
          <div className="flex items-start gap-2 text-sm text-slate-500 bg-amber-50 border border-amber-100 rounded-lg p-3">
            <span className="text-amber-500">💡</span>
            <span>{tip}</span>
          </div>
        )}
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-slate-900 text-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{miniArticle.title}</h2>
                    <span className="text-xs text-slate-400">{miniArticle.readTime} read</span>
                  </div>
                  <button
                    onClick={() => setShowArticle(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] prose prose-sm prose-slate">
                {miniArticle.sections.map((section, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <h3 className="text-base font-semibold text-slate-800 mb-2">{section.heading}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <button
                  onClick={() => setShowArticle(false)}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Got it, let's craft my focal issue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Step-specific learning content with rich prompts
const LEARNING_CONTENT: Record<Step, LearningSidebarProps> = {
  industry: {
    title: 'Industry Selection',
    whyItMatters: 'Different industries face different driving forces. A bank worries about regulation and fintech; a manufacturer worries about supply chains and automation.',
    learnMore: 'The industry you choose determines your "scenario vocabulary" - the forces, uncertainties, and possibilities you\'ll consider. A wrong industry frame can make you blind to the most important disruptions. This is why Shell saw the oil crisis coming while others didn\'t - they thought as energy system players, not just oil companies.',
    microCase: {
      company: 'Shell vs Nokia',
      story: 'Shell\'s famous 1970s scenarios predicted oil shocks because they understood energy industry forces. Nokia missed smartphone disruption because they thought as a hardware company, not as part of a software ecosystem.',
      explorePrompt: `Tell me the fascinating story of how Royal Dutch Shell invented scenario planning in the 1970s. I want to understand:

1. Who was Pierre Wack and what was his genius insight about "gentle art of reperceiving"?
2. How did Shell identify the "predetermined elements" vs "critical uncertainties" in the oil market?
3. The dramatic story of how Shell's scenarios predicted the 1973 oil crisis when every other company was blindsided
4. What was Wack's key insight about "changing the mental models of decision makers" rather than predicting the future?
5. How this differs from traditional forecasting and why most companies still get it wrong

Make it engaging - I want to feel like I'm learning a secret that transformed how the best strategists think about the future.`,
      exploreLinkText: 'Explore how Shell invented scenario planning →',
    },
    tip: 'If you operate across sectors, pick the one most relevant to your current strategic question.',
  },
  organization: {
    title: 'Organization Type',
    whyItMatters: 'A family business can think in generations; a PE-backed company thinks in exit timelines. This fundamentally changes what "long-term" means.',
    comparisonTiles: [
      {
        label: 'Family Business',
        horizon: '20-50+ years',
        dynamic: 'Succession, legacy, relationship-driven',
        icon: '👨‍👩‍👧‍👦',
        learnWhyPrompt: 'Why do Indian family businesses like Tata, Birla, and Godrej think in 50-100 year horizons? Give me 3 specific strategic bets they made that would be impossible for a PE-backed company. How does succession planning change their scenario thinking?'
      },
      {
        label: 'PE/VC-backed',
        horizon: '5-7 years',
        dynamic: 'Exit pressure, milestone gates',
        icon: '📈',
        learnWhyPrompt: 'How does the 5-7 year exit timeline of PE/VC investors fundamentally change strategic planning? Give me examples from Flipkart, Ola, or Byju\'s where exit pressure shaped (or distorted) their strategic choices. What scenarios can\'t they plan for?'
      },
      {
        label: 'MNC Subsidiary',
        horizon: '3-5 years',
        dynamic: 'HQ alignment, local autonomy tension',
        icon: '🌐',
        learnWhyPrompt: 'What unique strategic tensions do MNC subsidiaries in India face? Give me examples of how companies like Google India, Amazon India, or Unilever India navigate the "global playbook vs local reality" tension. What scenarios do they miss because of HQ blind spots?'
      },
      {
        label: 'Listed Enterprise',
        horizon: 'Quarterly + 3-5yr',
        dynamic: 'Analyst scrutiny, ESG pressure',
        icon: '📊',
        learnWhyPrompt: 'How does quarterly analyst pressure distort long-term strategic thinking for listed Indian companies? Give me examples where companies like Infosys or HDFC made decisions to please analysts that hurt long-term scenarios. How is ESG pressure changing this?'
      },
      {
        label: 'Startup/Scale-up',
        horizon: '18-36 months',
        dynamic: 'Runway-driven, pivot ability',
        icon: '🚀',
        learnWhyPrompt: 'How does runway pressure (18-36 months of cash) change how Indian startups think about scenarios? Give me examples of pivots that only worked because of short planning horizons. What long-term threats do startups systematically ignore?'
      },
      {
        label: 'PSU/Government',
        horizon: 'Policy cycles',
        dynamic: 'CAG oversight, social mandate',
        icon: '🏛️',
        learnWhyPrompt: 'How do PSUs like ONGC, SBI, or Coal India approach scenario planning differently because of CAG oversight and social mandates? What strategic moves can they NOT make that private companies can? How do political cycles affect their planning horizons?'
      },
    ],
    tip: 'Your org type determines not just HOW FAR you plan, but what risks you can take.',
  },
  stakeholder: {
    title: 'Stakeholder Perspective',
    whyItMatters: 'A board asks "Should we be in this business?" A BU head asks "How do we win in this market?" Same company, different scope.',
    learnMore: 'Your decision authority determines what questions you can meaningfully address. A BU head planning "Should we exit this industry?" is wasting time - that\'s a board decision. Conversely, a board debating "Which CRM system to use?" is micromanaging. Match your focal issue to your actual decision authority.',
    comparisonTiles: [
      {
        label: 'Board/Promoter',
        horizon: 'Portfolio & existence',
        dynamic: '"Should we be in this business at all?"',
        icon: '👔',
        learnWhyPrompt: 'What kind of strategic questions should an Indian company board be asking vs delegating to management? Give me examples of when Tata or Reliance boards made existential portfolio decisions (enter/exit businesses). What scenarios should boards worry about that CEOs miss?'
      },
      {
        label: 'CEO/MD',
        horizon: 'Enterprise strategy',
        dynamic: '"Where do we play & how do we win?"',
        icon: '🎯',
        learnWhyPrompt: 'What strategic questions are uniquely CEO/MD territory in Indian companies? Give me examples of "where to play and how to win" decisions from leaders like N Chandrasekaran (Tata), Mukesh Ambani (Reliance), or Salil Parekh (Infosys). What\'s the right scope for a CEO\'s scenarios?'
      },
      {
        label: 'BU Head',
        horizon: 'Market competition',
        dynamic: '"How do we beat competitors here?"',
        icon: '⚔️',
        learnWhyPrompt: 'What strategic questions should a BU Head in an Indian company focus on vs escalate to CEO? Give me examples of market-level competitive scenarios. What happens when BU heads try to answer board-level questions or vice versa? Why does scope mismatch kill scenario exercises?'
      },
      {
        label: 'Function Head',
        horizon: 'Capability building',
        dynamic: '"What capabilities do we need?"',
        icon: '🔧',
        learnWhyPrompt: 'What strategic scenarios should a Function Head (HR, Tech, Finance) in India plan for? Give me examples of capability-building decisions that were strategic vs operational. When does a function head\'s scenario planning add real value vs become ivory tower planning?'
      },
    ],
    tip: 'Choose the perspective that matches your actual decision-making authority.',
  },
  'focal-issue': {
    title: 'Focal Issue',
    whyItMatters: 'The focal issue is THE decision you\'re exploring. Get this wrong and your scenarios will be interesting but useless.',
    miniArticle: {
      title: 'The Art of Framing Your Focal Issue',
      author: 'In the style of Peter Schwartz',
      readTime: '3 min',
      buttonText: 'Read before you choose →',
      sections: [
        {
          heading: 'What is a Focal Issue?',
          content: `The focal issue is not a topic, not an area of interest, not even a problem. It is a specific decision that someone in your organisation will actually have to make.

"Digital transformation" is not a focal issue. "Should we build or buy our AI capabilities over the next 3 years?" is.

The difference is crucial: topics generate interesting discussions; decisions demand scenarios that illuminate the path forward.`
        },
        {
          heading: 'Hallmarks of a Good Focal Issue',
          content: `✓ Specific and actionable — Someone can say "yes" or "no" to it
✓ Genuinely uncertain — The answer isn't obvious in all futures
✓ Consequential — Getting it wrong would significantly hurt the organisation
✓ Timely — The decision window is open now, not in 5 years
✓ Within your authority — You can actually influence this decision

The best focal issues create what I call "productive discomfort" — they force you to confront futures you'd rather not think about.`
        },
        {
          heading: 'Red Flags: Signs of a Bad Focal Issue',
          content: `✗ Too vague: "What should our strategy be?" — This is everything and nothing
✗ Too narrow: "Which vendor for CRM?" — Scenarios won't help here
✗ Predetermined answer: "Should we adopt AI?" — If it's yes in all scenarios, it's not uncertain
✗ Outside your control: "Will interest rates rise?" — You can't decide this
✗ Retrospective: "Did we make the right acquisition?" — The decision is past

If your focal issue fails these tests, your scenarios will be intellectually stimulating but strategically useless.`
        },
        {
          heading: 'The Craft of Framing',
          content: `The way you frame the question determines what you see. Kodak asked "How do we sell more film?" and missed digital photography. They should have asked "How should we participate in image capture?"

Your frame is a lens. Choose it carefully. Ask yourself:
• Am I framing this around my current business, or the customer need?
• Am I assuming continuity when disruption is possible?
• Would my fiercest competitor frame it the same way?

The right focal issue, well-framed, is half the battle won.`
        }
      ]
    },
    microCase: {
      company: 'Kodak',
      story: 'Kodak asked "How do we sell more film?" instead of "How should we participate in image capture?" The narrow framing meant their scenarios missed digital photography entirely - even though they invented the digital camera.',
      explorePrompt: `Tell me the tragic strategic story of Kodak - but focus on the FRAMING mistake, not just "they missed digital":

1. What was Kodak's actual focal issue in their strategic planning? Why was it fatally narrow?
2. The irony: Kodak INVENTED the digital camera in 1975. How did their focal issue framing make them dismiss their own invention?
3. What should their focal issue have been? How would different framing have changed their scenarios?
4. Are there Indian companies making similar framing mistakes RIGHT NOW? (Give me specific examples)
5. How do I test if MY focal issue is too narrow? What questions should I ask?

I want to understand this at a deep level so I don't make the same mistake. Make me feel the tragedy of asking the wrong question.`,
      exploreLinkText: 'Explore how Kodak\'s wrong question killed them →',
    },
    tip: 'Test: Could you imagine scenarios where the opposite answer is correct? If not, it\'s not uncertain enough.',
  },
  modifiers: {
    title: 'Context Modifiers',
    whyItMatters: 'The same industry force affects companies differently. "AI disruption" is an opportunity for a digital-native company but an existential threat for one with legacy systems. Your modifiers tell us which version of each force to focus on.',
    learnMore: 'Think of modifiers as filters. Without them, you get generic scenarios that could apply to any company in your industry. With them, you get scenarios specific to YOUR strategic reality - your financial position, market focus, operational model, and regulatory context.',
    tip: 'Select 2-3 that most define your strategic reality. If you\'re unsure, pick the ones that would most change how a trend affects you.',
  },
  summary: {
    title: 'Mission Briefing',
    whyItMatters: 'You\'ve defined the decision, context, and scope. Next, we\'ll scan for forces that could shape how this plays out.',
    learnMore: 'The foundation you\'ve built - focal issue, industry context, stakeholder perspective, and modifiers - will shape everything that follows. In environmental scanning, we\'ll identify PESTEL forces. In scenario building, we\'ll combine uncertainties. But all of it traces back to these foundational choices.',
  },
}

// Progress indicator
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 w-8 rounded-full transition-colors',
              i < current ? 'bg-indigo-600' : i === current ? 'bg-indigo-300' : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">
        {current + 1} of {total}
      </span>
    </div>
  )
}

export default function Phase1Page() {
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
  const [showModifierCase, setShowModifierCase] = useState(false)
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
    setPhase,
    completePhase,
    startSession,
    isGeneratingFocalIssues,
    setIsGeneratingFocalIssues,
  } = useSimulationStore()

  const stepIndex = ['industry', 'organization', 'stakeholder', 'focal-issue', 'modifiers', 'summary'].indexOf(step)

  useEffect(() => {
    setPhase(1)
    startSession()
  }, [setPhase, startSession])

  // Generate focal issues with mix of good and bad
  const generateFocalIssues = async () => {
    setIsGeneratingFocalIssues(true)
    setRevealedIssues(new Set())
    setSelectedIssueId(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const contextualIssues: GeneratedFocalIssue[] = [
      // GOOD
      {
        id: '1',
        issue: `Should we invest in building our own ${industry === 'it-services' ? 'AI/ML capabilities' : industry === 'consumer-retail' ? 'D2C platform' : industry === 'manufacturing' ? 'smart factory infrastructure' : 'digital capabilities'} or partner with specialists?`,
        rationale: `Build vs buy decision with clear alternatives.`,
        isGood: true,
        whyGoodOrBad: 'Specific, actionable, has clear alternatives, forces trade-off thinking.',
      },
      {
        id: '2',
        issue: `Should we prioritise ${industry === 'bfsi' ? 'rural financial inclusion' : industry === 'consumer-retail' ? 'tier-2/3 expansion' : industry === 'it-services' ? 'GCC business' : 'new markets'} or deepen metro penetration?`,
        rationale: `Growth strategy with resource implications.`,
        isGood: true,
        whyGoodOrBad: 'Clear choice between two valid paths with different risk-reward profiles.',
      },
      {
        id: '3',
        issue: `Given ${industry === 'manufacturing' ? 'China+1' : industry === 'bfsi' ? 'fintech disruption' : 'competitive dynamics'}, should we pursue expansion or operational resilience?`,
        rationale: `Response to disruption.`,
        isGood: true,
        whyGoodOrBad: 'Specific force tied to clear strategic options.',
      },
      // BAD - Too vague
      {
        id: '4',
        issue: `What should our strategy be for the next 5 years?`,
        rationale: `Comprehensive strategic question.`,
        isGood: false,
        whyGoodOrBad: 'TOO VAGUE: This is a general inquiry, not a focal issue. Narrow it to a specific decision you need to make.',
      },
      {
        id: '5',
        issue: `How do we become more competitive?`,
        rationale: `Broad competitiveness question.`,
        isGood: false,
        whyGoodOrBad: 'TOO VAGUE: "Competitive" could mean anything. What specific decision would make you competitive?',
      },
      // BAD - Prediction
      {
        id: '6',
        issue: `Will AI replace most of our workforce?`,
        rationale: `AI impact question.`,
        isGood: false,
        whyGoodOrBad: 'PREDICTION: This frames the future as something to predict, not a choice to make. Reframe as a decision: "How should we restructure given AI automation possibilities?"',
      },
      // BAD - Too narrow
      {
        id: '7',
        issue: `Should we hire 15 or 25 engineers this quarter?`,
        rationale: `Staffing decision.`,
        isGood: false,
        whyGoodOrBad: 'TOO NARROW: This is tactical and near-term. Scenario planning is for strategic choices spanning years, not quarterly headcount.',
      },
      // GOOD
      {
        id: '8',
        issue: `Should we ${organizationType === 'family-business' ? 'professionalise management and bring outside leadership' : organizationType === 'pe-vc-backed' ? 'pursue profitability or prioritise growth' : 'restructure our operating model'} given margin pressures?`,
        rationale: `Organisational transformation.`,
        isGood: true,
        whyGoodOrBad: 'Specific choice with clear alternatives and strategic implications.',
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

  const handleStakeholderSelect = (perspective: StakeholderPerspective) => {
    setStakeholderPerspective(perspective)
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
    completePhase(1)
    setPhase(2)
    router.push('/simulation/phase-2')
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Progress */}
        <div className="mb-6">
          <ProgressBar current={stepIndex} total={6} />
        </div>

        <AnimatePresence mode="wait">
          {/* INDUSTRY SELECTION */}
          {step === 'industry' && (
            <motion.div key="industry" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Select your industry</h1>
              <p className="text-slate-600 mb-6">
                Choose the sector that best describes your organisation.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => handleIndustrySelect(ind.id)}
                    className={cn(
                      'text-left p-4 rounded-xl border-2 transition-all hover:shadow-md',
                      industry === ind.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <div className="text-2xl mb-2">{ind.icon}</div>
                    <div className="font-medium text-slate-900 text-sm">{ind.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{ind.description}</div>
                  </button>
                ))}

                {/* Custom option */}
                <button
                  onClick={() => setShowCustomIndustry(true)}
                  className={cn(
                    'text-left p-4 rounded-xl border-2 border-dashed transition-all hover:shadow-md',
                    showCustomIndustry
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  )}
                >
                  <Plus className="w-6 h-6 text-slate-400 mb-2" />
                  <div className="font-medium text-slate-900 text-sm">Other</div>
                  <div className="text-xs text-slate-500">Type your own</div>
                </button>
              </div>

              {showCustomIndustry && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4"
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      placeholder="e.g., Aerospace, Hospitality, Logistics..."
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <Button onClick={handleCustomIndustrySubmit} disabled={!customIndustry.trim()}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ORGANIZATION TYPE */}
          {step === 'organization' && (
            <motion.div key="organization" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">What type of organisation?</h1>
              <p className="text-slate-600 mb-6">
                This affects decision timelines and governance dynamics.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {ORGANIZATION_TYPES.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleOrganizationSelect(org.id)}
                    className={cn(
                      'text-left p-5 rounded-xl border-2 transition-all hover:shadow-md',
                      organizationType === org.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <div className="font-semibold text-slate-900 mb-1">{org.name}</div>
                    <div className="text-sm text-slate-500 mb-2">{org.description}</div>
                    {org.decisionStyle && (
                      <div className="text-xs text-slate-400 italic">{org.decisionStyle}</div>
                    )}
                  </button>
                ))}
              </div>

              <Button variant="ghost" onClick={() => setStep('industry')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
          )}

          {/* STAKEHOLDER PERSPECTIVE */}
          {step === 'stakeholder' && (
            <motion.div key="stakeholder" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Whose perspective?</h1>
              <p className="text-slate-600 mb-6">
                The scope changes based on who is planning.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {(Object.entries(STAKEHOLDER_LABELS) as [StakeholderPerspective, typeof STAKEHOLDER_LABELS[StakeholderPerspective]][]).map(
                  ([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleStakeholderSelect(key)}
                      className={cn(
                        'text-left p-5 rounded-xl border-2 transition-all hover:shadow-md',
                        stakeholderPerspective === key
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className="font-semibold text-slate-900 mb-1">{value.label}</div>
                      <div className="text-sm text-slate-500">{value.description}</div>
                    </button>
                  )
                )}
              </div>

              <Button variant="ghost" onClick={() => setStep('organization')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
          )}

          {/* FOCAL ISSUE */}
          {step === 'focal-issue' && (
            <motion.div key="focal-issue" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Define your focal issue</h1>
              <p className="text-slate-600 mb-4">
                The focal issue is the <strong>specific decision</strong> you're exploring.
              </p>

              {/* Time Horizon */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <Clock className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700">Planning horizon</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 5)}
                    className="w-16 p-2 text-center border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-600">years</span>
                </div>
              </div>

              {/* Generated Issues */}
              {isGeneratingFocalIssues ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
                  <span className="text-slate-500 text-sm">Generating options...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Write your own - prominent placement */}
                  <div
                    className={cn(
                      'rounded-xl border-2 border-dashed p-3 transition-all cursor-pointer',
                      isEditingIssue
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
                    )}
                    onClick={() => !isEditingIssue && setIsEditingIssue(true)}
                  >
                    {!isEditingIssue ? (
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Write your own focal issue</span>
                      </div>
                    ) : (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={customIssue}
                          onChange={(e) => setCustomIssue(e.target.value)}
                          placeholder="E.g., Should we shift from project-based to subscription model?"
                          className="w-full p-2 border border-indigo-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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

                  {/* Generated issues - compact cards */}
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
                            ? 'border-emerald-500 bg-emerald-50'
                            : isRevealed
                            ? issue.isGood
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : 'border-red-200 bg-red-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
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
                                ? 'bg-emerald-500 text-white'
                                : isRevealed
                                ? issue.isGood
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : 'bg-red-100 text-red-600'
                                : 'bg-slate-100 text-slate-400'
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
                            <p className="font-medium text-slate-900 text-sm leading-tight">{issue.issue}</p>

                            {isRevealed && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={cn(
                                  'mt-2 pt-2 border-t text-xs',
                                  issue.isGood ? 'border-emerald-200 text-emerald-700' : 'border-red-200 text-red-700'
                                )}
                              >
                                {issue.whyGoodOrBad}
                                {issue.isGood && !isSelected && (
                                  <Button
                                    size="sm"
                                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 h-6 text-xs px-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleIssueSelect(issue)
                                    }}
                                  >
                                    Select
                                  </Button>
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

              {/* Regenerate button */}
              {!isGeneratingFocalIssues && (
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                  <span>Click cards to reveal feedback</span>
                  <button
                    onClick={generateFocalIssues}
                    className="hover:text-slate-700 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              )}

              {/* Selected Issue - compact */}
              {focalIssue && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <Check className="w-4 h-4" />
                    <span className="font-medium text-xs">Selected</span>
                  </div>
                  <p className="text-slate-800 font-medium text-sm">{focalIssue}</p>

                  <div className="mt-2 pt-2 border-t border-emerald-200">
                    <input
                      type="text"
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                      onBlur={handleRefineIssue}
                      placeholder="Add context (optional): e.g., We have 3 years of runway..."
                      className="w-full p-2 border border-emerald-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                    {focalIssueRefinement && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Context added
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep('stakeholder')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep('modifiers')} disabled={!focalIssue}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* MODIFIERS */}
          {step === 'modifiers' && (
            <motion.div key="modifiers" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Personalize for your company</h1>
              <p className="text-slate-600 mb-4">
                These modifiers shape which forces matter most to YOU. The same industry trend affects companies differently.
              </p>

              {/* Cascaded Example - Real companies showing modifier impact */}
              <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200 rounded-xl overflow-hidden mb-6">
                <div className="p-4">
                  <div className="text-sm font-medium text-violet-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Same force, opposite fates
                  </div>

                  {/* Force label */}
                  <div className="text-xs text-slate-500 mb-2">Technological force: <strong className="text-slate-700">"ChatGPT Launch (Nov 2022)"</strong></div>

                  {/* Two company tiles */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Duolingo - Green/Opportunity */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="font-semibold text-emerald-800 text-sm">Duolingo</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium mb-1">Modifier: AI-native, gamified UX</div>
                      <div className="text-xs text-slate-600">
                        Launched Duolingo Max with GPT-4 → Stock up 60%+ in 2023
                      </div>
                    </div>

                    {/* Chegg - Red/Threat */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="font-semibold text-red-800 text-sm">Chegg</span>
                      </div>
                      <div className="text-[10px] text-red-700 font-medium mb-1">Modifier: Content-dependent, homework answers</div>
                      <div className="text-xs text-slate-600">
                        CEO mentioned ChatGPT threat → Stock crashed 48% in ONE DAY
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-violet-700 italic">
                    Both are EdTech. Same AI wave. One surfed it, one drowned.
                  </div>
                </div>

                {/* Learn the full story - expandable */}
                <button
                  onClick={() => setShowModifierCase(!showModifierCase)}
                  className="w-full bg-violet-100/80 border-t border-violet-200 px-4 py-2.5 text-left hover:bg-violet-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-violet-800">
                    {showModifierCase ? 'Hide the story' : 'What made the difference? →'}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-violet-600 transition-transform', showModifierCase && 'rotate-180')} />
                </button>

                {/* Expanded case study */}
                <AnimatePresence>
                  {showModifierCase && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 bg-white/50 border-t border-violet-100">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            <strong className="text-slate-800">May 2023:</strong> Two EdTech CEOs faced the same question from analysts: "How does ChatGPT affect your business?" Their answers - and stock reactions - revealed everything about modifiers.
                          </p>

                          <div className="bg-emerald-50/50 rounded-lg p-3 mb-3 border-l-2 border-emerald-400">
                            <div className="text-xs font-semibold text-emerald-800 mb-1">Duolingo's Reality (AI-native modifier)</div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-0">
                              Duolingo's value was never the content - it was the <em>gamified learning experience</em>. They integrated GPT-4 to create roleplay conversations and explain mistakes. AI made their product <em>better</em>. CEO Luis von Ahn called it "the biggest advancement in language learning in decades." Stock soared.
                            </p>
                          </div>

                          <div className="bg-red-50/50 rounded-lg p-3 mb-3 border-l-2 border-red-400">
                            <div className="text-xs font-semibold text-red-800 mb-1">Chegg's Reality (Content-dependent modifier)</div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-0">
                              Chegg's entire value prop was "get homework answers fast." ChatGPT does this for free, instantly, with explanations. CEO Dan Rosensweig admitted on the earnings call: "We saw a significant spike in student interest in ChatGPT." The stock lost <strong>$1 billion in market cap in hours</strong>. Same AI, existential threat.
                            </p>
                          </div>

                          <p className="text-xs text-slate-500 italic mb-3">
                            <strong>The lesson:</strong> "AI disruption" isn't a scenario. Your <em>modifiers</em> - what makes your company defensible - determine if AI is your rocket fuel or your extinction event.
                          </p>
                        </div>

                        {/* ChatGPT exploration link */}
                        <a
                          href={`https://chat.openai.com/?q=${encodeURIComponent(`I'm learning about how the same technological disruption affects companies differently based on their "modifiers" (company-specific context).

I just learned how ChatGPT's launch was:
- A ROCKET for Duolingo (AI-native, gamified UX, not content-dependent)
- An EXTINCTION EVENT for Chegg (content-dependent, homework answers business model)

Both are EdTech! Same force, opposite fates. Help me master this concept:

1. DEEP DIVE ON THESE TWO: What specific "modifiers" made Duolingo AI-proof while Chegg was AI-vulnerable? Break down their business models and show me exactly where ChatGPT helped vs. hurt.

2. GIVE ME 4 MORE DRAMATIC EXAMPLES of the same force creating winners and losers:
   - Netflix vs Blockbuster (streaming disruption)
   - Shopify vs traditional retail software (e-commerce wave)
   - Zoom vs Cisco WebEx (pandemic remote work)
   - Tesla vs traditional automakers (EV transition)

For each, identify the SPECIFIC MODIFIERS that determined who won and who lost.

3. THE SCARY QUESTION: How do I figure out if MY company is more like Duolingo or more like Chegg when facing a new disruption? Give me a framework - what questions should I ask about my business model, competitive moat, and value proposition?

4. PLOT TWIST: Can a company CHANGE its modifiers to flip from vulnerable to resilient? Did any company successfully "become Duolingo" after starting as "Chegg"? How?

Make this visceral - I want to feel the stakes of getting modifiers wrong.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium group"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="underline decoration-blue-300 group-hover:decoration-blue-500">
                            Explore: How do I know if I'm Duolingo or Chegg? →
                          </span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bridge: Connect example to modifier selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Now, describe YOUR company.</strong> Just like "AI-native" vs "content-dependent" determined Duolingo vs Chegg's fate, your modifiers below will determine how forces affect YOU.
                </p>
              </div>

              {Object.entries(groupedModifiers).map(([category, mods]) => (
                <div key={category} className="mb-5">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {mods.map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() => toggleModifier(mod.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                          modifiers.includes(mod.id)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        )}
                      >
                        {mod.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Custom Modifiers Section */}
              <div className="mb-5 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Your Own Modifiers
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Something unique about your company that isn't listed above? Add it here.
                </p>

                {/* Custom modifier tags */}
                {customModifiers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {customModifiers.map((mod) => (
                      <span
                        key={mod}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-violet-600 text-white flex items-center gap-1.5"
                      >
                        {mod}
                        <button
                          onClick={() => removeCustomModifier(mod)}
                          className="hover:bg-violet-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Input for new custom modifier */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customModifierInput}
                    onChange={(e) => setCustomModifierInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomModifier()}
                    placeholder="e.g., First-mover in tier-2 cities, Heavy R&D spender..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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

              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep('focal-issue')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep('summary')}>
                  Review
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* SUMMARY - Full width, plain language narrative */}
          {step === 'summary' && (
            <motion.div key="summary" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="lg:col-span-3">
              <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Scenario Planning Brief</h1>

              {/* Plain Language Narrative */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 mb-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed mb-4">
                    As the{' '}
                    <span className="text-amber-400 font-semibold">
                      {stakeholderPerspective && STAKEHOLDER_LABELS[stakeholderPerspective]?.label}
                    </span>{' '}
                    of a{' '}
                    <span className="text-amber-400 font-semibold">
                      {ORGANIZATION_TYPES.find((o) => o.id === organizationType)?.name}
                    </span>{' '}
                    in the{' '}
                    <span className="text-amber-400 font-semibold">
                      {industry?.startsWith('custom:')
                        ? industry.replace('custom:', '')
                        : INDUSTRIES.find((i) => i.id === industry)?.name}
                    </span>{' '}
                    industry, you're exploring:
                  </p>

                  <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <p className="text-xl font-semibold text-white leading-relaxed mb-0">
                      "{focalIssue}"
                    </p>
                  </div>

                  <p className="text-slate-300 mb-4">
                    over a <span className="text-white font-semibold">{timeHorizon}-year</span> horizon.
                  </p>

                  {focalIssueRefinement && (
                    <p className="text-slate-400 text-sm italic mb-4 border-l-2 border-slate-600 pl-3">
                      Additional context: {focalIssueRefinement}
                    </p>
                  )}

                  {(modifiers.length > 0 || customModifiers.length > 0) && (
                    <>
                      <p className="text-slate-300 mb-3">
                        Your company's defining characteristics:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {modifiers.map((mod) => (
                          <span key={mod} className="px-3 py-1.5 bg-indigo-500/30 text-indigo-200 rounded-full text-sm font-medium border border-indigo-400/30">
                            {CONTEXT_MODIFIERS.find((m) => m.id === mod)?.label}
                          </span>
                        ))}
                        {customModifiers.map((mod) => (
                          <span key={mod} className="px-3 py-1.5 bg-violet-500/30 text-violet-200 rounded-full text-sm font-medium border border-violet-400/30">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <p className="text-slate-400 text-sm leading-relaxed mb-0">
                      <strong className="text-slate-300">What happens next:</strong> We'll scan the environment for forces - political, economic, social, technological - that could shape how this decision plays out. Your modifiers will filter these forces to show what matters most to <em>your</em> specific situation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lock or Restart Actions */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Ready to proceed?</h3>
                    <p className="text-sm text-slate-500">
                      Once locked, you can't change these selections during this session.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep('industry')
                        setCustomModifiers([])
                      }}
                      className="text-slate-600"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                    <Button
                      onClick={handleComplete}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Lock & Continue
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Learning Sidebar - Contextual content per step (hidden on summary) */}
      {step !== 'summary' && (
        <div className="hidden lg:block">
          <div className="sticky top-6 pt-10">
            <LearningSidebar {...LEARNING_CONTENT[step]} />
          </div>
        </div>
      )}
    </div>
  )
}
