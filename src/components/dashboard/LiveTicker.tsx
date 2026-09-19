import { memo } from "react";
import { Activity, ArrowUpRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const tickerItems = [
  "API Gateway processed 8,421 requests/min",
  "Active users increased by 12.8%",
  "Database latency dropped to 42ms",
  "WebSocket connection stable",
  "Analytics engine processed 18.4K events",
];

function LiveTicker() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={
        isDark
          ? "group overflow-hidden border-b border-slate-800 bg-slate-950/80"
          : "group overflow-hidden border-b border-slate-200 bg-white/80"
      }
    >
      <div className="flex h-10 items-center gap-4">
        <div
          className={
            isDark
              ? "flex shrink-0 items-center gap-2 border-r border-slate-800 px-4 text-sky-400"
              : "flex shrink-0 items-center gap-2 border-r border-slate-200 px-4 text-sky-600"
          }
        >
          <Activity size={15} aria-hidden="true" />

          <span className="text-xs font-semibold uppercase tracking-wider">
            Live
          </span>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-max items-center gap-10 animate-[ticker_35s_linear_infinite]">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <ArrowUpRight
                  size={13}
                  className={
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }
                  aria-hidden="true"
                />

                <span
                  className={
                    isDark
                      ? "text-xs text-slate-400"
                      : "text-xs text-slate-500"
                  }
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

export default memo(LiveTicker);
