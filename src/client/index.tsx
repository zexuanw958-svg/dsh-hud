import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-session-stats/client'
import type {} from '@deepseek-ai/dsh-token-meter/client'
import {
  billedInputTokens,
  contextReading,
  formatDuration,
  formatTokens,
  latestModelRoute,
  workspaceName,
} from './format.ts'
import { HUD_CSS, HUD_STYLE_ID } from './styles.ts'

type HudProps = PropsRuntime<'conversation.session.header.actions'>

const EMPTY_LIST: readonly never[] = []

/** Browser services required by the header contribution. */
export const inject = ['slots']

/** Mount styles and add one self-contained entry to the session header. */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    if (typeof document === 'undefined') return () => {}
    const selector = `style[data-plugin-css=${JSON.stringify(HUD_STYLE_ID)}]`
    if (document.querySelector(selector) !== null) return () => {}
    const tag = document.createElement('style')
    tag.dataset.plugin = 'dsh-hud'
    tag.dataset.pluginCss = HUD_STYLE_ID
    tag.textContent = HUD_CSS
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, 'dsh-hud: styles')

  ctx.slots.inject(
    'conversation.session.header.actions',
    () => ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'dsh-hud',
      order: 30,
      label: 'Session HUD',
    }, HudAction),
  )
}

/** Live compact status plus an expandable detail panel. */
function HudAction({ sessionId, useSession, useSessions, useProjection }: HudProps) {
  const running = useSession(snapshot => snapshot.running)
  const route = useSession(snapshot => latestModelRoute(snapshot.nodes), sameRoute)
  const cwd = useSessions(state => state.byId[sessionId]?.cwd)
  const jobs = useSessions(state => state.jobsBySession[sessionId] ?? EMPTY_LIST)
  const subagents = useSessions(state => state.subagentsByParent[sessionId]?.entries ?? EMPTY_LIST)
  const pressure = useProjection('contextPressure')
  const usage = useProjection('tokenUsage')
  const stats = useProjection('sessionStats')

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const context = contextReading(pressure)
  const model = route?.model ?? 'No model yet'
  const provider = route?.provider ?? '—'
  const inputTokens = billedInputTokens(usage)
  const outputTokens = usage?.outputTokens ?? 0
  const activeJobs = jobs.filter(job => job.status === 'running' || job.status === 'stopping').length

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent): void => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target) !== true) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => { document.removeEventListener('pointerdown', closeOutside) }
  }, [open])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'Escape' || !open) return
    event.preventDefault()
    setOpen(false)
    triggerRef.current?.focus()
  }

  const contextLabel = context === null ? 'ctx —' : `ctx ${context.percent}%`
  const statusLabel = running ? 'Agent running' : 'Agent idle'
  const ariaLabel = `${statusLabel}; ${model}; ${contextLabel}; ${stats?.steps ?? 0} steps`

  return (
    <div ref={rootRef} className="dsh-hud" onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="dsh-hud__trigger"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => { setOpen(current => !current) }}
      >
        <span className="dsh-hud__status" data-running={String(running)} aria-hidden />
        <span className="dsh-hud__model" title={model}>{model}</span>
        <span className="dsh-hud__separator" aria-hidden>·</span>
        <span className="dsh-hud__segment">{contextLabel}</span>
        <span className="dsh-hud__separator dsh-hud__separator--secondary" aria-hidden>·</span>
        <span className="dsh-hud__segment dsh-hud__segment--secondary">{stats?.steps ?? 0} steps</span>
        <Chevron />
      </button>

      {open && (
        <section className="dsh-hud__panel" role="dialog" aria-label="DeepSeek Harness session HUD">
          <div className="dsh-hud__panel-head">
            <div>
              <p className="dsh-hud__eyebrow">DeepSeek Harness</p>
              <h2 className="dsh-hud__title">Session HUD</h2>
            </div>
            {running && <span className="dsh-hud__live-label"><span className="dsh-hud__status" data-running="true" />Live</span>}
          </div>

          <div className="dsh-hud__context">
            <div className="dsh-hud__context-head">
              <span>Context pressure</span>
              <strong>{context === null ? 'Waiting for usage' : `${context.percent}% · ~${formatTokens(context.usedTokens)} / ${formatTokens(context.contextWindow)}`}</strong>
            </div>
            <div className="dsh-hud__bar" aria-hidden>
              <div className="dsh-hud__bar-fill" style={{ width: `${context?.percent ?? 0}%` }} />
            </div>
          </div>

          <div className="dsh-hud__grid">
            <Metric label="Input" value={formatTokens(inputTokens)} />
            <Metric label="Output" value={formatTokens(outputTokens)} />
            <Metric label="Turns / steps" value={`${stats?.turns ?? 0} / ${stats?.steps ?? 0}`} />
            <Metric label="Model time" value={formatDuration(stats?.llmMs ?? 0)} />
            <Metric label="Tool time" value={formatDuration(stats?.toolMs ?? 0)} />
            <Metric label="Jobs / agents" value={`${activeJobs} / ${subagents.length}`} />
          </div>

          <dl className="dsh-hud__details">
            <Detail label="Model" value={model} title={model} />
            <Detail label="Provider" value={provider} title={provider} />
            <Detail label="Workspace" value={workspaceName(cwd)} title={cwd} />
            <Detail label="Session" value={sessionId} title={sessionId} />
          </dl>
        </section>
      )}
    </div>
  )
}

function sameRoute(left: ReturnType<typeof latestModelRoute>, right: ReturnType<typeof latestModelRoute>): boolean {
  return left?.provider === right?.provider && left?.model === right?.model
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="dsh-hud__metric">
      <span className="dsh-hud__metric-label">{label}</span>
      <strong className="dsh-hud__metric-value" title={value}>{value}</strong>
    </div>
  )
}

function Detail({ label, value, title }: { label: string; value: string; title?: string | undefined }) {
  return (
    <div className="dsh-hud__row">
      <dt>{label}</dt>
      <dd title={title}>{value}</dd>
    </div>
  )
}

function Chevron() {
  return (
    <svg className="dsh-hud__chevron" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5 6 7.5l3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
