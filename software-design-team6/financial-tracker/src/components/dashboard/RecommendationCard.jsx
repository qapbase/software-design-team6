import { useEffect, useState } from "react"
import { forecastAPI } from "../../services/api"

function RecommendationCard() {

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    forecastAPI.getBudget()
      .then(res => { setData(res); setLoading(false) })
      .catch(() => { setError('Could not load forecast'); setLoading(false) })
  }, [])

  const fmt = (val) =>
    val != null
      ? `₱${Number(val).toLocaleString('en-PH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '—'

  const budget = data?.recommended_budget ?? null

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-panel">

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-neutral">
          Budget Prediction
        </h3>

        {/* Model badge */}
        {data?.model && (
          <span className="text-xs bg-primary/10 text-primary
                           px-2 py-0.5 rounded-full font-medium">
            {data.model}
          </span>
        )}
      </div>

      <p className="text-xs text-neutral/50 mb-4">
        Recommended Essential Budget
      </p>

      {/* Main number */}
      {loading ? (
        <div className="animate-pulse h-9 w-36 bg-gray-200
                        rounded mb-4" />
      ) : error ? (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      ) : (
        <p className="text-3xl font-bold text-primary mb-4">
          {fmt(budget)}
        </p>
      )}

      {/* Daily breakdown */}
      {data?.daily_forecast && !loading && (
        <div className="mb-4">
          <p className="text-xs text-neutral/40 mb-2">
            7-day daily forecast
          </p>
          <div className="grid grid-cols-7 gap-1">
            {data.daily_forecast.map((val, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-neutral/40 mb-1">
                  D{i + 1}
                </div>
                <div className="text-xs font-medium text-neutral">
                  ₱{(val / 1000).toFixed(1)}k
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <ul className="space-y-1 text-xs text-neutral/60">
        <li className="flex gap-1">
          <span className="text-primary">·</span>
          Prioritize essential expenses — aim for 50–60%.
        </li>
        <li className="flex gap-1">
          <span className="text-primary">·</span>
          Save {fmt(budget ? budget * 0.1 : null)} as emergency fund.
        </li>
        <li className="flex gap-1">
          <span className="text-primary">·</span>
          Reduce multiple bank transfers to lower fees.
        </li>
      </ul>

    </div>
  )
}

export default RecommendationCard