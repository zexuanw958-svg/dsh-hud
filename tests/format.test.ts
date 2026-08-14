import { describe, expect, it } from 'vitest'
import {
  billedInputTokens,
  contextReading,
  formatDuration,
  formatTokens,
  workspaceName,
} from '../src/client/format.ts'

describe('HUD formatting', () => {
  it('formats compact token counts without noisy trailing decimals', () => {
    expect(formatTokens(999)).toBe('999')
    expect(formatTokens(1_000)).toBe('1k')
    expect(formatTokens(12_345)).toBe('12.3k')
    expect(formatTokens(2_000_000)).toBe('2m')
  })

  it('formats elapsed time with a bounded pair of units', () => {
    expect(formatDuration(999)).toBe('0s')
    expect(formatDuration(65_000)).toBe('1m 5s')
    expect(formatDuration(3_900_000)).toBe('1h 5m')
  })

  it('uses projected pressure and clamps display occupancy', () => {
    expect(contextReading({ pressureTokens: 20, projectedTokens: 75, contextWindow: 100 }))
      .toEqual({ percent: 75, usedTokens: 75, contextWindow: 100 })
    expect(contextReading({ pressureTokens: 150, contextWindow: 100 })?.percent).toBe(100)
    expect(contextReading({ pressureTokens: 10 })).toBeNull()
  })

  it('adds every billable input bucket', () => {
    expect(billedInputTokens({
      uncachedInputTokens: 10,
      outputTokens: 5,
      cacheReadTokens: 20,
      cacheWriteTokens: 3,
    })).toBe(33)
  })

  it('extracts a workspace basename across path styles', () => {
    expect(workspaceName('/work/acme/')).toBe('acme')
    expect(workspaceName('C:\\work\\acme')).toBe('acme')
    expect(workspaceName(undefined)).toBe('—')
  })
})
