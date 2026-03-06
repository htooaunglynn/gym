type FeedbackMessageProps = {
  type: 'error' | 'success'
  text: string
}

export function FeedbackMessage({ type, text }: FeedbackMessageProps) {
  if (!text) {
    return null
  }

  const classes =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700'

  return <p className={`rounded-xl border px-3 py-2 text-sm ${classes}`}>{text}</p>
}
