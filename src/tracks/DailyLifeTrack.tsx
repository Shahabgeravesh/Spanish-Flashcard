import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DAILY_CATEGORIES,
  dailyPhraseCards,
  filterDailyPhrases,
  type DailyCategory,
  type DailyPhraseCard,
} from '../data/dailyPhrases'
import {
  STREAK_TO_LEARNED,
  buildStudyQueue,
  clearProgress,
  createFreshState,
  learnedCards,
  learnedCount,
  learningCount,
  loadProgress,
  markCorrect,
  markIncorrect,
  saveProgress,
  unlearnCards,
  type PersistedProgress,
} from '../lib/progress'
import { AnswerBurst, useAnswerFeedback } from '../components/AnswerBurst'

export const DAILY_KEY = 'lexora:daily-phrases:v1'

type Phase = 'start' | 'study' | 'done' | 'review-learned'
type CategoryFilter = DailyCategory | 'all'

type Props = {
  onBack: () => void
}

export function DailyLifeTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [progress, setProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(dailyPhraseCards, DAILY_KEY) ??
      createFreshState(dailyPhraseCards, true),
  )

  const activeDeck = useMemo(
    () => filterDailyPhrases(dailyPhraseCards, category),
    [category],
  )

  const allowedIds = useMemo(
    () => new Set(activeDeck.map((c) => c.id)),
    [activeDeck],
  )

  const learned = useMemo(
    () => learnedCards(dailyPhraseCards, progress.byId),
    [progress.byId],
  )

  const scopedLearned = useMemo(() => {
    if (category === 'all') return learned
    return learned.filter((c) => c.category === category)
  }, [category, learned])

  const learningLeft = learningCount(activeDeck, progress.byId)
  const learnedInSection = learnedCount(activeDeck, progress.byId)
  const learnedTotal = learnedCount(dailyPhraseCards, progress.byId)
  const masteryPct = Math.round(
    (learnedInSection / Math.max(1, activeDeck.length)) * 100,
  )

  const currentId = progress.queue[progress.index]
  const current =
    currentId != null
      ? dailyPhraseCards.find((c) => c.id === currentId)
      : undefined
  const currentStreak =
    currentId != null
      ? (progress.byId[String(currentId)]?.streak ?? 0)
      : 0
  const reviewCard = scopedLearned[reviewIndex]

  useEffect(() => {
    saveProgress(progress, DAILY_KEY)
  }, [progress])

  const applyProgress = useCallback((next: PersistedProgress) => {
    setProgress(next)
    setFlipped(false)
    if (next.queue.length === 0) setPhase('done')
  }, [])

  const start = () => {
    if (activeDeck.length === 0) return
    const left = learningCount(activeDeck, progress.byId)
    if (left === 0) {
      setPhase('done')
      setFlipped(false)
      return
    }
    const queue = buildStudyQueue(
      activeDeck,
      progress.byId,
      true,
      allowedIds,
    )
    setProgress({ ...progress, queue, index: 0 })
    setFlipped(false)
    setConfirmReset(false)
    setPhase('study')
  }

  const flip = () => setFlipped((f) => !f)

  const onCorrect = () => {
    if (!current || !flipped) return
    const willLearn = currentStreak + 1 >= STREAK_TO_LEARNED
    setCardFx('correct')
    trigger('correct', { learned: willLearn })
    window.setTimeout(() => {
      applyProgress(
        markCorrect(dailyPhraseCards, progress, current.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const onIncorrect = () => {
    if (!current || !flipped) return
    setCardFx('incorrect')
    trigger('incorrect')
    window.setTimeout(() => {
      applyProgress(
        markIncorrect(dailyPhraseCards, progress, current.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const resetAll = () => {
    clearProgress(DAILY_KEY)
    setProgress(createFreshState(dailyPhraseCards, true))
    setFlipped(false)
    setConfirmReset(false)
    setBinOpen(false)
    setReviewIndex(0)
    setPhase('start')
  }

  const practiceLearnedAgain = (ids: number[]) => {
    const next = unlearnCards(progress, ids, true)
    const queue = buildStudyQueue(activeDeck, next.byId, true, allowedIds)
    setProgress({ ...next, queue, index: 0 })
    setFlipped(false)
    setReviewIndex(0)
    if (queue.length > 0) setPhase('study')
  }

  const hasSavedProgress =
    learnedTotal > 0 ||
    Object.values(progress.byId).some((p) => p.streak > 0)

  const categoryLabel =
    DAILY_CATEGORIES.find((c) => c.id === category)?.label ?? 'All'

  return (
    <div className="app daily-theme">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grain" />
      </div>

      <AnswerBurst burst={burst} />

      <div className="shell">
        <aside className={`bin bin-daily ${binOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="bin-toggle"
            onClick={() => setBinOpen((o) => !o)}
            aria-expanded={binOpen}
          >
            <span className="bin-label">Daily learned</span>
            <span className="bin-count">{learnedTotal}</span>
          </button>

          <div className="bin-body">
            <div className="bin-stats">
              <div>
                <span className="stat-num">{learningLeft}</span>
                <span className="stat-label">in section</span>
              </div>
              <div>
                <span className="stat-num">{learnedInSection}</span>
                <span className="stat-label">learned</span>
              </div>
              <div>
                <span className="stat-num">{masteryPct}%</span>
                <span className="stat-label">mastery</span>
              </div>
            </div>

            {learned.length === 0 ? (
              <p className="bin-empty">
                Daily phrases you master ({STREAK_TO_LEARNED} in a row) land
                here.
              </p>
            ) : (
              <ul className="bin-list">
                {learned.slice(0, 80).map((card) => (
                  <li key={card.id}>
                    <div className="bin-phrase">
                      <span className="bin-en">{card.front}</span>
                      <span className="bin-es">{card.back}</span>
                    </div>
                    <button
                      type="button"
                      className="bin-relearn"
                      onClick={() => practiceLearnedAgain([card.id])}
                    >
                      Relearn
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {learned.length > 0 && (
              <div className="bin-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    if (scopedLearned.length === 0) return
                    setReviewIndex(0)
                    setFlipped(false)
                    setPhase('review-learned')
                  }}
                  disabled={scopedLearned.length === 0}
                >
                  Review section
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() =>
                    practiceLearnedAgain(scopedLearned.map((c) => c.id))
                  }
                  disabled={scopedLearned.length === 0}
                >
                  Practice section again
                </button>
              </div>
            )}
          </div>
        </aside>

        <main className="stage">
          {phase === 'start' && (
            <section className="panel start-panel">
              <button type="button" className="text-btn back-hub" onClick={onBack}>
                ← All tracks
              </button>
              <p className="brand">Habla</p>
              <h1>Daily life phrases</h1>
              <p className="subtitle">
                {dailyPhraseCards.length} real-world lines · English → Spanish
              </p>
              <p className="lede">
                Greetings, food, shopping, travel, feelings, phone, weather, and
                more — the phrases people actually use every day.
              </p>

              <div className="tense-filters" role="group" aria-label="Category">
                {DAILY_CATEGORIES.map((c) => {
                  const count = filterDailyPhrases(
                    dailyPhraseCards,
                    c.id,
                  ).length
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`tense-chip ${category === c.id ? 'is-active' : ''}`}
                      onClick={() => setCategory(c.id)}
                    >
                      {c.label}
                      <span className="tense-count">{count}</span>
                    </button>
                  )
                })}
              </div>

              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={start}>
                  {hasSavedProgress ? 'Continue studying' : 'Start studying'}
                </button>
                {hasSavedProgress && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset this track
                  </button>
                )}
              </div>

              <p className="meta">
                {categoryLabel} · {activeDeck.length} phrases · {learningLeft}{' '}
                still learning · {learnedInSection} learned in section
              </p>
            </section>
          )}

          {phase === 'study' && current && (
            <StudyPanel
              onHome={() => setPhase('start')}
              onReset={() => setConfirmReset(true)}
              learningLeft={learningLeft}
              learnedInSection={learnedInSection}
              streak={currentStreak}
              masteryPct={masteryPct}
              flipped={flipped}
              onFlip={flip}
              front={current.front}
              back={current.back}
              category={(current as DailyPhraseCard).category}
              hint={false}
              cardFx={cardFx}
              onMissed={onIncorrect}
              onGotIt={onCorrect}
              help={
                flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'One more correct sends this into Daily learned.'
                    : 'Got it builds streak; Missed resets and requeues later.'
                  : 'Flip first, then mark yourself.'
              }
            />
          )}

          {phase === 'done' && (
            <section className="panel done-panel">
              <p className="brand">Session complete</p>
              <h1>{categoryLabel} cleared</h1>
              <p className="lede">
                {learnedInSection} of {activeDeck.length} phrases in this
                category are learned. Pick another category anytime.
              </p>
              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={start}>
                  Continue
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setPhase('start')}
                >
                  Back to start
                </button>
              </div>
            </section>
          )}

          {phase === 'review-learned' && reviewCard && (
            <StudyPanel
              onHome={() => setPhase('start')}
              onReset={() => undefined}
              hideReset
              learningLeft={scopedLearned.length - reviewIndex}
              learnedInSection={learnedInSection}
              streakLabel={`${reviewIndex + 1} / ${scopedLearned.length}`}
              masteryPct={Math.round(
                ((reviewIndex + 1) / Math.max(1, scopedLearned.length)) * 100,
              )}
              flipped={flipped}
              onFlip={flip}
              front={reviewCard.front}
              back={reviewCard.back}
              category={reviewCard.category}
              hint={false}
              onMissed={() => {
                setReviewIndex((i) => Math.max(0, i - 1))
                setFlipped(false)
              }}
              onGotIt={() => {
                if (reviewIndex >= scopedLearned.length - 1) {
                  setPhase('start')
                  setFlipped(false)
                  return
                }
                setReviewIndex((i) => i + 1)
                setFlipped(false)
              }}
              missedLabel="Previous"
              gotItLabel={
                reviewIndex >= scopedLearned.length - 1 ? 'Done' : 'Next'
              }
              help="Browsing learned daily phrases."
            />
          )}
        </main>
      </div>

      {confirmReset && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Reset daily phrases?</h2>
            <p>
              Clears only this track’s learned bin and streaks. Other tracks stay
              untouched.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
              <button type="button" className="danger-btn" onClick={resetAll}>
                Reset this track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StudyPanel(props: {
  onHome: () => void
  onReset: () => void
  hideReset?: boolean
  learningLeft: number
  learnedInSection: number
  streak?: number
  streakLabel?: string
  masteryPct: number
  flipped: boolean
  onFlip: () => void
  front: string
  back: string
  category?: string
  hint: boolean
  cardFx?: 'correct' | 'incorrect' | null
  onMissed: () => void
  onGotIt: () => void
  missedLabel?: string
  gotItLabel?: string
  help: string
}) {
  const {
    onHome,
    onReset,
    hideReset,
    learningLeft,
    learnedInSection,
    streak,
    streakLabel,
    masteryPct,
    flipped,
    onFlip,
    front,
    back,
    category,
    hint,
    cardFx = null,
    onMissed,
    onGotIt,
    missedLabel = 'Missed',
    gotItLabel = 'Got it',
    help,
  } = props

  const busy = cardFx != null

  return (
    <section className="panel study-panel">
      <header className="study-header">
        <div className="study-top">
          <button type="button" className="text-btn" onClick={onHome}>
            ← Home
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
        <div className="counters">
          <span>{learningLeft} left</span>
          <span className="dot" aria-hidden="true" />
          <span>{learnedInSection} learned</span>
          <span className="dot" aria-hidden="true" />
          <span>
            {streakLabel ?? `Streak ${streak ?? 0}/${STREAK_TO_LEARNED}`}
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, masteryPct)}%` }}
          />
        </div>
      </header>

      <button
        type="button"
        className={`card ${flipped ? 'is-flipped' : ''}${cardFx ? ` card-fx-${cardFx}` : ''}`}
        onClick={onFlip}
        disabled={busy}
      >
        <div className="card-inner">
          <div className="card-face card-front">
            {category && (
              <span className="lang-tag">{category}</span>
            )}
            {!category && <span className="lang-tag">English</span>}
            <p className="card-text">{front}</p>
            {hint && <span className="flip-hint">Tap to flip</span>}
          </div>
          <div className="card-face card-back">
            <span className="lang-tag">Español</span>
            <p className="card-text">{back}</p>
          </div>
        </div>
      </button>

      <div className="actions">
        <button
          type="button"
          className="mark mark-wrong"
          onClick={onMissed}
          disabled={busy || (!flipped && missedLabel === 'Missed')}
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
        <button
          type="button"
          className="mark mark-right"
          onClick={onGotIt}
          disabled={busy || (!flipped && gotItLabel === 'Got it')}
        >
          {gotItLabel}
        </button>
      </div>
      <p className="mark-help">{help}</p>
    </section>
  )
}

export function loadDailyLearnedCount(): number {
  const state = loadProgress(dailyPhraseCards, DAILY_KEY)
  if (!state) return 0
  return learnedCount(dailyPhraseCards, state.byId)
}
