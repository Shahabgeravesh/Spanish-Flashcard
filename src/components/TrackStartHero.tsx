import type { ReactNode } from 'react'
import { TrackVisual, type HubTrackId } from './TrackVisual'
import { ChapterProgress } from './ChapterProgress'

type Props = {
  brand?: string
  title: string
  subtitle: string
  description: string
  visualId: HubTrackId
  masteryPct: number
  masteryLabel?: string
  masteryDetail?: string
  stats: { label: string; value: string }[]
  previewPrompt?: string
  previewAnswer?: string
  previewHint?: string
  /** Optional visual inside the preview card (e.g. color swatch). */
  previewExtra?: ReactNode
  children?: ReactNode
  actions: ReactNode
  footer?: ReactNode
}

/** Shared rich opening layout for flashcard tracks. */
export function TrackStartHero({
  brand = 'Spanish Deck',
  title,
  subtitle,
  description,
  visualId,
  masteryPct,
  masteryLabel = 'Track progress',
  masteryDetail,
  stats,
  previewPrompt,
  previewAnswer,
  previewHint = 'Example card',
  previewExtra,
  children,
  actions,
  footer,
}: Props) {
  return (
    <section className="panel start-panel track-start">
      <div className="track-start-layout">
        <div className="track-start-main">
          <p className="brand">{brand}</p>
          <div className="track-start-title-row">
            <TrackVisual id={visualId} size="hub" className="track-start-visual" />
            <div className="track-start-copy">
              <h1 className="type-page">{title}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
          </div>
          <p className="lede">{description}</p>

          <ChapterProgress
            className="track-start-progress"
            label={masteryLabel}
            percent={masteryPct}
            detail={masteryDetail}
            size="md"
          />

          <ul className="track-start-stats" aria-label="Track scope">
            {stats.map((s) => (
              <li key={s.label}>
                <span className="track-start-stat-value">{s.value}</span>
                <span className="track-start-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>

          {children}

          <div className="cta-row track-start-cta">{actions}</div>
          {footer}
        </div>

        {(previewPrompt || previewAnswer || previewExtra) && (
          <aside className="track-start-preview" aria-label="Practice preview">
            <p className="track-start-preview-kicker">{previewHint}</p>
            <div className="track-start-preview-card">
              {previewExtra}
              {previewPrompt && (
                <p className="track-start-preview-prompt">{previewPrompt}</p>
              )}
              {previewAnswer && (
                <p className="track-start-preview-answer">{previewAnswer}</p>
              )}
            </div>
            <p className="track-start-preview-note">
              Reveal the answer, then mark Got it or Missed.
            </p>
          </aside>
        )}
      </div>
    </section>
  )
}
