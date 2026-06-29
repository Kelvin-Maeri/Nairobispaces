"use client";

import { useState } from "react";
import Link from "next/link";

// ── Demo accounts ─────────────────────────────────────────────────────────────

const demoAccounts = [
  {
    role: "Guest",
    email: "guest@nairobispaces.co.ke",
    redirect: "/",
    icon: "👤",
    description: "Browse and book listings",
    tag: null,
  },
  {
    role: "Host",
    email: "host@nairobispaces.co.ke",
    redirect: "/host",
    icon: "🏠",
    description: "Manage listings & payouts",
    tag: "→ /HOST",
  },
  {
    role: "Ops",
    email: "ops@nairobispaces.co.ke",
    redirect: "/ops",
    icon: "⚙️",
    description: "Review and approve requests",
    tag: "→ /OPS",
  },
  {
    role: "Admin",
    email: "admin@nairobispaces.co.ke",
    redirect: "/admin",
    icon: "📊",
    description: "Platform oversight & revenue",
    tag: "→ /ADMIN",
  },
];

const DEMO_PASSWORD = "demo1234";

type Field = "email" | "password";
type FormErrors = Partial<Record<Field, string>>;

export default function LoginPage() {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [apiError,    setApiError]    = useState("");
  const [activeDemo,  setActiveDemo]  = useState<string | null>(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!email.trim())                     errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email    = "Enter a valid email address.";
    if (!password)                         errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Auto-fill demo account ──────────────────────────────────────────────────
  function fillDemo(account: typeof demoAccounts[0]) {
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    setActiveDemo(account.role);
    setErrors({});
    setApiError("");
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));

      // Detect role from demo email and redirect
      const matched = demoAccounts.find(a => a.email === email.trim());
      if (matched) {
        window.location.href = matched.redirect;
      } else {
        // Default redirect — backend will handle role routing
        window.location.href = "/";
      }
    } catch {
      setApiError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function inputClass(field: Field) {
    return `w-full font-body text-[14px] text-[#222222] dark:text-white bg-white dark:bg-[#242424] border rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-[#AAAAAA] ${
      errors[field]
        ? "border-[#C62828] focus:border-[#C62828] focus:shadow-[0_0_0_3px_rgba(198,40,40,0.12)]"
        : "border-[#E5E5E5] dark:border-[#2a2a2a] focus:border-[#E35336] focus:shadow-[0_0_0_3px_rgba(227,83,54,0.12)]"
    }`;
  }

  return (
    <div className="min-h-screen bg-[#F5F4F2] dark:bg-[#0f0f0f] flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E35336] rounded-[6px] flex items-center justify-center">
            <span className="font-display font-bold text-white text-base leading-none">N</span>
          </div>
          <span className="font-display font-bold text-[#222222] dark:text-white text-[15px] tracking-wide">
            NAIROBI SPACES
          </span>
        </Link>
  <p className="font-body text-[13px] font-medium text-[#777777] dark:text-[#aaa]">
  No account?{" "}
  <Link href="/kyc" className="font-display font-bold text-[#E35336] hover:underline">
    Sign up & verify
  </Link>
</p>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[900px] flex flex-col lg:flex-row gap-6">

          {/* ── Left: sign-in form ── */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <p className="font-display text-[11px] font-bold uppercase tracking-widest text-[#E35336] mb-2">
                Sign in
              </p>
              <h1 className="font-display text-[32px] font-bold text-[#222222] dark:text-white leading-tight mb-2">
                One sign-in for everyone.
              </h1>
              <p className="font-body text-[14px] font-medium text-[#777777] dark:text-[#aaa] leading-relaxed">
                Use your email & password — we&apos;ll automatically take you to the right
                dashboard based on your role: Guest, Host, Ops or Admin.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-6 shadow-sm">

              {/* API error */}
              {apiError && (
                <div className="mb-5 bg-[#FDEAEA] dark:bg-[#3B0000] border border-[#EF9A9A] dark:border-[#C62828] rounded-[10px] px-4 py-3 flex items-start gap-2">
                  <span className="text-[#C62828] text-sm mt-0.5">⚠</span>
                  <p className="font-body text-[13px] font-medium text-[#C62828]">{apiError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#aaa] flex items-center gap-1.5">
                    ✉ Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); setActiveDemo(null); }}
                    className={inputClass("email")}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && (
                    <p className="font-body text-[12px] font-medium text-[#C62828] flex items-center gap-1">
                      ⚠ {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#aaa] flex items-center gap-1.5">
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                      className={inputClass("password")}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 font-display text-[11px] font-bold text-[#AAAAAA] hover:text-[#777777] transition-colors"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="font-body text-[12px] font-medium text-[#C62828] flex items-center gap-1">
                      ⚠ {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-display text-[14px] font-bold text-white bg-[#E35336] rounded-full py-3 hover:bg-[#C03D24] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>→ Sign in</>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-[#E5E5E5] dark:border-[#2a2a2a]" />
                <span className="font-body text-[11px] font-medium text-[#AAAAAA]">or</span>
                <div className="flex-1 border-t border-[#E5E5E5] dark:border-[#2a2a2a]" />
              </div>

              {/* M-Pesa OTP */}
              <button className="w-full font-display text-[13px] font-bold text-[#222222] dark:text-white border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-full py-2.5 hover:border-[#888] dark:hover:border-[#555] transition-colors flex items-center justify-center gap-2">
                📱 Sign in with M-Pesa OTP
              </button>

            {/* Sign up link */}
<p className="text-center font-body text-[13px] font-medium text-[#777777] dark:text-[#aaa] mt-4">
  No account?{" "}
  <Link href="/kyc" className="font-display font-bold text-[#E35336] hover:underline">
    Sign up & verify
  </Link>
</p>
            </div>
          </div>

          {/* ── Right: demo accounts ── */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#E35336]">🛡</span>
                <p className="font-display text-[14px] font-bold text-[#222222] dark:text-white">
                  Demo accounts
                </p>
              </div>
              <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mb-4">
                Click to autofill and sign in as any role.
              </p>

              {/* Account cards */}
              <div className="flex flex-col gap-2">
                {demoAccounts.map(account => (
                  <button
                    key={account.role}
                    onClick={() => fillDemo(account)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] border transition-all text-left ${
                      activeDemo === account.role
                        ? "border-[#E35336] bg-[#FDF1EE] dark:bg-[#3D1A14]"
                        : "border-[#E5E5E5] dark:border-[#2a2a2a] hover:border-[#E35336] hover:bg-[#FDF1EE] dark:hover:bg-[#3D1A14]"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${
                      activeDemo === account.role
                        ? "bg-[#E35336] text-white"
                        : "bg-[#F2F2F2] dark:bg-[#2a2a2a]"
                    }`}>
                      {account.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[13px] font-bold text-[#222222] dark:text-white">
                        {account.role}
                      </p>
                      <p className="font-body text-[11px] font-medium text-[#777777] dark:text-[#aaa] truncate">
                        {account.email}
                      </p>
                    </div>

                    {/* Tag */}
                    {account.tag && (
                      <span className="font-display text-[10px] font-bold text-[#E35336] flex-shrink-0">
                        {account.tag}
                      </span>
                    )}
                    {!account.tag && (
                      <span className="font-display text-[10px] font-bold text-[#E35336] flex-shrink-0">
                        →
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Password hint */}
              <div className="mt-4 pt-4 border-t border-[#F2F2F2] dark:border-[#2a2a2a]">
                <p className="font-body text-[11px] font-medium text-[#777777] dark:text-[#aaa]">
                  Password for all demo accounts:{" "}
                  <span className="font-display font-bold text-[#222222] dark:text-white bg-[#F2F2F2] dark:bg-[#2a2a2a] px-2 py-0.5 rounded-[6px] text-[11px]">
                    {DEMO_PASSWORD}
                  </span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#E5E5E5] dark:border-[#2a2a2a] py-4 px-8 flex items-center justify-between">
        <p className="font-body text-[11px] font-medium text-[#AAAAAA] dark:text-[#555]">
          © 2026 Nairobi Spaces · Mogoa Labs
        </p>
        <div className="flex gap-5 font-display text-[11px] font-bold text-[#AAAAAA] dark:text-[#555]">
          <span className="cursor-pointer hover:text-[#777] transition-colors">Help</span>
          <span className="cursor-pointer hover:text-[#777] transition-colors">Trust & Safety</span>
          <span className="cursor-pointer hover:text-[#777] transition-colors">About</span>
        </div>
      </div>

    </div>
  );
}
