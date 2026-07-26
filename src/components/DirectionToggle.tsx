type Props = {
  reverse: boolean
  onChange: (reverse: boolean) => void
  /** Prompt → answer for learn mode (default English → Español) */
  learnLabel?: string
  /** Prompt → answer for recall mode (default Español → English) */
  recallLabel?: string
  className?: string
}

/**
 * Study direction as two modes — not a buried “reverse” checkbox.
 * Learn = recognize/produce Spanish from English.
 * Recall = read Spanish and translate to English.
 */
export function DirectionToggle({
  reverse,
  onChange,
  learnLabel = 'English → Español',
  recallLabel = 'Español → English',
  className = '',
}: Props) {
  return (
    <div
      className={`direction-toggle ${className}`.trim()}
      role="group"
      aria-label="Study direction"
    >
      <button
        type="button"
        className={`direction-btn ${!reverse ? 'is-active' : ''}`}
        aria-pressed={!reverse}
        onClick={() => onChange(false)}
      >
        <span className="direction-kicker">Learn</span>
        <span className="direction-label">{learnLabel}</span>
      </button>
      <button
        type="button"
        className={`direction-btn ${reverse ? 'is-active' : ''}`}
        aria-pressed={reverse}
        onClick={() => onChange(true)}
      >
        <span className="direction-kicker">Recall</span>
        <span className="direction-label">{recallLabel}</span>
      </button>
    </div>
  )
}
