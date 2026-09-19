import { memo, useMemo } from "react";
import { Activity } from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTheme } from "../../context/ThemeContext";
import Skeleton from "../ui/Skeleton";
import type { TrafficPoint } from "../../features/analytics/analytics.types";

type TrafficChartProps = {
  traffic: TrafficPoint[];
  isLoading: boolean;
  error: string | null;
};

function TrafficChart({
  traffic,
  isLoading,
  error,
}: TrafficChartProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const trafficData = useMemo(() => {
    return traffic.map((point) => ({
      time: point.timestamp,
      requests: point.requests,
      errorRate: point.errorRate,
      responseTime: point.responseTime,
    }));
  }, [traffic]);

  const chartTheme = useMemo(
    () => ({
      gridColor: isDark ? "#1E293B" : "#E2E8F0",
      textColor: isDark ? "#64748B" : "#94A3B8",
      tooltipBackground: isDark ? "#0F172A" : "#FFFFFF",
      tooltipBorder: isDark ? "#334155" : "#E2E8F0",
      tooltipText: isDark ? "#E2E8F0" : "#1E293B",
    }),
    [isDark]
  );

  if (isLoading) {
    return (
      <div className="h-64 w-full animate-pulse">
        <div className="flex h-full flex-col justify-between">
          <div className="flex h-full items-end gap-3 px-4 pb-6 pt-4">
            <div className="flex h-full flex-1 flex-col justify-between">
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-px w-full" />
            </div>
          </div>

          <div className="flex justify-between px-4">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex h-64 w-full items-center justify-center"
      >
        <div
          className={
            isDark
              ? "flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-7 text-center"
              : "flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-8 py-7 text-center"
          }
        >
          <div
            className={
              isDark
                ? "mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400"
                : "mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500"
            }
          >
            <Activity size={20} />
          </div>

          <p
            className={
              isDark
                ? "text-sm font-medium text-red-300"
                : "text-sm font-medium text-red-600"
            }
          >
            Failed to load traffic data
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please try again or select another period.
          </p>
        </div>
      </div>
    );
  }

  if (!trafficData.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div
          className={
            isDark
              ? "flex max-w-sm flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/40 px-8 py-8 text-center"
              : "flex max-w-sm flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-8 py-8 text-center"
          }
        >
          <div
            className={
              isDark
                ? "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400"
                : "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-500"
            }
          >
            <Activity size={22} />
          </div>

          <h3
            className={
              isDark
                ? "text-sm font-semibold text-slate-200"
                : "text-sm font-semibold text-slate-800"
            }
          >
            No traffic data
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            There is no traffic activity available for
            the selected period. Try another time range
            to view traffic insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={trafficData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="trafficGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#38BDF8"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#38BDF8"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={chartTheme.gridColor}
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: chartTheme.textColor,
              fontSize: 12,
            }}
          />

          <YAxis
            yAxisId="requests"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: chartTheme.textColor,
              fontSize: 12,
            }}
          />

          <YAxis
            yAxisId="metrics"
            orientation="right"
            domain={[0, "auto"]}
            hide
          />

          <Tooltip
            contentStyle={{
              backgroundColor: chartTheme.tooltipBackground,
              border: `1px solid ${chartTheme.tooltipBorder}`,
              borderRadius: "12px",
              color: chartTheme.tooltipText,
            }}
            labelStyle={{
              color: chartTheme.textColor,
            }}
            formatter={(value, name) => {
              if (name === "requests") {
                return [value, "Requests"];
              }

              if (name === "errorRate") {
                return [`${value}%`, "Error Rate"];
              }

              if (name === "responseTime") {
                return [`${value} ms`, "Response Time"];
              }

              return [value, name];
            }}
          />

          <Area
            yAxisId="requests"
            type="monotone"
            dataKey="requests"
            stroke="#38BDF8"
            strokeWidth={2}
            fill="url(#trafficGradient)"
            isAnimationActive
          />

          <Line
            yAxisId="metrics"
            type="monotone"
            dataKey="errorRate"
            stroke="#F87171"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
          />

          <Line
            yAxisId="metrics"
            type="monotone"
            dataKey="responseTime"
            stroke="#A78BFA"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(TrafficChart);
