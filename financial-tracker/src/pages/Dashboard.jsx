import { useState } from "react"

import HeaderBanner from "../components/dashboard/HeaderBanner"
import WalletCard from "../components/dashboard/WalletCard"
import RecommendationCard from "../components/dashboard/RecommendationCard"
import AnalyticsChart from "../components/dashboard/AnalyticsChart"
import RecentTransactions from "../components/dashboard/RecentTransactions"
import AddTransactionModal from "../components/dashboard/AddTransactionModal"

export default function Dashboard() {

  const [showModal, setShowModal] = useState(false)

  const handleAddTransaction = async (data) => {
    console.log("Transaction added:", data)
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-8">

      {/* LEFT DASHBOARD */}
      <div className="col-span-9 space-y-6">

        {/* HEADER */}
        <HeaderBanner
          onAddTransaction={() => setShowModal(true)}
        />

        {/* WALLET + BUDGET PREDICTION */}
        <div className="grid grid-cols-2 gap-6">
          <WalletCard />
          <RecommendationCard />
        </div>


        {/* RECOMMENDATION + SALES */}
        <div className="grid grid-cols-2 gap-6">

          {/* AI RECOMMENDATION */}
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


          {/* SALES CARD */}
          <div className="bg-surface rounded-2xl p-6 shadow">

            <h3 className="text-neutral font-semibold mb-2">
              Sales
            </h3>

            <p className="text-2xl font-bold text-primary">
              ₱60,228
            </p>

            <p className="text-sm text-neutral mt-1">
              -3.4% since last month
            </p>

          </div>

        </div>


        {/* ANALYTICS */}
        <AnalyticsChart />

      </div>


      {/* RIGHT PANEL */}
      <div className="col-span-3">
        <RecentTransactions />
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