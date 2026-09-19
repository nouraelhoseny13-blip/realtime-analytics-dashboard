import { memo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  time: string;
};

const notifications: Notification[] = [
  {
    id: 1,
    title: "Traffic spike detected",
    message:
      "Requests increased by 18% in the last 5 minutes.",
    type: "warning",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Deployment completed",
    message:
      "Analytics service deployed successfully.",
    type: "success",
    time: "8 min ago",
  },
  {
    id: 3,
    title: "System update",
    message:
      "Real-time monitoring is running normally.",
    type: "info",
    time: "15 min ago",
  },
];

const iconMap = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

function NotificationPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-title"
      className={
        isDark
          ? "absolute right-6 top-16 z-50 w-[calc(100%-2rem)] max-w-96 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl"
          : "absolute right-6 top-16 z-50 w-[calc(100%-2rem)] max-w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 backdrop-blur-xl"
      }
    >
      <div
        className={
          isDark
            ? "flex items-center justify-between border-b border-slate-800 px-5 py-4"
            : "flex items-center justify-between border-b border-slate-200 px-5 py-4"
        }
      >
        <div>
          <h3
            id="notifications-title"
            className={
              isDark
                ? "font-semibold text-slate-100"
                : "font-semibold text-slate-900"
            }
          >
            Notifications
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Recent system activity
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className={
            isDark
              ? "rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95"
              : "rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95"
          }
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div
        role="list"
        aria-label="Recent notifications"
        className="max-h-96 overflow-y-auto"
      >
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];

          return (
            <div
              key={notification.id}
              role="listitem"
              className={
                isDark
                  ? "flex gap-3 border-b border-slate-800/70 px-5 py-4 transition-colors duration-200 hover:bg-slate-900/70"
                  : "flex gap-3 border-b border-slate-100 px-5 py-4 transition-colors duration-200 hover:bg-slate-50"
              }
            >
              <div
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              >
                <Icon
                  size={18}
                  className={
                    notification.type === "success"
                      ? "text-emerald-400"
                      : notification.type === "warning"
                        ? "text-amber-400"
                        : "text-sky-400"
                  }
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h4
                    className={
                      isDark
                        ? "text-sm font-medium text-slate-200"
                        : "text-sm font-medium text-slate-800"
                    }
                  >
                    {notification.title}
                  </h4>

                  <time className="shrink-0 text-[11px] text-slate-500">
                    {notification.time}
                  </time>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {notification.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={
          isDark
            ? "border-t border-slate-800 px-5 py-3"
            : "border-t border-slate-200 px-5 py-3"
        }
      >
        <button
          type="button"
          className={
            isDark
              ? "rounded-md text-xs font-medium text-sky-400 transition-all duration-200 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
              : "rounded-md text-xs font-medium text-sky-600 transition-all duration-200 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98]"
          }
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}

export default memo(NotificationPanel);
