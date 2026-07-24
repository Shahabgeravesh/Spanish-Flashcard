import type {
  GrammarContrast,
  GrammarExample,
  GrammarLesson,
} from '../data/grammarLessons'
import type { GrammarSection } from '../data/grammar'
import {
  GrammarVisual,
  type GrammarVisualId,
} from './GrammarVisual'

type Props = {
  lesson: GrammarLesson
  section: GrammarSection | 'all'
  /** When true, show “pick a chapter” styling for the overview */
  overview?: boolean
}

function ExampleCard({ ex }: { ex: GrammarExample }) {
  const tone = ex.tone ?? 'sand'
  return (
    <li className={`gex gex-${tone}`}>
      {ex.tag ? <span className="gex-tag">{ex.tag}</span> : null}
      <p className="gex-es">{ex.es}</p>
      <p className="gex-en">{ex.en}</p>
    </li>
  )
}

function ContrastCard({ pair }: { pair: GrammarContrast }) {
  return (
    <li className="gcontrast">
      <p className="gcontrast-label">{pair.label}</p>
      <div className="gcontrast-grid">
        <div className={`gcontrast-side gex-${pair.left.tone ?? 'sky'}`}>
          {pair.left.tag ? (
            <span className="gex-tag">{pair.left.tag}</span>
          ) : null}
          <p className="gex-es">{pair.left.es}</p>
          <p className="gex-en">{pair.left.en}</p>
        </div>
        <div className="gcontrast-vs" aria-hidden="true">
          vs
        </div>
        <div className={`gcontrast-side gex-${pair.right.tone ?? 'mint'}`}>
          {pair.right.tag ? (
            <span className="gex-tag">{pair.right.tag}</span>
          ) : null}
          <p className="gex-es">{pair.right.es}</p>
          <p className="gex-en">{pair.right.en}</p>
        </div>
      </div>
    </li>
  )
}

/** Colorful mini-lesson with bilingual examples and contrast pairs. */
export function GrammarLessonPanel({
  lesson,
  section,
  overview = false,
}: Props) {
  const visualId: GrammarVisualId = section

  return (
    <aside
      className={`grammar-lesson ${overview ? 'is-overview' : ''}`.trim()}
      aria-label="Chapter lesson"
    >
      <GrammarVisual
        id={visualId}
        size="hero"
        title={lesson.title}
        className="grammar-lesson-visual"
      />

      <div className="grammar-lesson-hero">
        <p className="grammar-lesson-kicker">
          {overview ? 'Start here' : 'Lesson'}
        </p>
        <h2 className="grammar-lesson-title">{lesson.title}</h2>
        <p className="grammar-lesson-hook">{lesson.hook}</p>
        <p className="grammar-lesson-summary">{lesson.summary}</p>
      </div>

      <div className="grammar-lesson-rules">
        <p className="grammar-lesson-section-label">Key rules</p>
        <ul className="grammar-lesson-bullets">
          {lesson.bullets.map((b) => (
            <li key={b}>
              <span className="grammar-bullet-dot" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {lesson.examples.length > 0 && (
        <div className="grammar-lesson-examples">
          <p className="grammar-lesson-section-label">
            Examples · tap your eyes across the colors
          </p>
          <ul className="gex-grid">
            {lesson.examples.map((ex) => (
              <ExampleCard key={`${ex.es}-${ex.en}`} ex={ex} />
            ))}
          </ul>
        </div>
      )}

      {lesson.contrasts && lesson.contrasts.length > 0 && (
        <div className="grammar-lesson-contrasts">
          <p className="grammar-lesson-section-label">Side-by-side</p>
          <ul className="gcontrast-list">
            {lesson.contrasts.map((pair) => (
              <ContrastCard key={pair.label} pair={pair} />
            ))}
          </ul>
        </div>
      )}

      <p className="grammar-lesson-remember">
        <span className="grammar-remember-label">Remember</span>
        {lesson.remember}
      </p>
    </aside>
  )
}
