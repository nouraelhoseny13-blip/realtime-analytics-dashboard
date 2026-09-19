import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <header
      className={
        isDark
          ? "flex min-h-20 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/50 px-4 backdrop-blur-xl sm:px-6"
          : "flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6"
      }
    >
      <div className="min-w-0">
        <p className="text-xs text-slate-500 sm:text-sm">
          Overview
        </p>

        <h2
          className={
            isDark
              ? "truncate text-lg font-semibold text-slate-100 sm:text-xl"
              : "truncate text-lg font-semibold text-slate-900 sm:text-xl"
          }
        >
          Real-time Analytics
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-pressed={isDark}
          title={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className={
            isDark
              ? "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 sm:h-10 sm:w-10"
              : "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 sm:h-10 sm:w-10"
          }
        >
          {isDark ? (
            <Sun
              size={17}
              aria-hidden="true"
            />
          ) : (
            <Moon
              size={17}
              aria-hidden="true"
            />
          )}
        </button>

        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500 sm:px-4 sm:text-sm"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"
          />

          <span className="hidden sm:inline">
            System Online
          </span>

          <span className="sm:hidden">
            Online
          </span>
        </div>
      </div>
    </header>
  );
}