import { Plus } from "lucide-react"

function HeaderBanner({ onAddTransaction }) {
  return (
    <div className="flex items-center justify-between mb-6">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-card">
          <span className="text-primary font-bold text-xl">₱</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-primary">
            Financial Tracker
          </h1>

          <p className="text-neutral text-sm">
            Track, analyze, and predict your finances
          </p>
        </div>

      </div>


      {/* RIGHT BUTTON */}
      <button
        onClick={onAddTransaction}
        className="flex items-center gap-2 bg-accent text-primary font-semibold px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
      >
        <Plus size={18}/>
        Add Transaction
      </button>

    </div>
  )
}

export default HeaderBanner