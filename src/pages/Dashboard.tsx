import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Activity,
  BarChart3,
  Calendar,
  ChevronDown,
  Clock3,
  Database,
  RefreshCw,
  Server,
  TrendingUp,
  Users,
  Wifi,
  X,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import LiveActivity from "../components/dashboard/LiveActivity";
import LiveTicker from "../components/dashboard/LiveTicker";
import TrafficChart from "../components/dashboard/TrafficChart";
import StatCard from "../components/dashboard/StatCard";
import StatusItem from "../components/dashboard/StatusItem";
import Skeleton from "../components/ui/Skeleton";
import Toast from "../components/ui/Toast";

import { useTheme } from "../context/ThemeContext";
import { useAnalytics } from "../features/analytics/analytics.hooks";
import { useAnalyticsWebSocket } from "../features/analytics/analytics.websocket";
import type { AnalyticsPeriod } from "../features/analytics/analytics.types";

const serviceOptions = [
  { label: "All Services", value: "all" },
  { label: "API Gateway", value: "API Gateway" },
  { label: "Auth Service", value: "Auth Service" },
  { label: "Analytics Engine", value: "Analytics Engine" },
  { label: "Notification Service", value: "Notification Service" },
];

const periodOptions: {
  label: string;
  value: AnalyticsPeriod;
}[] = [
  { label: "Today", value: "today" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "Custom", value: "custom" },
];

function formatNumber(value: number | undefined) {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number | undefined) {
  if (value === undefined || value === null) return "—";

  return `${value.toFixed(2)}%`;
}

function formatMs(value: number | undefined) {
  if (value === undefined || value === null) return "—";

  return `${Math.round(value)} ms`;
}

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [period, setPeriod] =
    useState<AnalyticsPeriod>("today");

  const [service, setService] = useState("all");

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [showServiceMenu, setShowServiceMenu] =
    useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters = useMemo(
    () => ({
      period,
      service:
        service === "all" ? undefined : service,
      startDate:
        period === "custom"
          ? customStart || undefined
          : undefined,
      endDate:
        period === "custom"
          ? customEnd || undefined
          : undefined,
    }),
    [period, service, customStart, customEnd]
  );

  const {
    data: analytics,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAnalytics(filters);

  const websocket = useAnalyticsWebSocket(period);

  const stats = analytics?.stats;

  const selectedService =
    serviceOptions.find(
      (item) => item.value === service
    )?.label ?? "All Services";

  const pageBackground = isDark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  const mainBackground = isDark
    ? "bg-slate-950"
    : "bg-slate-50";

  const panelClass = isDark
    ? "rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-black/10 backdrop-blur-xl"
    : "rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40";

  const isBackgroundFetching =
    isFetching && !isLoading;

  const hasAnalyticsData =
    analytics !== undefined &&
    (!!analytics.stats ||
      (analytics.traffic?.length ?? 0) > 0 ||
      (analytics.services?.length ?? 0) > 0 ||
      (analytics.endpoints?.length ?? 0) > 0);

  const isEmptyState =
    !isLoading &&
    !error &&
    !hasAnalyticsData;

  // -----------------------------
  // Toast queue
  // -----------------------------
  const [toasts, setToasts] =
    useState<ToastItem[]>([]);

  const toastIdRef = useRef(0);

  const lastErrorMessageRef =
    useRef<string | null>(null);

  const lastWsErrorMessageRef =
    useRef<string | null>(null);

  const lastReconnectedAtRef =
    useRef<number | null>(null);

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = "info"
    ) => {
      toastIdRef.current += 1;

      const id = toastIdRef.current;

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        setToasts((current) =>
          current.filter(
            (toast) => toast.id !== id
          )
        );
      }, 5000);
    },
    []
  );

  const dismissToast = useCallback(
    (id: number) => {
      setToasts((current) =>
        current.filter(
          (toast) => toast.id !== id
        )
      );
    },
    []
  );

  useEffect(() => {
    if (!error) {
      lastErrorMessageRef.current = null;
      return;
    }

    if (
      error === lastErrorMessageRef.current
    ) {
      return;
    }

    lastErrorMessageRef.current = error;

    addToast(error, "error");
  }, [error, addToast]);

  useEffect(() => {
    const message =
      websocket.lastError?.message;

    if (!message) {
      lastWsErrorMessageRef.current = null;
      return;
    }

    if (
      message ===
      lastWsErrorMessageRef.current
    ) {
      return;
    }

    lastWsErrorMessageRef.current = message;

    addToast(message, "error");
  }, [websocket.lastError, addToast]);

  useEffect(() => {
    if (!websocket.reconnectedAt) {
      return;
    }

    if (
      websocket.reconnectedAt ===
      lastReconnectedAtRef.current
    ) {
      return;
    }

    lastReconnectedAtRef.current =
      websocket.reconnectedAt;

    addToast(
      "Connection restored.",
      "success"
    );
  }, [
    websocket.reconnectedAt,
    addToast,
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await refetch();

      addToast(
        "Data refreshed successfully.",
        "success"
      );
    } catch {
      // the error effect above will already surface this as a toast
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handlePeriodChange = (
    nextPeriod: AnalyticsPeriod
  ) => {
    setPeriod(nextPeriod);
  };

  const handleClearCustomRange = () => {
    setCustomStart("");
    setCustomEnd("");
    setPeriod("today");
  };

  return (
    <div className={pageBackground}>
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className={mainBackground}>
          <LiveTicker />

          <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      websocket.isConnected
                        ? "animate-pulse bg-emerald-400"
                        : websocket.isConnecting
                        ? "animate-pulse bg-amber-400"
                        : "bg-red-400"
                    }`}
                  />

                  <span
                    className={
                      websocket.isConnected
                        ? "text-xs font-medium text-emerald-500"
                        : websocket.isConnecting
                        ? "text-xs font-medium text-amber-500"
                        : "text-xs font-medium text-red-500"
                    }
                  >
                    {websocket.isConnected
                      ? "Live connection"
                      : websocket.isConnecting
                      ? "Connecting..."
                      : "Disconnected"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <h1
                    className={
                      isDark
                        ? "text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl"
                        : "text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
                    }
                  >
                    Analytics Dashboard
                  </h1>

                  {isBackgroundFetching && (
                    <span
                      className={
                        isDark
                          ? "inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-400"
                          : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm"
                      }
                    >
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Updating
                    </span>
                  )}
                </div>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Monitor real-time traffic, system performance, and service
                  health from one place.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowServiceMenu(
                        (current) => !current
                      )
                    }
                    className={
                      isDark
                        ? "flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-300 transition hover:border-slate-700 sm:w-56"
                        : "flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300 sm:w-56"
                    }
                  >
                    <span>
                      {selectedService}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showServiceMenu
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showServiceMenu && (
                    <div
                      className={
                        isDark
                          ? "absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl sm:w-56"
                          : "absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-56"
                      }
                    >
                      {serviceOptions.map(
                        (option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setService(
                                option.value
                              );
                              setShowServiceMenu(
                                false
                              );
                            }}
                            className={
                              isDark
                                ? "flex w-full items-center px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800"
                                : "flex w-full items-center px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                            }
                          >
                            {option.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={
                    isDark
                      ? "flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm text-slate-300 transition hover:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      : "flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  }
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRefreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  Refresh
                </button>
              </div>
            </div>

            <div
              className={`${panelClass} mb-6 p-3`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {periodOptions.map(
                  (option) => {
                    const active =
                      period === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handlePeriodChange(
                            option.value
                          )
                        }
                        className={
                          active
                            ? "rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm"
                            : isDark
                            ? "rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                            : "rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        }
                      >
                        {option.label}
                      </button>
                    );
                  }
                )}
              </div>

              {period === "custom" && (
                <div className="mt-3 flex flex-col gap-3 border-t border-slate-800/60 pt-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-slate-500">
                      Start date
                    </label>

                    <input
                      type="date"
                      value={customStart}
                      onChange={(event) =>
                        setCustomStart(
                          event.target.value
                        )
                      }
                      className={
                        isDark
                          ? "h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-300 outline-none focus:border-slate-600"
                          : "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                      }
                    />
                  </div>

                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-slate-500">
                      End date
                    </label>

                    <input
                      type="date"
                      value={customEnd}
                      onChange={(event) =>
                        setCustomEnd(
                          event.target.value
                        )
                      }
                      className={
                        isDark
                          ? "h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-300 outline-none focus:border-slate-600"
                          : "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleClearCustomRange
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 text-sm text-slate-500 transition hover:text-slate-300"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      isRefreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  Retry
                </button>
              </div>
            )}

            {isEmptyState ? (
              <div
                className={`${panelClass} flex min-h-[420px] items-center justify-center p-8`}
              >
                <div className="mx-auto max-w-md text-center">
                  <div
                    className={
                      isDark
                        ? "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-500"
                        : "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400"
                    }
                  >
                    <BarChart3 className="h-7 w-7" />
                  </div>

                  <h2 className="mt-6 text-xl font-semibold">
                    No analytics data available
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    There is no analytics data for the selected period or
                    service. Try another time range or refresh the dashboard.
                  </p>

                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        setPeriod("today")
                      }
                      className={
                        isDark
                          ? "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-900 transition hover:bg-white"
                          : "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                      }
                    >
                      View today
                    </button>

                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className={
                        isDark
                          ? "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-medium text-slate-300 transition hover:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                          : "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                      }
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isRefreshing
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      Refresh data
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Active Users"
                    value={formatNumber(
                      stats?.activeUsers
                    )}
                    change="Live"
                    live
                    loading={isLoading}
                  />

                  <StatCard
                    title="Requests / Min"
                    value={formatNumber(
                      stats?.requestsPerMinute
                    )}
                    change="+8.4%"
                    live
                    loading={isLoading}
                  />

                  <StatCard
                    title="Peak Traffic"
                    value={formatNumber(
                      stats?.peakTraffic
                    )}
                    change="+12.1%"
                    loading={isLoading}
                  />

                  <StatCard
                    title="Success Rate"
                    value={formatPercent(
                      stats?.successRate
                    )}
                    change="+0.6%"
                    loading={isLoading}
                  />

                  <StatCard
                    title="Average Response"
                    value={formatMs(
                      stats?.averageResponseTime
                    )}
                    change="-4.2%"
                    loading={isLoading}
                  />

                  <StatCard
                    title="Total Requests"
                    value={formatNumber(
                      stats?.totalRequests
                    )}
                    change="+15.8%"
                    loading={isLoading}
                  />

                  <StatCard
                    title="Error Rate"
                    value={formatPercent(
                      stats?.errorRate
                    )}
                    change={
                      stats?.errorRate
                        ? "-2.1%"
                        : "Stable"
                    }
                    loading={isLoading}
                  />

                  <StatCard
                    title="Connection"
                    value={
                      websocket.isConnected
                        ? "Online"
                        : "Offline"
                    }
                    change={
                      websocket.isConnected
                        ? "Live"
                        : "Waiting"
                    }
                    live={
                      websocket.isConnected
                    }
                  />
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-3">
                  <div
                    className={`${panelClass} xl:col-span-2`}
                  >
                    <div className="border-b border-slate-800/60 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-base font-semibold">
                            Traffic Overview
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            Requests, response time, and error rate
                          </p>
                        </div>

                        <BarChart3 className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>

                    <div className="p-4">
                      <TrafficChart
                        traffic={
                          analytics?.traffic ?? []
                        }
                        isLoading={isLoading}
                        error={error}
                      />
                    </div>
                  </div>

                  <div
                    className={`${panelClass} p-5`}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold">
                          System Status
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Current infrastructure health
                        </p>
                      </div>

                      <Wifi className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div className="space-y-2">
                      <StatusItem
                        name="API Gateway"
                        status="Operational"
                        statusColor="emerald"
                      />

                      <StatusItem
                        name="Auth Service"
                        status="Operational"
                        statusColor="emerald"
                      />

                      <StatusItem
                        name="Analytics Engine"
                        status="Operational"
                        statusColor="emerald"
                      />

                      <StatusItem
                        name="Notification Service"
                        status="Operational"
                        statusColor="emerald"
                      />

                      <StatusItem
                        name="WebSocket"
                        status={
                          websocket.isConnected
                            ? "Connected"
                            : "Offline"
                        }
                        statusColor={
                          websocket.isConnected
                            ? "emerald"
                            : websocket.isConnecting
                            ? "amber"
                            : "red"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div
                    className={`${panelClass} overflow-hidden`}
                  >
                    <div className="border-b border-slate-800/60 p-5">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-slate-500" />

                        <div>
                          <h2 className="text-base font-semibold">
                            Service Performance
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            Performance by service
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left text-sm">
                        <thead
                          className={
                            isDark
                              ? "bg-slate-950/40 text-slate-500"
                              : "bg-slate-50 text-slate-500"
                          }
                        >
                          <tr>
                            <th className="px-5 py-3 font-medium">
                              Service
                            </th>

                            <th className="px-5 py-3 font-medium">
                              Requests
                            </th>

                            <th className="px-5 py-3 font-medium">
                              Success
                            </th>

                            <th className="px-5 py-3 font-medium">
                              Response
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/50">
                          {isLoading &&
                            Array.from({
                              length: 4,
                            }).map(
                              (_, index) => (
                                <tr
                                  key={`service-skeleton-${index}`}
                                >
                                  <td className="px-5 py-3">
                                    <Skeleton className="h-4 w-28" />
                                  </td>

                                  <td className="px-5 py-3">
                                    <Skeleton className="h-4 w-16" />
                                  </td>

                                  <td className="px-5 py-3">
                                    <Skeleton className="h-4 w-14" />
                                  </td>

                                  <td className="px-5 py-3">
                                    <Skeleton className="h-4 w-14" />
                                  </td>
                                </tr>
                              )
                            )}

                          {!isLoading &&
                            (
                              analytics?.services ??
                              []
                            ).map((item) => (
                              <tr
                                key={
                                  item.service
                                }
                                className="transition hover:bg-slate-500/5"
                              >
                                <td className="px-5 py-3 font-medium">
                                  {item.service}
                                </td>

                                <td className="px-5 py-3 text-slate-500">
                                  {formatNumber(
                                    item.requests
                                  )}
                                </td>

                                <td className="px-5 py-3 text-emerald-500">
                                  {formatPercent(
                                    item.successRate
                                  )}
                                </td>

                                <td className="px-5 py-3 text-slate-500">
                                  {formatMs(
                                    item.averageResponseTime
                                  )}
                                </td>
                              </tr>
                            ))}

                          {!isLoading &&
                            (
                              analytics?.services
                                ?.length ?? 0
                            ) === 0 && (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-5 py-8 text-center text-sm text-slate-500"
                                >
                                  No service data available for this period.
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    className={`${panelClass} overflow-hidden`}
                  >
                    <div className="border-b border-slate-800/60 p-5">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-slate-500" />

                        <div>
                          <h2 className="text-base font-semibold">
                            Endpoint Performance
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            Most active API endpoints
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-800/50">
                      {isLoading &&
                        Array.from({
                          length: 4,
                        }).map(
                          (_, index) => (
                            <div
                              key={`endpoint-skeleton-${index}`}
                              className="flex items-center justify-between gap-4 px-5 py-3"
                            >
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                          )
                        )}

                      {!isLoading &&
                        (
                          analytics?.endpoints ??
                          []
                        ).map(
                          (item, index) => (
                            <div
                              key={`${item.endpoint}-${index}`}
                              className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-500/5"
                            >
                              <span className="truncate text-sm text-slate-400">
                                {item.endpoint}
                              </span>

                              <span className="shrink-0 text-sm font-medium">
                                {formatNumber(
                                  item.requests
                                )}
                              </span>
                            </div>
                          )
                        )}

                      {!isLoading &&
                        (
                          analytics?.endpoints
                            ?.length ?? 0
                        ) === 0 && (
                          <div className="px-5 py-8 text-center text-sm text-slate-500">
                            No endpoint data available for this period.
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-3">
                  <div
                    className={`${panelClass} xl:col-span-2`}
                  >
                    <div className="border-b border-slate-800/60 p-5">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-slate-500" />

                        <div>
                          <h2 className="text-base font-semibold">
                            Live Activity
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            Latest system activity
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <LiveActivity />
                    </div>
                  </div>

                  <div
                    className={`${panelClass} p-5`}
                  >
                    <h2 className="text-base font-semibold">
                      Quick Indicators
                    </h2>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          <Users className="h-4 w-4" />
                          Active users
                        </span>

                        <span className="font-medium">
                          {formatNumber(
                            stats?.activeUsers
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          <TrendingUp className="h-4 w-4" />
                          Requests / min
                        </span>

                        <span className="font-medium">
                          {formatNumber(
                            stats?.requestsPerMinute
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock3 className="h-4 w-4" />
                          Response time
                        </span>

                        <span className="font-medium">
                          {formatMs(
                            stats?.averageResponseTime
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          <Database className="h-4 w-4" />
                          Selected service
                        </span>

                        <span className="max-w-[150px] truncate font-medium">
                          {selectedService}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          Period
                        </span>

                        <span className="font-medium">
                          {period === "custom"
                            ? "Custom"
                            : period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[100]">
        <div className="flex flex-col items-end gap-3 p-6">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto relative"
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() =>
                  dismissToast(toast.id)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
