import { useNavigate } from "react-router-dom"
import {
  Receipt,
  ShoppingCart,
  Tag,
  AlertTriangle,
  CalendarDays,
  Truck,
  BarChart3,
  Clock,
} from "lucide-react"

const AGENDA_DATA = [
  {
    date: "2026-03-02",
    dateLabel: "Monday, March 2",
    events: [
      { time: "9:00 AM", label: "Monthly Bills Payment", icon: Receipt, color: "bg-[#2C2F45] text-white", link: "/assistant" },
    ],
  },
  {
    date: "2026-03-04",
    dateLabel: "Wednesday, March 4",
    events: [
      { time: "All Day", label: "LOW stock Cooking Oil — Restock recommended", icon: AlertTriangle, color: "bg-[#F9B672]/20 text-[#050725]", link: "/calendar", isAlert: true },
    ],
  },
  {
    date: "2026-03-07",
    dateLabel: "Saturday, March 7",
    events: [
      { time: "10:00 AM", label: "Inventory Restock", icon: ShoppingCart, color: "bg-[#2C2F45] text-white", link: "/calendar" },
    ],
  },
  {
    date: "2026-03-10",
    dateLabel: "Tuesday, March 10",
    events: [
      { time: "2:00 PM", label: "Supplier Delivery", icon: Truck, color: "bg-[#2E6F4E] text-white", link: "/calendar" },
    ],
  },
  {
    date: "2026-03-14",
    dateLabel: "Saturday, March 14",
    events: [
      { time: "9:00 AM", label: "Price Adjustment Review", icon: Tag, color: "bg-[#F9B672] text-[#050725]", link: "/dashboard" },
      { time: "3:00 PM", label: "Sales Performance Review", icon: BarChart3, color: "bg-[#2C2F45] text-white", link: "/dashboard" },
    ],
  },
  {
    date: "2026-03-18",
    dateLabel: "Wednesday, March 18",
    events: [
      { time: "11:00 AM", label: "Budget Planning Session", icon: Receipt, color: "bg-[#2C2F45] text-white", link: "/assistant" },
    ],
  },
  {
    date: "2026-03-22",
    dateLabel: "Sunday, March 22",
    events: [
      { time: "All Day", label: "CRITICAL stock: Soft Drinks running low", icon: AlertTriangle, color: "bg-red-100 text-red-700", link: "/calendar", isAlert: true },
    ],
  },
  {
    date: "2026-03-27",
    dateLabel: "Friday, March 27",
    events: [
      { time: "9:00 AM", label: "Restock Warehouse", icon: ShoppingCart, color: "bg-[#2C2F45] text-white", link: "/calendar" },
      { time: "1:00 PM", label: "Supplier Payment", icon: Receipt, color: "bg-[#2E6F4E] text-white", link: "/assistant" },
    ],
  },
]

function AgendaView() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral/20">
        <CalendarDays size={16} className="text-accent" />
        <h3 className="font-semibold text-primary">Full Agenda</h3>
        <span className="text-xs text-neutral ml-2">
          {AGENDA_DATA.reduce((acc, d) => acc + d.events.length, 0)} events this month
        </span>
      </div>

      {/* AGENDA LIST */}
      <div className="divide-y divide-neutral/10">
        {AGENDA_DATA.map((day) => {
          const isPast = day.date < today
          const isToday = day.date === today

          return (
            <div
              key={day.date}
              className={`flex gap-6 px-6 py-5 transition-colors ${
                isPast ? "opacity-50" : ""
              } ${isToday ? "bg-accent/5" : ""}`}
            >
              {/* DATE COLUMN */}
              <div className="w-44 shrink-0">
                <p className={`text-sm font-semibold ${isToday ? "text-accent" : "text-primary"}`}>
                  {day.dateLabel}
                </p>
                {isToday && (
                  <span className="text-[10px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full mt-1 inline-block">
                    TODAY
                  </span>
                )}
              </div>

              {/* EVENTS COLUMN */}
              <div className="flex-1 flex flex-col gap-2.5">
                {day.events.map((event, i) => {
                  const Icon = event.icon
                  return (
                    <div
                      key={i}
                      onClick={() => navigate(event.link)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      {/* Time */}
                      <div className="flex items-center gap-1.5 w-20 shrink-0">
                        <Clock size={10} className="text-neutral" />
                        <span className="text-[11px] text-neutral font-medium">
                          {event.time}
                        </span>
                      </div>

                      {/* Event pill */}
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition-transform group-hover:scale-[1.02] ${event.color}`}
                      >
                        <Icon size={12} />
                        {event.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AgendaView