import { useCallback, useMemo, useState } from 'react'
import {
  filterNumberCards,
  getNumberCard,
  numberCards,
  type NumberCard,
} from '../data/numberCards'
import {
  NUMBER_RANGES,
  formatNumberDisplay,
  numberToSpanish,
  randomNumberInGroup,
  type NumberPatternGroup,
  type NumberRangeId,
} from '../lib/spanishNumbers'
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
import { getTrackReverse, saveSession } from '../lib/session'
import { AnswerBurst, useAnswerFeedback } from '../components/AnswerBurst'
import { ChapterMark } from '../components/ChapterMark'
import { ChapterProgress } from '../components/ChapterProgress'
import { FlashcardStudyPanel } from '../components/FlashcardStudyPanel'
import { ResetModal } from '../components/ResetModal'
import { TrackStartHero } from '../components/TrackStartHero'

export const NUMBER_KEY = 'habla:numbers:v1'
const NUMBER_LEGACY = ['lexora:numbers:v1']

type Phase = 'start' | 'study' | 'done' | 'review-learned' | 'drill'
type RangeFilter = 'all' | NumberRangeId
type StudyMode = 'foundations' | 'drill'

type DrillCard = {
  id: number
  value: number
  front: string
  back: string
}

type Props = {
  onBack: () => void
}

const DRILL_SIZE = 20

function buildDrillDeck(
  range: NumberRangeId,
  group: NumberPatternGroup,
): DrillCard[] {
  const meta = NUMBER_RANGES.find((r) => r.id === range) ?? NUMBER_RANGES[0]
  const cards: DrillCard[] = []
  const seen = new Set<number>()
  let guard = 0
  while (cards.length < DRILL_SIZE && guard < DRILL_SIZE * 40) {
    guard += 1
    const value = randomNumberInGroup(meta.min, meta.max, group)
    if (value == null || seen.has(value)) continue
    seen.add(value)
    cards.push({
      id: value,
      value,
      front: formatNumberDisplay(value),
      back: numberToSpanish(value),
    })
  }
  return cards
}

export function NumbersTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [mode, setMode] = useState<StudyMode>('foundations')
  const [numberGroup, setNumberGroup] =
    useState<NumberPatternGroup>('irregular')
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>('1-100')
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [reverse, setReverse] = useState(() => getTrackReverse('numbers'))
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [progress, setProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(numberCards, NUMBER_KEY, NUMBER_LEGACY) ??
      createFreshState(numberCards, true),
  )

  const [drillDeck, setDrillDeck] = useState<DrillCard[]>([])
  const [drillIndex, setDrillIndex] = useState(0)
  const [drillCorrect, setDrillCorrect] = useState(0)
  const [drillMissed, setDrillMissed] = useState(0)

  const activeFoundations = useMemo(() => {
    return filterNumberCards(numberCards, {
      range: rangeFilter,
      group: numberGroup,
    })
  }, [numberGroup, rangeFilter])

  const allowedIds = useMemo(() => {
    return new Set(activeFoundations.map((c) => c.id))
  }, [activeFoundations])

  const learned = useMemo(
    () => learnedCards(numberCards, progress.byId),
    [progress.byId],
  )

  const scopedLearned = useMemo(
    () => learned.filter((c) => c.group === numberGroup),
    [learned, numberGroup],
  )

  const learningLeft = learningCount(activeFoundations, progress.byId)
  const learnedInSection = learnedCount(activeFoundations, progress.byId)
  const learnedTotal = learnedCount(numberCards, progress.byId)
  const masteryPct = deckMasteryPercent(activeFoundations, progress.byId)
  const trackMasteryPct = deckMasteryPercent(numberCards, progress.byId)

  const currentId = progress.queue[progress.index]
  const currentFoundation =
    currentId != null ? getNumberCard(currentId) : undefined
  const currentDrill = drillDeck[drillIndex]
  const currentStreak =
    currentId != null
      ? (progress.byId[String(currentId)]?.streak ?? 0)
      : 0

  const reviewCard = scopedLearned[reviewIndex]

  usePersistentProgress(progress, NUMBER_KEY, numberCards, NUMBER_LEGACY)

  const applyProgress = useCallback((next: PersistedProgress) => {
    setProgress(next)
    setFlipped(false)
    if (next.queue.length === 0) setPhase('done')
  }, [])

  const startFoundations = () => {
    if (activeFoundations.length === 0) return
    const left = learningCount(activeFoundations, progress.byId)
    if (left === 0) {
      setPhase('done')
      setFlipped(false)
      return
    }
    const { queue, index } = resumeStudyQueue(
      progress,
      activeFoundations,
      true,
      allowedIds,
    )
    setProgress({ ...progress, queue, index })
    setFlipped(false)
    setConfirmReset(false)
    setPhase('study')
  }

  const startDrill = () => {
    const range =
      rangeFilter === 'all' ? '1-1000000' : (rangeFilter as NumberRangeId)
    const deck = buildDrillDeck(range, numberGroup)
    if (deck.length === 0) {
      setPhase('start')
      return
    }
    setDrillDeck(deck)
    setDrillIndex(0)
    setDrillCorrect(0)
    setDrillMissed(0)
    setFlipped(false)
    setPhase('drill')
  }

  const start = () => {
    if (mode === 'drill') startDrill()
    else startFoundations()
  }

  const flip = () => {
    setFlipped((f) => !f)
  }

  const onCorrect = () => {
    if (!currentFoundation || !flipped) return
    const willLearn = currentStreak + 1 >= STREAK_TO_LEARNED
    setCardFx('correct')
    trigger('correct', { learned: willLearn })
    window.setTimeout(() => {
      applyProgress(
        markCorrect(numberCards, progress, currentFoundation.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const onIncorrect = () => {
    if (!currentFoundation || !flipped) return
    setCardFx('incorrect')
    trigger('incorrect')
    window.setTimeout(() => {
      applyProgress(
        markIncorrect(numberCards, progress, currentFoundation.id, allowedIds),
      )
      setCardFx(null)
    }, 420)
  }

  const advanceDrill = (knewIt: boolean) => {
    if (!flipped) return
    setCardFx(knewIt ? 'correct' : 'incorrect')
    trigger(knewIt ? 'correct' : 'incorrect')
    window.setTimeout(() => {
      if (knewIt) setDrillCorrect((n) => n + 1)
      else setDrillMissed((n) => n + 1)
      const next = drillIndex + 1
      if (next >= drillDeck.length) {
        setPhase('done')
        setFlipped(false)
        setCardFx(null)
        return
      }
      setDrillIndex(next)
      setFlipped(false)
      setCardFx(null)
    }, 420)
  }

  const resetAll = () => {
    clearProgress(NUMBER_KEY, NUMBER_LEGACY)
    setProgress(createFreshState(numberCards, true))
    setFlipped(false)
    setConfirmReset(false)
    setBinOpen(false)
    setReviewIndex(0)
    setPhase('start')
  }

  const practiceLearnedAgain = (ids: number[]) => {
    const next = unlearnCards(progress, ids, true)
    const queue = buildStudyQueue(
      activeFoundations,
      next.byId,
      true,
      allowedIds,
    )
    setProgress({ ...next, queue, index: 0 })
    setFlipped(false)
    setReviewIndex(0)
    if (queue.length > 0) setPhase('study')
  }

  const frontOf = (card: { front: string; back: string }) =>
    reverse ? card.back : card.front
  const backOf = (card: { front: string; back: string }) =>
    reverse ? card.front : card.back
  const tipOf = (card: { value: number; group?: NumberPatternGroup }) => {
    if (card.value === 100)
      return 'cien alone; ciento before another number (ciento uno).'
    if (card.value === 1000) return 'mil never takes un: mil, not un mil.'
    if (card.value === 1_000_000)
      return 'un millón de… — millón needs un and often de before a noun.'
    if (card.group === 'irregular')
      return 'Irregular form — memorize it; tens 11–29 and special hundreds break the regular pattern.'
    if (card.value >= 31 && card.value < 100)
      return 'From 31 up: tens + y + ones (treinta y uno).'
    return 'Say the number in Spanish aloud — stress and linking matter with larger figures.'
  }

  const setDirection = (next: boolean) => {
    setReverse(next)
    setFlipped(false)
    saveSession({ reverseByTrack: { numbers: next } })
  }

  const hasSavedProgress =
    learnedTotal > 0 ||
    Object.values(progress.byId).some((p) => p.streak > 0)

  const rangeLabel =
    rangeFilter === 'all'
      ? '1 – 1,000,000'
      : (NUMBER_RANGES.find((r) => r.id === rangeFilter)?.label ?? rangeFilter)

  return (
    <div className="app numbers-theme">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grain" />
      </div>

      <AnswerBurst burst={burst} />

      <div className="shell">
        <aside className={`bin bin-numbers ${binOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="bin-toggle"
            onClick={() => setBinOpen((o) => !o)}
            aria-expanded={binOpen}
          >
            <span className="bin-label">Numbers learned</span>
            <span className="bin-count">{learnedTotal}</span>
          </button>

          <div className="bin-body">
            <div className="bin-stats">
              <div>
                <span className="stat-num">{learningLeft}</span>
                <span className="stat-label">learning</span>
              </div>
              <div>
                <span className="stat-num">{learnedInSection}</span>
                <span className="stat-label">in section</span>
              </div>
              <div>
                <span className="stat-num">{masteryPct}%</span>
                <span className="stat-label">mastery</span>
              </div>
            </div>

            {learned.length === 0 ? (
              <p className="bin-empty">
                Foundation numbers you master ({STREAK_TO_LEARNED} in a row) land
                here. Random drills test any number up to one million.
              </p>
            ) : (
              <ul className="bin-list">
                {learned.map((card) => (
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
                  Review this section
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
                title="Numbers"
                subtitle="1 → 1,000,000 · Digits ↔ Spanish"
                description="Study irregular forms and regular patterns by range, then drill random numbers up to one million."
                visualId="numbers"
                masteryPct={trackMasteryPct}
                masteryLabel="Track progress"
                masteryDetail={`${learnedTotal} learned overall · selected range ${masteryPct}%`}
                stats={[
                  {
                    label: 'Cards',
                    value: String(
                      mode === 'drill' ? DRILL_SIZE : activeFoundations.length,
                    ),
                  },
                  {
                    label: mode === 'drill' ? 'Drill size' : 'Learning',
                    value: String(
                      mode === 'drill' ? DRILL_SIZE : learningLeft,
                    ),
                  },
                  {
                    label: 'Learned',
                    value: String(learnedInSection),
                  },
                ]}
                previewPrompt={
                  activeFoundations[0]?.front ??
                  formatNumberDisplay(42)
                }
                previewAnswer={
                  activeFoundations[0]?.back ?? numberToSpanish(42)
                }
                previewHint={
                  mode === 'drill' ? 'Drill style' : 'Example card'
                }
                actions={
                  <>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={start}
                      disabled={
                        mode === 'foundations' && activeFoundations.length === 0
                      }
                    >
                      {mode === 'drill'
                        ? `Drill ${numberGroup} · ${rangeLabel}`
                        : hasSavedProgress
                          ? 'Continue foundations'
                          : 'Start foundations'}
                    </button>
                    {hasSavedProgress && mode === 'foundations' && (
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
                    {mode === 'drill'
                      ? `${DRILL_SIZE} ${numberGroup} numbers · range ${rangeLabel}`
                      : activeFoundations.length === 0
                        ? `No ${numberGroup} foundation cards in this range — try Irregular or a wider range.`
                        : `${numberGroup} · ${activeFoundations.length} cards · ${learningLeft} still learning`}
                  </p>
                }
              >
                <div
                  className="mode-toggle verb-sections"
                  role="group"
                  aria-label="Number type"
                >
                  <button
                    type="button"
                    className={`tense-chip verb-section-chip ${numberGroup === 'irregular' ? 'is-active' : ''}`}
                    onClick={() => setNumberGroup('irregular')}
                  >
                    Irregular
                    <span className="tense-count">
                      {deckMasteryPercent(
                        filterNumberCards(numberCards, { group: 'irregular' }),
                        progress.byId,
                      )}
                      %
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`tense-chip verb-section-chip ${numberGroup === 'regular' ? 'is-active' : ''}`}
                    onClick={() => setNumberGroup('regular')}
                  >
                    Regular
                    <span className="tense-count">
                      {deckMasteryPercent(
                        filterNumberCards(numberCards, { group: 'regular' }),
                        progress.byId,
                      )}
                      %
                    </span>
                  </button>
                </div>
                <p className="section-hint">
                  {numberGroup === 'irregular'
                    ? 'Special forms: 1–29, cien, quinientos / setecientos / novecientos, mil, un millón…'
                    : 'Formula patterns: treinta y…, doscientos…, dos mil…'}
                </p>

                <div className="mode-toggle" role="group" aria-label="Study mode">
                  <button
                    type="button"
                    className={`tense-chip ${mode === 'foundations' ? 'is-active' : ''}`}
                    onClick={() => setMode('foundations')}
                  >
                    Foundations
                  </button>
                  <button
                    type="button"
                    className={`tense-chip ${mode === 'drill' ? 'is-active' : ''}`}
                    onClick={() => setMode('drill')}
                  >
                    Random drill
                  </button>
                </div>

                <div className="chapter-list" aria-label="Number range chapters">
                  {NUMBER_RANGES.map((r) => {
                    const deck = filterNumberCards(numberCards, {
                      range: r.id,
                      group: numberGroup,
                    })
                    const pct = deckMasteryPercent(deck, progress.byId)
                    const learned = learnedCount(deck, progress.byId)
                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={`chapter-list-item chapter-row ${rangeFilter === r.id ? 'is-active' : ''}`}
                        onClick={() => setRangeFilter(r.id)}
                      >
                        <ChapterMark seed={String(r.id)} label={r.label} />
                        <ChapterProgress
                          size="sm"
                          label={r.label}
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

          {phase === 'study' && currentFoundation && (
            <FlashcardStudyPanel
              homeLabel="Home"
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
              learnLabel="Number → Spanish"
              recallLabel="Spanish → Number"
              frontLabel={reverse ? 'Spanish' : 'Number'}
              backLabel={reverse ? 'Number' : 'Spanish'}
              front={frontOf(currentFoundation)}
              back={backOf(currentFoundation)}
              speakText={currentFoundation.back}
              tip={tipOf(currentFoundation)}
              cardFront={currentFoundation.front}
              cardBack={currentFoundation.back}
              visualValue={currentFoundation.value}
              section="numbers"
              onMissed={onIncorrect}
              onGotIt={onCorrect}
              cardFx={cardFx}
              help={
                flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'One more correct sends this into Numbers learned.'
                    : 'Got it builds streak; Missed resets and requeues later.'
                  : 'Flip first, then mark yourself.'
              }
            />
          )}

          {phase === 'drill' && currentDrill && (
            <FlashcardStudyPanel
              homeLabel="Home"
              onHome={() => setPhase('start')}
              onReset={() => setPhase('start')}
              hideReset
              learningLeft={drillDeck.length - drillIndex}
              learnedInSection={drillCorrect}
              streakLabel={`${drillCorrect} hit · ${drillMissed} miss`}
              masteryPct={Math.round(
                (drillIndex / Math.max(1, drillDeck.length)) * 100,
              )}
              flipped={flipped}
              onFlip={flip}
              reverse={reverse}
              onDirectionChange={setDirection}
              learnLabel="Number → Spanish"
              recallLabel="Spanish → Number"
              frontLabel={reverse ? 'Spanish' : 'Number'}
              backLabel={reverse ? 'Number' : 'Spanish'}
              front={frontOf(currentDrill)}
              back={backOf(currentDrill)}
              speakText={currentDrill.back}
              tip={tipOf(currentDrill)}
              cardFront={currentDrill.front}
              cardBack={currentDrill.back}
              visualValue={currentDrill.value}
              section="numbers"
              onMissed={() => advanceDrill(false)}
              onGotIt={() => advanceDrill(true)}
              cardFx={cardFx}
              help={
                flipped
                  ? `Card ${drillIndex + 1} of ${drillDeck.length}`
                  : 'Say it aloud, then flip and mark yourself.'
              }
            />
          )}

          {phase === 'done' && (
            <section className="panel done-panel">
              <p className="brand">Session complete</p>
              <h1>
                {mode === 'drill'
                  ? 'Drill finished'
                  : `${numberGroup === 'regular' ? 'Regular' : 'Irregular'} section cleared`}
              </h1>
              <p className="lede">
                {mode === 'drill'
                  ? `You marked ${drillCorrect} correct and ${drillMissed} missed out of ${drillDeck.length} ${numberGroup} numbers in range ${rangeLabel}.`
                  : `${learnedInSection} of ${activeFoundations.length} ${numberGroup} foundations in this range are learned.`}
              </p>
              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={start}>
                  {mode === 'drill' ? 'Drill again' : 'Continue'}
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
              homeLabel="Back"
              onHome={() => setPhase(learningLeft === 0 ? 'done' : 'start')}
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
              learnLabel="Number → Spanish"
              recallLabel="Spanish → Number"
              frontLabel={reverse ? 'Spanish' : 'Number'}
              backLabel={reverse ? 'Number' : 'Spanish'}
              front={frontOf(reviewCard)}
              back={backOf(reviewCard)}
              speakText={reviewCard.back}
              tip={tipOf(reviewCard)}
              cardFront={reviewCard.front}
              cardBack={reviewCard.back}
              visualValue={reviewCard.value}
              section="numbers"
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
              help="Browsing learned numbers in this section."
            />
          )}
        </main>
      </div>

      {confirmReset && (
        <ResetModal
          title="Reset numbers progress?"
          description="Clears only the Numbers learned bin and foundation streaks. Other tracks stay untouched."
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  )
}


export function loadNumberLearnedCount(): number {
  const state = loadProgress(numberCards, NUMBER_KEY, NUMBER_LEGACY)
  if (!state) return 0
  return learnedCount(numberCards, state.byId)
}

export function loadNumberMasteryPercent(): number {
  const state = loadProgress(numberCards, NUMBER_KEY, NUMBER_LEGACY)
  if (!state) return 0
  return deckMasteryPercent(numberCards, state.byId)
}

// keep type export for App if needed
export type { NumberCard }
