import { memo } from "react";
import {
  Activity,
  CheckCircle2,
  Database,
  Globe,
  Radio,
  Server,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useActivity } from "../../features/activity/activity.hooks";

const services = [
  { name: "API Gateway", icon: Globe },
  { name: "Analytics Engine", icon: Activity },
  { name: "Database", icon: Database },
  { name: "WebSocket", icon: Radio },
  { name: "Server", icon: Server },
];

function LiveActivity() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const { data, isLoading, error } = useActivity({
    limit: 8,
  });

  const activities = data?.items ?? [];

  return (
    <section
      aria-labelledby="live-activity-title"
      className={
        isDark
          ? "rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-black/10 backdrop-blur-xl"
          : "rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
      }
    >
      {/* Header */}
      <div
        className={
          isDark
            ? "flex items-center justify-between border-b border-slate-800 px-6 py-5"
            : "flex items-center justify-between border-b border-slate-200 px-6 py-5"
        }
      >
        <div>
          <h4
            id="live-activity-title"
            className={
              isDark
                ? "font-semibold text-slate-100"
                : "font-semibold text-slate-900"
            }
          >
            Live Activity
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Real-time system events
          </p>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-xs text-emerald-500"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"
          />

          <span>Live</span>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="flex h-48 items-center justify-center px-6 text-sm text-slate-500"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-400"
            />

            <span>Loading activity...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex h-48 items-center justify-center px-6 text-center text-sm text-red-400"
        >
          Failed to load activity data.
        </div>
      )}

      {/* Empty State */}
      {!isLoading &&
        !error &&
        activities.length === 0 && (
          <div
            role="status"
            className="flex h-48 items-center justify-center px-6 text-center text-sm text-slate-500"
          >
            No activity available.
          </div>
        )}

      {/* Activities */}
      {!isLoading &&
        !error &&
        activities.length > 0 && (
          <div
            role="list"
            aria-label="Recent system activity"
            className={
              isDark
                ? "divide-y divide-slate-800/70"
                : "divide-y divide-slate-100"
            }
          >
            {activities.map((activity) => {
              const service = services.find(
                (item) => item.name === activity.service
              );

              const Icon = service?.icon ?? Activity;

              const statusClass =
                activity.status === "Success"
                  ? "text-emerald-500"
                  : activity.status === "Failed"
                    ? "text-red-500"
                    : "text-amber-500";

              const iconClass =
                activity.status === "Success"
                  ? "text-emerald-400"
                  : activity.status === "Failed"
                    ? "text-red-400"
                    : "text-amber-400";

              return (
                <div
                  key={activity.id}
                  role="listitem"
                  aria-label={`${activity.service}: ${activity.action}. Status: ${activity.status}. ${activity.timestamp}`}
                  className={
                    isDark
                      ? "grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-slate-800/30"
                      : "grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-slate-50"
                  }
                >
                  {/* Service Icon */}
                  <div
                    aria-hidden="true"
                    className={
                      isDark
                        ? "flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400"
                        : "flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500"
                    }
                  >
                    <Icon size={17} />
                  </div>

                  {/* Activity Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={
                          isDark
                            ? "truncate text-sm font-medium text-slate-200"
                            : "truncate text-sm font-medium text-slate-800"
                        }
                      >
                        {activity.service}
                      </p>

                      <span
                        aria-hidden="true"
                        className="hidden text-xs text-slate-400 sm:inline"
                      >
                        •
                      </span>

                      <p className="hidden truncate text-xs text-slate-500 sm:block">
                        {activity.action}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {activity.timestamp}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      aria-hidden="true"
                      className={iconClass}
                    />

                    <span
                      className={`text-xs ${statusClass}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </section>
  );
}

export default memo(LiveActivity);