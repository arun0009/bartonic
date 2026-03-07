import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem 1.25rem', color: 'var(--text)' }}>
          <h1 style={{ margin: 0, fontSize: '1.1rem' }}>Something went wrong</h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Refresh the page. If this keeps happening, please report the route and stations you selected.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
