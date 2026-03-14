import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  AlertTriangle,
  PiggyBank,
  BarChart3,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { getRecommendations } from "../../services/geminiService";

/* Map recommendation type to icon */
const ICON_MAP = {
  budget: Wallet,
  sales: TrendingUp,
  inventory: AlertTriangle,
  savings: PiggyBank,
  alert: AlertTriangle,
};

/* Fallback recommendations if AI fails */
const FALLBACK_RECS = [
  {
    title: "Budget Allocation",
    text: "Prioritize essential expenses first — aim for 50–60% necessities and 20–30% savings.",
    type: "budget",
  },
  {
    title: "Monitor Low Stock",
    text: "Check your inventory regularly to avoid running out of high-demand products.",
    type: "inventory",
  },
  {
    title: "Emergency Fund",
    text: "Set aside 10% of your balance as an emergency fund before discretionary spending.",
    type: "savings",
  },
  {
    title: "Track Expenses",
    text: "Log all transactions daily to maintain accurate financial records.",
    type: "budget",
  },
  {
    title: "Sales Analysis",
    text: "Review your best-selling products weekly and adjust stock levels accordingly.",
    type: "sales",
  },
];

function RecommendationSidebar() {
  const [recommendations, setRecommendations] = useState(FALLBACK_RECS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRecs = async () => {
    setIsLoading(true);
    try {
      const recs = await getRecommendations();
      if (recs && recs.length > 0) {
        setRecommendations(recs);
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h3 className="font-semibold text-primary">Recommendations</h3>
        </div>

        <button
          onClick={fetchRecs}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-[#ECDFC7] transition-colors disabled:opacity-50"
          title="Refresh recommendations"
        >
          {isLoading ? (
            <Loader2 size={14} className="text-neutral animate-spin" />
          ) : (
            <RefreshCcw
              size={14}
              className="text-neutral hover:text-primary transition"
            />
          )}
        </button>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-[10px] text-neutral mb-3">
          AI-generated • Updated {lastUpdated}
        </p>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-neutral/20 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3.5 h-3.5 bg-[#ECDFC7] rounded animate-pulse" />
                  <div className="h-3.5 bg-[#ECDFC7] rounded w-28 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 bg-[#ECDFC7] rounded w-full animate-pulse" />
                  <div className="h-3 bg-[#ECDFC7] rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </>
        ) : (
          recommendations.map((rec, idx) => {
            const Icon = ICON_MAP[rec.type] || BarChart3;

            return (
              <div
                key={idx}
                className="border-b border-neutral/20 pb-4 last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} className="text-accent shrink-0" />
                  <p className="text-sm font-semibold text-primary">
                    {rec.title}
                  </p>
                </div>
                <p className="text-xs text-neutral leading-relaxed">
                  {rec.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecommendationSidebar;