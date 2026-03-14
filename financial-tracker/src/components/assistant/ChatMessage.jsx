import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

/* ─── Lightweight Markdown Parser ─── */
function parseMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line → spacer
    if (line.trim() === "") {
      elements.push({ type: "spacer", key: i });
      i++;
      continue;
    }

    // Heading: ### or ## or #
    if (line.startsWith("### ")) {
      elements.push({ type: "h3", text: line.slice(4), key: i });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push({ type: "h2", text: line.slice(3), key: i });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push({ type: "h1", text: line.slice(2), key: i });
      i++;
      continue;
    }

    // Bullet list: - or * or •
    if (/^[\-\*•]\s/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^[\-\*•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[\-\*•]\s+/, ""));
        i++;
      }
      elements.push({ type: "ul", items, key: `ul-${i}` });
      continue;
    }

    // Numbered list: 1. 2. 3.
    if (/^\d+[\.\)]\s/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s+/, ""));
        i++;
      }
      elements.push({ type: "ol", items, key: `ol-${i}` });
      continue;
    }

    // Regular paragraph
    elements.push({ type: "p", text: line, key: i });
    i++;
  }

  return elements;
}

/* ─── Inline formatting: **bold**, *italic*, `code`, ₱ highlight ─── */
function renderInline(text) {
  if (!text) return null;

  const parts = [];
  // Split by **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|(₱[\d,]+\.?\d*))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *italic*
      parts.push(
        <em key={`i-${match.index}`} className="italic">
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      // `code`
      parts.push(
        <code
          key={`c-${match.index}`}
          className="bg-[#ECDFC7] text-[#050725] px-1.5 py-0.5 rounded text-xs font-mono"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      // ₱ amount highlight
      parts.push(
        <span
          key={`p-${match.index}`}
          className="font-semibold text-[#2E6F4E]"
        >
          {match[5]}
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

/* ─── Main Component ─── */
function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parsed = !isUser ? parseMarkdown(message.content) : null;

  return (
    <div
      className={`flex items-end gap-2.5 animate-slide-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser ? "bg-primary" : "bg-secondary"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`group relative max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-secondary text-white rounded-2xl rounded-br-sm"
            : "bg-surface text-primary rounded-2xl rounded-bl-sm"
        }`}
      >
        {/* Copy button for assistant messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#ECDFC7]"
            title="Copy message"
          >
            {copied ? (
              <Check size={12} className="text-[#2E6F4E]" />
            ) : (
              <Copy size={12} className="text-[#84848A]" />
            )}
          </button>
        )}

        {/* Render content */}
        {isUser ? (
          // User messages: plain text
          message.content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))
        ) : (
          // Assistant messages: parsed markdown
          <div className="space-y-1.5">
            {parsed.map((el) => {
              switch (el.type) {
                case "spacer":
                  return <div key={el.key} className="h-1" />;

                case "h1":
                  return (
                    <h3
                      key={el.key}
                      className="text-base font-bold text-[#050725] mt-2 mb-1"
                    >
                      {renderInline(el.text)}
                    </h3>
                  );

                case "h2":
                  return (
                    <h4
                      key={el.key}
                      className="text-sm font-bold text-[#050725] mt-2 mb-1"
                    >
                      {renderInline(el.text)}
                    </h4>
                  );

                case "h3":
                  return (
                    <h5
                      key={el.key}
                      className="text-sm font-semibold text-[#050725] mt-1.5 mb-0.5"
                    >
                      {renderInline(el.text)}
                    </h5>
                  );

                case "ul":
                  return (
                    <ul key={el.key} className="space-y-1 ml-1">
                      {el.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F9B672] mt-1.5 shrink-0" />
                          <span>{renderInline(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );

                case "ol":
                  return (
                    <ol key={el.key} className="space-y-1 ml-1">
                      {el.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-xs font-bold text-[#F9B672] mt-0.5 shrink-0 w-4">
                            {j + 1}.
                          </span>
                          <span>{renderInline(item)}</span>
                        </li>
                      ))}
                    </ol>
                  );

                case "p":
                default:
                  return (
                    <p key={el.key} className="leading-relaxed">
                      {renderInline(el.text)}
                    </p>
                  );
              }
            })}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-[10px] mt-1.5 font-medium ${
            isUser ? "text-neutral text-right" : "text-neutral"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;