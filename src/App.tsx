import { useCallback, useMemo, useState } from 'react'
import { cards as allCards, shuffle, type FlashCard } from './data/cards'
import './App.css'

type Phase = 'start' | 'study' | 'done'

function App() {
  const [phase, setPhase] = useState<Phase>('start')
  const [deck, setDeck] = useState<FlashCard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set())
  const [repeatUntilCorrect, setRepeatUntilCorrect] = useState(true)
  const [shuffleOnStart, setShuffleOnStart] = useState(true)
  const [showAnswerHint, setShowAnswerHint] = useState(true)

  const current = deck[index]
  const remaining = deck.length - index
  const progress = useMemo(() => {
    if (deck.length === 0) return 0
    return Math.round((knownIds.size / allCards.length) * 100)
  }, [deck.length, knownIds.size])

  const start = useCallback(() => {
    const ordered = shuffleOnStart ? shuffle(allCards) : [...allCards]
    setDeck(ordered)
    setIndex(0)
    setFlipped(false)
    setKnownIds(new Set())
    setPhase('study')
  }, [shuffleOnStart])

  const flip = () => setFlipped((f) => !f)

  const advance = useCallback(
    (knewIt: boolean) => {
      if (!current) return

      const nextKnown = new Set(knownIds)
      if (knewIt) nextKnown.add(current.id)
      else nextKnown.delete(current.id)
      setKnownIds(nextKnown)

      let nextDeck = deck
      if (repeatUntilCorrect && !knewIt) {
        // Send missed card toward the end of the remaining deck
        const rest = deck.slice(index + 1)
        const insertAt = Math.min(rest.length, 2 + Math.floor(Math.random() * 3))
        const requeued = [
          ...rest.slice(0, insertAt),
          current,
          ...rest.slice(insertAt),
        ]
        nextDeck = [...deck.slice(0, index + 1), ...requeued]
        setDeck(nextDeck)
      }

      const nextIndex = index + 1
      if (nextIndex >= nextDeck.length) {
        if (repeatUntilCorrect && nextKnown.size < allCards.length) {
          const missed = shuffle(
            allCards.filter((c) => !nextKnown.has(c.id)),
          )
          setDeck(missed)
          setIndex(0)
          setFlipped(false)
          return
        }
        setPhase('done')
        return
      }

      setIndex(nextIndex)
      setFlipped(false)
    },
    [current, deck, index, knownIds, repeatUntilCorrect],
  )

  return (
    <div className="app">
      <div className="desk" aria-hidden="true" />
      <main className="stage">
        {phase === 'start' && (
          <section className="panel start-panel">
            <p className="eyebrow">Flash cards</p>
            <h1>Making requests, INTENTIONS, Phrases</h1>
            <p className="lede">
              Test yourself using cards with prompts on the front and answers
              on the back. English → Spanish.
            </p>

            <div className="options">
              <label className="option">
                <input
                  type="checkbox"
                  checked={shuffleOnStart}
                  onChange={(e) => setShuffleOnStart(e.target.checked)}
                />
                Shuffle item order
              </label>
              <label className="option">
                <input
                  type="checkbox"
                  checked={repeatUntilCorrect}
                  onChange={(e) => setRepeatUntilCorrect(e.target.checked)}
                />
                Repeat cards until all correct
              </label>
              <label className="option">
                <input
                  type="checkbox"
                  checked={showAnswerHint}
                  onChange={(e) => setShowAnswerHint(e.target.checked)}
                />
                Show “tap to flip” hint
              </label>
            </div>

            <button type="button" className="start-btn" onClick={start}>
              <span className="play-icon" aria-hidden="true" />
              START
            </button>
            <p className="meta">{allCards.length} cards</p>
          </section>
        )}

        {phase === 'study' && current && (
          <section className="panel study-panel">
            <header className="study-header">
              <button
                type="button"
                className="text-btn"
                onClick={() => setPhase('start')}
              >
                ← Exit
              </button>
              <div className="counters">
                <span>
                  Card {index + 1}
                  {repeatUntilCorrect ? '' : ` / ${deck.length}`}
                </span>
                <span className="dot" aria-hidden="true" />
                <span>{knownIds.size} known</span>
                <span className="dot" aria-hidden="true" />
                <span>{remaining} left</span>
              </div>
              <div className="progress-track" title={`${progress}% known`}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </header>

            <button
              type="button"
              className={`card ${flipped ? 'is-flipped' : ''}`}
              onClick={flip}
              aria-label={flipped ? 'Show English prompt' : 'Show Spanish answer'}
            >
              <div className="card-inner">
                <div className="card-face card-front">
                  <span className="lang-tag">English</span>
                  <p className="card-text">{current.front}</p>
                  {showAnswerHint && (
                    <span className="flip-hint">Tap to flip</span>
                  )}
                </div>
                <div className="card-face card-back">
                  <span className="lang-tag">Español</span>
                  <p className="card-text">{current.back}</p>
                  {showAnswerHint && (
                    <span className="flip-hint">Tap to flip back</span>
                  )}
                </div>
              </div>
            </button>

            <div className="actions">
              <button
                type="button"
                className="mark mark-wrong"
                onClick={() => advance(false)}
                disabled={!flipped}
                title={flipped ? 'Still learning' : 'Flip the card first'}
              >
                ✕
              </button>
              <button
                type="button"
                className="mark mark-reveal"
                onClick={flip}
              >
                {flipped ? 'Hide' : 'Reveal'}
              </button>
              <button
                type="button"
                className="mark mark-right"
                onClick={() => advance(true)}
                disabled={!flipped}
                title={flipped ? 'Got it' : 'Flip the card first'}
              >
                ✓
              </button>
            </div>
            <p className="mark-help">
              {flipped
                ? 'Mark ✕ to practice again, or ✓ if you knew it.'
                : 'Flip the card, then mark yourself.'}
            </p>
          </section>
        )}

        {phase === 'done' && (
          <section className="panel done-panel">
            <p className="eyebrow">Nice work</p>
            <h1>Deck complete</h1>
            <p className="lede">
              You marked {knownIds.size} of {allCards.length} phrases as known.
            </p>
            <button type="button" className="start-btn" onClick={start}>
              <span className="play-icon" aria-hidden="true" />
              PLAY AGAIN
            </button>
            <button
              type="button"
              className="text-btn home-link"
              onClick={() => setPhase('start')}
            >
              Back to start
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
