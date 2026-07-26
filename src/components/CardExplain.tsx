import { resolveCardExample } from '../lib/cardExample'

type Props = {
  tip?: string
  situation?: string
  /** Short grammar rule label shown above the tip */
  rule?: string
  exampleEs?: string
  exampleEn?: string
  front?: string
  back?: string
  /** When false, hide (e.g. before the card is revealed) */
  visible?: boolean
}

/** Learning note under the card after reveal — example first, then why. */
export function CardExplain({
  tip,
  situation,
  rule,
  exampleEs,
  exampleEn,
  front,
  back,
  visible = true,
}: Props) {
  const example = resolveCardExample({
    front: front ?? '',
    back: back ?? '',
    tip,
    exampleEs,
    exampleEn,
  })

  if (!visible || (!tip && !situation && !rule && !example)) return null

  return (
    <aside className="card-learn" aria-live="polite">
      {example && (
        <div className="card-example">
          <p className="card-example-label">Example</p>
          <p className="card-example-es">{example.es}</p>
          <p className="card-example-en">{example.en}</p>
        </div>
      )}

      {(rule || situation || tip) && (
        <div className="card-learn-why">
          <p className="card-learn-label">Why it works</p>
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
        </div>
      )}
    </aside>
  )
}
