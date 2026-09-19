import { memo } from "react";

import { useTheme } from "../../context/ThemeContext";
import Skeleton from "../ui/Skeleton";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  live?: boolean;
  loading?: boolean;
};

function StatCard({
  title,
  value,
  change,
  live = false,
  loading = false,
}: StatCardProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={
        isDark
          ? "group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-black/20"
          : "group rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/70"
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 transition-colors duration-200">
          {title}
        </p>

        {live && (
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-500 transition-transform duration-300 group-hover:scale-105">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            Live
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p
            className={
              isDark
                ? "text-2xl font-semibold tracking-tight text-slate-100 transition-transform duration-300 group-hover:translate-x-0.5"
                : "text-2xl font-semibold tracking-tight text-slate-900 transition-transform duration-300 group-hover:translate-x-0.5"
            }
          >
            {value}
          </p>
        )}

        {loading ? (
          <Skeleton className="h-5 w-14" />
        ) : (
          <span
            className={
              change.startsWith("-")
                ? "text-xs font-medium text-rose-500 transition-transform duration-300 group-hover:scale-105"
                : "text-xs font-medium text-emerald-500 transition-transform duration-300 group-hover:scale-105"
            }
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(StatCard);