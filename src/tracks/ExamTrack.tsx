import { useEffect, useState } from 'react'
import {
  EXAM_SECTIONS,
  buildExamQuestions,
  type ExamQuestion,
  type ExamSectionId,
} from '../data/exam'
import { grammarExamCoverageNote } from '../data/grammarExam'
import { answersMatch } from '../lib/examAnswer'
import {
  clearExamProgress,
  examMasteryPercent,
  loadExamProgress,
  recordExamAttempt,
  saveExamProgress,
  sectionBestPercent,
  type ExamProgress,
} from '../lib/examProgress'
import { ResetModal } from '../components/ResetModal'
import { ChapterProgress } from '../components/ChapterProgress'
import { SpeakButton } from '../components/SpeakButton'
import { TrackVisual } from '../components/TrackVisual'

type Phase = 'start' | 'exam' | 'result'

type Props = {
  onBack: () => void
}

const LENGTHS = [8, 12, 16] as const

/** Prefer full topic coverage when starting Grammar. */
function defaultLengthFor(section: ExamSectionId): (typeof LENGTHS)[number] {
  return section === 'grammar' ? 16 : 12
}

export function ExamTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [section, setSection] = useState<ExamSectionId>('conjugations')
  const [length, setLength] = useState<(typeof LENGTHS)[number]>(12)
  const [progress, setProgress] = useState<ExamProgress>(loadExamProgress)
  const [queue, setQueue] = useState<ExamQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    saveExamProgress(progress)
  }, [progress])

  const current = queue[index]
  const trackMastery = examMasteryPercent(progress)
  const sectionStats = progress.bySection[section]
  const sectionLabel =
    EXAM_SECTIONS.find((s) => s.id === section)?.label ?? section

  const startExam = () => {
    const qs = buildExamQuestions(section, length)
    if (qs.length === 0) return
    setQueue(qs)
    setIndex(0)
    setInput('')
    setChecked(false)
    setWasCorrect(false)
    setScore(0)
    setPhase('exam')
  }

  const checkAnswer = () => {
    if (!current || checked) return
    const ok =
      current.kind === 'choice'
        ? answersMatch(input, current.answers)
        : answersMatch(input, current.answers)
    setWasCorrect(ok)
    setChecked(true)
    if (ok) setScore((s) => s + 1)
  }

  const chooseOption = (choice: string) => {
    if (checked) return
    setInput(choice)
  }

  const goNext = () => {
    if (!current) return
    if (!checked) {
      checkAnswer()
      return
    }
    if (index >= queue.length - 1) {
      setProgress((p) =>
        recordExamAttempt(p, section, score, queue.length),
      )
      setPhase('result')
      return
    }
    setIndex((i) => i + 1)
    setInput('')
    setChecked(false)
    setWasCorrect(false)
  }

  const exitExam = () => {
    const answered = checked ? index + 1 : index
    if (answered > 0) {
      setProgress((p) => recordExamAttempt(p, section, score, answered))
      setPhase('result')
      return
    }
    setPhase('start')
  }

  const resetAll = () => {
    clearExamProgress()
    setProgress({ bySection: {} })
    setConfirmReset(false)
    setPhase('start')
  }

  return (
    <div className="app exam-theme">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grain" />
      </div>

      <div className="shell stories-shell">
        <main className="stage">
          {phase === 'start' && (
            <section className="panel start-panel">
              <button
                type="button"
                className="back-btn back-hub"
                onClick={onBack}
              >
                <span className="back-btn-icon" aria-hidden="true">
                  ←
                </span>{' '}
                All tracks
              </button>
              <p className="brand">Spanish Deck</p>
              <h1>Exam</h1>
              <p className="subtitle">Test yourself — fill blanks & type answers</p>
              <p className="lede">
                Pick a section, answer without peeking at flashcards, and track
                your best score per section.
              </p>

              <ChapterProgress
                label="Exam mastery"
                percent={trackMastery}
                detail={`Average of best scores · ${trackMastery}%`}
              />

              <div className="chapter-list exam-section-list" aria-label="Exam sections">
                {EXAM_SECTIONS.map((s) => {
                  const best = sectionBestPercent(progress, s.id)
                  const stats = progress.bySection[s.id]
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`chapter-list-item exam-section-row ${section === s.id ? 'is-active' : ''}`}
                      onClick={() => {
                        setSection(s.id)
                        if (s.id === 'grammar') setLength(defaultLengthFor('grammar'))
                      }}
                    >
                      <TrackVisual id={s.id} size="sm" />
                      <ChapterProgress
                        size="sm"
                        label={s.label}
                        percent={best}
                        detail={
                          stats
                            ? `Best ${best}% · last ${stats.lastScore}/${stats.lastTotal} · ${stats.attempts} tries`
                            : s.blurb
                        }
                      />
                    </button>
                  )
                })}
              </div>

              <div className="exam-setup">
                <p className="exam-setup-label">Questions</p>
                <div className="tense-filters" role="group" aria-label="Length">
                  {LENGTHS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`tense-chip ${length === n ? 'is-active' : ''}`}
                      onClick={() => setLength(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={startExam}>
                  Start {sectionLabel} exam
                </button>
                {Object.keys(progress.bySection).length > 0 && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset exam progress
                  </button>
                )}
              </div>

              <p className="meta">
                Accents optional · answers with “/” alternatives accepted ·{' '}
                {section === 'grammar'
                  ? grammarExamCoverageNote(length)
                  : sectionStats
                    ? `Your best in ${sectionLabel}: ${sectionStats.bestPercent}%`
                    : `No attempts yet in ${sectionLabel}`}
              </p>
            </section>
          )}

          {phase === 'exam' && current && (
            <section className="panel exam-panel">
              <header className="study-header">
                <div className="study-top">
                  <button
                    type="button"
                    className="back-btn back-btn-sm"
                    onClick={exitExam}
                  >
                    <span className="back-btn-icon" aria-hidden="true">
                      ←
                    </span>{' '}
                    Exit
                  </button>
                  <span className="counters">
                    {index + 1} / {queue.length}
                    <span className="dot" aria-hidden="true" />
                    Score {score}
                  </span>
                </div>
                <ChapterProgress
                  size="sm"
                  label={sectionLabel}
                  percent={Math.round(((index + (checked ? 1 : 0)) / queue.length) * 100)}
                />
              </header>

              <div className={`exam-banner exam-banner-${section}`}>
                <TrackVisual id={section} size="sm" />
                <div>
                  <p className="exam-instruction">{current.instruction}</p>
                  <h2 className="exam-prompt">{current.prompt}</h2>
                </div>
              </div>
              {current.cloze && (
                <p className="exam-cloze" aria-label="Fill in the blank">
                  {current.cloze.split('___').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="exam-blank">
                          {checked ? current.answers[0] : '___'}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              )}
              {current.hint && !checked && (
                <p className="exam-hint">Hint: {current.hint}</p>
              )}

              {current.kind === 'choice' && current.choices ? (
                <div className="exam-choices" role="group" aria-label="Choices">
                  {current.choices.map((c) => {
                    const selected = input === c
                    const showState = checked && selected
                    const isRight = answersMatch(c, current.answers)
                    return (
                      <button
                        key={c}
                        type="button"
                        className={`exam-choice ${selected ? 'is-selected' : ''} ${
                          checked && isRight ? 'is-correct' : ''
                        } ${showState && !wasCorrect ? 'is-wrong' : ''}`}
                        onClick={() => chooseOption(c)}
                        disabled={checked}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <form
                  className="exam-input-row"
                  onSubmit={(e) => {
                    e.preventDefault()
                    goNext()
                  }}
                >
                  <label className="sr-only" htmlFor="exam-answer">
                    Your answer
                  </label>
                  <input
                    id="exam-answer"
                    className={`exam-input ${checked ? (wasCorrect ? 'is-correct' : 'is-wrong') : ''}`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer…"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    disabled={checked}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                </form>
              )}

              {checked && (
                <div
                  className={`exam-feedback ${wasCorrect ? 'is-correct' : 'is-wrong'}`}
                  role="status"
                >
                  <p className="exam-feedback-title">
                    {wasCorrect ? 'Correct' : 'Not quite'}
                  </p>
                  {!wasCorrect && (
                    <p className="exam-feedback-answer">
                      Answer: <strong>{current.answers[0]}</strong>
                      {current.answers.length > 1 && (
                        <span className="exam-alts">
                          {' '}
                          (also: {current.answers.slice(1).join(', ')})
                        </span>
                      )}
                    </p>
                  )}
                  {current.explain && (
                    <p className="exam-feedback-explain">{current.explain}</p>
                  )}
                  <SpeakButton text={current.answers[0]} />
                </div>
              )}

              <div className="cta-row exam-cta">
                {current.kind === 'choice' && !checked ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={checkAnswer}
                    disabled={!input}
                  >
                    Check
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={goNext}
                    disabled={!checked && !input.trim()}
                  >
                    {checked
                      ? index >= queue.length - 1
                        ? 'See results'
                        : 'Next'
                      : 'Check'}
                  </button>
                )}
              </div>
              <p className="mark-help">
                {queue.length - index - (checked ? 1 : 0)} left after this · Enter
                to check / continue
              </p>
            </section>
          )}

          {phase === 'result' && (
            <section className="panel done-panel exam-result-panel">
              <p className="brand">Exam complete</p>
              <div
                className="exam-score-ring"
                style={{
                  ['--score-pct' as string]: String(
                    Math.round((score / Math.max(1, queue.length)) * 100),
                  ),
                }}
                aria-hidden="true"
              >
                <span className="exam-score-value">
                  {Math.round((score / Math.max(1, queue.length)) * 100)}%
                </span>
              </div>
              <h1>
                {score} of {queue.length} correct
              </h1>
              <p className="lede">
                {sectionLabel} · Best in this section:{' '}
                {sectionBestPercent(progress, section)}%
              </p>
              <ChapterProgress
                label="This attempt"
                percent={Math.round((score / Math.max(1, queue.length)) * 100)}
              />
              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={startExam}>
                  Retry section
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setPhase('start')}
                >
                  Choose another section
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {confirmReset && (
        <ResetModal
          title="Reset exam progress?"
          description="Clears best scores and attempt history for every exam section. Flashcard tracks stay untouched."
          confirmLabel="Reset exams"
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  )
}

export function loadExamMasteryPercent(): number {
  return examMasteryPercent(loadExamProgress())
}
