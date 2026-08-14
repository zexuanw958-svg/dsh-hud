import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('built DeepSeek Harness artifacts', () => {
  it('ships a no-op host entry', () => {
    const source = readFileSync(new URL('../lib/index.js', import.meta.url), 'utf8')
    expect(source).toContain('function apply')
  })

  it('registers the browser bundle through the Harness module loader', () => {
    const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
    expect(source).toContain('window.__ModuleLoader__.load({')
    expect(source).toContain('id: "dsh-hud"')
    expect(source).toContain('conversation.session.header.actions')
    expect(source).toContain('dsh-hud__panel')
  })
})
