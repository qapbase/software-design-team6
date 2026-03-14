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

function Profile() {
  const navigate = useNavigate();

  // ── User Information State ──
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: "Keneth Campo",
    email: "admin@email.com",
    businessName: "Campo Retail Store",
    phone: "+63 912 345 6789",
    address: "Quezon City, Metro Manila",
  });
  const [editBuffer, setEditBuffer] = useState({ ...userInfo });

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

  // ── Account Statistics (read-only, typically from API) ──
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
    navigate("/login");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditBuffer({ ...userInfo });
    } else {
      setEditBuffer({ ...userInfo });
    }
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
      <span className="text-sm font-medium text-[#050725] mt-1 sm:mt-0">
        {value}
      </span>
    </div>
  );

  const EditRow = ({ label, fieldKey }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ECDFC7] last:border-0 gap-2">
      <span className="text-sm text-[#84848A]">{label}</span>
      <input
        type="text"
        value={editBuffer[fieldKey]}
        onChange={(e) =>
          setEditBuffer((prev) => ({ ...prev, [fieldKey]: e.target.value }))
        }
        className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-[#F9B672] transition-colors"
      />
    </div>
  );

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-[#2E6F4E]" : "bg-[#84848A]/30"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3 p-3 bg-[#ECDFC7]/60 rounded-xl">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color + "18" }}
      >
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
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#84848A] pointer-events-none"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* ═══════════════════════════════════════════
          SECTION 1 — PROFILE HEADER / USER INFO
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        {/* Top row: avatar + name + edit button */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#2C2F45] rounded-xl flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#050725]">
                {userInfo.fullName}
              </h2>
              <p className="text-sm text-[#84848A]">{userInfo.email}</p>
            </div>
          </div>

          <button
            onClick={isEditing ? handleSaveProfile : handleEditToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isEditing
                ? "bg-[#2E6F4E] hover:bg-[#245a3f] text-white"
                : "bg-[#2C2F45] hover:bg-[#050725] text-white"
            }`}
          >
            {isEditing ? <Save size={15} /> : <Pencil size={15} />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#ECDFC7] mb-4" />

        {/* User info rows */}
        {isEditing ? (
          <div>
            <EditRow label="Full Name" fieldKey="fullName" />
            <EditRow label="Email" fieldKey="email" />
            <EditRow label="Business Name" fieldKey="businessName" />
            <EditRow label="Phone" fieldKey="phone" />
            <EditRow label="Address" fieldKey="address" />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-1.5 text-sm text-[#84848A] hover:text-[#050725] transition-colors"
              >
                <X size={14} />
                Cancel
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
          {/* Currency */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Currency</p>
              <p className="text-xs text-[#84848A]">
                Display currency for all amounts
              </p>
            </div>
            <SelectDropdown
              value={preferences.currency}
              options={["PHP", "USD", "EUR", "JPY", "GBP"]}
              onChange={(val) => handlePreferenceChange("currency", val)}
            />
          </div>

          {/* Monthly Budget */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Monthly Budget Limit
              </p>
              <p className="text-xs text-[#84848A]">
                Set your target monthly spending cap
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#84848A]">₱</span>
              <input
                type="number"
                value={preferences.monthlyBudget}
                onChange={(e) =>
                  handlePreferenceChange("monthlyBudget", e.target.value)
                }
                className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:border-[#F9B672] transition-colors text-right"
              />
            </div>
          </div>

          {/* Savings Goal */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Savings Goal
              </p>
              <p className="text-xs text-[#84848A]">
                Percentage of income to save each month
              </p>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={preferences.savingsGoal}
                onChange={(e) =>
                  handlePreferenceChange("savingsGoal", e.target.value)
                }
                className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-20 focus:outline-none focus:border-[#F9B672] transition-colors text-right"
              />
              <span className="text-sm text-[#84848A]">%</span>
            </div>
          </div>

          {/* Low Stock Alert Threshold */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Low Stock Alert Threshold
              </p>
              <p className="text-xs text-[#84848A]">
                Alert when inventory falls below this percentage
              </p>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={preferences.alertThreshold}
                onChange={(e) =>
                  handlePreferenceChange("alertThreshold", e.target.value)
                }
                className="text-sm font-medium text-[#050725] bg-white border border-[#ECDFC7] rounded-lg px-3 py-1.5 w-20 focus:outline-none focus:border-[#F9B672] transition-colors text-right"
              />
              <span className="text-sm text-[#84848A]">%</span>
            </div>
          </div>

          {/* Fiscal Year Start */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Fiscal Year Start
              </p>
              <p className="text-xs text-[#84848A]">
                When your business fiscal year begins
              </p>
            </div>
            <SelectDropdown
              value={preferences.fiscalYearStart}
              options={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
              onChange={(val) =>
                handlePreferenceChange("fiscalYearStart", val)
              }
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3 — ACCOUNT STATISTICS
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={BarChart3} title="Account Statistics" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={Receipt}
            label="Total Transactions"
            value={accountStats.totalTransactions}
            color="#050725"
          />
          <StatCard
            icon={TrendingDown}
            label="Total Expenses"
            value={accountStats.totalExpenses}
            color="#E74C3C"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Income"
            value={accountStats.totalIncome}
            color="#2E6F4E"
          />
          <StatCard
            icon={Wallet}
            label="Avg Monthly Spend"
            value={accountStats.avgMonthlySpend}
            color="#F9B672"
          />
          <StatCard
            icon={PiggyBank}
            label="Inventory Items"
            value={accountStats.inventoryItems}
            color="#2C2F45"
          />
          <StatCard
            icon={BarChart3}
            label="Member Since"
            value={accountStats.memberSince}
            color="#84848A"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 4 — AI SETTINGS
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={Bot} title="AI Settings" />

        <div className="space-y-0">
          {/* Auto Recommendations */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Auto Recommendations
              </p>
              <p className="text-xs text-[#84848A]">
                Receive AI-generated budget and spending tips on dashboard
              </p>
            </div>
            <ToggleSwitch
              enabled={aiSettings.autoRecommendations}
              onToggle={() => handleAiToggle("autoRecommendations")}
            />
          </div>

          {/* Restock Alerts */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Restock Alerts
              </p>
              <p className="text-xs text-[#84848A]">
                AI monitors inventory and suggests when to restock
              </p>
            </div>
            <ToggleSwitch
              enabled={aiSettings.restockAlerts}
              onToggle={() => handleAiToggle("restockAlerts")}
            />
          </div>

          {/* Budget Warnings */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Budget Warnings
              </p>
              <p className="text-xs text-[#84848A]">
                Get notified when spending approaches your budget limit
              </p>
            </div>
            <ToggleSwitch
              enabled={aiSettings.budgetWarnings}
              onToggle={() => handleAiToggle("budgetWarnings")}
            />
          </div>

          {/* Sales Forecasting */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Sales Forecasting
              </p>
              <p className="text-xs text-[#84848A]">
                Enable AI-powered sales predictions on analytics chart
              </p>
            </div>
            <ToggleSwitch
              enabled={aiSettings.salesForecasting}
              onToggle={() => handleAiToggle("salesForecasting")}
            />
          </div>

          {/* Assistant Tone */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[#050725]">
                Assistant Tone
              </p>
              <p className="text-xs text-[#84848A]">
                How the AI assistant communicates with you
              </p>
            </div>
            <SelectDropdown
              value={aiSettings.assistantTone}
              options={["Professional", "Friendly", "Concise", "Detailed"]}
              onChange={(val) => handleAiSelectChange("assistantTone", val)}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 5 — SECURITY
          ═══════════════════════════════════════════ */}
      <div className="bg-[#F4E9DA] rounded-2xl p-6 shadow-sm">
        <SectionHeader icon={Shield} title="Security" />

        <div className="space-y-4">
          {/* Password change hint */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECDFC7]">
            <div>
              <p className="text-sm font-medium text-[#050725]">Password</p>
              <p className="text-xs text-[#84848A]">
                Last changed 30 days ago
              </p>
            </div>
            <button className="text-sm text-[#F9B672] hover:text-[#e5a25e] font-medium transition-colors">
              Change Password
            </button>
          </div>

          {/* Logout */}
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