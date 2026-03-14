import { CreditCard, Landmark, Wallet, Trash2 } from "lucide-react"
import { transactionsAPI } from "../../services/api"
import useApi from "../../hooks/useApi"

const iconMap = {
  "Bank Transfer": Landmark,
  "Paypal": Wallet,
  "Debit Card": CreditCard,
}

function RecentTransactions({ onViewAll }) {

  const { data, refetch } = useApi(transactionsAPI.getAll)

  const recent = data?.slice(0,4) ?? []

  const handleDelete = async (id) => {
    await transactionsAPI.delete(id)
    refetch()
  }

  return (

    <div className="bg-surface rounded-2xl p-6 shadow-card">

      <div className="flex justify-between mb-4">

        <h3 className="font-semibold text-primary">
          Recent Transactions
        </h3>

        <button
          onClick={onViewAll}
          className="text-xs text-neutral hover:text-primary"
        >
          View All
        </button>

      </div>


      <ul className="space-y-4">

        {recent.map((t)=>{

          const Icon = iconMap[t.type] ?? CreditCard

          return(

            <li
              key={t.id}
              className="flex justify-between items-center"
            >

              <div className="flex items-center gap-3">

                <div className="bg-secondary text-white p-2 rounded-lg">
                  <Icon size={16}/>
                </div>

                <div>

                  <p className="text-sm font-semibold text-primary">
                    {t.to_name}
                  </p>

                  <p className="text-xs text-neutral">
                    {t.type}
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-3">

                <div className="text-right">

                  <p className="text-sm font-semibold text-red-500">
                    -₱{Math.abs(t.amount).toFixed(2)}
                  </p>

                  <p className="text-xs text-neutral">
                    {t.date}
                  </p>

                </div>

                <button
                  onClick={()=>handleDelete(t.id)}
                  className="text-neutral hover:text-red-500"
                >
                  <Trash2 size={14}/>
                </button>

              </div>

            </li>

          )
        })}

      </ul>

    </div>

  )
}

export default RecentTransactions