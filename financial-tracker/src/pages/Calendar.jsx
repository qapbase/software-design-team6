import { useState } from "react"

import AgendaPanel from "../components/calendar/AgendaPanel"
import CalendarGrid from "../components/calendar/CalendarGrid"
import WeekView from "../components/calendar/WeekView"
import AgendaView from "../components/calendar/AgendaView"
import MiniCalendar from "../components/calendar/MiniCalendar"
import RestockPanel from "../components/calendar/RestockPanel"

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeView, setActiveView] = useState("month")

  const views = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "agenda", label: "Agenda" },
  ]

  return (
    <div className="grid grid-cols-12 gap-6 p-8">

      {/* LEFT SIDE */}
      <div className="col-span-9 space-y-6">

        {/* VIEW SWITCH HEADER */}
        <div className="flex items-center justify-end">
          <div className="flex gap-1 bg-surface rounded-xl p-1 text-sm">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setActiveView(v.key)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                  activeView === v.key
                    ? "bg-white shadow text-primary"
                    : "text-neutral hover:text-primary"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE VIEW */}
        {activeView === "month" && (
          <>
            <CalendarGrid
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <AgendaPanel />
          </>
        )}

        {activeView === "week" && (
          <WeekView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}

        {activeView === "agenda" && (
          <AgendaView />
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-3 space-y-6">
        <MiniCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <RestockPanel />
      </div>
    </div>
  )
}

export default Calendar