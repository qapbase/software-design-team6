import { useState } from "react"
import { Check, Package, AlertTriangle, Plus, X } from "lucide-react"
import { storageAPI } from "../../services/api"
import useApi from "../../hooks/useApi"
import LoadingSpinner from "../shared/LoadingSpinner"

const statusStyle = {
  LOW: "text-orange-600 bg-orange-100",
  CRITICAL: "text-red-600 bg-red-100",
  OK: "text-green-700 bg-green-100",
}

const EMOJI_OPTIONS = [
  "📦", "🥫", "🥤", "🫙", "🍜", "🍚", "🍞", "🥛", "🥚", "☕",
  "🍬", "🧂", "🍪", "🥔", "🍫", "🍨", "💧", "⚡", "🥣", "🧈",
  "🧀", "🧴", "🧹", "🪣", "🧻", "🥩", "🐟", "🍎", "🥕", "🧅",
]

function RestockPanel() {
  const { data, loading, refetch } = useApi(storageAPI.getAll)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [newItem, setNewItem] = useState({
    item_name: "",
    emoji: "📦",
    current_stock: "",
    unit: "pcs",
    min_level: "",
  })

  const handleRestock = async (item) => {
    await storageAPI.updateStock(item.id, item.min_level * 2)
    refetch()
  }

  const handleAddItem = async () => {
    if (!newItem.item_name.trim()) return

    setAddLoading(true)
    try {
      const stock = parseInt(newItem.current_stock) || 0
      const min = parseInt(newItem.min_level) || 10

      let status = "OK"
      if (stock === 0 || stock < min * 0.5) status = "CRITICAL"
      else if (stock < min) status = "LOW"

      await storageAPI.add({
        item_name: newItem.item_name.trim(),
        emoji: newItem.emoji,
        current_stock: stock,
        unit: newItem.unit,
        min_level: min,
        status: status,
      })

      setNewItem({
        item_name: "",
        emoji: "📦",
        current_stock: "",
        unit: "pcs",
        min_level: "",
      })
      setShowAddModal(false)
      refetch()
    } catch (err) {
      console.error("Failed to add item:", err)
    }
    setAddLoading(false)
  }

  const items = data ?? []

  const sortedItems = [...items].sort((a, b) => {
    const priority = { CRITICAL: 0, LOW: 1, OK: 2 }
    return priority[a.status] - priority[b.status]
  })

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-accent" />
          <h3 className="font-semibold text-primary text-sm">Restock Details</h3>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition"
          title="Add new item"
        >
          <Plus size={14} className="text-primary" />
        </button>
      </div>

      {/* Item count */}
      <p className="text-[10px] text-neutral -mt-2">
        {items.filter((i) => i.status !== "OK").length} items need attention • {items.length} total
      </p>

      {loading && <LoadingSpinner message="Loading inventory..." />}

      {!loading && (
        <ul className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
          {sortedItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">

              {/* LEFT INFO */}
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">
                  {item.emoji ?? "📦"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {item.item_name}
                  </p>
                  <p className="text-[11px] text-neutral mt-0.5">
                    Stock: {item.current_stock} / {item.min_level} {item.unit}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* RESTOCK BUTTON */}
              {item.status !== "OK" ? (
                <button
                  onClick={() => handleRestock(item)}
                  className="w-7 h-7 rounded-full border border-accent bg-accent/10 flex items-center justify-center hover:bg-accent/30 transition"
                  title="Restock this item"
                >
                  <Check size={13} className="text-primary" />
                </button>
              ) : (
                <div className="w-7 h-7 rounded-full border border-neutral/20 flex items-center justify-center">
                  <Check size={13} className="text-green-600" />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* RESTOCK ALL */}
      {items.filter((i) => i.status !== "OK").length > 0 && (
        <button
          onClick={() =>
            sortedItems.filter((i) => i.status !== "OK").forEach(handleRestock)
          }
          className="mt-2 w-full bg-accent text-primary font-semibold py-2 rounded-xl hover:opacity-90 transition"
        >
          Restock All ({items.filter((i) => i.status !== "OK").length} items)
        </button>
      )}

      {/* ═══════════════════════════════════════
          ADD ITEM MODAL
          ═══════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#F4E9DA] w-full max-w-sm p-6 rounded-2xl shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#050725]">Add Inventory Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#84848A] hover:text-[#050725] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Emoji Picker */}
            <div className="mb-3">
              <label className="text-xs text-[#84848A] mb-1 block">Icon</label>
              <div className="flex flex-wrap gap-1.5 bg-white rounded-xl p-2 border border-gray-200 max-h-20 overflow-y-auto">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewItem((p) => ({ ...p, emoji }))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
                      newItem.emoji === emoji ? "bg-[#F9B672]/30 scale-110" : "hover:bg-[#ECDFC7]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Name */}
            <div className="mb-3">
              <label className="text-xs text-[#84848A] mb-1 block">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Canned Sardines"
                value={newItem.item_name}
                onChange={(e) => setNewItem((p) => ({ ...p, item_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#F9B672] transition-colors"
              />
            </div>

            {/* Stock & Min Level row */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-xs text-[#84848A] mb-1 block">Current Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.current_stock}
                  onChange={(e) => setNewItem((p) => ({ ...p, current_stock: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#F9B672] transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#84848A] mb-1 block">Min Level</label>
                <input
                  type="number"
                  placeholder="10"
                  value={newItem.min_level}
                  onChange={(e) => setNewItem((p) => ({ ...p, min_level: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#F9B672] transition-colors"
                />
              </div>
            </div>

            {/* Unit */}
            <div className="mb-4">
              <label className="text-xs text-[#84848A] mb-1 block">Unit</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#F9B672] transition-colors cursor-pointer"
              >
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="bottles">bottles</option>
                <option value="packs">packs</option>
                <option value="cans">cans</option>
                <option value="boxes">boxes</option>
                <option value="cartons">cartons</option>
                <option value="tubs">tubs</option>
                <option value="bars">bars</option>
                <option value="rolls">rolls</option>
                <option value="liters">liters</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddItem}
              disabled={!newItem.item_name.trim() || addLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#2C2F45] hover:bg-[#050725] text-white py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-50"
            >
              {addLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={16} />
                  Add Item
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RestockPanel