import {
  Users,
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  Bot,
  UserCircle,
  Package,
  TrendingUp,
  Shield,
  Crown,
  Cpu,
  BrainCircuit,
  Network,
} from "lucide-react";

// ── Team Data ──
const TEAM_MEMBERS = [
  { name: "Keneth Campo", role: "Leader", track: "System Administration", color: "#F9B672", initials: "KC", photo: "/team/Keneth_Campo.jpg" },
  { name: "Angelo Base", role: "Member", track: "Data Science", color: "#2E6F4E", initials: "AB", photo: "/team/Angelo_Base.jpg" },
  { name: "Gwyneth Esperat", role: "Member", track: "Data Science", color: "#2C2F45", initials: "GE", photo: "/team/Gwyneth_Esperat.jpg" },
  { name: "Pamela Malazarte", role: "Member", track: "Cyber Physical System", color: "#84848A", initials: "PM", photo: "/team/Pamela_Malazarte.jpg" },
  { name: "Maynard Refugia", role: "Member", track: "Cyber Physical System", color: "#050725", initials: "MR", photo: null },
];

// ── App Features ──
const APP_FEATURES = [
  { icon: LayoutDashboard, title: "Dashboard", description: "View your wallet balance, budget predictions, sales analytics chart, and recent transactions all in one place." },
  { icon: CalendarDays, title: "Calendar", description: "Plan bills payments, supplier deliveries, and restock schedules. Switch between Week, Month, and Agenda views." },
  { icon: Bot, title: "AI Assistant", description: "Chat with our Gemini-powered assistant for expense analysis, restock suggestions, savings advice, and financial predictions." },
  { icon: UserCircle, title: "Profile", description: "Manage your account info, financial preferences, AI settings, and security. Supports Google Sign-In." },
  { icon: Package, title: "Inventory Management", description: "Track stock levels with automatic LOW and CRITICAL alerts. Restock items individually or all at once." },
  { icon: TrendingUp, title: "Budget Prediction", description: "Machine learning-powered sales forecasting to help you plan your monthly budget based on historical data." },
];

// ── Quick Start Steps ──
const QUICK_STEPS = [
  "Login with your Google account or use the demo account (admin@email.com / admin123).",
  "Add your transactions on the Dashboard to track income and expenses.",
  "Check the Calendar for upcoming bills, deliveries, and restock reminders.",
  "Ask the AI Assistant anything about your finances — it reads your real data.",
  "Monitor inventory in the Restock Panel and add new items as needed.",
  "Review your Profile settings to customize budget limits and AI preferences.",
];

function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">

      {/* ═══════════════════════════════════════════
          ABOUT HEADER
          ═══════════════════════════════════════════ */}
      <div className="bg-[#2C2F45] rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-[#F9B672] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-[#050725]">₱</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Financial Tracker
        </h1>
        <p className="text-sm text-gray-400">
          Budget Prediction System for Small Retail Businesses
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Version 1.0 • Software Design Project • 2025–2026
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          HOW TO USE
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-[#F9B672]" />
          <h3 className="text-[#050725] font-semibold">How to Use</h3>
        </div>

        <p className="text-sm text-[#84848A] mb-5 leading-relaxed">
          Financial Tracker is a SaaS dashboard designed for small retail businesses to track expenses,
          predict budgets, manage inventory, and get AI-powered financial advice. Here's what each feature does:
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {APP_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-3 p-4 bg-[#ECDFC7]/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#2C2F45] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#050725]">{feature.title}</p>
                  <p className="text-xs text-[#84848A] leading-relaxed mt-0.5">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Start */}
        <div className="p-5 bg-[#2C2F45] rounded-xl">
          <p className="text-sm font-semibold text-white mb-4">Quick Start Guide</p>
          <div className="space-y-3">
            {QUICK_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F9B672] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-[#050725]">{i + 1}</span>
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MEET THE TEAM
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-[#F9B672]" />
          <h3 className="text-[#050725] font-semibold">Meet the Team</h3>
        </div>

        <p className="text-sm text-[#84848A] mb-6">
          Bachelor of Science in Computer Engineering • Technological Institute of the Philippines
        </p>

        {/* Team List */}
        <div className="space-y-3">
          {TEAM_MEMBERS.map((member) => {
            const isLeader = member.role === "Leader";
            const TrackIcon =
              member.track === "System Administration" ? Shield
              : member.track === "Data Science" ? BrainCircuit
              : Network;

            return (
              <div
                key={member.name}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isLeader ? "bg-[#2C2F45]" : "bg-[#ECDFC7]/50"
                }`}
              >
                {/* Avatar — real photo or initials fallback */}
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: isLeader ? "#F9B672" : member.color + "20" }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: isLeader ? "#050725" : member.color }}
                    >
                      {member.initials}
                    </span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${isLeader ? "text-white" : "text-[#050725]"}`}>
                      {member.name}
                    </p>
                    {isLeader && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#F9B672] bg-[#F9B672]/15 px-2 py-0.5 rounded-full">
                        <Crown size={10} />
                        LEADER
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <TrackIcon size={11} className={isLeader ? "text-gray-400" : "text-[#84848A]"} />
                    <p className={`text-xs ${isLeader ? "text-gray-400" : "text-[#84848A]"}`}>
                      {member.track}
                    </p>
                  </div>
                </div>

                {/* Program badge */}
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                  isLeader ? "bg-white/10 text-gray-300" : "bg-[#ECDFC7] text-[#84848A]"
                }`}>
                  <Cpu size={10} className="inline mr-1 -mt-0.5" />
                  CPE
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#ECDFC7] text-center">
          <p className="text-xs text-[#84848A]">
            Software Design • Group 6 • A.Y. 2025–2026
          </p>
          <p className="text-[10px] text-[#84848A]/60 mt-1">
            Financial Tracker with Budget Prediction
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;