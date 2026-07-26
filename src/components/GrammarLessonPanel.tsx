import { useMemo, useState } from 'react'
import type {
  GrammarContrast,
  GrammarExample,
  GrammarLesson,
} from '../data/grammarLessons'
import type { GrammarSection } from '../data/grammar'

type Props = {
  lesson: GrammarLesson
  section: GrammarSection | 'all'
  /** Overview for “All” — keep ultra short */
  overview?: boolean
}

const MAX_BULLETS = 3
const MAX_EXAMPLES = 3

function ExampleRow({ ex }: { ex: GrammarExample }) {
  return (
    <li className="gex-row">
      <span className="gex-es">{ex.es}</span>
      <span className="gex-en">{ex.en}</span>
      {ex.tag ? <span className="gex-tag">{ex.tag}</span> : null}
    </li>
  )
}

function ContrastBlock({ pair }: { pair: GrammarContrast }) {
  return (
    <div className="gcontrast">
      <p className="gcontrast-label">{pair.label}</p>
      <div className="gcontrast-grid">
        <div className="gcontrast-side">
          {pair.left.tag ? (
            <span className="gex-tag">{pair.left.tag}</span>
          ) : null}
          <p className="gex-es">{pair.left.es}</p>
          <p className="gex-en">{pair.left.en}</p>
        </div>
        <div className="gcontrast-vs" aria-hidden="true">
          vs
        </div>
        <div className="gcontrast-side">
          {pair.right.tag ? (
            <span className="gex-tag">{pair.right.tag}</span>
          ) : null}
          <p className="gex-es">{pair.right.es}</p>
          <p className="gex-en">{pair.right.en}</p>
        </div>
      </div>
    </div>
  )
}

/** Minimal chapter lesson: one idea, a few rules, one contrast, sparse examples. */
export function GrammarLessonPanel({
  lesson,
  overview = false,
}: Props) {
  const [showAllExamples, setShowAllExamples] = useState(false)

  const bullets = useMemo(
    () => lesson.bullets.slice(0, MAX_BULLETS),
    [lesson.bullets],
  )
  const examples = useMemo(() => {
    if (showAllExamples) return lesson.examples
    return lesson.examples.slice(0, MAX_EXAMPLES)
  }, [lesson.examples, showAllExamples])
  const hasMoreExamples = lesson.examples.length > MAX_EXAMPLES
  const contrast = lesson.contrasts?.[0]

  if (overview) {
    return (
      <aside className="grammar-lesson is-overview" aria-label="Chapter lesson">
        <p className="grammar-lesson-lede">
          Pick a chapter for a short lesson, then drill with flashcards.
        </p>
      </aside>
    )
  }

  return (
    <aside className="grammar-lesson" aria-label="Chapter lesson">
      <header className="grammar-lesson-hero">
        <h2 className="grammar-lesson-title">{lesson.title}</h2>
        <p className="grammar-lesson-hook">{lesson.hook}</p>
      </header>

      <ul className="grammar-lesson-bullets">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      {contrast ? <ContrastBlock pair={contrast} /> : null}

      {examples.length > 0 && (
        <div className="grammar-lesson-examples">
          <p className="grammar-lesson-section-label">Examples</p>
          <ul className="gex-list">
            {examples.map((ex) => (
              <ExampleRow key={`${ex.es}-${ex.en}`} ex={ex} />
            ))}
          </ul>
          {hasMoreExamples && (
            <button
              type="button"
              className="grammar-more-btn"
              onClick={() => setShowAllExamples((v) => !v)}
            >
              {showAllExamples
                ? 'Show fewer'
                : `More examples (${lesson.examples.length - MAX_EXAMPLES})`}
            </button>
          )}
        </div>
      )}

      <p className="grammar-lesson-remember">{lesson.remember}</p>
    </aside>
  )
}
