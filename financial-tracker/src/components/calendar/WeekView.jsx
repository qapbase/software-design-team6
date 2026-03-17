import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

// Sample events for the week
const WEEK_EVENTS = [
  { day: 1, hour: 9, label: "Monthly Bills Payment", color: "bg-[#2C2F45] text-white" },
  { day: 1, hour: 14, label: "Inventory Check", color: "bg-[#F9B672] text-[#050725]" },
  { day: 2, hour: 10, label: "Supplier Meeting", color: "bg-[#2C2F45] text-white" },
  { day: 3, hour: 11, label: "Restock Delivery", color: "bg-[#2E6F4E] text-white" },
  { day: 4, hour: 9, label: "Sales Review", color: "bg-[#F9B672] text-[#050725]" },
  { day: 4, hour: 15, label: "Price Adjustment", color: "bg-[#2C2F45] text-white" },
  { day: 5, hour: 13, label: "Supplier Payment", color: "bg-[#2E6F4E] text-white" },
]

function WeekView({ selectedDate, onSelectDate }) {
  const today = new Date()

  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const [weekStart, setWeekStart] = useState(getWeekStart(selectedDate || today))

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const weekEnd = weekDays[6]
  const headerLabel = weekDays[0].getMonth() === weekEnd.getMonth()
    ? `${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`
    : `${MONTH_NAMES[weekDays[0].getMonth()]} – ${MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const isToday = (date) => date.toDateString() === today.toDateString()
  const isSelected = (date) => selectedDate?.toDateString() === date.toDateString()

  const getEventsForSlot = (dayIndex, hour) => {
    return WEEK_EVENTS.filter((e) => e.day === dayIndex && e.hour === hour)
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral/20">
        <div className="flex items-center gap-4">
          <button onClick={prevWeek} className="p-2 rounded-lg hover:bg-background">
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-semibold text-primary">{headerLabel}</h2>
          <button onClick={nextWeek} className="p-2 rounded-lg hover:bg-background">
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          onClick={() => {
            setWeekStart(getWeekStart(today))
            onSelectDate(today)
          }}
          className="text-xs font-medium text-accent hover:text-primary transition-colors px-3 py-1 rounded-lg border border-accent/30"
        >
          Today
        </button>
      </div>

      {/* DAY HEADERS */}
      <div className="grid grid-cols-8 border-b border-neutral/20">
        <div className="p-3 text-[10px] text-neutral font-semibold" />
        {weekDays.map((date, i) => (
          <button
            key={i}
            onClick={() => onSelectDate(date)}
            className={`p-3 text-center transition-colors ${
              isSelected(date) ? "bg-accent/10" : ""
            }`}
          >
            <p className="text-[10px] font-semibold text-neutral tracking-wide">
              {DAY_NAMES[date.getDay()]}
            </p>
            <p
              className={`text-sm font-bold mt-0.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full ${
                isToday(date)
                  ? "bg-primary text-white"
                  : isSelected(date)
                  ? "bg-accent text-primary"
                  : "text-primary"
              }`}
            >
              {date.getDate()}
            </p>
          </button>
        ))}
      </div>

      {/* TIME GRID */}
      <div className="max-h-[500px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-neutral/10">
            {/* Time label */}
            <div className="p-2 text-[10px] text-neutral font-medium text-right pr-3 pt-3">
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
            </div>

            {/* Day cells */}
            {weekDays.map((date, dayIndex) => {
              const events = getEventsForSlot(dayIndex, hour)
              return (
                <div
                  key={dayIndex}
                  className={`min-h-[48px] border-l border-neutral/10 p-1 transition-colors hover:bg-background/50 ${
                    isToday(date) ? "bg-accent/5" : ""
                  }`}
                >
                  {events.map((event, ei) => (
                    <div
                      key={ei}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${event.color} truncate`}
                    >
                      {event.label}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeekView