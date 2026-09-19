import { memo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
};

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    lightIconClass: "text-emerald-500",
    title: "Success",
  },

  error: {
    icon: AlertCircle,
    iconClass: "text-red-400",
    lightIconClass: "text-red-500",
    title: "Error",
  },

  info: {
    icon: Info,
    iconClass: "text-sky-400",
    lightIconClass: "text-sky-500",
    title: "Information",
  },
};

function Toast({
  message,
  type = "info",
  onClose,
}: ToastProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const config = toastConfig[type];

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-right-4 fade-in duration-300 ${
        isDark
          ? "rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          : "rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-300/30 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={`mt-0.5 shrink-0 ${
            isDark
              ? "rounded-xl bg-slate-900 p-2"
              : "rounded-xl bg-slate-50 p-2"
          }`}
        >
          <Icon
            size={18}
            className={
              isDark
                ? config.iconClass
                : config.lightIconClass
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={
              isDark
                ? "text-sm font-semibold text-slate-100"
                : "text-sm font-semibold text-slate-900"
            }
          >
            {config.title}
          </p>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className={
            isDark
              ? "rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
              : "rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          }
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(Toast);
