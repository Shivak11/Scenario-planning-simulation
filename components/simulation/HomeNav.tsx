'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

interface HomeNavProps {
  className?: string
}

export function HomeNav({ className }: HomeNavProps) {
  return (
    <Link
      href="/"
      className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2
        bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg
        text-slate-400 hover:text-gold-400 hover:border-gold-500/30
        transition-all duration-200 group ${className || ''}`}
    >
      <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">Home</span>
    </Link>
  )
}
