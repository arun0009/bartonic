import type { ReactNode } from 'react'

type IconProps = {
  size?: number
  className?: string
}

function Svg({ size = 22, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function RoutesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 6.5h15a1.5 1.5 0 0 1 0 3H4.5a1.5 1.5 0 0 1 0-3Z" />
      <path d="M4.5 14.5h10a1.5 1.5 0 0 1 0 3H4.5a1.5 1.5 0 0 1 0-3Z" />
    </Svg>
  )
}

export function LookupIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="7" r="2.25" />
      <circle cx="18" cy="17" r="2.25" />
      <path d="M8.2 8.2V12.5h7.6V15" />
    </Svg>
  )
}

export function MapIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 17 9 7l4 6" />
      <path d="m13 13 7-7" />
      <path d="m9 7 7 10" />
    </Svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6v12" strokeWidth="2" />
      <path d="M6 12h12" strokeWidth="2" />
    </Svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function GripIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="7" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1.15" fill="currentColor" stroke="none" />
    </Svg>
  )
}
