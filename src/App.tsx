import { useCallback, useEffect, useMemo, useState } from 'react'
import { cards as phraseCards } from './data/cards'
import {
  TENSE_META,
  filterVerbCards,
  getVerbCard,
  verbCards,
  type Tense,
  type VerbCard,
} from './data/verbs'
import {
  STREAK_TO_LEARNED,
  buildStudyQueue,
  canUseStorage,
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
} from './lib/progress'
import { usePersistentProgress } from './lib/usePersistentProgress'
import { getTrackReverse, loadSession, saveSession } from './lib/session'
import {
  isHablaTrack,
  pushHablaState,
  replaceHablaState,
  storyIdFromLocation,
  trackFromLocation,
  type HablaHistoryState,
  type HablaTrack,
} from './lib/navHistory'
import { NumbersTrack, loadNumberMasteryPercent } from './tracks/NumbersTrack'
import { DailyLifeTrack, loadDailyMasteryPercent } from './tracks/DailyLifeTrack'
import { ColorsTrack, loadColorsMasteryPercent } from './tracks/ColorsTrack'
import {
  FoundationsTrack,
  loadFoundationsMasteryPercent,
} from './tracks/FoundationsTrack'
import {
  GrammarTrack,
  loadGrammarMasteryPercent,
} from './tracks/GrammarTrack'
import {
  StoriesTrack,
  loadStoriesMasteryPercent,
} from './tracks/StoriesTrack'
import {
  ExamTrack,
  loadExamMasteryPercent,
} from './tracks/ExamTrack'
import { AnswerBurst, useAnswerFeedback } from './components/AnswerBurst'
import { CardVisual } from './components/CardVisual'
import { ChapterMark } from './components/ChapterMark'
import { TrackVisual } from './components/TrackVisual'
import { ChapterProgress } from './components/ChapterProgress'
import { FlashcardStudyPanel } from './components/FlashcardStudyPanel'
import { ResetModal } from './components/ResetModal'
import './App.css'

type Track =
  | 'hub'
  | 'phrases'
  | 'daily'
  | 'verbs'
  | 'numbers'
  | 'colors'
  | 'foundations'
  | 'grammar'
  | 'stories'
  | 'exam'
type Phase = 'start' | 'study' | 'done' | 'review-learned'

const PHRASE_KEY = 'habla:phrases:v1'
const PHRASE_LEGACY = ['making-requests-flashcards:v1']
const VERB_KEY = 'habla:verbs:v1'
const VERB_LEGACY = ['lexora:verbs:v1']

type TenseFilter = 'all' | Tense
type VerbGroupFilter = 'regular' | 'irregular'

function App() {
  const [track, setTrack] = useState<Track>(() => {
    const fromUrl = trackFromLocation()
    if (fromUrl !== 'hub') return fromUrl
    const saved = loadSession().lastTrack
    const allowed: Track[] = [
      'hub',
      'phrases',
      'daily',
      'verbs',
      'numbers',
      'colors',
      'foundations',
      'grammar',
      'stories',
      'exam',
    ]
    return saved && allowed.includes(saved as Track) ? (saved as Track) : 'hub'
  })
  const [phase, setPhase] = useState<Phase>('start')
  const [flipped, setFlipped] = useState(false)
  const [binOpen, setBinOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const [tenseFilter, setTenseFilter] = useState<TenseFilter>('all')
  const [verbGroup, setVerbGroup] = useState<VerbGroupFilter>('regular')
  const [cardFx, setCardFx] = useState<'correct' | 'incorrect' | null>(null)
  const [reverse, setReverse] = useState(() => getTrackReverse('phrases'))
  const { burst, trigger } = useAnswerFeedback()

  const [phraseProgress, setPhraseProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(phraseCards, PHRASE_KEY, PHRASE_LEGACY) ??
      createFreshState(phraseCards, true),
  )
  const [verbProgress, setVerbProgress] = useState<PersistedProgress>(
    () =>
      loadProgress(verbCards, VERB_KEY, VERB_LEGACY) ??
      createFreshState(verbCards, true),
  )

  const isVerbs = track === 'verbs'
  const deck = isVerbs ? verbCards : phraseCards
  const storageKey = isVerbs ? VERB_KEY : PHRASE_KEY
  const progress = isVerbs ? verbProgress : phraseProgress
  const setProgress = isVerbs ? setVerbProgress : setPhraseProgress

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

  const masteryPct = deckMasteryPercent(
    isVerbs ? activeVerbDeck : phraseCards,
    progress.byId,
  )
  const phraseMasteryPct = deckMasteryPercent(phraseCards, phraseProgress.byId)
  const verbMasteryPct = deckMasteryPercent(verbCards, verbProgress.byId)

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

  const studySpanish =
    isVerbs && currentVerb
      ? currentVerb.back
      : currentPhrase?.back
  const reviewSpanish = reviewCard?.back

  const phraseLearnedTotal = learnedCount(phraseCards, phraseProgress.byId)
  const [numberMasteryPct, setNumberMasteryPct] = useState(() =>
    loadNumberMasteryPercent(),
  )
  const [dailyMasteryPct, setDailyMasteryPct] = useState(() =>
    loadDailyMasteryPercent(),
  )
  const [colorsMasteryPct, setColorsMasteryPct] = useState(() =>
    loadColorsMasteryPercent(),
  )
  const [foundationsMasteryPct, setFoundationsMasteryPct] = useState(() =>
    loadFoundationsMasteryPercent(),
  )
  const [grammarMasteryPct, setGrammarMasteryPct] = useState(() =>
    loadGrammarMasteryPercent(),
  )
  const [storiesMasteryPct, setStoriesMasteryPct] = useState(() =>
    loadStoriesMasteryPercent(),
  )
  const [examMasteryPct, setExamMasteryPct] = useState(() =>
    loadExamMasteryPercent(),
  )

  useEffect(() => {
    if (track === 'hub' || track === 'numbers') {
      setNumberMasteryPct(loadNumberMasteryPercent())
    }
    if (track === 'hub' || track === 'daily') {
      setDailyMasteryPct(loadDailyMasteryPercent())
    }
    if (track === 'hub' || track === 'colors') {
      setColorsMasteryPct(loadColorsMasteryPercent())
    }
    if (track === 'hub' || track === 'foundations') {
      setFoundationsMasteryPct(loadFoundationsMasteryPercent())
    }
    if (track === 'hub' || track === 'grammar') {
      setGrammarMasteryPct(loadGrammarMasteryPercent())
    }
    if (track === 'hub' || track === 'stories') {
      setStoriesMasteryPct(loadStoriesMasteryPercent())
    }
    if (track === 'hub' || track === 'exam') {
      setExamMasteryPct(loadExamMasteryPercent())
    }
  }, [track])

  usePersistentProgress(phraseProgress, PHRASE_KEY, phraseCards, PHRASE_LEGACY)
  usePersistentProgress(verbProgress, VERB_KEY, verbCards, VERB_LEGACY)

  useEffect(() => {
    saveSession({ lastTrack: track })
  }, [track])

  const applyProgress = useCallback(
    (next: PersistedProgress) => {
      setProgress(next)
      setFlipped(false)
      if (next.queue.length === 0) setPhase('done')
    },
    [setProgress],
  )

  const applyTrack = useCallback((next: Track) => {
    setTrack(next)
    setPhase('start')
    setFlipped(false)
    setConfirmReset(false)
    setBinOpen(false)
    setReviewIndex(0)
    if (next === 'phrases') setReverse(getTrackReverse('phrases'))
    saveSession({ lastTrack: next })
  }, [])

  const setDirection = (next: boolean) => {
    setReverse(next)
    setFlipped(false)
    saveSession({ reverseByTrack: { phrases: next } })
  }

  const enterTrack = (next: Track) => {
    if (next === 'hub') {
      const state = window.history.state as HablaHistoryState | null
      if (state?.habla && state.track !== 'hub') {
        window.history.back()
        return
      }
      applyTrack('hub')
      replaceHablaState('hub')
      return
    }
    applyTrack(next)
    pushHablaState(next as HablaTrack)
  }

  useEffect(() => {
    // Keep hub under the current screen so swipe-back never leaves the site.
    const deepStory =
      track === 'stories' ? storyIdFromLocation() : null
    if (track !== 'hub') {
      replaceHablaState('hub')
      pushHablaState(track as HablaTrack)
      if (deepStory) pushHablaState('stories', deepStory)
    } else {
      replaceHablaState('hub')
    }

    const onPop = (event: PopStateEvent) => {
      const state = event.state as HablaHistoryState | null
      const next =
        state?.habla && isHablaTrack(state.track)
          ? state.track
          : trackFromLocation()
      applyTrack(next)
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // Mount once — track seed is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyTrack])

  const start = useCallback(() => {
    const studyDeck = isVerbs ? activeVerbDeck : phraseCards
    const left = learningCount(studyDeck, progress.byId)

    if (left === 0) {
      setPhase('done')
      setFlipped(false)
      return
    }

    const { queue, index } = resumeStudyQueue(
      progress,
      studyDeck,
      true,
      allowedIds,
    )

    setProgress({
      ...progress,
      queue,
      index,
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

  const flip = () => {
    setFlipped((f) => !f)
  }

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
    clearProgress(
      storageKey,
      isVerbs ? VERB_LEGACY : PHRASE_LEGACY,
    )
    const fresh = createFreshState(deck, true)
    setProgress(fresh)
    setFlipped(false)
    setConfirmReset(false)
    setBinOpen(false)
    setReviewIndex(0)
    setPhase('start')
  }, [deck, isVerbs, setProgress, storageKey])

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
          setDailyMasteryPct(loadDailyMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'colors') {
    return (
      <ColorsTrack
        onBack={() => {
          setColorsMasteryPct(loadColorsMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'numbers') {
    return (
      <NumbersTrack
        onBack={() => {
          setNumberMasteryPct(loadNumberMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'foundations') {
    return (
      <FoundationsTrack
        onBack={() => {
          setFoundationsMasteryPct(loadFoundationsMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'grammar') {
    return (
      <GrammarTrack
        onBack={() => {
          setGrammarMasteryPct(loadGrammarMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'stories') {
    return (
      <StoriesTrack
        onBack={() => {
          setStoriesMasteryPct(loadStoriesMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'exam') {
    return (
      <ExamTrack
        onBack={() => {
          setExamMasteryPct(loadExamMasteryPercent())
          enterTrack('hub')
        }}
      />
    )
  }

  if (track === 'hub') {
    const overallPct = Math.round(
      (phraseMasteryPct +
        verbMasteryPct +
        dailyMasteryPct +
        numberMasteryPct +
        colorsMasteryPct +
        foundationsMasteryPct +
        grammarMasteryPct +
        storiesMasteryPct +
        examMasteryPct) /
        9,
    )

    return (
      <div className="app hub-theme">
        <div className="atmosphere" aria-hidden="true" />

        <main className="hub">
          <header className="hub-header">
            <div className="hub-hero">
              <p className="brand">Spanish Deck</p>
              <h1>Calm, focused Spanish practice</h1>
              <p className="lede hub-lede">
                Nine tracks — flashcards, nightly stories, and honest exams. Progress stays on this device.
              </p>
            </div>
            <ChapterProgress
              className="hub-overall"
              label="Overall mastery"
              size="md"
              percent={overallPct}
              detail={`Average across ${9} learning tracks`}
            />
          </header>

          <div className="hub-grid">
            <button
              type="button"
              className="hub-card hub-foundations"
              onClick={() => enterTrack('foundations')}
            >
              <TrackVisual id="foundations" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Foundations</h2>
                  <span className="hub-pct">{foundationsMasteryPct}%</span>
                </div>
                <p>Days, every day phrases, commands, routines & more</p>
                <ChapterProgress size="sm" percent={foundationsMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-grammar"
              onClick={() => enterTrack('grammar')}
            >
              <TrackVisual id="grammar" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Grammar</h2>
                  <span className="hub-pct">{grammarMasteryPct}%</span>
                </div>
                <p>Lessons + drills: por/para, gustar, tenses</p>
                <ChapterProgress size="sm" percent={grammarMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-phrases"
              onClick={() => enterTrack('phrases')}
            >
              <TrackVisual id="phrases" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Requests</h2>
                  <span className="hub-pct">{phraseMasteryPct}%</span>
                </div>
                <p>Intentions, polite asks, connectors</p>
                <ChapterProgress size="sm" percent={phraseMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-daily"
              onClick={() => enterTrack('daily')}
            >
              <TrackVisual id="daily" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Daily life</h2>
                  <span className="hub-pct">{dailyMasteryPct}%</span>
                </div>
                <p>Situations: café, commands, travel, doctor</p>
                <ChapterProgress size="sm" percent={dailyMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-verbs"
              onClick={() => enterTrack('verbs')}
            >
              <TrackVisual id="verbs" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Verbs</h2>
                  <span className="hub-pct">{verbMasteryPct}%</span>
                </div>
                <p>Present, past, future conjugations</p>
                <ChapterProgress size="sm" percent={verbMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-numbers"
              onClick={() => enterTrack('numbers')}
            >
              <TrackVisual id="numbers" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Numbers</h2>
                  <span className="hub-pct">{numberMasteryPct}%</span>
                </div>
                <p>1 to 1,000,000</p>
                <ChapterProgress size="sm" percent={numberMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-colors"
              onClick={() => enterTrack('colors')}
            >
              <TrackVisual id="colors" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Colors</h2>
                  <span className="hub-pct">{colorsMasteryPct}%</span>
                </div>
                <p>Names, shades, useful phrases</p>
                <ChapterProgress size="sm" percent={colorsMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-stories"
              onClick={() => enterTrack('stories')}
            >
              <TrackVisual id="stories" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Stories</h2>
                  <span className="hub-pct">{storiesMasteryPct}%</span>
                </div>
                <p>31 illustrated nights — enjoy reading</p>
                <ChapterProgress size="sm" percent={storiesMasteryPct} />
              </div>
            </button>

            <button
              type="button"
              className="hub-card hub-exam"
              onClick={() => enterTrack('exam')}
            >
              <TrackVisual id="exam" />
              <div className="hub-card-body">
                <div className="hub-card-top">
                  <h2>Exam</h2>
                  <span className="hub-pct">{examMasteryPct}%</span>
                </div>
                <p>Latest chapter — test everything you’ve learned</p>
                <ChapterProgress size="sm" percent={examMasteryPct} />
              </div>
            </button>
          </div>

          <p className="hub-footnote">
            {canUseStorage()
              ? 'Progress saves on this device.'
              : 'Private browsing may not save progress.'}
          </p>
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
                className="back-btn back-hub"
                onClick={() => enterTrack('hub')}
              >
                <span className="back-btn-icon" aria-hidden="true">←</span> All tracks
              </button>
              <p className="brand">Spanish Deck</p>
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
                    className="tense-filters"
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
                        {deckMasteryPercent(
                          filterVerbCards(verbCards, { group: 'regular' }),
                          verbProgress.byId,
                        )}
                        %
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`tense-chip verb-section-chip ${verbGroup === 'irregular' ? 'is-active' : ''}`}
                      onClick={() => setVerbGroup('irregular')}
                    >
                      Irregular
                      <span className="tense-count">
                        {deckMasteryPercent(
                          filterVerbCards(verbCards, { group: 'irregular' }),
                          verbProgress.byId,
                        )}
                        %
                      </span>
                    </button>
                  </div>
                  <p className="section-hint">
                    {verbGroup === 'regular'
                      ? 'hablar · comer · vivir — predictable endings'
                      : 'ser · estar · tener · ir · hacer · querer · poder · decir · venir · dar · ver · saber · poner · salir · traer · oír · conocer'}
                  </p>

                  <div className="chapter-list" aria-label="Verb chapter progress">
                    {(
                      [
                        ['all', 'All tenses'],
                        ['present', 'Present'],
                        ['preterite', 'Past'],
                        ['future', 'Future'],
                      ] as const
                    ).map(([value, label]) => {
                      const chapter = filterVerbCards(verbCards, {
                        group: verbGroup,
                        tenses: value === 'all' ? 'all' : [value],
                      })
                      const pct = deckMasteryPercent(chapter, verbProgress.byId)
                      const learned = learnedCount(chapter, verbProgress.byId)
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`chapter-list-item chapter-row ${tenseFilter === value ? 'is-active' : ''}`}
                          onClick={() => setTenseFilter(value)}
                        >
                          <ChapterMark seed={value} label={label} />
                          <ChapterProgress
                            size="sm"
                            label={label}
                            percent={pct}
                            detail={`${learned} / ${chapter.length} learned`}
                          />
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {!isVerbs && (
                <ChapterProgress
                  label="Chapter progress"
                  percent={phraseMasteryPct}
                  detail={`${phraseLearnedTotal} of ${phraseCards.length} phrases mastered`}
                />
              )}
              {isVerbs && (
                <ChapterProgress
                  label="Selected chapter"
                  percent={masteryPct}
                  detail={`${learnedInSection} of ${activeVerbDeck.length} forms in this chapter`}
                />
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
            <FlashcardStudyPanel
              onHome={() => setPhase('start')}
              onReset={() => setConfirmReset(true)}
              learningLeft={learningLeft}
              learnedInSection={isVerbs ? learnedInSection : learnedTotal}
              streak={currentStreak}
              masteryPct={masteryPct}
              progressLabel={isVerbs ? 'This chapter' : 'Track progress'}
              flipped={flipped}
              onFlip={flip}
              showDirectionToggle={!isVerbs}
              reverse={reverse}
              onDirectionChange={setDirection}
              frontLabel={reverse ? 'Español' : 'English'}
              backLabel={reverse ? 'English' : 'Español'}
              front={
                isVerbs && currentVerb
                  ? currentVerb.front
                  : reverse
                    ? current.back
                    : current.front
              }
              back={
                isVerbs && currentVerb
                  ? currentVerb.back
                  : reverse
                    ? current.front
                    : current.back
              }
              speakText={
                (isVerbs ? currentVerb?.back : studySpanish) ?? current.back
              }
              tip={isVerbs ? currentVerb?.tip : currentPhrase?.tip}
              cardFront={current.front}
              cardBack={current.back}
              exampleEs={isVerbs ? undefined : currentPhrase?.exampleEs}
              exampleEn={isVerbs ? undefined : currentPhrase?.exampleEn}
              infinitive={currentVerb?.infinitive}
              tense={currentVerb?.tense}
              cardFx={cardFx}
              onMissed={onIncorrect}
              onGotIt={onCorrect}
              help={
                flipped
                  ? currentStreak + 1 >= STREAK_TO_LEARNED
                    ? 'Read the explanation, then one more correct sends this into the learned bin.'
                    : 'Read the explanation below. Got it builds streak; Missed resets it and requeues later.'
                  : isVerbs
                    ? 'Flip to reveal the conjugated form, hear it, and see the tip.'
                    : 'Flip to reveal Spanish, hear it, and see the explanation.'
              }
              frontFace={
                isVerbs && currentVerb ? (
                  <>
                    <div className="verb-tags">
                      <span className={`tense-pill tense-${currentVerb.tense}`}>
                        {TENSE_META[currentVerb.tense].label}
                      </span>
                      <span className="group-pill">{currentVerb.group}</span>
                    </div>
                    <CardVisual
                      infinitive={currentVerb.infinitive}
                      tense={currentVerb.tense}
                      front={currentVerb.front}
                      back={currentVerb.back}
                      tip={currentVerb.tip}
                    />
                    <p className="card-text verb-infinitive">
                      {currentVerb.infinitive}
                    </p>
                    <p className="verb-prompt">
                      <span className="verb-pronoun">
                        {currentVerb.pronounEs}
                      </span>
                      <span className="verb-meaning">
                        {currentVerb.meaning} · {currentVerb.pronounEn}
                      </span>
                    </p>
                  </>
                ) : undefined
              }
              backFace={
                isVerbs && currentVerb ? (
                  <>
                    <span className="lang-tag">Conjugated form</span>
                    <CardVisual
                      infinitive={currentVerb.infinitive}
                      tense={currentVerb.tense}
                      front={currentVerb.front}
                      back={currentVerb.back}
                      tip={currentVerb.tip}
                      size="sm"
                    />
                    <p className="card-text">{currentVerb.back}</p>
                    <p className="verb-answer-meta">
                      {currentVerb.infinitive} ·{' '}
                      {TENSE_META[currentVerb.tense].esLabel} ·{' '}
                      {currentVerb.pronounEs}
                    </p>
                  </>
                ) : undefined
              }
            />
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
                className="back-btn home-link"
                onClick={() => setPhase('start')}
              >
                <span className="back-btn-icon" aria-hidden="true">
                  ←
                </span>{' '}
                Back to start
              </button>
            </section>
          )}

          {phase === 'review-learned' && reviewCard && (
            <FlashcardStudyPanel
              homeLabel="Back"
              onHome={() => setPhase(learningLeft === 0 ? 'done' : 'study')}
              onReset={() => undefined}
              hideReset
              learningLeft={scopedLearned.length - reviewIndex}
              learnedInSection={scopedLearned.length}
              streakLabel={`${reviewIndex + 1} / ${scopedLearned.length}`}
              masteryPct={Math.round(
                ((reviewIndex + 1) / Math.max(1, scopedLearned.length)) * 100,
              )}
              flipped={flipped}
              onFlip={flip}
              showDirectionToggle={!isVerbs}
              reverse={reverse}
              onDirectionChange={setDirection}
              frontLabel={reverse ? 'Español' : 'English'}
              backLabel={
                isVerbs ? 'Form' : reverse ? 'English' : 'Español'
              }
              front={
                isVerbs
                  ? reviewCard.front
                  : reverse
                    ? reviewCard.back
                    : reviewCard.front
              }
              back={
                isVerbs || !reverse ? reviewCard.back : reviewCard.front
              }
              speakText={reviewSpanish ?? reviewCard.back}
              tip={
                isVerbs
                  ? (reviewCard as VerbCard).tip
                  : (reviewCard as (typeof phraseCards)[number]).tip
              }
              cardFront={reviewCard.front}
              cardBack={reviewCard.back}
              exampleEs={
                isVerbs
                  ? undefined
                  : (reviewCard as (typeof phraseCards)[number]).exampleEs
              }
              exampleEn={
                isVerbs
                  ? undefined
                  : (reviewCard as (typeof phraseCards)[number]).exampleEn
              }
              infinitive={
                isVerbs ? (reviewCard as VerbCard).infinitive : undefined
              }
              tense={isVerbs ? (reviewCard as VerbCard).tense : undefined}
              onMissed={() => {
                setReviewIndex((i) => Math.max(0, i - 1))
                setFlipped(false)
              }}
              onGotIt={() => {
                if (reviewIndex >= scopedLearned.length - 1) {
                  setPhase(learningLeft === 0 ? 'done' : 'study')
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
              help="Browsing learned cards."
              frontFace={
                isVerbs ? (
                  <>
                    <span className="lang-tag">Prompt</span>
                    <CardVisual
                      infinitive={(reviewCard as VerbCard).infinitive}
                      tense={(reviewCard as VerbCard).tense}
                      front={reviewCard.front}
                      back={reviewCard.back}
                      tip={(reviewCard as VerbCard).tip}
                    />
                    <p className="card-text">{reviewCard.front}</p>
                  </>
                ) : undefined
              }
              footer={
                <button
                  type="button"
                  className="ghost-btn center-ghost"
                  onClick={() => practiceLearnedAgain([reviewCard.id])}
                >
                  Move back to learning
                </button>
              }
            />
          )}
        </main>
      </div>

      {confirmReset && (
        <ResetModal
          title={`Reset ${isVerbs ? 'verbs' : 'phrases'} progress?`}
          description="This clears only this track’s learned bin, streaks, and queue. The other track stays untouched."
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  )
}

export default App
