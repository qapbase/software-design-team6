import { Bot } from "lucide-react"

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">

      {/* Bot Avatar */}
      <div
        className="
        w-8 h-8
        rounded-xl
        bg-secondary
        flex items-center
        justify-center
        shrink-0
        shadow-sm
        "
      >
        <Bot size={16} className="text-white" />
      </div>


      {/* Animated Dots Bubble */}
      <div
        className="
        bg-surface
        px-4 py-3
        rounded-2xl
        rounded-tl-sm
        shadow-sm
        "
      >
        <div className="flex items-center gap-1.5">

          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-neutral rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}

        </div>
      </div>

    </div>
  )
}

export default TypingIndicator