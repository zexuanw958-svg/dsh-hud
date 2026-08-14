import { describe, expect, it } from 'vitest'
import { hudModelRouteProjectionDefinition as route } from '../src/projection.ts'

describe('HUD model-route projection', () => {
  it('publishes the latest request/context route from real session-event shape', () => {
    const empty = route.init()
    const unrelated = route.apply(empty, {
      type: 'step/start',
      seq: 6,
      time: 100,
      data: { turn: 1, step: 1 },
    } as never)
    const first = route.apply(unrelated, {
      type: 'request/context',
      seq: 12,
      time: 110,
      data: {
        provider: 'deepseek-official',
        model: 'deepseek-v4-flash',
        contextWindow: 1_000_000,
      },
    } as never)
    const duplicate = route.apply(first, {
      type: 'request/context',
      seq: 13,
      time: 120,
      data: {
        provider: 'deepseek-official',
        model: 'deepseek-v4-flash',
        contextWindow: 1_000_000,
      },
    } as never)
    const switched = route.apply(duplicate, {
      type: 'request/context',
      seq: 14,
      time: 130,
      data: {
        provider: 'openai',
        model: 'gpt-next',
        contextWindow: 200_000,
      },
    } as never)

    expect(unrelated).toBe(empty)
    expect(route.view(first)).toEqual({
      provider: 'deepseek-official',
      model: 'deepseek-v4-flash',
    })
    expect(duplicate).toBe(first)
    expect(route.view(switched)).toEqual({ provider: 'openai', model: 'gpt-next' })
  })
})
