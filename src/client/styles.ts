export const HUD_STYLE_ID = 'dsh-hud/main.css'

export const HUD_CSS = String.raw`
.dsh-hud {
  position: relative;
  min-width: 0;
  font-variant-numeric: tabular-nums;
}

.dsh-hud__trigger {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  gap: 7px;
  padding: 3px 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--dsw-alias-label-tertiary);
  background: transparent;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  transition: color 120ms ease, background 120ms ease, border-color 120ms ease;
}

.dsh-hud__trigger:hover,
.dsh-hud__trigger:focus-visible,
.dsh-hud__trigger[aria-expanded='true'] {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-hover);
  outline: none;
}

.dsh-hud__status {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 999px;
  background: var(--dsw-alias-label-caption);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-label-caption) 14%, transparent);
}

.dsh-hud__status[data-running='true'] {
  background: var(--dsw-alias-state-success-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary) 16%, transparent);
  animation: dsh-hud-pulse 1.6s ease-in-out infinite;
}

.dsh-hud__model {
  max-width: 150px;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dsh-hud__segment {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.dsh-hud__separator {
  color: var(--dsw-alias-border-l1);
}

.dsh-hud__chevron {
  width: 12px;
  height: 12px;
  flex: none;
  transition: transform 120ms ease;
}

.dsh-hud__trigger[aria-expanded='true'] .dsh-hud__chevron {
  transform: rotate(180deg);
}

.dsh-hud__panel {
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  z-index: 120;
  box-sizing: border-box;
  width: 380px;
  max-width: min(380px, calc(100vw - 32px));
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 14px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-base));
  box-shadow: var(--dsw-shadow-lv3);
}

.dsh-hud__panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.dsh-hud__eyebrow {
  margin: 0 0 2px;
  color: var(--dsw-alias-label-caption);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  line-height: 14px;
  text-transform: uppercase;
}

.dsh-hud__title {
  margin: 0;
  font-size: 14px;
  font-weight: 650;
  line-height: 20px;
}

.dsh-hud__live-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 7px;
  border-radius: 999px;
  color: var(--dsw-alias-state-success-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-transform: uppercase;
}

.dsh-hud__context {
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-fill-l1);
}

.dsh-hud__context-head,
.dsh-hud__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dsh-hud__context-head {
  margin-bottom: 7px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
}

.dsh-hud__context-head strong {
  color: var(--dsw-alias-label-secondary);
  font-weight: 650;
}

.dsh-hud__bar {
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-fill-l3);
}

.dsh-hud__bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4f8cff, #8b6cff);
  transition: width 220ms ease;
}

.dsh-hud__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-bottom: 12px;
}

.dsh-hud__metric {
  min-width: 0;
  padding: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 9px;
  background: var(--dsw-alias-bg-base);
}

.dsh-hud__metric-label {
  display: block;
  overflow: hidden;
  margin-bottom: 2px;
  color: var(--dsw-alias-label-caption);
  font-size: 10px;
  line-height: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dsh-hud__metric-value {
  display: block;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 12px;
  font-weight: 650;
  line-height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dsh-hud__details {
  display: grid;
  gap: 7px;
  padding-top: 11px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.dsh-hud__row {
  min-width: 0;
  font-size: 11px;
  line-height: 17px;
}

.dsh-hud__row dt {
  flex: none;
  color: var(--dsw-alias-label-caption);
}

.dsh-hud__row dd {
  min-width: 0;
  overflow: hidden;
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@keyframes dsh-hud-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .62; transform: scale(.82); }
}

@media (max-width: 980px) {
  .dsh-hud__segment--secondary,
  .dsh-hud__separator--secondary { display: none; }
  .dsh-hud__model { max-width: 100px; }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-hud__status,
  .dsh-hud__bar-fill,
  .dsh-hud__chevron { animation: none; transition: none; }
}
`
