import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Map.module.css'

const MIN_SCALE = 0.06
const MAX_SCALE = 2.5
const DEFAULT_SCALE = 1

export default function Map() {
  const [scale, setScale] = useState(DEFAULT_SCALE)
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null)
  const [useHiResMap, setUseHiResMap] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const didAutoFitRef = useRef(false)

  const zoomTo = useCallback(
    (nextScale: number) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
      if (next === scale) return
      const viewport = viewportRef.current
      if (!viewport) {
        setScale(next)
        return
      }

      const centerX = viewport.scrollLeft + viewport.clientWidth / 2
      const centerY = viewport.scrollTop + viewport.clientHeight / 2
      const ratio = next / scale
      setScale(next)
      requestAnimationFrame(() => {
        viewport.scrollLeft = centerX * ratio - viewport.clientWidth / 2
        viewport.scrollTop = centerY * ratio - viewport.clientHeight / 2
      })
    },
    [scale]
  )

  const zoomIn = useCallback(() => {
    const step = scale < 0.3 ? 0.06 : 0.2
    zoomTo(scale + step)
  }, [scale, zoomTo])
  const zoomOut = useCallback(() => {
    const step = scale <= 0.3 ? 0.06 : 0.2
    zoomTo(scale - step)
  }, [scale, zoomTo])

  const fitToScreen = useCallback(() => {
    if (!imgSize) return
    const viewport = viewportRef.current
    if (!viewport) return
    const availableWidth = Math.max(1, viewport.clientWidth - 2)
    const availableHeight = Math.max(1, viewport.clientHeight - 2)
    const fitWidth = availableWidth / imgSize.w
    const fitHeight = availableHeight / imgSize.h
    const target = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.min(fitWidth, fitHeight)))
    setScale(target)
    requestAnimationFrame(() => {
      viewport.scrollLeft = 0
      viewport.scrollTop = 0
    })
  }, [imgSize])

  const resetView = useCallback(() => {
    didAutoFitRef.current = true
    fitToScreen()
  }, [fitToScreen])

  useEffect(() => {
    if (!imgSize || didAutoFitRef.current) return
    didAutoFitRef.current = true
    fitToScreen()
  }, [imgSize, fitToScreen])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let idleId: number | null = null
    const loadHiRes = () => setUseHiResMap(true)
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(loadHiRes, { timeout: 1500 })
    } else {
      timeoutId = globalThis.setTimeout(loadHiRes, 800)
    }
    return () => {
      if (timeoutId != null) globalThis.clearTimeout(timeoutId)
      if (idleId != null && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId)
    }
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>BART system map</h1>
        <p className={styles.subtitle}>Use +/− to zoom, drag to pan. Tap Reset to fit.</p>
      </header>
      <div className={styles.card}>
        <div className={styles.zoomBar}>
          <button type="button" onClick={zoomOut} className={styles.zoomBtn} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={zoomIn} className={styles.zoomBtn} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={resetView} className={styles.resetBtn}>
            Reset
          </button>
          <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
        </div>
        <div
          className={styles.viewport}
          ref={viewportRef}
          onWheel={(e) => {
            if (!e.ctrlKey) return
            e.preventDefault()
            zoomTo(scale + (e.deltaY > 0 ? -0.1 : 0.1))
          }}
          onPointerDown={(e) => {
            const viewport = viewportRef.current
            if (!viewport) return
            dragRef.current = {
              x: e.clientX,
              y: e.clientY,
              left: viewport.scrollLeft,
              top: viewport.scrollTop
            }
            ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            const drag = dragRef.current
            const viewport = viewportRef.current
            if (!drag || !viewport) return
            viewport.scrollLeft = drag.left - (e.clientX - drag.x)
            viewport.scrollTop = drag.top - (e.clientY - drag.y)
          }}
          onPointerUp={() => {
            dragRef.current = null
          }}
          onPointerCancel={() => {
            dragRef.current = null
          }}
        >
          <div
            className={styles.canvas}
            style={{ width: imgSize ? imgSize.w * scale : undefined, height: imgSize ? imgSize.h * scale : undefined }}
          >
            <img
              src="/bart-system-map.png"
              srcSet={useHiResMap ? '/bart-system-map.png 1x, /bart-system-map@2x.png 2x' : undefined}
              alt="BART system map – all lines and stations"
              className={styles.bartMap}
              style={{
                width: imgSize ? imgSize.w * scale : undefined,
                height: imgSize ? imgSize.h * scale : undefined
              }}
              onLoad={(e) => {
                const el = e.currentTarget
                if (el.naturalWidth && el.naturalHeight) {
                  setImgSize({ w: el.naturalWidth, h: el.naturalHeight })
                }
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>
      <p className={styles.attribution}>
        © BART · <a href="https://www.bart.gov/system-map" target="_blank" rel="noopener noreferrer">Official map</a>
      </p>
    </div>
  )
}
