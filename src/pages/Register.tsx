import {
  useState,
  type FormEvent,
} from "react";

import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    isLoading,
    error,
  } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await register({
      name,
      email,
      password,
    });

    if (success) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#080B12] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-slate-800 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.12),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10">
                <Activity
                  size={20}
                  className="text-sky-400"
                />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                Realtime Analytics
              </span>
            </div>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Systems operational
              </div>

              <h1 className="text-4xl font-semibold tracking-tight xl:text-6xl">
                Start monitoring
                <span className="block text-sky-400">
                  in real time.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Create your workspace account and
                monitor traffic, service health, and
                operational activity from one place.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xl font-semibold">
                    Live
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Analytics
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xl font-semibold">
                    Secure
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Authentication
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xl font-semibold">
                    Real-time
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Monitoring
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Secure analytics platform
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10">
                  <Activity
                    size={20}
                    className="text-sky-400"
                  />
                </div>

                <div>
                  <p className="text-lg font-semibold">
                    Pulse Analytics
                  </p>

                  <p className="text-xs text-slate-500">
                    Live Intelligence
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                <ShieldCheck
                  size={21}
                  className="text-sky-400"
                />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Set up your account to access the
                analytics dashboard.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3 pl-10 pr-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="font-medium text-sky-400 transition hover:text-sky-300"
              >
                Sign in
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-600">
              <span className="h-px flex-1 bg-slate-800" />

              <span>
                Secure account creation
              </span>

              <span className="h-px flex-1 bg-slate-800" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}