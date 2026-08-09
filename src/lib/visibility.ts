/** Subscribe to document visibility; used to pause polling in background. */
export function subscribeVisibility(onChange: (visible: boolean) => void): () => void {
  if (typeof document === 'undefined') return () => {}

  const handler = () => onChange(document.visibilityState === 'visible')
  document.addEventListener('visibilitychange', handler)
  return () => document.removeEventListener('visibilitychange', handler)
}

export function isDocumentVisible(): boolean {
  if (typeof document === 'undefined') return true
  return document.visibilityState === 'visible'
}
