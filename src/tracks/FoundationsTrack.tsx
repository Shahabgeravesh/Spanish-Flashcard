import { useCallback, useMemo, useState } from 'react'
import {
  FOUNDATION_SECTIONS,
  filterFoundations,
  foundationCards,
  type FoundationCard,
  type FoundationSection,
} from '../data/foundations'
import {
  STREAK_TO_LEARNED,
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
import { ChapterProgress } from '../components/ChapterProgress'

export const FOUNDATIONS_KEY = 'habla:foundations:v1'

type Phase = 'start' | 'study' | 'done' | 'review-learned'
type SectionFilter = FoundationSection | 'all'

type Props = {
  onBack: () => void
}

export function FoundationsTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [section, setSection] = useState<SectionFilter>('all')
  const [reverse, setReverse] = useState(() => getTrackReverse('foundations'))
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [progress, setProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(foundationCards, FOUNDATIONS_KEY) ??
      createFreshState(foundationCards, true),
  )

  const activeDeck = useMemo(
    () => filterFoundations(foundationCards, section),
    [section],
  )

  const allowedIds = useMemo(
    () => new Set(activeDeck.map((c) => c.id)),
    [activeDeck],
  )

  const learned = useMemo(
    () => learnedCards(foundationCards, progress.byId),
    [progress.byId],
  )

  const scopedLearned = useMemo(() => {
    if (section === 'all') return learned
    return learned.filter((c) => c.section === section)
  }, [learned, section])

  const learningLeft = learningCount(activeDeck, progress.byId)
  const learnedInSection = learnedCount(activeDeck, progress.byId)
  const learnedTotal = learnedCount(foundationCards, progress.byId)
  const masteryPct = deckMasteryPercent(activeDeck, progress.byId)
  const trackMasteryPct = deckMasteryPercent(foundationCards, progress.byId)

  const currentId = progress.queue[progress.index]
  const current =
    currentId != null
      ? foundationCards.find((c) => c.id === currentId)
      : undefined
  const currentStreak =
    currentId != null
      ? (progress.byId[String(currentId)]?.streak ?? 0)
      : 0
  const reviewCard = scopedLearned[reviewIndex]

  const voice = useSpanishVoice({
    spanishText: phase === 'study' ? current?.back : undefined,
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

  usePersistentProgress(progress, FOUNDATIONS_KEY, foundationCards)

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
    if (!current || !flipped || cardFx) return
    const willLearn = currentStreak + 1 >= STREAK_TO_LEARNED
    setCardFx('correct')
    trigger('correct', { learned: willLearn })
    window.setTimeout(() => {
      applyProgress(
        markCorrect(foundationCards, progress, current.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const onIncorrect = () => {
    if (!current || !flipped || cardFx) return
    setCardFx('incorrect')
    trigger('incorrect')
    window.setTimeout(() => {
      applyProgress(
        markIncorrect(foundationCards, progress, current.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const resetAll = () => {
    clearProgress(FOUNDATIONS_KEY)
    setProgress(createFreshState(foundationCards, true))
    setConfirmReset(false)
    setPhase('start')
    setFlipped(false)
    setReviewIndex(0)
  }

  const practiceLearnedAgain = (ids: number[]) => {
    setProgress(unlearnCards(progress, ids, true))
    setPhase('start')
    setFlipped(false)
  }

  const openLearnedReview = () => {
    if (scopedLearned.length === 0) return
    setReviewIndex(0)
    setFlipped(false)
    setPhase('review-learned')
  }

  const hasSavedProgress =
    learnedTotal > 0 ||
    Object.values(progress.byId).some((p) => p.streak > 0)

  const sectionLabel =
    FOUNDATION_SECTIONS.find((s) => s.id === section)?.label ?? 'All'

  const promptOf = (card: FoundationCard) => (reverse ? card.back : card.front)
  const answerOf = (card: FoundationCard) => (reverse ? card.front : card.back)
  const speakOf = (card: FoundationCard) => card.speak ?? card.back

  return (
    <div className="app foundations-theme">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grain" />
      </div>

      <AnswerBurst burst={burst} />

      <div className="shell">
        <aside className={`bin ${binOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="bin-toggle"
            onClick={() => setBinOpen((o) => !o)}
            aria-expanded={binOpen}
          >
            <span className="bin-label">Foundations learned</span>
            <span className="bin-count">{learnedTotal}</span>
          </button>
          <div className="bin-body">
            <div className="bin-stats">
              <div>
                <span className="stat-num">{learningLeft}</span>
                <span className="stat-label">in section</span>
              </div>
              <div>
                <span className="stat-num">{learnedTotal}</span>
                <span className="stat-label">learned</span>
              </div>
              <div>
                <span className="stat-num">{masteryPct}%</span>
                <span className="stat-label">mastery</span>
              </div>
            </div>
            {learned.length === 0 ? (
              <p className="bin-empty">
                Master cards ({STREAK_TO_LEARNED} correct in a row) to fill this
                bin.
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
                  onClick={openLearnedReview}
                >
                  Review bin
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
              <h1>Foundations</h1>
              <p className="subtitle">
                Days, months, questions, articles, ser vs estar, family & more
              </p>
              <p className="lede">
                Core building blocks every Spanish learner needs — with tips on
                every reveal and Listen for pronunciation.
              </p>

              <div className="chapter-list" aria-label="Foundation chapters">
                {FOUNDATION_SECTIONS.map((s) => {
                  const deck = filterFoundations(foundationCards, s.id)
                  const pct = deckMasteryPercent(deck, progress.byId)
                  const learned = learnedCount(deck, progress.byId)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`chapter-list-item ${section === s.id ? 'is-active' : ''}`}
                      onClick={() => setSection(s.id)}
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
                detail={`${learnedInSection} of ${activeDeck.length} · track ${trackMasteryPct}%`}
              />

              <div className="options">
                <label className="option">
                  <input
                    type="checkbox"
                    checked={reverse}
                    onChange={(e) => {
                      const on = e.target.checked
                      setReverse(on)
                      saveSession({ reverseByTrack: { foundations: on } })
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
                {sectionLabel} · {activeDeck.length} cards · {learningLeft} still
                learning · {learnedInSection} learned in section
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
              speakText={speakOf(current)}
              tip={current.tip}
              section={current.section}
              cardFx={cardFx}
              onMissed={onIncorrect}
              onGotIt={onCorrect}
              help={
                flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'One more correct sends this into Foundations learned.'
                    : 'Got it builds streak; Missed resets and requeues later.'
                  : 'Flip first, then mark yourself.'
              }
            />
          )}

          {phase === 'done' && (
            <section className="panel done-panel">
              <p className="brand">Session complete</p>
              <h1>{sectionLabel} cleared</h1>
              <p className="lede">
                {learnedInSection} of {activeDeck.length} cards in this section
                are learned. Pick another section anytime.
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
              speakText={speakOf(reviewCard)}
              tip={reviewCard.tip}
              section={reviewCard.section}
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
              help="Browsing learned foundations."
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
            <h2>Reset foundations?</h2>
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
  section?: string
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
    section,
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
        <div className="study-progress-wrap">
          <ChapterProgress size="sm" label="Chapter" percent={masteryPct} />
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
            {section && <span className="lang-tag">{section}</span>}
            {!section && <span className="lang-tag">{frontLabel}</span>}
            <p className="card-text">{front}</p>
          </div>
          <div className="card-face card-back">
            <span className="lang-tag">{backLabel}</span>
            <p className="card-text">{back}</p>
          </div>
        </div>
      </button>

      <CardExplain visible={flipped} tip={tip} />

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

export function loadFoundationsLearnedCount(): number {
  const state = loadProgress(foundationCards, FOUNDATIONS_KEY)
  if (!state) return 0
  return learnedCount(foundationCards, state.byId)
}

export function loadFoundationsMasteryPercent(): number {
  const state = loadProgress(foundationCards, FOUNDATIONS_KEY)
  if (!state) return 0
  return deckMasteryPercent(foundationCards, state.byId)
}
