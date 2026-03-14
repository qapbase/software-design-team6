import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"]

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function MiniCalendar({ selectedDate, onSelectDate }) {

  const [viewMonth, setViewMonth] = useState(new Date())

  const year  = viewMonth.getFullYear()
  const month = viewMonth.getMonth()

  const firstDay  = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  const isSelected = (day) => {
    const d = new Date(year, month, day)
    return selectedDate?.toDateString() === d.toDateString()
  }

  const isToday = (day) => {
    const d = new Date(year, month, day)
    return new Date().toDateString() === d.toDateString()
  }

  return (

    <div className="bg-surface rounded-2xl p-5 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center
          hover:bg-background rounded-lg transition"
        >
          <ChevronLeft size={15} className="text-neutral"/>
        </button>


        {/* Month + Year */}
        <div className="flex items-center gap-1.5">

          <select
            value={month}
            onChange={(e)=>
              setViewMonth(new Date(year, parseInt(e.target.value), 1))
            }
            className="text-xs font-semibold text-primary bg-transparent
            focus:outline-none cursor-pointer"
          >
            {MONTHS.map((m,i)=>(
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e)=>
              setViewMonth(new Date(parseInt(e.target.value), month, 1))
            }
            className="text-xs font-semibold text-primary bg-transparent
            focus:outline-none cursor-pointer"
          >
            {Array.from({length:10},(_,i)=>year-3+i).map((y)=>(
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

        </div>


        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center
          hover:bg-background rounded-lg transition"
        >
          <ChevronRight size={15} className="text-neutral"/>
        </button>

      </div>


      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">

        {DAYS.map((d)=>(
          <div
            key={d}
            className="text-center text-[10px] font-semibold
            text-neutral py-1 tracking-wide"
          >
            {d}
          </div>
        ))}

      </div>


      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-y-0.5">

        {Array.from({length:firstDay}).map((_,i)=>(
          <div key={`empty-${i}`}/>
        ))}

        {Array.from({length:totalDays},(_,i)=>i+1).map((day)=>(
          <button
            key={day}
            onClick={()=>onSelectDate(new Date(year,month,day))}
            className={`w-7 h-7 mx-auto text-[11px] rounded-full
            flex items-center justify-center font-semibold transition
            ${
              isSelected(day)
                ? "bg-primary text-white"
                : isToday(day)
                ? "bg-accent text-primary"
                : "text-primary hover:bg-accent/20"
            }`}
          >
            {day}
          </button>
        ))}

      </div>

    </div>

  )
}

export default MiniCalendar