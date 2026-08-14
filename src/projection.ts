import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import { z } from 'zod'

/** Latest durable provider route used by the main session request loop. */
export interface HudModelRouteProjection {
  provider: string
  model: string
}

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    /** Latest route recorded before a main model request, or null before the first request. */
    dshHudModelRoute: HudModelRouteProjection | null
  }
}

const modelRouteSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
}).strict().nullable()

/** Fold Harness request/context events into a browser-safe current-route value. */
export const hudModelRouteProjectionDefinition: ProjectionDefinition<
  'dshHudModelRoute',
  HudModelRouteProjection | null
> = {
  key: 'dshHudModelRoute',
  schema: modelRouteSchema,
  init: () => null,
  apply: (state, event) => {
    if (event.type !== 'request/context') return state
    if (state?.provider === event.data.provider && state.model === event.data.model) return state
    return { provider: event.data.provider, model: event.data.model }
  },
  view: state => state,
  stateVersion: 1,
}
