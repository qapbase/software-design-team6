import { useNavigate } from "react-router-dom"
import {
  Receipt,
  ShoppingCart,
  Tag,
  AlertTriangle,
  CalendarDays,
  Truck,
  BarChart3
} from "lucide-react"

const agendaItems = [

  {
    id: 1,
    date: "March 2, 2026",
    events: [
      {
        label: "Monthly Bills Payment",
        icon: Receipt,
        color: "bg-secondary text-white",
        link: "/assistant"
      },
    ],
  },

  {
    id: 2,
    date: "March 4, 2026",
    events: [],
    alert: "LOW stock Cooking Oil — Recommended restock today",
    link: "/calendar"
  },

  {
    id: 3,
    date: "March 7, 2026",
    events: [
      {
        label: "Inventory Restock",
        icon: ShoppingCart,
        color: "bg-secondary text-white",
        link: "/calendar"
      },
    ],
  },

  {
    id: 4,
    date: "March 10, 2026",
    events: [
      {
        label: "Supplier Delivery",
        icon: Truck,
        color: "bg-secondary text-white",
        link: "/calendar"
      },
    ],
  },

  {
    id: 5,
    date: "March 14, 2026",
    events: [
      {
        label: "Price Adjustment",
        icon: Tag,
        color: "bg-accent text-primary",
        link: "/dashboard"
      },
    ],
  },

  {
    id: 6,
    date: "March 18, 2026",
    events: [
      {
        label: "Sales Performance Review",
        icon: BarChart3,
        color: "bg-secondary text-white",
        link: "/dashboard"
      },
    ],
  },

  {
    id: 7,
    date: "March 22, 2026",
    events: [],
    alert: "CRITICAL stock: Soft Drinks running low",
    link: "/calendar"
  },

  {
    id: 8,
    date: "March 27, 2026",
    events: [
      {
        label: "Restock Warehouse",
        icon: ShoppingCart,
        color: "bg-secondary text-white",
        link: "/calendar"
      },
      {
        label: "Supplier Payment",
        icon: Receipt,
        color: "bg-secondary text-white",
        link: "/assistant"
      },
    ],
  },

]

function AgendaPanel() {

  const navigate = useNavigate()

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <CalendarDays size={16} className="text-accent" />
        <h3 className="font-semibold text-primary">
          Agenda Details
        </h3>
      </div>

      {/* AGENDA LIST */}
      <ul className="flex flex-col gap-5">

        {agendaItems.map((item) => (

          <li
            key={item.id}
            className="flex items-start gap-4 pb-5 border-b border-neutral/20 last:border-0 last:pb-0"
          >

            {/* DATE */}
            <div className="w-36 shrink-0">
              <span className="text-xs font-semibold text-neutral">
                {item.date}
              </span>
            </div>

            {/* EVENTS */}
            <div className="flex flex-wrap gap-2">

              {item.events.map((event, i) => {

                const Icon = event.icon

                return (
                  <span
                    key={i}
                    onClick={() => navigate(event.link)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:scale-105 transition ${event.color}`}
                  >
                    <Icon size={11} />
                    {event.label}
                  </span>
                )
              })}

              {item.alert && (
                <span
                  onClick={() => navigate(item.link)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-accent/20 text-primary shadow-sm cursor-pointer hover:scale-105 transition"
                >
                  <AlertTriangle size={11} />
                  {item.alert}
                </span>
              )}

            </div>

          </li>

        ))}

      </ul>

    </div>
  )
}

export default AgendaPanel