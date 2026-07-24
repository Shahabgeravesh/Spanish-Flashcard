import { useCallback, useMemo, useState } from 'react'
import {
  DAILY_CATEGORIES,
  DAILY_SITUATIONS,
  dailyPhraseCards,
  filterDailyPhrases,
  type DailyCategory,
  type DailyPhraseCard,
  type DailySituation,
} from '../data/dailyPhrases'
import {
  STREAK_TO_LEARNED,
  buildStudyQueue,
  clearProgress,
  createFreshState,
  deckMasteryPercent,
  learnedCards,
  learnedCount,
  learningCount,
  loadProgress,
  markCorrect,
  markIncorrect,
  resumeStudyQueue,
  unlearnCards,
  type PersistedProgress,
} from '../lib/progress'
import { usePersistentProgress } from '../lib/usePersistentProgress'
import { useSpanishVoice } from '../lib/useSpanishVoice'
import { getTrackReverse, saveSession } from '../lib/session'
import { AnswerBurst, useAnswerFeedback } from '../components/AnswerBurst'
import { SpeakButton } from '../components/SpeakButton'
import { CardExplain } from '../components/CardExplain'
import { CardVisual } from '../components/CardVisual'
import { ChapterProgress } from '../components/ChapterProgress'

export const DAILY_KEY = 'habla:daily-phrases:v1'
const DAILY_LEGACY = ['lexora:daily-phrases:v1']

type Phase = 'start' | 'study' | 'done' | 'review-learned'
type CategoryFilter = DailyCategory | 'all'
type SituationFilter = DailySituation | 'all'

type Props = {
  onBack: () => void
}

export function DailyLifeTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [situation, setSituation] = useState<SituationFilter>('all')
  const [reverse, setReverse] = useState(() => getTrackReverse('daily'))
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [progress, setProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(dailyPhraseCards, DAILY_KEY, DAILY_LEGACY) ??
      createFreshState(dailyPhraseCards, true),
  )

  const activeDeck = useMemo(
    () => filterDailyPhrases(dailyPhraseCards, category, situation),
    [category, situation],
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
    return learned.filter((c) => {
      const catOk = category === 'all' || c.category === category
      const sitOk = situation === 'all' || c.situation === situation
      return catOk && sitOk
    })
  }, [category, learned, situation])

  const learningLeft = learningCount(activeDeck, progress.byId)
  const learnedInSection = learnedCount(activeDeck, progress.byId)
  const learnedTotal = learnedCount(dailyPhraseCards, progress.byId)
  const masteryPct = deckMasteryPercent(activeDeck, progress.byId)
  const trackMasteryPct = deckMasteryPercent(dailyPhraseCards, progress.byId)

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

  const studySpanish = current?.back
  const voice = useSpanishVoice({
    spanishText: phase === 'study' ? studySpanish : undefined,
    showingSpanish:
      phase === 'study' && (reverse ? !flipped : flipped),
    cardKey: phase === 'study' ? current?.id : undefined,
  })
  useSpanishVoice({
    spanishText: phase === 'review-learned' ? reviewCard?.back : undefined,
    showingSpanish:
      phase === 'review-learned' && (reverse ? !flipped : flipped),
    cardKey: phase === 'review-learned' ? reviewCard?.id : undefined,
  })

  usePersistentProgress(progress, DAILY_KEY, dailyPhraseCards, DAILY_LEGACY)

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
    const { queue, index } = resumeStudyQueue(
      progress,
      activeDeck,
      true,
      allowedIds,
    )
    setProgress({ ...progress, queue, index })
    setFlipped(false)
    setConfirmReset(false)
    setPhase('study')
  }

  const flip = () => {
    const next = !flipped
    setFlipped(next)
    const showSpanish = reverse ? !next : next
    if (showSpanish && voice.autoSpeak && current?.back) voice.replay()
    else if (!showSpanish) voice.stop()
  }

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
    clearProgress(DAILY_KEY, DAILY_LEGACY)
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
  const situationLabel =
    DAILY_SITUATIONS.find((s) => s.id === situation)?.label ?? 'All situations'
  const filterLabel =
    category === 'all' && situation === 'all'
      ? 'All phrases'
      : [category !== 'all' ? categoryLabel : null, situation !== 'all' ? situationLabel : null]
          .filter(Boolean)
          .join(' · ')

  const promptOf = (card: DailyPhraseCard) => (reverse ? card.back : card.front)
  const answerOf = (card: DailyPhraseCard) => (reverse ? card.front : card.back)

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
              <button type="button" className="back-btn back-hub" onClick={onBack}>
                <span className="back-btn-icon" aria-hidden="true">←</span> All tracks
              </button>
              <p className="brand">Habla</p>
              <h1>Daily life phrases</h1>
              <p className="subtitle">
                {dailyPhraseCards.length} real-world lines · tips · situations
              </p>
              <p className="lede">
                Study by topic or by real situations — café, airport, hotel,
                doctor, and more. Every reveal includes a learning tip and Listen.
              </p>

              <p className="filter-heading">By topic</p>
              <div className="chapter-list" aria-label="Topic chapter progress">
                {DAILY_CATEGORIES.map((c) => {
                  const deck = filterDailyPhrases(
                    dailyPhraseCards,
                    c.id,
                    situation,
                  )
                  const pct = deckMasteryPercent(deck, progress.byId)
                  const learned = learnedCount(deck, progress.byId)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`chapter-list-item ${category === c.id ? 'is-active' : ''}`}
                      onClick={() => setCategory(c.id)}
                    >
                      <ChapterProgress
                        size="sm"
                        label={c.label}
                        percent={pct}
                        detail={`${learned} / ${deck.length}`}
                      />
                    </button>
                  )
                })}
              </div>

              <p className="filter-heading">By situation</p>
              <div className="chapter-list" aria-label="Situation chapter progress">
                {DAILY_SITUATIONS.map((s) => {
                  const deck = filterDailyPhrases(
                    dailyPhraseCards,
                    category,
                    s.id,
                  )
                  const pct = deckMasteryPercent(deck, progress.byId)
                  const learned = learnedCount(deck, progress.byId)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`chapter-list-item ${situation === s.id ? 'is-active' : ''}`}
                      onClick={() => setSituation(s.id)}
                    >
                      <ChapterProgress
                        size="sm"
                        label={s.label}
                        percent={pct}
                        detail={`${learned} / ${deck.length}`}
                      />
                    </button>
                  )
                })}
              </div>

              <ChapterProgress
                label="Selected chapter"
                percent={masteryPct}
                detail={`${learnedInSection} of ${activeDeck.length} in this filter · track ${trackMasteryPct}%`}
              />

              <div className="options">
                <label className="option">
                  <input
                    type="checkbox"
                    checked={reverse}
                    onChange={(e) => {
                      const on = e.target.checked
                      setReverse(on)
                      saveSession({ reverseByTrack: { daily: on } })
                    }}
                  />
                  Spanish → English (reverse practice)
                </label>
                {voice.supported && (
                  <label className="option">
                    <input
                      type="checkbox"
                      checked={voice.autoSpeak}
                      onChange={(e) => voice.setAutoSpeak(e.target.checked)}
                    />
                    Auto-read Spanish aloud
                  </label>
                )}
              </div>

              <div className="cta-row">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={start}
                  disabled={activeDeck.length === 0}
                >
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
                {filterLabel} · {activeDeck.length} phrases · {learningLeft}{' '}
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
              frontLabel={reverse ? 'Español' : 'English'}
              backLabel={reverse ? 'English' : 'Español'}
              front={promptOf(current)}
              back={answerOf(current)}
              speakText={current.back}
              tip={current.tip}
              situation={current.situation}
              category={current.category}
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
              <h1>{filterLabel} cleared</h1>
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
              frontLabel={reverse ? 'Español' : 'English'}
              backLabel={reverse ? 'English' : 'Español'}
              front={promptOf(reviewCard)}
              back={answerOf(reviewCard)}
              speakText={reviewCard.back}
              tip={reviewCard.tip}
              situation={reviewCard.situation}
              category={reviewCard.category}
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
  frontLabel: string
  backLabel: string
  front: string
  back: string
  speakText: string
  tip: string
  situation?: string
  category?: string
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
    frontLabel,
    backLabel,
    front,
    back,
    speakText,
    tip,
    situation,
    category,
    cardFx = null,
    onMissed,
    onGotIt,
    missedLabel = 'Missed',
    gotItLabel = 'Got it',
    help,
  } = props

  const busy = cardFx != null
  const situationLabel =
    situation != null
      ? DAILY_SITUATIONS.find((s) => s.id === situation)?.label ?? situation
      : undefined

  return (
    <section className="panel study-panel">
      <header className="study-header">
        <div className="study-top">
          <button type="button" className="back-btn back-btn-sm" onClick={onHome}>
            <span className="back-btn-icon" aria-hidden="true">
              ←
            </span>{' '}
            Home
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
        <div className="study-progress-wrap">
          <ChapterProgress
            size="sm"
            label="Chapter"
            percent={masteryPct}
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
            <span className="lang-tag">{category ?? frontLabel}</span>
            <CardVisual
              front={front}
              back={back}
              tip={tip}
              category={category}
              situation={situationLabel}
            />
            <p className="card-text">{front}</p>
          </div>
          <div className="card-face card-back">
            <span className="lang-tag">{backLabel}</span>
            <CardVisual
              front={front}
              back={back}
              tip={tip}
              category={category}
              situation={situationLabel}
              size="sm"
            />
            <p className="card-text">{back}</p>
          </div>
        </div>
      </button>

      <CardExplain
        visible={flipped}
        tip={tip}
        situation={situationLabel}
      />

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
        <SpeakButton text={speakText} variant="mark" disabled={busy} />
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
  const state = loadProgress(dailyPhraseCards, DAILY_KEY, DAILY_LEGACY)
  if (!state) return 0
  return learnedCount(dailyPhraseCards, state.byId)
}

export function loadDailyMasteryPercent(): number {
  const state = loadProgress(dailyPhraseCards, DAILY_KEY, DAILY_LEGACY)
  if (!state) return 0
  return deckMasteryPercent(dailyPhraseCards, state.byId)
}
