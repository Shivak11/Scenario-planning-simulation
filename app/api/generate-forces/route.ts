import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { INDUSTRIES, ORGANIZATION_TYPES, CONTEXT_MODIFIERS } from '@/lib/types'
import { buildGenerateForcesPrompt } from '@/lib/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { industry, organizationType, challenge, modifiers = [], strategicQuestion } = await request.json()
    console.log('Generating forces for:', { industry, organizationType, challenge })

    // Get human-readable labels
    const industryName = INDUSTRIES.find((i) => i.id === industry)?.name || industry
    const orgTypeName = ORGANIZATION_TYPES.find((o) => o.id === organizationType)?.name || organizationType
    const modifierLabels = Array.isArray(modifiers)
      ? modifiers
          .map((m: string) => CONTEXT_MODIFIERS.find((cm) => cm.id === m)?.label)
          .filter(Boolean)
          .join(', ')
      : ''

    // Build prompt from centralized prompts file
    const prompt = buildGenerateForcesPrompt({
      industryName,
      orgTypeName,
      challenge,
      strategicQuestion,
      modifierLabels: modifierLabels || undefined,
    })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    // Extract text content from the response
    const textContent = message.content.find(block => block.type === 'text')
    const content = textContent?.type === 'text' ? textContent.text : ''

    if (!content) {
      return NextResponse.json({ error: 'No content in response' }, { status: 500 })
    }

    // Parse the response
    let parsed
    try {
      // Try to extract JSON from the response (in case there's any surrounding text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', content)
      return NextResponse.json({ error: 'Invalid JSON response from AI' }, { status: 500 })
    }

    // Handle different response formats
    let forces = Array.isArray(parsed) ? parsed : (parsed.forces || [])

    // Add IDs and ensure isCustom is false
    // Set impact and uncertainty to 0 (Not Rated) - user must actively rate each force
    forces = forces.map((force: Record<string, unknown>, index: number) => ({
      ...force,
      id: `force-${Date.now()}-${index}`,
      impact: 0,
      uncertainty: 0,
      isCustom: false,
    }))

    console.log(`Generated ${forces.length} forces`)
    return NextResponse.json({ forces })
  } catch (error: unknown) {
    console.error('Error generating forces:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to generate forces: ${errorMessage}` },
      { status: 500 }
    )
  }
}
