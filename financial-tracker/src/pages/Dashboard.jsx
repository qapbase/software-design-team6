import { useState, useCallback } from "react"
import { X, Wallet, TrendingUp, Star, ShoppingBag } from "lucide-react"

import HeaderBanner from "../components/dashboard/HeaderBanner"
import WalletCard from "../components/dashboard/WalletCard"
import RecommendationCard from "../components/dashboard/RecommendationCard"
import AnalyticsChart from "../components/dashboard/AnalyticsChart"
import RecentTransactions from "../components/dashboard/RecentTransactions"
import AddTransactionModal from "../components/dashboard/AddTransactionModal"
import { transactionsAPI } from "../services/api"

// ── Clickable Card Wrapper ──
function ClickableCard({ children, modalTitle, modalIcon: Icon }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      >
        {children}
      </div>

      {expanded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-[#F4E9DA] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECDFC7]">
              <div className="flex items-center gap-2">
                {Icon && <Icon size={18} className="text-[#F9B672]" />}
                <h2 className="text-lg font-bold text-[#050725]">{modalTitle}</h2>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                className="w-9 h-9 rounded-xl bg-[#ECDFC7] hover:bg-[#2C2F45] hover:text-white flex items-center justify-center transition-colors text-[#84848A]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function Dashboard() {

  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddTransaction = async (data) => {
    try {
      await transactionsAPI.add(data)
      // Trigger refresh of child components
      setRefreshKey((prev) => prev + 1)
      setShowModal(false)
    } catch (error) {
      console.error("Failed to add transaction:", error)
      alert("Failed to add transaction. Please try again.")
    }
  }

  // ── Welcome Greeting ──
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dateString = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`

  const userName = "Keneth"

  return (
    <div className="grid grid-cols-12 gap-6 p-8">

      {/* LEFT DASHBOARD */}
      <div className="col-span-9 space-y-6">

        {/* WELCOME GREETING */}
        <div>
          <h1 className="text-xl font-bold text-[#050725]">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-sm text-[#84848A] mt-0.5">
            {dateString}
          </p>
        </div>

        {/* HEADER */}
        <HeaderBanner onAddTransaction={() => setShowModal(true)} />

        {/* WALLET + BUDGET PREDICTION */}
        <div className="grid grid-cols-2 gap-6">
          <ClickableCard modalTitle="Wallet Details" modalIcon={Wallet}>
            <WalletCard key={`wallet-${refreshKey}`} />
          </ClickableCard>
          <ClickableCard modalTitle="Budget Prediction" modalIcon={TrendingUp}>
            <RecommendationCard />
          </ClickableCard>
        </div>

        {/* RECOMMENDATION + SALES */}
        <div className="grid grid-cols-2 gap-6">

          {/* AI RECOMMENDATION */}
          <ClickableCard modalTitle="AI Recommendations" modalIcon={Star}>
            <div className="bg-secondary text-white rounded-2xl p-6 shadow">
              <h3 className="text-xs tracking-widest font-semibold text-accent mb-4">
                RECOMMENDATION
              </h3>
              <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex gap-2">
                  <span className="text-accent">★</span>
                  Prioritize essential expenses first — aim for 50–60% of budget on necessities.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">★</span>
                  Multiple Bank Transfers detected. Consider consolidating payments.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">★</span>
                  Set aside ₱3,200 (10%) as an emergency fund this month.
                </li>
              </ul>
            </div>
          </ClickableCard>

          {/* SALES CARD */}
          <ClickableCard modalTitle="Sales Overview" modalIcon={ShoppingBag}>
            <div className="bg-surface rounded-2xl p-6 shadow">
              <h3 className="text-neutral font-semibold mb-2">Sales</h3>
              <p className="text-2xl font-bold text-primary">₱60,228</p>
              <p className="text-sm text-neutral mt-1">-3.4% since last month</p>
            </div>
          </ClickableCard>

        </div>

        {/* ANALYTICS */}
        <AnalyticsChart />

      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-3">
        <RecentTransactions key={`txn-${refreshKey}`} />
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  )
}