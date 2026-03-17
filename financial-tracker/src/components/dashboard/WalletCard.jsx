import { Wallet } from "lucide-react"
import { transactionsAPI } from "../../services/api"
import useApi from "../../hooks/useApi"

function WalletCard() {
  const { data, loading } = useApi(transactionsAPI.getBalance)

  const balance = data?.balance ?? 0

  return (
    <div className="bg-secondary text-white rounded-2xl p-6 shadow-panel">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm text-neutral">
            Main Wallet
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {loading ? (
              <span className="inline-block w-40 h-8 bg-white/10 rounded-lg animate-pulse" />
            ) : (
              `₱${Math.abs(balance).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </h2>

          <p className="text-xs text-neutral mt-2">
            Total balance
          </p>
        </div>

        <div className="bg-primary/60 p-3 rounded-xl">
          <Wallet size={22} />
        </div>

      </div>

    </div>
  )
}

export default WalletCard