type Props = {
  label?: string
  /** 0–100 */
  percent: number
  detail?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Visual mastery bar that fills toward 100% as the learner progresses. */
export function ChapterProgress({
  label,
  percent,
  detail,
  size = 'md',
  className = '',
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)))
  const done = pct >= 100

  return (
    <div
      className={`chapter-progress chapter-progress-${size} ${done ? 'is-complete' : ''} ${className}`.trim()}
      title={detail ?? `${pct}% complete`}
    >
      <div className="chapter-progress-top">
        {label && <span className="chapter-progress-label">{label}</span>}
        <span className="chapter-progress-pct">{pct}%</span>
      </div>
      <div
        className="chapter-progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label} progress` : 'Progress'}
      >
        <div
          className="chapter-progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      {detail && <p className="chapter-progress-detail">{detail}</p>}
    </div>
  )
}
