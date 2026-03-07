import { useState, useEffect } from 'react'

interface CountdownProps {
  seconds: number
  className?: string
}

export default function Countdown({ seconds, className }: CountdownProps) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    setLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (left <= 0) return
    const t = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [left])

  const m = Math.floor(left / 60)
  const s = left % 60
  const str = `${m}m ${s}s`

  return <span className={className}>{str}</span>
}
