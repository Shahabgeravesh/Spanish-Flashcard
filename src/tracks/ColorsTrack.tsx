import { useCallback, useMemo, useState } from 'react'
import {
  COLOR_FILTERS,
  colorCards,
  filterColorCards,
  type ColorFilter,
} from '../data/colors'
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
import { AnswerBurst, useAnswerFeedback } from '../components/AnswerBurst'
import { ChapterMark } from '../components/ChapterMark'
import { ChapterProgress } from '../components/ChapterProgress'
import { FlashcardStudyPanel } from '../components/FlashcardStudyPanel'
import { ResetModal } from '../components/ResetModal'

export const COLORS_KEY = 'habla:colors:v1'

type Phase = 'start' | 'study' | 'done' | 'review-learned'

type Props = {
  onBack: () => void
}

export function ColorsTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [filter, setFilter] = useState<ColorFilter>('all')
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [progress, setProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(colorCards, COLORS_KEY) ??
      createFreshState(colorCards, true),
  )

  const activeDeck = useMemo(
    () => filterColorCards(colorCards, filter),
    [filter],
  )

  const allowedIds = useMemo(
    () => new Set(activeDeck.map((c) => c.id)),
    [activeDeck],
  )

  const learned = useMemo(
    () => learnedCards(colorCards, progress.byId),
    [progress.byId],
  )

  const scopedLearned = useMemo(() => {
    if (filter === 'all') return learned
    return learned.filter((c) => c.kind === filter)
  }, [filter, learned])

  const learningLeft = learningCount(activeDeck, progress.byId)
  const learnedInSection = learnedCount(activeDeck, progress.byId)
  const learnedTotal = learnedCount(colorCards, progress.byId)
  const masteryPct = deckMasteryPercent(activeDeck, progress.byId)
  const trackMasteryPct = deckMasteryPercent(colorCards, progress.byId)

  const currentId = progress.queue[progress.index]
  const current =
    currentId != null ? colorCards.find((c) => c.id === currentId) : undefined
  const currentStreak =
    currentId != null
      ? (progress.byId[String(currentId)]?.streak ?? 0)
      : 0
  const reviewCard = scopedLearned[reviewIndex]

  const voice = useSpanishVoice({
    spanishText: phase === 'study' ? current?.back : undefined,
  })
  useSpanishVoice({
    spanishText: phase === 'review-learned' ? reviewCard?.back : undefined,
  })

  usePersistentProgress(progress, COLORS_KEY, colorCards)

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
  }

  const onCorrect = () => {
    if (!current || !flipped) return
    const willLearn = currentStreak + 1 >= STREAK_TO_LEARNED
    setCardFx('correct')
    trigger('correct', { learned: willLearn })
    window.setTimeout(() => {
      applyProgress(
        markCorrect(colorCards, progress, current.id, allowedIds),
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
        markIncorrect(colorCards, progress, current.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const resetAll = () => {
    clearProgress(COLORS_KEY)
    setProgress(createFreshState(colorCards, true))
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

  const filterLabel =
    COLOR_FILTERS.find((f) => f.id === filter)?.label ?? 'All'

  return (
    <div className="app colors-theme">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grain" />
      </div>

      <AnswerBurst burst={burst} />

      <div className="shell">
        <aside className={`bin bin-colors ${binOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="bin-toggle"
            onClick={() => setBinOpen((o) => !o)}
            aria-expanded={binOpen}
          >
            <span className="bin-label">Colors learned</span>
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
                Colors you master ({STREAK_TO_LEARNED} in a row) land here.
              </p>
            ) : (
              <ul className="bin-list">
                {learned.map((card) => (
                  <li key={card.id}>
                    <div className="bin-phrase">
                      <span className="bin-en bin-en-with-swatch">
                        {card.swatch && (
                          <span
                            className="mini-swatch"
                            style={{ background: card.swatch }}
                            aria-hidden="true"
                          />
                        )}
                        {card.front}
                      </span>
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
              <button
                type="button"
                className="back-btn back-hub"
                onClick={onBack}
              >
                <span className="back-btn-icon" aria-hidden="true">←</span> All tracks
              </button>
              <p className="brand">Spanish Deck</p>
              <h1>Colors</h1>
              <p className="subtitle">
                {colorCards.length} cards · names, shades & phrases
              </p>
              <p className="lede">
                Learn Spanish color words with live swatches, light/dark shades,
                and everyday lines like “¿De qué color es?”
              </p>

              <div className="chapter-list" aria-label="Color chapters">
                {COLOR_FILTERS.map((f) => {
                  const deck = filterColorCards(colorCards, f.id)
                  const pct = deckMasteryPercent(deck, progress.byId)
                  const learned = learnedCount(deck, progress.byId)
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`chapter-list-item chapter-row ${filter === f.id ? 'is-active' : ''}`}
                      onClick={() => setFilter(f.id)}
                    >
                      <ChapterMark seed={String(f.id)} label={f.label} />
                      <ChapterProgress
                        size="sm"
                        label={f.label}
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
                detail={`${learnedInSection} of ${activeDeck.length} · track ${trackMasteryPct}%`}
              />

              {voice.supported && (
                <div className="options">
                </div>
              )}

              <div className="cta-row" style={{ marginTop: '1.35rem' }}>
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
                {filterLabel} · {activeDeck.length} cards · {learningLeft} still
                learning · always shuffled
              </p>
            </section>
          )}

          {phase === 'study' && current && (
            <FlashcardStudyPanel
              onHome={() => setPhase('start')}
              onReset={() => setConfirmReset(true)}
              learningLeft={learningLeft}
              learnedInSection={learnedInSection}
              streak={currentStreak}
              masteryPct={masteryPct}
              flipped={flipped}
              onFlip={flip}
              showDirectionToggle={false}
              frontLabel={current.kind}
              backLabel="Español"
              front={current.front}
              back={current.back}
              speakText={current.back}
              tip={current.tip}
              cardFront={current.front}
              cardBack={current.back}
              exampleEs={current.exampleEs}
              exampleEn={current.exampleEn}
              swatch={current.swatch}
              kind={current.kind}
              cardFx={cardFx}
              onMissed={onIncorrect}
              onGotIt={onCorrect}
              help={
                flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'One more correct sends this into Colors learned.'
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
                {learnedInSection} of {activeDeck.length} cards in this section
                are learned. Switch section anytime from Home.
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
            <FlashcardStudyPanel
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
              showDirectionToggle={false}
              frontLabel={reviewCard.kind}
              backLabel="Español"
              front={reviewCard.front}
              back={reviewCard.back}
              speakText={reviewCard.back}
              tip={reviewCard.tip}
              cardFront={reviewCard.front}
              cardBack={reviewCard.back}
              exampleEs={reviewCard.exampleEs}
              exampleEn={reviewCard.exampleEn}
              swatch={reviewCard.swatch}
              kind={reviewCard.kind}
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
              help="Browsing learned colors."
            />
          )}
        </main>
      </div>

      {confirmReset && (
        <ResetModal
          title="Reset colors progress?"
          description="Clears only this track’s learned bin and streaks. Other tracks stay untouched."
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  )
}

export function loadColorsLearnedCount(): number {
  const state = loadProgress(colorCards, COLORS_KEY)
  if (!state) return 0
  return learnedCount(colorCards, state.byId)
}

export function loadColorsMasteryPercent(): number {
  const state = loadProgress(colorCards, COLORS_KEY)
  if (!state) return 0
  return deckMasteryPercent(colorCards, state.byId)
}
