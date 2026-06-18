export function getStudioGreeting(firstName?: string | null) {
  const hour = new Date().getHours()
  const salutation =
    hour < 12 ? "Good morning" : hour < 17 ? "Afternoon" : "Good evening"

  const name = firstName?.trim()
  if (!name || name === "there") {
    return salutation
  }

  return `${salutation}, ${name}`
}
