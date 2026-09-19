import { useState } from "react";
import {
  Activity,
  Bell,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";

import NotificationPanel from "../dashboard/NotificationPanel";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const { theme } = useTheme();

  const isDark = theme === "dark";

  const sidebarClasses = isDark
    ? "bg-slate-950 border-slate-800"
    : "bg-white border-slate-200";

  const navItemClasses = isDark
    ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900";

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((current) => !current);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Main navigation"
        className={`fixed left-0 top-0 hidden h-screen w-64 border-r p-5 backdrop-blur-xl lg:block ${sidebarClasses}`}
      >
        <SidebarContent
          isDark={isDark}
          navItemClasses={navItemClasses}
          onNotifications={toggleNotifications}
          notificationsOpen={showNotifications}
        />
      </aside>

      {/* Mobile Header */}
      <header
        className={`sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl lg:hidden ${
          isDark
            ? "border-slate-800 bg-slate-950/95"
            : "border-slate-200 bg-white/95"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className={
              isDark
                ? "flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400"
                : "flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500"
            }
          >
            <Activity size={19} />
          </div>

          <div>
            <p
              className={
                isDark
                  ? "text-sm font-semibold text-slate-100"
                  : "text-sm font-semibold text-slate-900"
              }
            >
              Pulse Analytics
            </p>

            <p className="text-[10px] text-slate-500">
              Live Intelligence
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen((current) => !current)
          }
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          className={
            isDark
              ? "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-all duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95"
              : "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95"
          }
        >
          {mobileOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`fixed left-0 top-16 z-50 w-full border-b shadow-2xl transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        } ${
          isDark
            ? "border-slate-800 bg-slate-950"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="p-4">
          <SidebarContent
            isDark={isDark}
            navItemClasses={navItemClasses}
            onNotifications={() => {
              toggleNotifications();
              closeMobileMenu();
            }}
            onNavigate={closeMobileMenu}
            notificationsOpen={showNotifications}
          />
        </div>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <NotificationPanel
          onClose={() => setShowNotifications(false)}
        />
      )}
    </>
  );
}

function SidebarContent({
  isDark,
  navItemClasses,
  onNotifications,
  onNavigate,
  notificationsOpen = false,
}: {
  isDark: boolean;
  navItemClasses: string;
  onNotifications: () => void;
  onNavigate?: () => void;
  notificationsOpen?: boolean;
}) {
  return (
    <div>
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div
          aria-hidden="true"
          className={
            isDark
              ? "flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400"
              : "flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500"
          }
        >
          <Activity size={22} />
        </div>

        <div>
          <h1
            className={
              isDark
                ? "font-semibold tracking-tight text-slate-100"
                : "font-semibold tracking-tight text-slate-900"
            }
          >
            Pulse Analytics
          </h1>

          <p className="text-xs text-slate-500">
            Live Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Dashboard navigation"
        className="space-y-2"
      >
        {/* Dashboard */}
        <button
          type="button"
          onClick={onNavigate}
          aria-current="page"
          className={
            isDark
              ? "flex w-full items-center gap-3 rounded-xl bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-400 transition-all duration-200 hover:bg-sky-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99]"
              : "flex w-full items-center gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-600 transition-all duration-200 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99]"
          }
        >
          <LayoutDashboard
            size={18}
            aria-hidden="true"
          />

          Dashboard
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onNotifications}
          aria-haspopup="dialog"
          aria-expanded={notificationsOpen}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 active:scale-[0.99] ${navItemClasses}`}
        >
          <Bell
            size={18}
            aria-hidden="true"
          />

          Notifications
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onNavigate}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 active:scale-[0.99] ${navItemClasses}`}
        >
          <Settings
            size={18}
            aria-hidden="true"
          />

          Settings
        </button>
      </nav>
    </div>
  );
}