import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"]

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function CalendarGrid({ selectedDate, onSelectDate }) {

  // REAL TIME DATE
  const today = new Date()

  const [viewDate,setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // FIRST DAY OF MONTH
  const firstDay = new Date(year, month, 1).getDay()

  // TOTAL DAYS OF MONTH
  const totalDays = new Date(year, month + 1, 0).getDate()

  // PREVIOUS MONTH DAYS
  const prevMonthDays = new Date(year, month, 0).getDate()

  const goPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const goNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const isToday = (day) => {
    const d = new Date(year, month, day)
    return d.toDateString() === today.toDateString()
  }

  const isSelected = (day) => {
    if(!selectedDate) return false
    return new Date(year, month, day).toDateString() === selectedDate.toDateString()
  }

  return (

    <div className="bg-surface rounded-2xl p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-4">

          <button
            onClick={goPrevMonth}
            className="p-2 rounded-lg hover:bg-background"
          >
            <ChevronLeft size={18}/>
          </button>

          <h2 className="font-semibold text-primary">
            {MONTHS[month]} {year}
          </h2>

          <button
            onClick={goNextMonth}
            className="p-2 rounded-lg hover:bg-background"
          >
            <ChevronRight size={18}/>
          </button>

        </div>

      </div>


      {/* DAYS */}
      <div className="grid grid-cols-7 text-xs text-neutral mb-2">

        {DAYS.map((d)=>(
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}

      </div>


      {/* GRID */}
      <div className="grid grid-cols-7">

        {/* PREVIOUS MONTH DAYS */}
        {Array.from({length:firstDay}).map((_,i)=>(
          <div key={i} className="h-20 p-2 text-neutral/40">
            {prevMonthDays - firstDay + i + 1}
          </div>
        ))}

        {/* CURRENT MONTH */}
        {Array.from({length:totalDays},(_,i)=>{

          const day = i + 1
          const selected = isSelected(day)
          const todayMark = isToday(day)

          return(

            <div
              key={day}
              onClick={()=>onSelectDate(new Date(year,month,day))}
              className={`h-20 p-2 cursor-pointer transition
              ${
                selected
                ? "bg-accent/20"
                : "hover:bg-background"
              }`}
            >

              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs
                ${
                  selected
                  ? "bg-accent text-primary"
                  : todayMark
                  ? "bg-primary text-white"
                  : "text-primary"
                }
              `}>
                {day}
              </span>

            </div>

          )

        })}

      </div>

    </div>
  )
}

export default CalendarGrid