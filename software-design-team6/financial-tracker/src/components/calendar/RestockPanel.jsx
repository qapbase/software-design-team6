import { Check, Package, AlertTriangle } from "lucide-react"
import { storageAPI } from "../../services/api"
import useApi from "../../hooks/useApi"
import LoadingSpinner from "../shared/LoadingSpinner"

const statusStyle = {
  LOW: "text-orange-600 bg-orange-100",
  CRITICAL: "text-red-600 bg-red-100",
  OK: "text-green-700 bg-green-100",
}

function RestockPanel() {

  const { data, loading, refetch } = useApi(storageAPI.getAll)

  const handleRestock = async (item) => {
    await storageAPI.updateStock(item.id, item.min_level * 2)
    refetch()
  }

  const items = data ?? []

  // prioritize items needing restock
  const sortedItems = [...items].sort((a,b)=>{
    const priority = { CRITICAL:0, LOW:1, OK:2 }
    return priority[a.status] - priority[b.status]
  })

  return (

    <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-2">

        <AlertTriangle size={16} className="text-accent"/>

        <h3 className="font-semibold text-primary text-sm">
          Restock Details
        </h3>

      </div>


      {loading && (
        <LoadingSpinner message="Loading inventory..." />
      )}


      {!loading && (

        <ul className="flex flex-col gap-4">

          {sortedItems.map((item)=>(
            <li
              key={item.id}
              className="flex items-center justify-between"
            >

              {/* LEFT INFO */}
              <div className="flex items-center gap-3">

                <span className="text-xl w-8 text-center">
                  {item.emoji ?? "📦"}
                </span>

                <div>

                  <p className="text-sm font-semibold text-primary">
                    {item.item_name}
                  </p>

                  <p className="text-[11px] text-neutral mt-0.5">
                    Stock: {item.current_stock} / {item.min_level} {item.unit}
                  </p>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5
                    rounded-full mt-1 inline-block
                    ${statusStyle[item.status]}`}
                  >
                    {item.status}
                  </span>

                </div>

              </div>


              {/* RESTOCK BUTTON */}
              <button
                onClick={() => handleRestock(item)}
                className="w-7 h-7 rounded-full border border-neutral
                flex items-center justify-center
                hover:bg-accent/20 transition"
              >
                <Check size={13} className="text-primary"/>
              </button>

            </li>
          ))}

        </ul>

      )}


      {/* RESTOCK ALL */}
      <button
        onClick={() => sortedItems.forEach(handleRestock)}
        className="mt-2 w-full bg-accent text-primary font-semibold
        py-2 rounded-xl hover:opacity-90 transition"
      >
        Restock All
      </button>

    </div>

  )
}

export default RestockPanel