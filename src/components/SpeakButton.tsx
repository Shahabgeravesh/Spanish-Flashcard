import { speakSpanish, canSpeak, stopSpeaking } from '../lib/speak'

type Props = {
  text: string
  className?: string
  /** Larger control for the action bar */
  variant?: 'chip' | 'mark'
  disabled?: boolean
  label?: string
}

/** Replay Spanish pronunciation — keep outside the flip card (not nested buttons). */
export function SpeakButton({
  text,
  className = '',
  variant = 'chip',
  disabled = false,
  label = 'Listen',
}: Props) {
  if (!canSpeak() || !text.trim()) return null

  const isMark = variant === 'mark'

  return (
    <button
      type="button"
      className={`${isMark ? 'mark mark-speak' : 'speak-btn'} ${className}`.trim()}
      aria-label="Hear Spanish pronunciation"
      title="Hear Spanish"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        if (disabled) return
        stopSpeaking()
        speakSpanish(text)
      }}
    >
      <span aria-hidden="true">🔊</span>
      <span>{label}</span>
    </button>
  )
}
