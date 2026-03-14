import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import AgendaPanel from "../components/calendar/AgendaPanel"
import CalendarGrid from "../components/calendar/CalendarGrid"
import MiniCalendar from "../components/calendar/MiniCalendar"
import RestockPanel from "../components/calendar/RestockPanel"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function Calendar() {

  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  return (

    <div className="grid grid-cols-12 gap-6 p-8">

      {/* LEFT SIDE */}
      <div className="col-span-9 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-surface"
            >
              <ChevronLeft size={18}/>
            </button>

            <h2 className="text-lg font-semibold text-primary">
              {MONTHS[month]} {year}
            </h2>

            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-surface"
            >
              <ChevronRight size={18}/>
            </button>

          </div>

          {/* VIEW SWITCH */}
          <div className="flex gap-2 bg-surface rounded-xl p-1 text-sm">

            <button className="px-3 py-1 rounded-lg text-neutral">
              Week
            </button>

            <button className="px-3 py-1 rounded-lg bg-white shadow text-primary">
              Month
            </button>

            <button className="px-3 py-1 rounded-lg text-neutral">
              Agenda
            </button>

          </div>

        </div>


        {/* MAIN CALENDAR GRID */}
        <CalendarGrid
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* AGENDA */}
        <AgendaPanel />

      </div>


      {/* RIGHT PANEL */}
      <div className="col-span-3 space-y-6">

        {/* MINI CALENDAR */}
        <MiniCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* RESTOCK PANEL */}
        <RestockPanel />

      </div>

    </div>

  )
}

export default Calendar