import { useCallback, useEffect, useMemo, useState } from 'react'
import { cards as phraseCards } from './data/cards'
import { dailyPhraseCards } from './data/dailyPhrases'
import {
  TENSE_META,
  countByGroup,
  filterVerbCards,
  getVerbCard,
  verbCards,
  type Tense,
  type VerbCard,
} from './data/verbs'
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
} from './lib/progress'
import { NumbersTrack, loadNumberLearnedCount } from './tracks/NumbersTrack'
import { DailyLifeTrack, loadDailyLearnedCount } from './tracks/DailyLifeTrack'
import { AnswerBurst, useAnswerFeedback } from './components/AnswerBurst'
import './App.css'

type Track = 'hub' | 'phrases' | 'daily' | 'verbs' | 'numbers'
type Phase = 'start' | 'study' | 'done' | 'review-learned'

const PHRASE_KEY = 'making-requests-flashcards:v1'
const VERB_KEY = 'lexora:verbs:v1'
const dailyPhraseCount = dailyPhraseCards.length

type TenseFilter = 'all' | Tense
type VerbGroupFilter = 'regular' | 'irregular'

function App() {
  const [track, setTrack] = useState<Track>('hub')
  const [phase, setPhase] = useState<Phase>('start')
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [tenseFilter, setTenseFilter] = useState<TenseFilter>('all')
  const [verbGroup, setVerbGroup] = useState<VerbGroupFilter>('regular')
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const { burst, trigger } = useAnswerFeedback()

  const [phraseProgress, setPhraseProgress] = useState<PersistedProgress>(
    () => loadProgress(phraseCards, PHRASE_KEY) ?? createFreshState(phraseCards, true),
  )
  const [verbProgress, setVerbProgress] = useState<PersistedProgress>(
    () => loadProgress(verbCards, VERB_KEY) ?? createFreshState(verbCards, true),
  )

  const isVerbs = track === 'verbs'
  const deck = isVerbs ? verbCards : phraseCards
  const storageKey = isVerbs ? VERB_KEY : PHRASE_KEY
  const progress = isVerbs ? verbProgress : phraseProgress
  const setProgress = isVerbs ? setVerbProgress : setPhraseProgress

  const verbGroupCounts = useMemo(() => countByGroup(verbCards), [])

  const activeVerbDeck = useMemo(() => {
    if (!isVerbs) return verbCards
    return filterVerbCards(verbCards, {
      group: verbGroup,
      tenses: tenseFilter === 'all' ? 'all' : [tenseFilter],
    })
  }, [isVerbs, tenseFilter, verbGroup])

  const allowedIds = useMemo(() => {
    if (!isVerbs) return undefined
    return new Set(activeVerbDeck.map((c) => c.id))
  }, [activeVerbDeck, isVerbs])

  const learned = useMemo(() => {
    if (isVerbs) return learnedCards(verbCards, progress.byId)
    return learnedCards(phraseCards, progress.byId)
  }, [isVerbs, progress.byId])

  const scopedLearned = useMemo(() => {
    if (!isVerbs) return learned
    return (learned as VerbCard[]).filter((c) => {
      if (c.group !== verbGroup) return false
      if (tenseFilter !== 'all' && c.tense !== tenseFilter) return false
      return true
    })
  }, [isVerbs, learned, tenseFilter, verbGroup])

  const learningLeft = useMemo(() => {
    if (isVerbs) {
      return learningCount(activeVerbDeck, progress.byId)
    }
    return learningCount(phraseCards, progress.byId)
  }, [activeVerbDeck, isVerbs, progress.byId])

  const learnedInSection = useMemo(() => {
    if (!isVerbs) return learnedCount(phraseCards, progress.byId)
    return learnedCount(activeVerbDeck, progress.byId)
  }, [activeVerbDeck, isVerbs, progress.byId])

  const learnedTotal = useMemo(() => {
    if (isVerbs) return learnedCount(verbCards, progress.byId)
    return learnedCount(phraseCards, progress.byId)
  }, [isVerbs, progress.byId])

  const masteryPct = Math.round(
    (learnedInSection / Math.max(1, isVerbs ? activeVerbDeck.length : deck.length)) *
      100,
  )

  const currentId = progress.queue[progress.index]
  const currentPhrase =
    !isVerbs && currentId != null
      ? phraseCards.find((c) => c.id === currentId)
      : undefined
  const currentVerb =
    isVerbs && currentId != null ? getVerbCard(currentId) : undefined
  const current = isVerbs ? currentVerb : currentPhrase

  const currentStreak =
    currentId != null
      ? (progress.byId[String(currentId)]?.streak ?? 0)
      : 0

  const reviewCard = scopedLearned[reviewIndex]

  const phraseLearnedTotal = learnedCount(phraseCards, phraseProgress.byId)
  const verbLearnedTotal = learnedCount(verbCards, verbProgress.byId)
  const [numberLearnedTotal, setNumberLearnedTotal] = useState(() =>
    loadNumberLearnedCount(),
  )
  const [dailyLearnedTotal, setDailyLearnedTotal] = useState(() =>
    loadDailyLearnedCount(),
  )

  useEffect(() => {
    if (track === 'hub' || track === 'numbers') {
      setNumberLearnedTotal(loadNumberLearnedCount())
    }
    if (track === 'hub' || track === 'daily') {
      setDailyLearnedTotal(loadDailyLearnedCount())
    }
  }, [track])

  useEffect(() => {
    if (track === 'phrases') saveProgress(phraseProgress, PHRASE_KEY)
  }, [phraseProgress, track])

  useEffect(() => {
    if (track === 'verbs') saveProgress(verbProgress, VERB_KEY)
  }, [track, verbProgress])

  // Persist both whenever they change (covers hub view too)
  useEffect(() => {
    saveProgress(phraseProgress, PHRASE_KEY)
  }, [phraseProgress])

  useEffect(() => {
    saveProgress(verbProgress, VERB_KEY)
  }, [verbProgress])

  const applyProgress = useCallback(
    (next: PersistedProgress) => {
      setProgress(next)
      setFlipped(false)
      if (next.queue.length === 0) setPhase('done')
    },
    [setProgress],
  )

  const enterTrack = (next: Track) => {
    setTrack(next)
    setPhase('start')
    setFlipped(false)
    setConfirmReset(false)
    setBinOpen(false)
    setReviewIndex(0)
  }

  const start = useCallback(() => {
    const studyDeck = isVerbs ? activeVerbDeck : phraseCards
    const left = learningCount(studyDeck, progress.byId)

    if (left === 0) {
      setPhase('done')
      setFlipped(false)
      return
    }

    const queue = buildStudyQueue(
      studyDeck,
      progress.byId,
      true,
      allowedIds,
    )

    setProgress({
      ...progress,
      queue,
      index: 0,
    })
    setFlipped(false)
    setConfirmReset(false)
    setPhase('study')
  }, [
    activeVerbDeck,
    allowedIds,
    isVerbs,
    progress,
    setProgress,
  ])

  const flip = () => setFlipped((f) => !f)

  const onCorrect = useCallback(() => {
    if (!current || !flipped) return
    const willLearn = currentStreak + 1 >= STREAK_TO_LEARNED
    setCardFx('correct')
    trigger('correct', { learned: willLearn })
    window.setTimeout(() => {
      applyProgress(markCorrect(deck, progress, current.id, allowedIds))
      setCardFx(null)
    }, 420)
  }, [
    allowedIds,
    applyProgress,
    current,
    currentStreak,
    deck,
    flipped,
    progress,
    trigger,
  ])

  const onIncorrect = useCallback(() => {
    if (!current || !flipped) return
    setCardFx('incorrect')
    trigger('incorrect')
    window.setTimeout(() => {
      applyProgress(markIncorrect(deck, progress, current.id, allowedIds))
      setCardFx(null)
    }, 420)
  }, [allowedIds, applyProgress, current, deck, flipped, progress, trigger])

  const resetAll = useCallback(() => {
    clearProgress(storageKey)
    const fresh = createFreshState(deck, true)
    setProgress(fresh)
    setFlipped(false)
    setConfirmReset(false)
    setBinOpen(false)
    setReviewIndex(0)
    setPhase('start')
  }, [deck, setProgress, true, storageKey])

  const practiceLearnedAgain = useCallback(
    (ids: number[]) => {
      const next = unlearnCards(progress, ids, true)
      const studyDeck = isVerbs ? activeVerbDeck : phraseCards
      const queue = buildStudyQueue(
        studyDeck,
        next.byId,
        true,
        allowedIds,
      )
      setProgress({ ...next, queue, index: 0 })
      setFlipped(false)
      setReviewIndex(0)
      if (queue.length > 0) setPhase('study')
    },
    [activeVerbDeck, allowedIds, isVerbs, progress, setProgress],
  )

  const openLearnedReview = () => {
    if (scopedLearned.length === 0) return
    setReviewIndex(0)
    setFlipped(false)
    setPhase('review-learned')
  }

  const hasSavedProgress =
    learnedTotal > 0 ||
    Object.values(progress.byId).some((p) => p.streak > 0)

  if (track === 'daily') {
    return (
      <DailyLifeTrack
        onBack={() => {
          setDailyLearnedTotal(loadDailyLearnedCount())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'numbers') {
    return (
      <NumbersTrack
        onBack={() => {
          setNumberLearnedTotal(loadNumberLearnedCount())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'hub') {
    return (
      <div className="app hub-theme">
        <div className="atmosphere" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="grain" />
        </div>

        <main className="hub">
          <header className="hub-header">
            <p className="brand">Habla</p>
            <h1>Choose a practice track</h1>
            <p className="lede hub-lede">
              Four colorful tracks — requests, daily life, verbs, and numbers.
              Flip, mark yourself, celebrate wins.
            </p>
          </header>

          <div className="hub-grid hub-grid-4">
            <button
              type="button"
              className="hub-card hub-phrases"
              onClick={() => enterTrack('phrases')}
            >
              <span className="hub-kicker">Track 01</span>
              <h2>Requests & intentions</h2>
              <p>
                Making requests, intentions, and useful connectors — English to
                Spanish.
              </p>
              <div className="hub-meta">
                <span>{phraseCards.length} cards</span>
                <span>{phraseLearnedTotal} learned</span>
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-daily"
              onClick={() => enterTrack('daily')}
            >
              <span className="hub-kicker">Track 02</span>
              <h2>Daily life phrases</h2>
              <p>
                Greetings, food, shopping, travel, feelings, phone, weather —
                lines people use every day.
              </p>
              <div className="hub-meta">
                <span>{dailyPhraseCount} cards</span>
                <span>{dailyLearnedTotal} learned</span>
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-verbs"
              onClick={() => enterTrack('verbs')}
            >
              <span className="hub-kicker">Track 03</span>
              <h2>Verb conjugations</h2>
              <p>
                Present, past, and future for all pronouns — regular and
                irregular, studied separately.
              </p>
              <div className="hub-meta">
                <span>{verbCards.length} forms</span>
                <span>{verbLearnedTotal} learned</span>
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-numbers"
              onClick={() => enterTrack('numbers')}
            >
              <span className="hub-kicker">Track 04</span>
              <h2>Numbers</h2>
              <p>
                From 1 to 1,000,000 — regular and irregular forms, foundations
                and drills.
              </p>
              <div className="hub-meta">
                <span>1 – 1M</span>
                <span>{numberLearnedTotal} learned</span>
              </div>
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={`app ${isVerbs ? 'verbs-theme' : 'phrases-theme'}`}>
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grain" />
      </div>

      <AnswerBurst burst={burst} />

      <div className="shell">
        <aside className={`bin ${binOpen ? 'is-open' : ''} ${isVerbs ? 'bin-verbs' : ''}`}>
          <button
            type="button"
            className="bin-toggle"
            onClick={() => setBinOpen((o) => !o)}
            aria-expanded={binOpen}
          >
            <span className="bin-label">
              {isVerbs ? 'Verbs learned' : 'Phrases learned'}
            </span>
            <span className="bin-count">{learnedTotal}</span>
          </button>

          <div className="bin-body">
            <div className="bin-stats">
              <div>
                <span className="stat-num">{learningLeft}</span>
                <span className="stat-label">
                  {isVerbs ? 'in section' : 'learning'}
                </span>
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
                {isVerbs
                  ? `Forms you master (${STREAK_TO_LEARNED} correct in a row) land here — a separate bin from the other track.`
                  : `Phrases you master (${STREAK_TO_LEARNED} correct in a row) land here.`}
              </p>
            ) : (
              <ul className="bin-list">
                {learned.slice(0, 80).map((card) => {
                  const verb = isVerbs ? (card as VerbCard) : null
                  return (
                    <li key={card.id}>
                      <div className="bin-phrase">
                        <span className="bin-en">
                          {verb
                            ? `${verb.infinitive} · ${TENSE_META[verb.tense].label}`
                            : card.front}
                        </span>
                        <span className="bin-es">
                          {verb
                            ? `${verb.pronounEs} → ${verb.back}`
                            : card.back}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="bin-relearn"
                        onClick={() => practiceLearnedAgain([card.id])}
                        title="Practice again"
                      >
                        Relearn
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {learned.length > 80 && (
              <p className="bin-empty">Showing first 80 of {learned.length}…</p>
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
                    practiceLearnedAgain(learned.map((c) => c.id))
                  }
                >
                  Practice all again
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
                className="text-btn back-hub"
                onClick={() => enterTrack('hub')}
              >
                ← All tracks
              </button>
              <p className="brand">Habla</p>
              <h1>{isVerbs ? 'Verb conjugations' : 'Making requests'}</h1>
              <p className="subtitle">
                {isVerbs
                  ? 'Present · Past · Future · All pronouns'
                  : 'Intentions & phrases · English → Spanish'}
              </p>
              <p className="lede">
                {isVerbs
                  ? 'Pick Regular or Irregular, then drill present / past / future. Mastered forms move into your Verbs learned bin.'
                  : 'Flip each card, mark yourself honestly, and watch phrases move into your Phrases learned bin.'}
              </p>

              {isVerbs && (
                <>
                  <div
                    className="mode-toggle verb-sections"
                    role="group"
                    aria-label="Verb type"
                  >
                    <button
                      type="button"
                      className={`tense-chip verb-section-chip ${verbGroup === 'regular' ? 'is-active' : ''}`}
                      onClick={() => setVerbGroup('regular')}
                    >
                      Regular
                      <span className="tense-count">
                        {verbGroupCounts.regular}
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`tense-chip verb-section-chip ${verbGroup === 'irregular' ? 'is-active' : ''}`}
                      onClick={() => setVerbGroup('irregular')}
                    >
                      Irregular
                      <span className="tense-count">
                        {verbGroupCounts.irregular}
                      </span>
                    </button>
                  </div>
                  <p className="section-hint">
                    {verbGroup === 'regular'
                      ? 'hablar · comer · vivir — predictable endings'
                      : 'ser · estar · tener · ir · hacer · querer · poder · decir · venir'}
                  </p>

                  <div
                    className="tense-filters"
                    role="group"
                    aria-label="Tense filter"
                  >
                    {(
                      [
                        ['all', 'All tenses'],
                        ['present', 'Present'],
                        ['preterite', 'Past'],
                        ['future', 'Future'],
                      ] as const
                    ).map(([value, label]) => {
                      const count = filterVerbCards(verbCards, {
                        group: verbGroup,
                        tenses: value === 'all' ? 'all' : [value],
                      }).length
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`tense-chip ${tenseFilter === value ? 'is-active' : ''}`}
                          onClick={() => setTenseFilter(value)}
                        >
                          {label}
                          <span className="tense-count">{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

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
                {isVerbs
                  ? `${verbGroup === 'regular' ? 'Regular' : 'Irregular'} · ${activeVerbDeck.length} forms · ${learningLeft} still learning · ${learnedInSection} learned in this section`
                  : `${phraseCards.length} cards · ${STREAK_TO_LEARNED} streak to learn · ${learnedTotal} already learned`}
              </p>
            </section>
          )}

          {phase === 'study' && current && (
            <section className="panel study-panel">
              <header className="study-header">
                <div className="study-top">
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => setPhase('start')}
                  >
                    ← Home
                  </button>
                  <button
                    type="button"
                    className="text-btn danger-text"
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset
                  </button>
                </div>

                <div className="counters">
                  <span>{learningLeft} remaining</span>
                  <span className="dot" aria-hidden="true" />
                  <span>
                    {isVerbs
                      ? `${learnedInSection} in section`
                      : `${learnedTotal} learned`}
                  </span>
                  <span className="dot" aria-hidden="true" />
                  <span>
                    Streak {currentStreak}/{STREAK_TO_LEARNED}
                  </span>
                </div>

                <div
                  className="progress-track"
                  title={`${masteryPct}% mastered`}
                >
                  <div
                    className="progress-fill"
                    style={{ width: `${masteryPct}%` }}
                  />
                </div>
              </header>

              <button
                type="button"
                className={`card ${flipped ? 'is-flipped' : ''}${cardFx ? ` card-fx-${cardFx}` : ''}`}
                onClick={flip}
                aria-label={
                  flipped ? 'Show prompt' : 'Show answer'
                }
                disabled={cardFx != null}
              >
                <div className="card-inner">
                  <div className="card-face card-front">
                    {isVerbs && currentVerb ? (
                      <>
                        <div className="verb-tags">
                          <span className={`tense-pill tense-${currentVerb.tense}`}>
                            {TENSE_META[currentVerb.tense].label}
                          </span>
                          <span className="group-pill">
                            {currentVerb.group}
                          </span>
                        </div>
                        <p className="card-text verb-infinitive">
                          {currentVerb.infinitive}
                        </p>
                        <p className="verb-prompt">
                          <span className="verb-pronoun">{currentVerb.pronounEs}</span>
                          <span className="verb-meaning">
                            {currentVerb.meaning} · {currentVerb.pronounEn}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="lang-tag">English</span>
                        <p className="card-text">{current.front}</p>
                      </>
                    )}
                  </div>
                  <div className="card-face card-back">
                    {isVerbs && currentVerb ? (
                      <>
                        <span className="lang-tag">Conjugated form</span>
                        <p className="card-text">{currentVerb.back}</p>
                        <p className="verb-answer-meta">
                          {currentVerb.infinitive} ·{' '}
                          {TENSE_META[currentVerb.tense].esLabel} ·{' '}
                          {currentVerb.pronounEs}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="lang-tag">Español</span>
                        <p className="card-text">{current.back}</p>
                      </>
                    )}
                  </div>
                </div>
              </button>

              <div className="actions">
                <button
                  type="button"
                  className="mark mark-wrong"
                  onClick={onIncorrect}
                  disabled={!flipped || cardFx != null}
                >
                  Missed
                </button>
                <button
                  type="button"
                  className="mark mark-reveal"
                  onClick={flip}
                  disabled={cardFx != null}
                >
                  {flipped ? 'Hide' : 'Reveal'}
                </button>
                <button
                  type="button"
                  className="mark mark-right"
                  onClick={onCorrect}
                  disabled={!flipped || cardFx != null}
                >
                  Got it
                </button>
              </div>
              <p className="mark-help">
                {flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'One more correct sends this into the learned bin.'
                    : 'Got it builds streak; Missed resets it and requeues later.'
                  : 'Flip first, then mark yourself.'}
              </p>
            </section>
          )}

          {phase === 'done' && (
            <section className="panel done-panel">
              <p className="brand">Session complete</p>
              <h1>
                {isVerbs
                  ? `${verbGroup === 'regular' ? 'Regular' : 'Irregular'} verbs done${
                      tenseFilter === 'all'
                        ? ''
                        : ` · ${TENSE_META[tenseFilter].label}`
                    }`
                  : 'All phrases learned'}
              </h1>
              <p className="lede">
                {isVerbs
                  ? `${learnedInSection} of ${activeVerbDeck.length} forms in this section are learned. Switch section anytime from Home.`
                  : `${learnedTotal} of ${deck.length} in this track are in your learned bin.`}
              </p>
              <div className="cta-row">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={openLearnedReview}
                  disabled={scopedLearned.length === 0}
                >
                  Review Learned
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setConfirmReset(true)}
                >
                  Reset this track
                </button>
              </div>
              <button
                type="button"
                className="text-btn home-link"
                onClick={() => setPhase('start')}
              >
                Back to start
              </button>
            </section>
          )}

          {phase === 'review-learned' && reviewCard && (
            <section className="panel study-panel">
              <header className="study-header">
                <div className="study-top">
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() =>
                      setPhase(learningLeft === 0 ? 'done' : 'study')
                    }
                  >
                    ← Back
                  </button>
                  <span className="counters">
                    Learned {reviewIndex + 1} / {scopedLearned.length}
                  </span>
                </div>
              </header>

              <button
                type="button"
                className={`card ${flipped ? 'is-flipped' : ''}`}
                onClick={flip}
              >
                <div className="card-inner">
                  <div className="card-face card-front">
                    {isVerbs ? (
                      <>
                        <span className="lang-tag">Prompt</span>
                        <p className="card-text">{reviewCard.front}</p>
                      </>
                    ) : (
                      <>
                        <span className="lang-tag">English</span>
                        <p className="card-text">{reviewCard.front}</p>
                      </>
                    )}
                  </div>
                  <div className="card-face card-back">
                    <span className="lang-tag">
                      {isVerbs ? 'Form' : 'Español'}
                    </span>
                    <p className="card-text">{reviewCard.back}</p>
                  </div>
                </div>
              </button>

              <div className="actions review-actions">
                <button
                  type="button"
                  className="mark mark-reveal"
                  disabled={reviewIndex === 0}
                  onClick={() => {
                    setReviewIndex((i) => Math.max(0, i - 1))
                    setFlipped(false)
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="mark mark-right"
                  onClick={() => {
                    if (reviewIndex >= scopedLearned.length - 1) {
                      setPhase(learningLeft === 0 ? 'done' : 'study')
                      setFlipped(false)
                      return
                    }
                    setReviewIndex((i) => i + 1)
                    setFlipped(false)
                  }}
                >
                  {reviewIndex >= scopedLearned.length - 1 ? 'Done' : 'Next'}
                </button>
              </div>
              <button
                type="button"
                className="ghost-btn center-ghost"
                onClick={() => practiceLearnedAgain([reviewCard.id])}
              >
                Move back to learning
              </button>
            </section>
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
            aria-labelledby="reset-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="reset-title">
              Reset {isVerbs ? 'verbs' : 'phrases'} progress?
            </h2>
            <p>
              This clears only this track’s learned bin, streaks, and queue. The
              other track stays untouched.
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

export default App
