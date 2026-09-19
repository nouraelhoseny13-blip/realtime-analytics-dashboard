import { memo } from "react";

import { useTheme } from "../../context/ThemeContext";

type StatusItemProps = {
  name: string;
  status?: string;
  statusColor?: "emerald" | "amber" | "red";
};

function StatusItem({
  name,
  status = "Operational",
  statusColor = "emerald",
}: StatusItemProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const colorClasses = {
    emerald: {
      text: isDark
        ? "text-emerald-400"
        : "text-emerald-600",
      dot: "bg-emerald-400",
    },
    amber: {
      text: isDark
        ? "text-amber-400"
        : "text-amber-600",
      dot: "bg-amber-400",
    },
    red: {
      text: isDark
        ? "text-red-400"
        : "text-red-600",
      dot: "bg-red-400",
    },
  };

  const colors = colorClasses[statusColor];

  return (
    <div className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-slate-500/5">
      <span
        className={
          isDark
            ? "text-sm text-slate-300 transition-colors duration-200 group-hover:text-slate-100"
            : "text-sm text-slate-600 transition-colors duration-200 group-hover:text-slate-900"
        }
      >
        {name}
      </span>

      <div
        className={`flex items-center gap-2 text-xs font-medium transition-transform duration-200 group-hover:translate-x-0.5 ${colors.text}`}
      >
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${colors.dot} ${
            statusColor === "emerald"
              ? "animate-pulse"
              : ""
          }`}
        />

        {status}
      </div>
    </div>
  );
}

export default memo(StatusItem);