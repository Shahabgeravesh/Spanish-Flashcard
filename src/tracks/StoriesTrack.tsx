import { useEffect, useMemo, useState } from 'react'
import {
  STORY_TENSES,
  filterStories,
  nextUnreadStory,
  stories,
  storyById,
  type Story,
} from '../data/stories'
import type { Tense } from '../data/verbs'
import { TENSE_META } from '../data/verbs'
import { canUseStorage } from '../lib/progress'
import { SpeakButton } from '../components/SpeakButton'
import { ChapterProgress } from '../components/ChapterProgress'
import { StoryVisual } from '../components/StoryVisual'
import { ResetModal } from '../components/ResetModal'
import {
  goBackOr,
  pushHablaState,
  replaceHablaState,
  storyIdFromLocation,
} from '../lib/navHistory'

export const STORIES_KEY = 'habla:stories:v1'

type Phase = 'start' | 'read'
type TenseFilter = Tense | 'all'

type StoryProgress = {
  /** Stories the learner marked as understood */
  understoodIds: string[]
  /** Optional line checkmarks: storyId → line indexes */
  clearedLines: Record<string, number[]>
}

type Props = {
  onBack: () => void
}

function emptyProgress(): StoryProgress {
  return { understoodIds: [], clearedLines: {} }
}

function loadStoryProgress(): StoryProgress {
  if (!canUseStorage()) return emptyProgress()
  try {
    const raw = localStorage.getItem(STORIES_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Partial<StoryProgress>
    return {
      understoodIds: Array.isArray(parsed.understoodIds)
        ? parsed.understoodIds.filter((id) => typeof id === 'string')
        : [],
      clearedLines:
        parsed.clearedLines && typeof parsed.clearedLines === 'object'
          ? parsed.clearedLines
          : {},
    }
  } catch {
    return emptyProgress()
  }
}

function saveStoryProgress(next: StoryProgress) {
  if (!canUseStorage()) return
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
}

function masteryFromProgress(progress: StoryProgress, list: Story[]): number {
  if (list.length === 0) return 0
  const understood = list.filter((s) =>
    progress.understoodIds.includes(s.id),
  ).length
  // Partial credit: clearing lines on unfinished stories
  let partial = 0
  for (const s of list) {
    if (progress.understoodIds.includes(s.id)) continue
    const cleared = progress.clearedLines[s.id]?.length ?? 0
    if (cleared > 0 && s.lines.length > 0) {
      partial += (cleared / s.lines.length) * 0.5
    }
  }
  return Math.min(
    100,
    Math.round(((understood + partial) / list.length) * 100),
  )
}

export function StoriesTrack({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [tense, setTense] = useState<TenseFilter>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hideEnglish, setHideEnglish] = useState(false)
  const [revealedLines, setRevealedLines] = useState<Set<number>>(
    () => new Set(),
  )
  const [progress, setProgress] = useState<StoryProgress>(loadStoryProgress)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    saveStoryProgress(progress)
  }, [progress])

  useEffect(() => {
    const fromUrl = storyIdFromLocation()
    if (fromUrl && storyById(fromUrl)) {
      setActiveId(fromUrl)
      setPhase('read')
    }

    const onPop = () => {
      const story = storyIdFromLocation()
      if (story && storyById(story)) {
        setActiveId(story)
        setRevealedLines(new Set())
        setPhase('read')
      } else {
        setPhase('start')
        setActiveId(null)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const filtered = useMemo(() => filterStories(stories, tense), [tense])
  const active = activeId ? storyById(activeId) : undefined
  const trackMastery = masteryFromProgress(progress, stories)
  const sectionMastery = masteryFromProgress(progress, filtered)
  const understoodCount = progress.understoodIds.filter((id) =>
    stories.some((s) => s.id === id),
  ).length
  const tonight = nextUnreadStory(filtered, progress.understoodIds)

  const openStory = (id: string) => {
    setActiveId(id)
    setRevealedLines(new Set())
    setPhase('read')
    pushHablaState('stories', id)
  }

  const closeStory = () => {
    goBackOr(() => {
      setPhase('start')
      setActiveId(null)
      replaceHablaState('stories')
    })
  }

  const unmarkUnderstood = (id: string) => {
    setProgress((p) => ({
      ...p,
      understoodIds: p.understoodIds.filter((x) => x !== id),
    }))
  }

  const toggleLineCleared = (storyId: string, lineIndex: number) => {
    setProgress((p) => {
      const prev = p.clearedLines[storyId] ?? []
      const has = prev.includes(lineIndex)
      const nextLines = has
        ? prev.filter((i) => i !== lineIndex)
        : [...prev, lineIndex]
      return {
        ...p,
        clearedLines: { ...p.clearedLines, [storyId]: nextLines },
      }
    })
    if (hideEnglish) {
      setRevealedLines((prev) => {
        const next = new Set(prev)
        if (next.has(lineIndex)) next.delete(lineIndex)
        else next.add(lineIndex)
        return next
      })
    }
  }

  const resetAll = () => {
    setProgress(emptyProgress())
    setConfirmReset(false)
    setPhase('start')
    setActiveId(null)
  }

  const fullSpanish = active?.lines.map((l) => l.es).join(' ') ?? ''

  return (
    <div className="app stories-theme">
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
              <h1 className="type-page">Stories</h1>
              <p className="subtitle">
                31 short nights — read, listen, and mark what you understand
              </p>
              <p className="lede">
                Spanish first, English when you need it. Practice pronouns and
                tenses inside complete scenes you can finish in a few minutes.
              </p>

              <ChapterProgress
                label="Nights completed"
                percent={trackMastery}
                detail={`${understoodCount} of ${stories.length} understood · ${trackMastery}%`}
              />

              {tonight && (
                <button
                  type="button"
                  className="story-featured"
                  onClick={() => openStory(tonight.id)}
                >
                  <StoryVisual
                    scene={tonight.scene}
                    night={tonight.night}
                    size="thumb"
                    title={tonight.titleEn}
                  />
                  <div className="story-featured-copy">
                    <p className="story-featured-kicker">Tonight’s story</p>
                    <strong className="story-featured-title">
                      Night {tonight.night} · {tonight.title}
                    </strong>
                    <span className="story-featured-meta">
                      {TENSE_META[tonight.tense].label} · ~{tonight.minutes} min ·{' '}
                      {tonight.lines.length} lines
                    </span>
                    <span className="story-featured-blurb">{tonight.blurb}</span>
                    <span className="story-featured-cta">Open story</span>
                  </div>
                </button>
              )}

              <div className="tense-filters" role="group" aria-label="Tense">
                {STORY_TENSES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`tense-chip ${tense === t.id ? 'is-active' : ''}`}
                    onClick={() => setTense(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="story-list" aria-label="Stories">
                {filtered.map((story) => {
                  const done = progress.understoodIds.includes(story.id)
                  const cleared =
                    progress.clearedLines[story.id]?.length ?? 0
                  const linePct = Math.round(
                    (cleared / Math.max(1, story.lines.length)) * 100,
                  )
                  const tenseLabel = TENSE_META[story.tense].label
                  const isTonight = tonight?.id === story.id
                  return (
                    <button
                      key={story.id}
                      type="button"
                      className={`story-list-item ${done ? 'is-done' : ''}${isTonight ? ' is-tonight' : ''}`}
                      onClick={() => openStory(story.id)}
                    >
                      <div className="story-list-top">
                        <span className="story-tense-tag">
                          Night {story.night} · {tenseLabel}
                        </span>
                        {done ? (
                          <span className="story-done-badge">Understood</span>
                        ) : isTonight ? (
                          <span className="story-line-badge">Tonight</span>
                        ) : cleared > 0 ? (
                          <span className="story-line-badge">
                            {linePct}% lines
                          </span>
                        ) : null}
                      </div>
                      <div className="story-list-main">
                        <StoryVisual
                          scene={story.scene}
                          night={story.night}
                          size="thumb"
                          title={story.titleEn}
                        />
                        <div className="story-list-copy">
                          <strong className="story-list-title">{story.title}</strong>
                          <span className="story-list-en">{story.titleEn}</span>
                          <span className="story-list-blurb">{story.blurb}</span>
                        </div>
                      </div>
                      <ChapterProgress
                        size="sm"
                        percent={done ? 100 : linePct * 0.5}
                        detail={`~${story.minutes} min · ${story.lines.length} lines`}
                      />
                    </button>
                  )
                })}
              </div>

              <p className="meta">
                {filtered.length} pages · one a night · section {sectionMastery}%
              </p>

              {understoodCount > 0 && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setConfirmReset(true)}
                >
                  Reset story progress
                </button>
              )}
            </section>
          )}

          {phase === 'read' && active && (
            <section className="panel story-reader">
              <header className="study-header">
                <div className="study-top">
                  <button
                    type="button"
                    className="back-btn back-btn-sm"
                    onClick={closeStory}
                  >
                    <span className="back-btn-icon" aria-hidden="true">
                      ←
                    </span>{' '}
                    Stories
                  </button>
                  <SpeakButton text={fullSpanish} />
                </div>
              </header>

              <StoryVisual
                scene={active.scene}
                night={active.night}
                size="hero"
                title={active.titleEn}
              />

              <p className="story-tense-kicker">
                Night {active.night} · {TENSE_META[active.tense].label} · ~
                {active.minutes} min
              </p>
              <h1 className="story-reader-title">{active.title}</h1>
              <p className="story-reader-en">{active.titleEn}</p>
              <p className="lede story-reader-blurb">{active.blurb}</p>

              <details className="story-notes">
                <summary>Language notes</summary>
                <div className="story-meta-chips" aria-label="Grammar covered">
                  <div className="story-chip-row">
                    <span className="story-chip-label">Pronouns</span>
                    {active.pronouns.map((p) => (
                      <span key={p} className="story-chip">
                        {p === 'tu' ? 'tú' : p === 'el' ? 'él/ella/usted' : p}
                      </span>
                    ))}
                  </div>
                  <div className="story-chip-row">
                    <span className="story-chip-label">Verbs</span>
                    {active.verbs.map((v) => (
                      <span key={v} className="story-chip story-chip-verb">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </details>

              <div className="options">
                <label className="option">
                  <input
                    type="checkbox"
                    checked={hideEnglish}
                    onChange={(e) => {
                      setHideEnglish(e.target.checked)
                      setRevealedLines(new Set())
                    }}
                  />
                  Hide English (tap a line to peek)
                </label>
              </div>

              <ol className="story-lines">
                {active.lines.map((line, i) => {
                  const cleared =
                    progress.clearedLines[active.id]?.includes(i) ?? false
                  const showEn =
                    !hideEnglish || revealedLines.has(i) || cleared
                  return (
                    <li key={`${active.id}-${i}`}>
                      <button
                        type="button"
                        className={`story-line ${cleared ? 'is-cleared' : ''}`}
                        onClick={() => toggleLineCleared(active.id, i)}
                      >
                        <span className="story-line-num" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="story-line-body">
                          <span className="story-line-es">{line.es}</span>
                          <span
                            className={`story-line-en ${showEn ? '' : 'is-hidden'}`}
                          >
                            {showEn ? line.en : 'Tap to show English'}
                          </span>
                        </span>
                        <span className="story-line-check" aria-hidden="true">
                          {cleared ? '✓' : ''}
                        </span>
                      </button>
                      <SpeakButton text={line.es} />
                    </li>
                  )
                })}
              </ol>

              <div className="cta-row story-cta">
                {progress.understoodIds.includes(active.id) ? (
                  <>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={closeStory}
                    >
                      Back to list
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => unmarkUnderstood(active.id)}
                    >
                      Unmark understood
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      setProgress((p) => ({
                        understoodIds: p.understoodIds.includes(active.id)
                          ? p.understoodIds
                          : [...p.understoodIds, active.id],
                        clearedLines: {
                          ...p.clearedLines,
                          [active.id]: active.lines.map((_, i) => i),
                        },
                      }))
                    }}
                  >
                    I understand this story
                  </button>
                )}
              </div>
              <p className="mark-help">
                Tap lines as you follow along. Mark the story when the tense and
                conjugations feel natural.
              </p>
            </section>
          )}
        </main>
      </div>

      {confirmReset && (
        <ResetModal
          title="Reset stories?"
          description="Clears understood stories and line checkmarks. Other tracks stay untouched."
          confirmLabel="Reset stories"
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  )
}

export function loadStoriesMasteryPercent(): number {
  return masteryFromProgress(loadStoryProgress(), stories)
}
