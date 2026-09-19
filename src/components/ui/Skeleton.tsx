import { useTheme } from "../../context/ThemeContext";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({
  className = "",
}: SkeletonProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md ${
        isDark
          ? "bg-slate-700/50"
          : "bg-slate-200"
      } ${className}`}
    />
  );
}