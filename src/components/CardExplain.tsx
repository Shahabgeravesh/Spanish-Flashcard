type Props = {
  tip?: string
  situation?: string
  /** When false, hide (e.g. before the card is revealed) */
  visible?: boolean
}

/** Learning note — render under the card after reveal so it isn’t clipped by the flip. */
export function CardExplain({ tip, situation, visible = true }: Props) {
  if (!visible || (!tip && !situation)) return null

  return (
    <aside className="card-learn" aria-live="polite">
      <p className="card-learn-label">Explanation</p>
      {situation && (
        <p className="card-situation">
          <span className="card-situation-label">When</span> {situation}
        </p>
      )}
      {tip && <p className="card-explain">{tip}</p>}
    </aside>
  )
}
