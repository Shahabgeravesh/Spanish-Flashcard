import type { ReactNode } from 'react'
import type { Tense } from '../data/verbs'
import { STREAK_TO_LEARNED } from '../lib/progress'
import { CardExplain } from './CardExplain'
import { CardVisual } from './CardVisual'
import { ChapterProgress } from './ChapterProgress'
import { DirectionToggle } from './DirectionToggle'
import { SpeakButton } from './SpeakButton'

export type FlashcardStudyPanelProps = {
  onHome: () => void
  onReset: () => void
  hideReset?: boolean
  learningLeft: number
  learnedInSection: number
  streak?: number
  streakLabel?: string
  masteryPct: number
  progressLabel?: string
  flipped: boolean
  onFlip: () => void
  /** When false, Learn/Recall toggle is hidden (e.g. verbs, colors). */
  showDirectionToggle?: boolean
  reverse?: boolean
  onDirectionChange?: (reverse: boolean) => void
  learnLabel?: string
  recallLabel?: string
  frontLabel: string
  backLabel: string
  front: string
  back: string
  speakText: string
  tip?: string
  cardFront: string
  cardBack: string
  exampleEs?: string
  exampleEn?: string
  section?: string
  rule?: string
  situation?: string
  category?: string
  cardFx?: 'correct' | 'incorrect' | null
  onMissed: () => void
  onGotIt: () => void
  missedLabel?: string
  gotItLabel?: string
  help: string
  homeLabel?: string
  /** Number cards — dot visualization on CardVisual */
  visualValue?: number
  /** Color swatch for Colors track */
  swatch?: string
  kind?: string
  /** Verb CardVisual hints */
  infinitive?: string
  tense?: Tense
  /** Replace default front/back face content (verbs use rich layout). */
  frontFace?: ReactNode
  backFace?: ReactNode
  /** Extra content below mark help (e.g. relearn action). */
  footer?: ReactNode
}

export function FlashcardStudyPanel(props: FlashcardStudyPanelProps) {
  const {
    onHome,
    onReset,
    hideReset,
    learningLeft,
    learnedInSection,
    streak,
    streakLabel,
    masteryPct,
    progressLabel = 'Chapter',
    flipped,
    onFlip,
    showDirectionToggle = true,
    reverse = false,
    onDirectionChange,
    learnLabel,
    recallLabel,
    frontLabel,
    backLabel,
    front,
    back,
    speakText,
    tip = '',
    cardFront,
    cardBack,
    exampleEs,
    exampleEn,
    section,
    rule,
    situation,
    category,
    cardFx = null,
    onMissed,
    onGotIt,
    missedLabel = 'Missed',
    gotItLabel = 'Got it',
    help,
    homeLabel = 'Home',
    visualValue,
    swatch,
    kind,
    infinitive,
    tense,
    frontFace,
    backFace,
    footer,
  } = props

  const busy = cardFx != null

  return (
    <section className="panel study-panel" aria-label="Study session">
      <header className="study-header">
        <div className="study-top">
          <button type="button" className="back-btn back-btn-sm" onClick={onHome}>
            <span className="back-btn-icon" aria-hidden="true">
              ←
            </span>{' '}
            {homeLabel}
          </button>
          {!hideReset && (
            <button
              type="button"
              className="text-btn danger-text"
              onClick={onReset}
            >
              Reset
            </button>
          )}
        </div>
        <div className="counters" aria-label="Session stats">
          <span>{learningLeft} left</span>
          <span className="dot" aria-hidden="true" />
          <span>{learnedInSection} learned</span>
          <span className="dot" aria-hidden="true" />
          <span>
            {streakLabel ?? `Streak ${streak ?? 0}/${STREAK_TO_LEARNED}`}
          </span>
        </div>
        {showDirectionToggle && onDirectionChange && (
          <DirectionToggle
            reverse={reverse}
            onChange={onDirectionChange}
            learnLabel={learnLabel}
            recallLabel={recallLabel}
          />
        )}
        <div className="study-progress-wrap">
          <ChapterProgress size="sm" label={progressLabel} percent={masteryPct} />
        </div>
      </header>

      <button
        type="button"
        className={`card ${flipped ? 'is-flipped' : ''}${cardFx ? ` card-fx-${cardFx}` : ''}`}
        onClick={onFlip}
        disabled={busy}
        aria-pressed={flipped}
        aria-label={flipped ? 'Hide answer' : 'Reveal answer'}
      >
        <div className="card-inner">
          <div className="card-face card-front">
            {frontFace ?? (
              <>
                {section ? (
                  <span className="lang-tag">{section}</span>
                ) : (
                  <span className="lang-tag">{frontLabel}</span>
                )}
                <CardVisual
                  front={front}
                  back={back}
                  tip={tip}
                  section={section}
                  category={category}
                  situation={situation}
                  value={visualValue}
                  swatch={swatch}
                  kind={kind}
                  infinitive={infinitive}
                  tense={tense}
                />
                <p className="card-text">{front}</p>
              </>
            )}
          </div>
          <div className="card-face card-back">
            {backFace ?? (
              <>
                <span className="lang-tag">{backLabel}</span>
                <CardVisual
                  front={front}
                  back={back}
                  tip={tip}
                  section={section}
                  category={category}
                  situation={situation}
                  size="sm"
                  value={visualValue}
                  swatch={swatch}
                  kind={kind}
                  infinitive={infinitive}
                  tense={tense}
                />
                <p className="card-text">{back}</p>
              </>
            )}
          </div>
        </div>
      </button>

      <CardExplain
        visible={flipped}
        tip={tip}
        front={cardFront}
        back={cardBack}
        exampleEs={exampleEs}
        exampleEn={exampleEn}
        rule={rule}
        situation={situation}
      />

      <div className="actions" role="group" aria-label="Card actions">
        <button
          type="button"
          className="mark mark-right"
          onClick={onGotIt}
          disabled={busy || (!flipped && gotItLabel === 'Got it')}
          aria-label={
            gotItLabel === 'Got it'
              ? 'Got it — mark this card correct'
              : gotItLabel
          }
        >
          <span className="mark-icon" aria-hidden="true">
            ✓
          </span>
          {gotItLabel}
        </button>
        <button
          type="button"
          className="mark mark-wrong"
          onClick={onMissed}
          disabled={busy || (!flipped && missedLabel === 'Missed')}
          aria-label={
            missedLabel === 'Missed'
              ? 'Missed — mark this card incorrect'
              : missedLabel
          }
        >
          {missedLabel}
        </button>
        <button
          type="button"
          className="mark mark-reveal"
          onClick={onFlip}
          disabled={busy}
        >
          {flipped ? 'Hide' : 'Reveal'}
        </button>
        <SpeakButton text={speakText} variant="mark" disabled={busy} />
      </div>
      <p className="mark-help">{help}</p>
      {footer}
    </section>
  )
}
