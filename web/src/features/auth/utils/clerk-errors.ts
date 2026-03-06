const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'

type ClerkErrorEntry = {
  longMessage?: string
  message?: string
}

type ClerkErrorShape = {
  errors?: ClerkErrorEntry[]
}

export function getClerkErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const entries = (error as ClerkErrorShape).errors

    if (Array.isArray(entries) && entries.length > 0) {
      const firstMessage = entries[0]?.longMessage ?? entries[0]?.message

      if (firstMessage) {
        return firstMessage
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
