import type { ContextPressureProjection, TokenUsageProjection } from '@deepseek-ai/dsh-token-meter/client'

export interface ContextReading {
  percent: number
  usedTokens: number
  contextWindow: number
}

/** Prompt-side context occupancy, clamped for display rather than policy. */
export function contextReading(pressure: ContextPressureProjection | undefined): ContextReading | null {
  const usedTokens = pressure?.projectedTokens ?? pressure?.pressureTokens
  const contextWindow = pressure?.contextWindow
  if (usedTokens === undefined || contextWindow === undefined || contextWindow <= 0) return null
  return {
    percent: Math.min(100, Math.max(0, Math.round(usedTokens / contextWindow * 100))),
    usedTokens,
    contextWindow,
  }
}

/** Provider billing input includes uncached and both cache traffic buckets. */
export function billedInputTokens(usage: TokenUsageProjection | undefined): number {
  if (usage === undefined) return 0
  return usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens
}

/** Compact human-readable token count. */
export function formatTokens(value: number): string {
  const safe = Math.max(0, value)
  if (safe < 1_000) return String(Math.round(safe))
  if (safe < 1_000_000) return `${trimOneDecimal(safe / 1_000)}k`
  if (safe < 1_000_000_000) return `${trimOneDecimal(safe / 1_000_000)}m`
  return `${trimOneDecimal(safe / 1_000_000_000)}b`
}

/** Compact elapsed duration with the widest useful pair of units. */
export function formatDuration(valueMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(valueMs / 1_000))
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  if (totalMinutes === 0) return `${seconds}s`
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  if (hours === 0) return `${minutes}m ${seconds}s`
  return `${hours}h ${minutes}m`
}

/** Last path segment across Unix and Windows separators. */
export function workspaceName(cwd: string | undefined): string {
  if (cwd === undefined || cwd === '') return '—'
  return cwd.replace(/[/\\]+$/, '').split(/[/\\]/).pop() || cwd
}

function trimOneDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/u, '')
}
