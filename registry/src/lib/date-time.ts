// registry: auradata (times as AuraData shows them, 24-hour "HH:mm", and the options of a time picker)

const pad = (value: number) => String(value).padStart(2, "0")
const minutesOf = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/** The times a picker offers, every `step` minutes from `min` to `max`: `["09:00", "09:30", …]`. */
function timeOptions({
  step = 30,
  min = "00:00",
  max = "23:59",
}: { step?: number; min?: string; max?: string } = {}) {
  const options: string[] = []
  for (let minute = minutesOf(min); minute <= minutesOf(max); minute += step) {
    options.push(`${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`)
  }
  return options
}

/** The time of a date, 24-hour: `14:05`. */
function timeOf(date: Date | undefined) {
  return date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : undefined
}

/** The same day at `time` ("HH:mm"), seconds at zero. */
function withTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

export { timeOf, timeOptions, withTime }
