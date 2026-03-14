import { Wallet } from "lucide-react"

function WalletCard() {
  return (
    <div className="bg-secondary text-white rounded-2xl p-6 shadow-panel">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm text-neutral">
            Main Wallet
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₱40,000.00
          </h2>

          <p className="text-xs text-neutral mt-2">
            Total balance
          </p>
        </div>

        <div className="bg-primary/60 p-3 rounded-xl">
          <Wallet size={22}/>
        </div>

      </div>

    </div>
  )
}

export default WalletCard