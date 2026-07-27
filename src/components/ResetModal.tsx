type Props = {
  title: string
  description: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export function ResetModal({
  title,
  description,
  confirmLabel = 'Reset this track',
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        aria-describedby="reset-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="reset-modal-title">{title}</h2>
        <p id="reset-modal-desc">{description}</p>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="danger-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
