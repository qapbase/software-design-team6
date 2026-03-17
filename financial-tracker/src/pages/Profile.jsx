import { useState } from "react";
import {
  User,
  Shield,
  Wallet,
  BarChart3,
  Bot,
  Save,
  Pencil,
  X,
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  // ── User Information State (pre-filled from Firebase user) ──
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || "Keneth Campo",
    email: user?.email || "admin@email.com",
    businessName: "Campo Retail Store",
    phone: "+63 912 345 6789",
    address: "Quezon City, Metro Manila",
  });
  const [editBuffer, setEditBuffer] = useState({ ...userInfo });

  // Google profile photo from Firebase
  const photoURL = user?.photoURL || null;
  const provider = user?.provider || "demo";

  // ── Financial Preferences State ──
  const [preferences, setPreferences] = useState({
    currency: "PHP",
    monthlyBudget: "32000",
    savingsGoal: "10",
    alertThreshold: "20",
    fiscalYearStart: "January",
  });

  // ── AI Settings State ──
  const [aiSettings, setAiSettings] = useState({
    autoRecommendations: true,
    restockAlerts: true,
    budgetWarnings: true,
    salesForecasting: true,
    assistantTone: "Professional",
  });

  // ── Account Statistics ──
  const accountStats = {
    totalTransactions: 128,
    totalExpenses: "₱58,420.00",
    totalIncome: "₱120,456.00",
    avgMonthlySpend: "₱9,736.67",
    memberSince: "September 2024",
    inventoryItems: 24,
  };

  // ── Handlers ──
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  const handleEditToggle = () => {
    setEditBuffer({ ...userInfo });
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setUserInfo({ ...editBuffer });
    setIsEditing(false);
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleAiToggle = (key) => {
    setAiSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAiSelectChange = (key, value) => {
    setAiSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ── Reusable Components ──
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-5">
      <Icon size={18} className="text-[#F9B672]" />
      <h3 className="text-[#050725] font-semibold">{title}</h3>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ECDFC7] last:border-0">
      <span className="text-sm text-[#84848A]">{label}</span>
      <span className="text-sm font-medium text-[#050725] mt-1 sm:mt-0">{value}</span>
    </div>
  );

  const EditRow = ({ label, fieldKey }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ECDFC7] last:border-0 gap-2">
      <span className="text-sm text-[#84848A]">{label}</span>
      <input
        type="text"
        value={editBuffer[fieldKey]}
        onChange={(e) => setEditBuffer((prev) => ({ ...prev, [fieldKey]: e.target.value }))}
        className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-[#F9B672] transition-colors"
      />
    </div>
  );

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-[#2E6F4E]" : "bg-[#84848A]/30"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3 p-3 bg-[#ECDFC7]/60 rounded-xl">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
        <Icon size={18} style={{ color: color }} />
      </div>
      <div>
        <p className="text-xs text-[#84848A]">{label}</p>
        <p className="text-sm font-semibold text-[#050725]">{value}</p>
      </div>
    </div>
  );

  const SelectDropdown = ({ value, options, onChange }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-[#F9B672] transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#84848A] pointer-events-none" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* ═══════════════════════════════════════════
          SECTION 1 — PROFILE HEADER / USER INFO
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-5">
            {/* Avatar: Google photo or default icon */}
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-xl object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 bg-[#2C2F45] rounded-xl flex items-center justify-center">
                <User size={28} className="text-white" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-[#050725]">{userInfo.fullName}</h2>
              <p className="text-sm text-[#84848A]">{userInfo.email}</p>
              {provider === "google.com" && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#84848A] bg-[#ECDFC7] px-2 py-0.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  Signed in with Google
                </span>
              )}
            </div>
          </div>

          <button
            onClick={isEditing ? handleSaveProfile : handleEditToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isEditing ? "bg-[#2E6F4E] hover:bg-[#245a3f] text-white" : "bg-[#2C2F45] hover:bg-[#050725] text-white"
            }`}
          >
            {isEditing ? <Save size={15} /> : <Pencil size={15} />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="h-px bg-[#ECDFC7] mb-4" />

        {isEditing ? (
          <div>
            <EditRow label="Full Name" fieldKey="fullName" />
            <EditRow label="Email" fieldKey="email" />
            <EditRow label="Business Name" fieldKey="businessName" />
            <EditRow label="Phone" fieldKey="phone" />
            <EditRow label="Address" fieldKey="address" />
            <div className="flex justify-end mt-4">
              <button onClick={handleEditToggle} className="flex items-center gap-1.5 text-sm text-[#84848A] hover:text-[#050725] transition-colors">
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <InfoRow label="Full Name" value={userInfo.fullName} />
            <InfoRow label="Email" value={userInfo.email} />
            <InfoRow label="Business Name" value={userInfo.businessName} />
            <InfoRow label="Phone" value={userInfo.phone} />
            <InfoRow label="Address" value={userInfo.address} />
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 2 — FINANCIAL PREFERENCES
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={Wallet} title="Financial Preferences" />
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Currency</p>
              <p className="text-xs text-[#84848A]">Display currency for all amounts</p>
            </div>
            <SelectDropdown value={preferences.currency} options={["PHP", "USD", "EUR", "JPY", "GBP"]} onChange={(val) => handlePreferenceChange("currency", val)} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Monthly Budget Limit</p>
              <p className="text-xs text-[#84848A]">Set your target monthly spending cap</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#84848A]">₱</span>
              <input type="number" value={preferences.monthlyBudget} onChange={(e) => handlePreferenceChange("monthlyBudget", e.target.value)}
                className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:border-[#F9B672] transition-colors text-right" />
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Savings Goal</p>
              <p className="text-xs text-[#84848A]">Percentage of income to save each month</p>
            </div>
            <div className="flex items-center gap-1">
              <input type="number" min="0" max="100" value={preferences.savingsGoal} onChange={(e) => handlePreferenceChange("savingsGoal", e.target.value)}
                className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-20 focus:outline-none focus:border-[#F9B672] transition-colors text-right" />
              <span className="text-sm text-[#84848A]">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Low Stock Alert Threshold</p>
              <p className="text-xs text-[#84848A]">Alert when inventory falls below this percentage</p>
            </div>
            <div className="flex items-center gap-1">
              <input type="number" min="0" max="100" value={preferences.alertThreshold} onChange={(e) => handlePreferenceChange("alertThreshold", e.target.value)}
                className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-20 focus:outline-none focus:border-[#F9B672] transition-colors text-right" />
              <span className="text-sm text-[#84848A]">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[#050725]">Fiscal Year Start</p>
              <p className="text-xs text-[#84848A]">When your business fiscal year begins</p>
            </div>
            <SelectDropdown value={preferences.fiscalYearStart}
              options={["January","February","March","April","May","June","July","August","September","October","November","December"]}
              onChange={(val) => handlePreferenceChange("fiscalYearStart", val)} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3 — ACCOUNT STATISTICS
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={BarChart3} title="Account Statistics" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard icon={Receipt} label="Total Transactions" value={accountStats.totalTransactions} color="#050725" />
          <StatCard icon={TrendingDown} label="Total Expenses" value={accountStats.totalExpenses} color="#E74C3C" />
          <StatCard icon={TrendingUp} label="Total Income" value={accountStats.totalIncome} color="#2E6F4E" />
          <StatCard icon={Wallet} label="Avg Monthly Spend" value={accountStats.avgMonthlySpend} color="#F9B672" />
          <StatCard icon={PiggyBank} label="Inventory Items" value={accountStats.inventoryItems} color="#2C2F45" />
          <StatCard icon={BarChart3} label="Member Since" value={accountStats.memberSince} color="#84848A" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 4 — AI SETTINGS
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={Bot} title="AI Settings" />
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Auto Recommendations</p>
              <p className="text-xs text-[#84848A]">Receive AI-generated budget and spending tips on dashboard</p>
            </div>
            <ToggleSwitch enabled={aiSettings.autoRecommendations} onToggle={() => handleAiToggle("autoRecommendations")} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Restock Alerts</p>
              <p className="text-xs text-[#84848A]">AI monitors inventory and suggests when to restock</p>
            </div>
            <ToggleSwitch enabled={aiSettings.restockAlerts} onToggle={() => handleAiToggle("restockAlerts")} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Budget Warnings</p>
              <p className="text-xs text-[#84848A]">Get notified when spending approaches your budget limit</p>
            </div>
            <ToggleSwitch enabled={aiSettings.budgetWarnings} onToggle={() => handleAiToggle("budgetWarnings")} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Sales Forecasting</p>
              <p className="text-xs text-[#84848A]">Enable AI-powered sales predictions on analytics chart</p>
            </div>
            <ToggleSwitch enabled={aiSettings.salesForecasting} onToggle={() => handleAiToggle("salesForecasting")} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[#050725]">Assistant Tone</p>
              <p className="text-xs text-[#84848A]">How the AI assistant communicates with you</p>
            </div>
            <SelectDropdown value={aiSettings.assistantTone} options={["Professional", "Friendly", "Concise", "Detailed"]}
              onChange={(val) => handleAiSelectChange("assistantTone", val)} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 5 — SECURITY
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={Shield} title="Security" />
        <div className="space-y-4">
          {provider !== "google.com" && (
            <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
              <div>
                <p className="text-sm font-medium text-[#050725]">Password</p>
                <p className="text-xs text-[#84848A]">Last changed 30 days ago</p>
              </div>
              <button className="text-sm text-[#F9B672] hover:text-[#e5a25e] font-medium transition-colors">
                Change Password
              </button>
            </div>
          )}

          {provider === "google.com" && (
            <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
              <div>
                <p className="text-sm font-medium text-[#050725]">Authentication</p>
                <p className="text-xs text-[#84848A]">Signed in via Google — password managed by Google</p>
              </div>
              <span className="text-xs text-[#2E6F4E] bg-[#2E6F4E]/10 px-2.5 py-1 rounded-full font-medium">Secure</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#2C2F45] hover:bg-[#050725] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;