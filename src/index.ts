/**
 * dsh-hud host half. The plugin is intentionally browser-only for v0.1:
 * this no-op entry makes the package visible to the Host Loader, whose client
 * module scanner discovers the package's `dsh.client` declaration.
 */

/** Host plugin body — all behavior lives in the browser half. */
export function apply(): void {}
