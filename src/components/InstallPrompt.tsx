import { useEffect, useMemo, useState } from 'react'
import styles from './InstallPrompt.module.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'bartonic.install.dismissed'

function isIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISS_KEY) === '1'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setDeferred(null)
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const showIosHint = useMemo(() => isIos() && !isStandalone(), [])
  const show = !dismissed && !isStandalone() && (deferred != null || showIosHint)
  if (!show) return null

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setDeferred(null)
  }

  function handleDismiss() {
    setDismissed(true)
    if (typeof window !== 'undefined') localStorage.setItem(DISMISS_KEY, '1')
  }

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <div className={styles.text}>
        <strong className={styles.title}>Install BARTonic</strong>
        <p className={styles.sub}>
          {showIosHint
            ? 'On iPhone, tap Share and choose "Add to Home Screen".'
            : 'Install for faster launch and full-screen app experience.'}
        </p>
      </div>
      <div className={styles.actions}>
        {deferred && (
          <button type="button" className={styles.install} onClick={handleInstall}>
            Install
          </button>
        )}
        <button type="button" className={styles.dismiss} onClick={handleDismiss} aria-label="Dismiss install prompt">
          Not now
        </button>
      </div>
    </div>
  )
}
