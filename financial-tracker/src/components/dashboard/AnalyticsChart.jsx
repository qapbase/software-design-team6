import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts"

import { forecastAPI } from "../../services/api"
import LoadingSpinner from "../shared/LoadingSpinner"

// ── Custom tooltip ────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1f1f1f] border border-[#333]
                    rounded-xl p-3 text-xs min-w-[130px]">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}
           className="mb-0.5">
          {p.name}: ₱{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  )
}

function AnalyticsChart() {

  const [chartData, setChartData]       = useState([])
  const [splitLabel, setSplitLabel]     = useState(null)
  const [modelName, setModelName]       = useState('')
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    forecastAPI.getForecast()
      .then(data => {
        const recent   = data.recent_sales ?? []
        const forecast = data.forecast     ?? []

        // ── Actual days ───────────────────────────────────
        const actualPoints = recent.map((val, i) => ({
          label:    `D${i + 1}`,
          actual:   Math.round(val),
          forecast: null,
        }))

        // ── Forecast days (dashed continuation) ──────────
        const forecastPoints = forecast.map((val, i) => ({
          label:    `+${i + 1}d`,
          actual:   null,
          forecast: Math.round(val),
        }))

        // ── Stitch: last actual point also starts forecast
        // so the line connects visually
        if (actualPoints.length > 0 && forecastPoints.length > 0) {
          forecastPoints[0] = {
            ...forecastPoints[0],
            actual: actualPoints[actualPoints.length - 1].actual,
          }
        }

        setChartData([...actualPoints, ...forecastPoints])
        setSplitLabel(forecastPoints[0]?.label ?? null)
        setModelName(data.model ?? '')
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load forecast data')
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-[#1f1f1f] rounded-2xl p-6 shadow-xl
                    border border-[#333]">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Sales Analytics
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Last 30 days of sales + 7-day forecast
            {modelName && (
              <span className="ml-1 text-green-400">
                ({modelName})
              </span>
            )}
          </p>
        </div>
        <span className="text-xs bg-[#003366] text-white
                         px-3 py-1 rounded-full">
          Live Data
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading forecast..." />
      ) : error ? (
        <p className="text-red-400 text-sm text-center py-10">
          {error}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={270}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2d2d2d"
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />

            <YAxis
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v =>
                `₱${(v / 1000).toFixed(1)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Divider line between actual and forecast */}
            {splitLabel && (
              <ReferenceLine
                x={splitLabel}
                stroke="#444"
                strokeDasharray="4 4"
                label={{
                  value: 'Forecast →',
                  fill: '#666',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Actual sales — solid green */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 2, fill: '#22c55e' }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />

            {/* Forecast — dashed blue/orange depending on model */}
            <Line
              type="monotone"
              dataKey="forecast"
              name={modelName || 'Forecast'}
              stroke="#fb923c"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 3, fill: '#fb923c' }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />

          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend note */}
      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5 text-xs
                        text-gray-500">
          <span className="w-6 h-0.5 bg-green-500
                           inline-block rounded" />
          Actual Sales
        </div>
        <div className="flex items-center gap-1.5 text-xs
                        text-gray-500">
          <span className="w-6 h-0.5 bg-orange-400
                           inline-block rounded
                           border-dashed" />
          {modelName} Forecast
        </div>
      </div>

    </div>
  )
}

export default AnalyticsChart