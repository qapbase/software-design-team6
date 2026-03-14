import { X } from "lucide-react";
import { useState } from "react";

const categories = [
  "Bank Transfer",
  "Paypal",
  "Debit Card",
  "Cash",
  "Sales Income",
  "Other",
];

function AddTransactionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    to: "",
    amount: "",
    type: "Bank Transfer",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.to || !form.amount) return;

    await onSubmit({
      to_name: form.to,
      amount: -Math.abs(parseFloat(form.amount)),
      type: form.type,
      date: form.date,
      note: form.note,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-6 w-full max-w-md shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Add Transaction
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* RECIPIENT */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Recipient / Description
            </label>

            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              placeholder="e.g. Supplier Payment"
              className="w-full bg-[#121212] border border-[#333]
              text-white rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:border-[#007a33]"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Amount (₱)
            </label>

            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full bg-[#121212] border border-[#333]
              text-white rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:border-[#007a33]"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Category
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-[#121212] border border-[#333]
              text-white rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:border-[#007a33]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Date
            </label>

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-[#121212] border border-[#333]
              text-white rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:border-[#007a33]"
            />
          </div>

          {/* NOTE */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Note (optional)
            </label>

            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Add a note..."
              rows={2}
              className="w-full bg-[#121212] border border-[#333]
              text-white rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:border-[#007a33] resize-none"
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 border border-[#333] text-gray-300 py-2.5
            rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#003366] hover:bg-[#0d47a1]
            text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Add Transaction
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddTransactionModal;