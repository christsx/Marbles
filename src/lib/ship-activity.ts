export type ShipDay = {
  date: string
  count: number
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function toLocalIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function buildShipActivity(weeks = 26): ShipDay[] {
  const days = weeks * 7
  const end = new Date(2026, 5, 16)
  const result: ShipDay[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(end)
    date.setDate(date.getDate() - i)
    const iso = toLocalIso(date)
    const [y, m, d] = iso.split("-").map(Number)
    const seed = y * 10000 + m * 100 + d
    let count = Math.floor(seededRandom(seed) * 14)
    const dow = date.getDay()
    if (dow === 0 || dow === 6) count = Math.floor(count * 0.35)
    result.push({ date: iso, count })
  }

  return result
}

/** GitHub-style weeks: columns left→right, rows Sun→Sat, padded at start. */
export function buildWeekGrid(
  days: ShipDay[]
): (ShipDay | null)[][] {
  if (days.length === 0) return []

  const grid: (ShipDay | null)[][] = []
  let week: (ShipDay | null)[] = []

  const firstDow = new Date(days[0].date + "T12:00:00").getDay()
  for (let i = 0; i < firstDow; i++) week.push(null)

  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      grid.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    grid.push(week)
  }

  return grid
}

export function activityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

export function formatActivityDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function totalShipped(days: ShipDay[]): number {
  return days.reduce((sum, day) => sum + day.count, 0)
}
