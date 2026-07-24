type Props = {
  tip?: string
  situation?: string
  /** Short grammar rule label shown above the tip */
  rule?: string
  /** When false, hide (e.g. before the card is revealed) */
  visible?: boolean
}

/** Learning note — render under the card after reveal so it isn’t clipped by the flip. */
export function CardExplain({ tip, situation, rule, visible = true }: Props) {
  if (!visible || (!tip && !situation && !rule)) return null

  return (
    <aside className="card-learn" aria-live="polite">
      <p className="card-learn-label">Explanation</p>
      {rule && (
        <p className="card-rule">
          <span className="card-rule-label">Rule</span> {rule}
        </p>
      )}
      {situation && (
        <p className="card-situation">
          <span className="card-situation-label">When</span> {situation}
        </p>
      )}
      {tip && <p className="card-explain">{tip}</p>}
    </aside>
  )
}
