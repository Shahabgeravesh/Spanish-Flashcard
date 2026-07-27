import { TrackVisual, type HubTrackId } from './TrackVisual'

export type HubTrackMeta = {
  id: HubTrackId
  title: string
  description: string
  hubClass: string
  percent: number
  featured?: boolean
}

type Props = {
  overallPct: number
  lastTrack: string | null
  onContinue: () => void
  onEnter: (track: HubTrackId) => void
  tracks: {
    essentials: HubTrackMeta[]
    realLife: HubTrackMeta[]
    understanding: HubTrackMeta[]
    test: HubTrackMeta[]
  }
  storageNote: string
  continueLabel: string
}

function HubTrackButton({
  track,
  onEnter,
}: {
  track: HubTrackMeta
  onEnter: (id: HubTrackId) => void
}) {
  return (
    <button
      type="button"
      className={`hub-card ${track.hubClass}${track.featured ? ' hub-card-featured' : ''}`}
      onClick={() => onEnter(track.id)}
    >
      <TrackVisual id={track.id} />
      <div className="hub-card-body">
        <div className="hub-card-top">
          <h3>{track.title}</h3>
          <span className="hub-pct">{track.percent}%</span>
        </div>
        <p>{track.description}</p>
        <div
          className="hub-card-bar"
          role="progressbar"
          aria-valuenow={track.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${track.title} progress`}
        >
          <span
            style={{ width: `${Math.max(0, Math.min(100, track.percent))}%` }}
          />
        </div>
      </div>
    </button>
  )
}

export function HubHome({
  overallPct,
  lastTrack,
  onContinue,
  onEnter,
  tracks,
  storageNote,
  continueLabel,
}: Props) {
  return (
    <main className="hub">
      <header className="hub-header">
        <div className="hub-hero">
          <p className="brand type-brand">Spanish Deck</p>
          <h1 className="type-display">Learn Spanish with focused practice</h1>
          <p className="lede hub-lede">
            Build vocabulary, master conjugations, read short stories, and test
            what you know — progress stays on this device.
          </p>
        </div>
        <div className="hub-hero-aside">
          <div className="hub-overall">
            <div className="hub-overall-top">
              <span className="type-label">Overall mastery</span>
              <span className="hub-overall-pct type-page">{overallPct}%</span>
            </div>
            <div
              className="hub-overall-track"
              role="progressbar"
              aria-valuenow={overallPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall mastery"
            >
              <span style={{ width: `${overallPct}%` }} />
            </div>
            <p className="type-meta hub-overall-detail">
              Average across all nine tracks
            </p>
          </div>
          {lastTrack && lastTrack !== 'hub' && (
            <button
              type="button"
              className="primary-btn hub-continue"
              onClick={onContinue}
            >
              {continueLabel}
            </button>
          )}
        </div>
      </header>

      <section className="hub-section" aria-labelledby="hub-essentials">
        <div className="hub-section-head">
          <h2 id="hub-essentials" className="type-section">
            Learn the essentials
          </h2>
          <p className="type-meta">Core vocabulary, grammar, and forms</p>
        </div>
        <div className="hub-grid hub-grid-essentials">
          {tracks.essentials.map((t) => (
            <HubTrackButton key={t.id} track={t} onEnter={onEnter} />
          ))}
        </div>
      </section>

      <section className="hub-section" aria-labelledby="hub-life">
        <div className="hub-section-head">
          <h2 id="hub-life" className="type-section">
            Use Spanish in real life
          </h2>
          <p className="type-meta">Phrases for requests and everyday situations</p>
        </div>
        <div className="hub-grid hub-grid-pair">
          {tracks.realLife.map((t) => (
            <HubTrackButton key={t.id} track={t} onEnter={onEnter} />
          ))}
        </div>
      </section>

      <div className="hub-feature-row">
        <section
          className="hub-section hub-section-feature"
          aria-labelledby="hub-stories"
        >
          <div className="hub-section-head">
            <h2 id="hub-stories" className="type-section">
              Build understanding
            </h2>
            <p className="type-meta">
              Short stories with listening and line tracking
            </p>
          </div>
          <div className="hub-grid hub-grid-single">
            {tracks.understanding.map((t) => (
              <HubTrackButton
                key={t.id}
                track={{ ...t, featured: true }}
                onEnter={onEnter}
              />
            ))}
          </div>
        </section>

        <section
          className="hub-section hub-section-feature"
          aria-labelledby="hub-exam"
        >
          <div className="hub-section-head">
            <h2 id="hub-exam" className="type-section">
              Test your progress
            </h2>
            <p className="type-meta">Typed exams without peeking at cards</p>
          </div>
          <div className="hub-grid hub-grid-single">
            {tracks.test.map((t) => (
              <HubTrackButton
                key={t.id}
                track={{ ...t, featured: true }}
                onEnter={onEnter}
              />
            ))}
          </div>
        </section>
      </div>

      <p className="hub-footnote">{storageNote}</p>
    </main>
  )
}
