import { useState, useEffect } from "react"

export function useWindowCountdown(lastUserMessageAt: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!lastUserMessageAt) {
      setRemaining(null)
      return
    }

    const update = () => {
      const deadline = new Date(lastUserMessageAt).getTime() + 24 * 60 * 60 * 1000
      const now = Date.now()
      const diff = deadline - now
      setRemaining(diff > 0 ? diff : 0)
    }

    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [lastUserMessageAt])

  if (remaining === null) return null

  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes, expired: remaining === 0 }
}
