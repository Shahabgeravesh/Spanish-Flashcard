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
import { getTrackReverse, saveSession } from '../lib/session'
import { AnswerBurst, useAnswerFeedback } from '../components/AnswerBurst'
import { ChapterProgress } from '../components/ChapterProgress'
import { ChapterMark } from '../components/ChapterMark'
import { FlashcardStudyPanel } from '../components/FlashcardStudyPanel'
import { ResetModal } from '../components/ResetModal'
import { TrackStartHero } from '../components/TrackStartHero'

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

  const setDirection = (next: boolean) => {
    setReverse(next)
    setFlipped(false)
    saveSession({ reverseByTrack: { foundations: next } })
  }

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
            <>
              <button type="button" className="back-btn back-hub" onClick={onBack}>
                <span className="back-btn-icon" aria-hidden="true">
                  ←
                </span>{' '}
                All tracks
              </button>
              <TrackStartHero
                title="Foundations"
                subtitle="Days, months, commands, routines, and more"
                description="Build the vocabulary every learner needs. Reveal tips and Listen for pronunciation as you go."
                visualId="foundations"
                masteryPct={trackMasteryPct}
                masteryLabel="Track progress"
                masteryDetail={`${learnedTotal} learned overall · selected chapter ${masteryPct}%`}
                stats={[
                  { label: 'Cards', value: String(activeDeck.length) },
                  { label: 'Learning', value: String(learningLeft) },
                  { label: 'Learned', value: String(learnedInSection) },
                ]}
                previewPrompt={activeDeck[0]?.front ?? 'Monday'}
                previewAnswer={activeDeck[0]?.back ?? 'lunes'}
                actions={
                  <>
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
                  </>
                }
                footer={
                  <p className="meta">
                    {sectionLabel} · {activeDeck.length} cards · {learningLeft}{' '}
                    still learning
                  </p>
                }
              >
                <div className="chapter-list" aria-label="Foundation chapters">
                  {FOUNDATION_SECTIONS.map((s) => {
                    const deck = filterFoundations(foundationCards, s.id)
                    const pct = deckMasteryPercent(deck, progress.byId)
                    const learned = learnedCount(deck, progress.byId)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`chapter-list-item chapter-row ${section === s.id ? 'is-active' : ''}`}
                        onClick={() => setSection(s.id)}
                      >
                        <ChapterMark seed={String(s.id)} label={s.label} />
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
              </TrackStartHero>
            </>
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
        <ResetModal
          title="Reset foundations?"
          description="Clears only this track’s learned bin and streaks. Other tracks stay untouched."
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
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
