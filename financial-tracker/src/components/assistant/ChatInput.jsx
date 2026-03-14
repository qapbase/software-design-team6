import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

const SUGGESTION_GROUPS = [
  {
    label: "Budget",
    suggestions: [
      "How is my budget this month?",
      "Am I overspending? Give me a breakdown.",
      "Help me create a monthly budget plan.",
    ],
  },
  {
    label: "Inventory",
    suggestions: [
      "What items should I restock?",
      "Show me my low stock alerts.",
      "Which products are selling the fastest?",
    ],
  },
  {
    label: "Savings",
    suggestions: [
      "How can I reduce my expenses?",
      "Tips to save money this month.",
      "What's my income vs expenses ratio?",
    ],
  },
  {
    label: "Analytics",
    suggestions: [
      "Analyze my recent transactions.",
      "What are my biggest expense categories?",
      "Predict my expenses for next month.",
    ],
  },
];

function ChatInput({ onSend, isLoading, showSuggestions }) {
  const [input, setInput] = useState("");
  const [activeGroup, setActiveGroup] = useState(0);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    onSend(text);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Suggestion Chips */}
      {showSuggestions && (
        <div className="space-y-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-accent shrink-0" />
            {SUGGESTION_GROUPS.map((group, idx) => (
              <button
                key={group.label}
                onClick={() => setActiveGroup(idx)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
                  activeGroup === idx
                    ? "bg-accent/25 text-primary border border-accent/40"
                    : "text-neutral hover:text-primary hover:bg-accent/10"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Suggestion Pills */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_GROUPS[activeGroup].suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="
                  text-xs
                  bg-accent/15
                  hover:bg-accent/25
                  text-primary
                  font-medium
                  px-3 py-1.5
                  rounded-full
                  border border-accent/25
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:shadow-sm
                "
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Row */}
      <div
        className="
          flex items-end gap-2
          bg-surface
          rounded-2xl
          p-3
          border border-neutral/20
          focus-within:border-accent
          focus-within:bg-white
          transition-all duration-200
        "
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What would you like to know?"
          rows={1}
          className="
            flex-1
            resize-none
            text-sm
            text-primary
            focus:outline-none
            placeholder:text-neutral
            bg-transparent
            leading-relaxed
            max-h-28
          "
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`
            p-2
            rounded-xl
            transition-all duration-200
            shrink-0
            ${
              input.trim() && !isLoading
                ? "bg-secondary hover:bg-primary text-white hover:-translate-y-0.5"
                : "bg-neutral/30 text-neutral cursor-not-allowed"
            }
          `}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;