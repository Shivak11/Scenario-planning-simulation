'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Quote,
  Sparkles,
  User,
} from 'lucide-react'

// Types for wisdom content
export interface WisdomQuote {
  id: string
  quote: string
  author: string
  role: string
  context?: string
  chatGptPrompt?: string
  googleQuery?: string
  category: 'strategy' | 'leadership' | 'innovation' | 'planning'
}

export interface LearningCard {
  id: string
  title: string
  content: string
  isGood: boolean
  explanation?: string
}

export interface DiscoverPrompt {
  label: string
  prompt: string
  type: 'chatgpt' | 'google'
}

// Famous quotes database - will be expanded
export const WISDOM_QUOTES: WisdomQuote[] = [
  // Peter Schwartz - Scenario Planning
  {
    id: 'schwartz-1',
    quote: 'Scenarios are not predictions. They are a means of helping people learn.',
    author: 'Peter Schwartz',
    role: 'Author, The Art of the Long View',
    context: 'Schwartz pioneered scenario planning at Royal Dutch Shell',
    chatGptPrompt: 'Explain Peter Schwartz\'s approach to scenario planning and how scenarios differ from predictions',
    category: 'planning',
  },
  {
    id: 'schwartz-2',
    quote: 'The end result of scenario planning is not a more accurate picture of tomorrow, but better decisions about the future.',
    author: 'Peter Schwartz',
    role: 'Futurist, Global Business Network',
    chatGptPrompt: 'How does scenario planning improve decision-making compared to traditional forecasting?',
    category: 'planning',
  },
  {
    id: 'schwartz-3',
    quote: 'Good scenarios are plausible and surprising; they have the power to break old stereotypes.',
    author: 'Peter Schwartz',
    role: 'The Art of the Long View',
    chatGptPrompt: 'What makes a scenario both plausible and surprising? Give examples from business history.',
    category: 'planning',
  },
  // Steve Jobs - Innovation & Vision
  {
    id: 'jobs-1',
    quote: 'You can\'t connect the dots looking forward; you can only connect them looking backwards.',
    author: 'Steve Jobs',
    role: 'Co-founder, Apple',
    context: 'Stanford Commencement Speech, 2005',
    chatGptPrompt: 'How did Steve Jobs apply this philosophy in Apple\'s product strategy?',
    category: 'innovation',
  },
  {
    id: 'jobs-2',
    quote: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    role: 'Co-founder, Apple',
    chatGptPrompt: 'What strategic decisions at Apple demonstrated this leadership through innovation?',
    category: 'innovation',
  },
  // Andy Grove - Strategic Inflection Points
  {
    id: 'grove-1',
    quote: 'A strategic inflection point is a time in the life of a business when its fundamentals are about to change.',
    author: 'Andy Grove',
    role: 'Former CEO, Intel',
    context: 'From "Only the Paranoid Survive"',
    chatGptPrompt: 'Explain Andy Grove\'s concept of strategic inflection points with Indian business examples',
    category: 'strategy',
  },
  {
    id: 'grove-2',
    quote: 'Success breeds complacency. Complacency breeds failure. Only the paranoid survive.',
    author: 'Andy Grove',
    role: 'Former CEO, Intel',
    chatGptPrompt: 'How can established companies maintain strategic vigilance? Examples from tech industry.',
    category: 'strategy',
  },
  // Sun Tzu - Classical Strategy
  {
    id: 'suntzu-1',
    quote: 'In the midst of chaos, there is also opportunity.',
    author: 'Sun Tzu',
    role: 'Ancient Chinese Military Strategist',
    context: 'The Art of War, ~500 BCE',
    chatGptPrompt: 'How do modern companies find opportunity in market chaos? Give recent examples.',
    category: 'strategy',
  },
  {
    id: 'suntzu-2',
    quote: 'Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.',
    author: 'Sun Tzu',
    role: 'The Art of War',
    chatGptPrompt: 'Explain the relationship between strategy and tactics in corporate planning',
    category: 'strategy',
  },
  // Ratan Tata - Indian Leadership
  {
    id: 'tata-1',
    quote: 'I don\'t believe in taking right decisions. I take decisions and then make them right.',
    author: 'Ratan Tata',
    role: 'Chairman Emeritus, Tata Group',
    chatGptPrompt: 'How did Ratan Tata\'s decision-making philosophy shape Tata Group\'s global expansion?',
    category: 'leadership',
  },
  {
    id: 'tata-2',
    quote: 'Ups and downs in life are very important to keep us going, because a straight line even in an ECG means we are not alive.',
    author: 'Ratan Tata',
    role: 'Chairman Emeritus, Tata Group',
    chatGptPrompt: 'How should business leaders embrace uncertainty and volatility?',
    category: 'leadership',
  },
  // Narayana Murthy - Building Institutions
  {
    id: 'murthy-1',
    quote: 'In God we trust, everybody else brings data.',
    author: 'Narayana Murthy',
    role: 'Co-founder, Infosys',
    chatGptPrompt: 'How did data-driven decision making shape Infosys\'s growth strategy?',
    category: 'leadership',
  },
  // Clayton Christensen - Disruption
  {
    id: 'christensen-1',
    quote: 'Disruption is a process, not an event, and innovations can only be disruptive relative to something else.',
    author: 'Clayton Christensen',
    role: 'Harvard Business School',
    context: 'Author of "The Innovator\'s Dilemma"',
    chatGptPrompt: 'Explain disruptive innovation with examples from Indian markets',
    category: 'innovation',
  },
  // Jeff Bezos - Long-term thinking
  {
    id: 'bezos-1',
    quote: 'If you\'re long-term oriented, customer interests and shareholder interests are aligned.',
    author: 'Jeff Bezos',
    role: 'Founder, Amazon',
    chatGptPrompt: 'How does long-term orientation change strategic planning? Amazon\'s approach.',
    category: 'strategy',
  },
]

// Component Props
interface WisdomPanelProps {
  category?: WisdomQuote['category'] | 'all'
  maxQuotes?: number
  showExploreLinks?: boolean
  className?: string
  defaultCollapsed?: boolean
  title?: string
}

export function WisdomPanel({
  category = 'all',
  maxQuotes = 3,
  showExploreLinks = true,
  className,
  defaultCollapsed = true,
  title = 'Wisdom from Strategic Thinkers',
}: WisdomPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredQuotes =
    category === 'all'
      ? WISDOM_QUOTES.slice(0, maxQuotes)
      : WISDOM_QUOTES.filter((q) => q.category === category).slice(0, maxQuotes)

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const openChatGpt = (prompt: string) => {
    const encodedPrompt = encodeURIComponent(prompt)
    window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank')
  }

  const openGoogle = (query: string) => {
    const encodedQuery = encodeURIComponent(query)
    window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank')
  }

  return (
    <div className={cn('rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden', className)}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
            <Quote className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-gold-400">
          <span className="text-xs">{filteredQuotes.length} quotes</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Content - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4">
              {/* Scrollable quotes */}
              <div className="relative">
                {filteredQuotes.length > 1 && (
                  <>
                    <button
                      onClick={() => handleScroll('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-700/80 rounded-full shadow-md flex items-center justify-center hover:bg-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gold-400" />
                    </button>
                    <button
                      onClick={() => handleScroll('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-700/80 rounded-full shadow-md flex items-center justify-center hover:bg-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gold-400" />
                    </button>
                  </>
                )}

                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 -mx-1 scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredQuotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      showExploreLinks={showExploreLinks}
                      onChatGpt={openChatGpt}
                      onGoogle={openGoogle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Individual Quote Card
interface QuoteCardProps {
  quote: WisdomQuote
  showExploreLinks: boolean
  onChatGpt: (prompt: string) => void
  onGoogle: (query: string) => void
}

function QuoteCard({ quote, showExploreLinks, onChatGpt, onGoogle }: QuoteCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="flex-shrink-0 w-[300px] bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-sm">
      <div className="flex items-start gap-2 mb-3">
        <Quote className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
        <p className="text-sm text-slate-300 italic leading-relaxed line-clamp-4">
          "{quote.quote}"
        </p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
          <User className="w-4 h-4 text-gold-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{quote.author}</p>
          <p className="text-xs text-slate-400">{quote.role}</p>
        </div>
      </div>

      {quote.context && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gold-400 hover:text-gold-300 mb-2 flex items-center gap-1"
        >
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showDetails ? 'Hide context' : 'Show context'}
        </button>
      )}

      <AnimatePresence>
        {showDetails && quote.context && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-xs text-slate-400 mb-2 overflow-hidden"
          >
            {quote.context}
          </motion.p>
        )}
      </AnimatePresence>

      {showExploreLinks && quote.chatGptPrompt && (
        <div className="pt-2 border-t border-slate-700 flex gap-2">
          <button
            onClick={() => onChatGpt(quote.chatGptPrompt!)}
            className="flex-1 text-xs px-2 py-1.5 bg-gold-500/20 text-gold-400 rounded-md hover:bg-gold-500/30 transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Explore on ChatGPT
          </button>
        </div>
      )}
    </div>
  )
}

// Learning Cards Component - For good/bad examples
interface LearningCardsProps {
  title: string
  cards: LearningCard[]
  className?: string
  defaultCollapsed?: boolean
}

export function LearningCards({
  title,
  cards,
  className,
  defaultCollapsed = true,
}: LearningCardsProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleReveal = (cardId: string) => {
    setRevealedCards((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 260
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className={cn('rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-medium text-amber-900">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-amber-600">
          <span className="text-xs">{cards.length} examples</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4">
              <p className="text-xs text-amber-700 mb-3">
                Click each card to reveal if it's a good or poor example. Test your understanding!
              </p>

              <div className="relative">
                {cards.length > 2 && (
                  <>
                    <button
                      onClick={() => handleScroll('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-800/80 rounded-full shadow-md flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                      onClick={() => handleScroll('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-800/80 rounded-full shadow-md flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-amber-600" />
                    </button>
                  </>
                )}

                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 -mx-1 scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {cards.map((card) => {
                    const isRevealed = revealedCards.has(card.id)
                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleReveal(card.id)}
                        className={cn(
                          'flex-shrink-0 w-[240px] rounded-lg border p-4 cursor-pointer transition-all duration-300',
                          isRevealed
                            ? card.isGood
                              ? 'bg-gold-500/10 border-gold-500/30'
                              : 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-slate-800 border-amber-100 hover:border-amber-300'
                        )}
                      >
                        <h4 className="font-medium text-sm text-navy-900 mb-2">{card.title}</h4>
                        <p className="text-xs text-navy-600 mb-3">{card.content}</p>

                        {isRevealed ? (
                          <div
                            className={cn(
                              'text-xs font-medium px-2 py-1 rounded-full inline-block',
                              card.isGood
                                ? 'bg-gold-500/20 text-gold-400'
                                : 'bg-amber-500/20 text-amber-400'
                            )}
                          >
                            {card.isGood ? 'Good Example' : 'Poor Example'}
                          </div>
                        ) : (
                          <div className="text-xs text-amber-600">Click to reveal</div>
                        )}

                        {isRevealed && card.explanation && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-navy-500 mt-2 pt-2 border-t border-current/10"
                          >
                            {card.explanation}
                          </motion.p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Discover Prompts Component
interface DiscoverPromptsProps {
  prompts: DiscoverPrompt[]
  className?: string
  title?: string
  defaultCollapsed?: boolean
}

export function DiscoverPrompts({
  prompts,
  className,
  title = 'Go Deeper',
  defaultCollapsed = true,
}: DiscoverPromptsProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)

  const openPrompt = (prompt: DiscoverPrompt) => {
    if (prompt.type === 'chatgpt') {
      window.open(`https://chat.openai.com/?q=${encodeURIComponent(prompt.prompt)}`, '_blank')
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(prompt.prompt)}`, '_blank')
    }
  }

  return (
    <div className={cn('rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-medium text-indigo-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gold-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gold-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 space-y-2">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => openPrompt(prompt)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {prompt.type === 'chatgpt' ? (
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-indigo-500" />
                    )}
                    <span className="text-sm text-navy-700">{prompt.label}</span>
                  </div>
                  <span className="text-xs text-indigo-500">
                    {prompt.type === 'chatgpt' ? 'ChatGPT' : 'Google'}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Pre-built learning cards for focal issues
export const FOCAL_ISSUE_LEARNING_CARDS: LearningCard[] = [
  {
    id: 'fi-1',
    title: '"What should our strategy be?"',
    content: 'A broad question about overall direction and approach',
    isGood: false,
    explanation: 'Too vague. A focal issue needs specificity to generate meaningful scenarios.',
  },
  {
    id: 'fi-2',
    title: '"Should we acquire a D2C brand or build our own digital channel?"',
    content: 'A specific decision with clear alternatives and resource implications',
    isGood: true,
    explanation: 'Excellent! Specific, actionable, has clear alternatives, and forces trade-off thinking.',
  },
  {
    id: 'fi-3',
    title: '"Will AI replace our workforce?"',
    content: 'A prediction question about future technology impact',
    isGood: false,
    explanation: 'Framed as a prediction, not a decision. Reframe as: "How should we restructure our workforce given AI automation possibilities?"',
  },
  {
    id: 'fi-4',
    title: '"Should we hire 5 or 10 engineers this quarter?"',
    content: 'A tactical staffing decision for the current quarter',
    isGood: false,
    explanation: 'Too narrow and tactical. Scenario planning is for strategic decisions spanning years, not quarters.',
  },
]
