import { useState, useRef, useEffect } from "react";
import { Search, Bot } from "lucide-react";

import ChatMessage from "../components/assistant/ChatMessage";
import TypingIndicator from "../components/assistant/TypingIndicator";
import ChatInput from "../components/assistant/ChatInput";
import RecommendationSidebar from "../components/assistant/RecommendationSidebar";

import { sendMessage } from "../services/geminiService";

const INITIAL_MESSAGE = {
  id: 1,
  role: "assistant",
  content:
    "Hello! I am your Financial Assistant 👋\n\n" +
    "I can help you analyze expenses, suggest restocks, track budgets, and give predictions.\n\n" +
    "How can I assist you today?",
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

function Assistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Build conversation history (exclude initial greeting)
    const history = messages
      .filter((m) => m.id !== 1)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // Send with history so Gemini has conversation context
    const responseText = await sendMessage(text, history);

    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const filteredMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
        {/* CHAT AREA */}
        <div className="col-span-2 bg-surface rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Financial Assistant
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[11px] text-neutral">
                    Online • Powered by Gemini AI
                  </span>
                </div>
              </div>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2 border border-neutral/20 w-48">
              <Search size={13} className="text-neutral shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chat..."
                className="flex-1 text-xs bg-transparent focus:outline-none text-primary placeholder:text-neutral"
              />
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {filteredMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>

          {/* CHAT INPUT */}
          <div className="px-6 py-4 border-t border-neutral/20">
            <ChatInput
              onSend={handleSend}
              isLoading={isLoading}
              showSuggestions={messages.length <= 1}
            />
          </div>
        </div>

        {/* RECOMMENDATION SIDEBAR */}
        <div className="overflow-y-auto">
          <RecommendationSidebar />
        </div>
      </div>
    </div>
  );
}

export default Assistant;