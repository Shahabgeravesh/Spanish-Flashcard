import { useCallback, useMemo, useState } from 'react'
import {
  GRAMMAR_SECTIONS,
  filterGrammar,
  getGrammarLesson,
  grammarCards,
  type GrammarCard,
  type GrammarSection,
} from '../data/grammar'
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
import { getTrackReverse, saveSession } from '../lib/session'
import { AnswerBurst, useAnswerFeedback } from '../components/AnswerBurst'
import { SpeakButton } from '../components/SpeakButton'
import { CardExplain } from '../components/CardExplain'
import { ChapterProgress } from '../components/ChapterProgress'
import { CardVisual } from '../components/CardVisual'
import { DirectionToggle } from '../components/DirectionToggle'
import { GrammarLessonPanel } from '../components/GrammarLessonPanel'

export const GRAMMAR_KEY = 'habla:grammar:v1'

type Phase = 'start' | 'study' | 'done' | 'review-learned'
type SectionFilter = GrammarSection | 'all'

type Props = {
  onBack: () => void
}

export function GrammarTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [section, setSection] = useState<SectionFilter>('all')
  const [reverse, setReverse] = useState(() => getTrackReverse('grammar'))
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [progress, setProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(grammarCards, GRAMMAR_KEY) ??
      createFreshState(grammarCards, true),
  )

  const activeDeck = useMemo(
    () => filterGrammar(grammarCards, section),
    [section],
  )

  const allowedIds = useMemo(
    () => new Set(activeDeck.map((c) => c.id)),
    [activeDeck],
  )

  const learned = useMemo(
    () => learnedCards(grammarCards, progress.byId),
    [progress.byId],
  )

  const scopedLearned = useMemo(() => {
    if (section === 'all') return learned
    return learned.filter((c) => c.section === section)
  }, [learned, section])

  const learningLeft = learningCount(activeDeck, progress.byId)
  const learnedInSection = learnedCount(activeDeck, progress.byId)
  const learnedTotal = learnedCount(grammarCards, progress.byId)
  const masteryPct = deckMasteryPercent(activeDeck, progress.byId)

  const currentId = progress.queue[progress.index]
  const current =
    currentId != null
      ? grammarCards.find((c) => c.id === currentId)
      : undefined
  const currentStreak =
    currentId != null
      ? (progress.byId[String(currentId)]?.streak ?? 0)
      : 0
  const reviewCard = scopedLearned[reviewIndex]
  const lesson = getGrammarLesson(section)

  usePersistentProgress(progress, GRAMMAR_KEY, grammarCards)

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
    if (!current || !flipped || cardFx) return
    const willLearn = currentStreak + 1 >= STREAK_TO_LEARNED
    setCardFx('correct')
    trigger('correct', { learned: willLearn })
    window.setTimeout(() => {
      applyProgress(
        markCorrect(grammarCards, progress, current.id, allowedIds),
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
        markIncorrect(grammarCards, progress, current.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const resetAll = () => {
    clearProgress(GRAMMAR_KEY)
    setProgress(createFreshState(grammarCards, true))
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
    GRAMMAR_SECTIONS.find((s) => s.id === section)?.label ?? 'All'

  const promptOf = (card: GrammarCard) => (reverse ? card.back : card.front)
  const answerOf = (card: GrammarCard) => (reverse ? card.front : card.back)
  const speakOf = (card: GrammarCard) => card.speak ?? card.back

  const setDirection = (next: boolean) => {
    setReverse(next)
    setFlipped(false)
    saveSession({ reverseByTrack: { grammar: next } })
  }

  return (
    <div className="app grammar-theme">
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
            <span className="bin-label">Grammar learned</span>
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
            <section className="panel start-panel grammar-start">
              <button type="button" className="back-btn back-hub" onClick={onBack}>
                <span className="back-btn-icon" aria-hidden="true">
                  ←
                </span>{' '}
                All tracks
              </button>
              <p className="brand">Spanish Deck</p>
              <h1>Grammar</h1>
              <p className="subtitle">
                One short lesson, then a few cards.
              </p>

              <div
                className="grammar-chapter-chips"
                role="listbox"
                aria-label="Grammar chapters"
              >
                {GRAMMAR_SECTIONS.map((s) => {
                  const deck = filterGrammar(grammarCards, s.id)
                  const pct = deckMasteryPercent(deck, progress.byId)
                  const active = section === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`grammar-chip ${active ? 'is-active' : ''}`}
                      onClick={() => setSection(s.id)}
                    >
                      <span className="grammar-chip-label">{s.label}</span>
                      {s.id !== 'all' && (
                        <span className="grammar-chip-pct">{pct}%</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <GrammarLessonPanel
                lesson={lesson}
                section={section}
                overview={section === 'all'}
              />

              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={start}>
                  {hasSavedProgress
                    ? `Practice ${sectionLabel}`
                    : `Start ${sectionLabel}`}
                </button>
                {hasSavedProgress && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset
                  </button>
                )}
              </div>

              <p className="meta grammar-meta">
                {activeDeck.length} cards · {learningLeft} left · {masteryPct}%
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
              reverse={reverse}
              onDirectionChange={setDirection}
              frontLabel={reverse ? 'Español' : 'English'}
              backLabel={reverse ? 'English' : 'Español'}
              front={promptOf(current)}
              back={answerOf(current)}
              speakText={speakOf(current)}
              tip={current.tip}
              cardFront={current.front}
              cardBack={current.back}
              exampleEs={current.exampleEs}
              exampleEn={current.exampleEn}
              rule={current.rule}
              section={current.section}
              cardFx={cardFx}
              onMissed={onIncorrect}
              onGotIt={onCorrect}
              help={
                flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'One more correct sends this into Grammar learned.'
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
                are learned. Skim another lesson anytime.
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
              reverse={reverse}
              onDirectionChange={setDirection}
              frontLabel={reverse ? 'Español' : 'English'}
              backLabel={reverse ? 'English' : 'Español'}
              front={promptOf(reviewCard)}
              back={answerOf(reviewCard)}
              speakText={speakOf(reviewCard)}
              tip={reviewCard.tip}
              cardFront={reviewCard.front}
              cardBack={reviewCard.back}
              exampleEs={reviewCard.exampleEs}
              exampleEn={reviewCard.exampleEn}
              rule={reviewCard.rule}
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
              help="Browsing learned grammar."
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
            <h2>Reset grammar?</h2>
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
  reverse: boolean
  onDirectionChange: (reverse: boolean) => void
  learnLabel?: string
  recallLabel?: string
  frontLabel: string
  backLabel: string
  front: string
  back: string
  speakText: string
  tip: string
  cardFront: string
  cardBack: string
  exampleEs?: string
  exampleEn?: string
  rule?: string
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
    reverse,
    onDirectionChange,
    learnLabel,
    recallLabel,
    frontLabel,
    backLabel,
    front,
    back,
    speakText,
    tip,
    cardFront,
    cardBack,
    exampleEs,
    exampleEn,
    rule,
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
        <DirectionToggle
          reverse={reverse}
          onChange={onDirectionChange}
          learnLabel={learnLabel}
          recallLabel={recallLabel}
        />
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
            <CardVisual
              front={front}
              back={back}
              tip={tip}
              section={section}
            />
            <p className="card-text">{front}</p>
          </div>
          <div className="card-face card-back">
            <span className="lang-tag">{backLabel}</span>
            <CardVisual
              front={front}
              back={back}
              tip={tip}
              section={section}
              size="sm"
            />
            <p className="card-text">{back}</p>
          </div>
        </div>
      </button>

      <CardExplain visible={flipped} tip={tip} rule={rule} front={cardFront} back={cardBack} exampleEs={exampleEs} exampleEn={exampleEn} />

      <div className="actions">
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
    </section>
  )
}

export function loadGrammarMasteryPercent(): number {
  const state = loadProgress(grammarCards, GRAMMAR_KEY)
  if (!state) return 0
  return deckMasteryPercent(grammarCards, state.byId)
}
