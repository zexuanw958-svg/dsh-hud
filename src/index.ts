import type { Context } from '@deepseek-ai/cordis'
import { hudModelRouteProjectionDefinition } from './projection.ts'

/** Host capability required to fold the durable model route without polling. */
export const inject = ['sessionProjections']

/** Register the one read-only projection consumed by the browser HUD. */
export function apply(ctx: Context): void {
  ctx.sessionProjections.register(hudModelRouteProjectionDefinition)
}
