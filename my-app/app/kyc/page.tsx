"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type StepIndex = 1 | 2 | 3;

interface UploadSlot {
  fileName: string | null;
  preview: string | null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KycPage() {
  // Step 1 — ID upload
  const [idFront, setIdFront] = useState<UploadSlot>({ fileName: null, preview: null });
  const [idBack,  setIdBack]  = useState<UploadSlot>({ fileName: null, preview: null });

  // Step 2 — Selfie
  const [selfie, setSelfie] = useState<UploadSlot>({ fileName: null, preview: null });

  // Step 3 — OTP
  const [otpSent,    setOtpSent]    = useState(false);
  const [otpDigits,  setOtpDigits]  = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifying,  setVerifying]  = useState(false);
  const [verified,   setVerified]   = useState(false);

  const phone = "+254 712 •••678";
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  // ── Step completion logic ────────────────────────────────────────────────────
  const step1Complete = !!idFront.fileName && !!idBack.fileName;
  const step2Complete = !!selfie.fileName;
  const step3Complete = verified;

  const completedCount = [step1Complete, step2Complete, step3Complete].filter(Boolean).length;
  const progressPercent = (completedCount / 3) * 100;

  // Determine which step is "active" (first incomplete)
  const activeStep: StepIndex = !step1Complete ? 1 : !step2Complete ? 2 : 3;

  // ── File handlers ─────────────────────────────────────────────────────────────
  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadSlot>>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter({ fileName: file.name, preview: url });
  }

  // ── OTP handlers ──────────────────────────────────────────────────────────────
  function sendOtp() {
    setOtpSent(true);
    setResendTimer(54);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value.slice(-1);
    setOtpDigits(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp() {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1200));
    setVerifying(false);
    setVerified(true);
  }

  const otpComplete = otpDigits.every(d => d !== "");

  // ── Upload zone component ──────────────────────────────────────────────────────
  function UploadZone({
    slot,
    label,
    onUpload,
    icon = "⬆",
  }: {
    slot: UploadSlot;
    label: string;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: string;
  }) {
    return (
      <label className="relative flex-1 cursor-pointer">
        <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={onUpload} />
        <div className={`flex flex-col items-center justify-center gap-2 h-[120px] rounded-[12px] border-2 border-dashed transition-colors ${
          slot.fileName
            ? "border-[#A5D6A7] bg-[#E8F5E9]"
            : "border-[#E5E5E5] dark:border-[#2a2a2a] hover:border-[#E35336] hover:bg-[#FDF1EE] dark:hover:bg-[#3D1A14]"
        }`}>
          {slot.fileName ? (
            <>
              <span className="text-[#2E7D32] text-lg">✓</span>
              <p className="font-body text-[11px] font-medium text-[#2E7D32] px-2 text-center truncate max-w-full">
                {slot.fileName}
              </p>
            </>
          ) : (
            <>
              <span className="text-[#AAAAAA] text-lg">{icon === "⬆" ? "📷" : icon}</span>
              <p className="font-body text-[12px] font-medium text-[#AAAAAA]">{label}</p>
            </>
          )}
        </div>
      </label>
    );
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
        <Link href="/login" className="font-body text-[13px] font-medium text-[#777777] dark:text-[#aaa] hover:text-[#222222] dark:hover:text-white transition-colors">
          ← Back to sign in
        </Link>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-[640px]">

          {/* Header */}
          <div className="mb-6">
            <p className="font-display text-[11px] font-bold uppercase tracking-widest text-[#E35336] mb-2">
              Verify your identity
            </p>
            <h1 className="font-display text-[32px] font-bold text-[#222222] dark:text-white leading-tight mb-2">
              Quick KYC — under 2 minutes
            </h1>
            <p className="font-body text-[14px] font-medium text-[#777777] dark:text-[#aaa]">
              We verify every guest and host. Your data is encrypted and never shared.
            </p>
          </div>

          {/* Progress bar — 3 segments */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex-1 h-1.5 rounded-full bg-[#E5E5E5] dark:bg-[#2a2a2a] overflow-hidden">
                <div
                  className="h-full bg-[#E35336] transition-all duration-500 rounded-full"
                  style={{
                    width:
                      step === 1 ? (step1Complete ? "100%" : activeStep === 1 ? "55%" : "0%")
                    : step === 2 ? (step2Complete ? "100%" : activeStep === 2 ? "55%" : "0%")
                    : (step3Complete ? "100%" : activeStep === 3 ? "55%" : "0%"),
                  }}
                />
              </div>
            ))}
          </div>

          {/* ── Step 1 — National ID or Passport ── */}
          <div className={`bg-white dark:bg-[#1c1c1c] border-2 rounded-[16px] p-6 mb-4 transition-colors ${
            step1Complete ? "border-[#A5D6A7]" : activeStep === 1 ? "border-[#E35336]" : "border-[#E5E5E5] dark:border-[#2a2a2a]"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={step1Complete ? "text-[#2E7D32]" : "text-[#E35336]"}>
                {step1Complete ? "✓" : "📄"}
              </span>
              <h2 className="font-display text-[15px] font-bold text-[#222222] dark:text-white">
                1. National ID or Passport
              </h2>
            </div>
            <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mb-4">
              Upload front and back. Make sure all corners are visible.
            </p>
            <div className="flex gap-3">
              <UploadZone slot={idFront} label="Front of ID" onUpload={e => handleFile(e, setIdFront)} />
              <UploadZone slot={idBack}  label="Back of ID"  onUpload={e => handleFile(e, setIdBack)} />
            </div>
          </div>

          {/* ── Step 2 — Selfie liveness check ── */}
          <div className={`bg-white dark:bg-[#1c1c1c] border-2 rounded-[16px] p-6 mb-4 transition-colors ${
            !step1Complete ? "opacity-50 pointer-events-none border-[#E5E5E5] dark:border-[#2a2a2a]"
            : step2Complete ? "border-[#A5D6A7]"
            : activeStep === 2 ? "border-[#E35336]"
            : "border-[#E5E5E5] dark:border-[#2a2a2a]"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={step2Complete ? "text-[#2E7D32]" : "text-[#E35336]"}>
                {step2Complete ? "✓" : "📷"}
              </span>
              <h2 className="font-display text-[15px] font-bold text-[#222222] dark:text-white">
                2. Selfie liveness check
              </h2>
            </div>
            <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mb-4">
              A quick selfie to match your ID.
            </p>
            <label className="cursor-pointer block">
              <input type="file" accept="image/jpeg,image/png" capture="user" className="hidden" onChange={e => handleFile(e, setSelfie)} />
              <div className={`flex flex-col items-center justify-center gap-2 h-[140px] rounded-[12px] border-2 border-dashed transition-colors ${
                selfie.fileName
                  ? "border-[#A5D6A7] bg-[#E8F5E9]"
                  : "border-[#E5E5E5] dark:border-[#2a2a2a] hover:border-[#E35336] hover:bg-[#FDF1EE] dark:hover:bg-[#3D1A14]"
              }`}>
                {selfie.fileName ? (
                  <>
                    <span className="text-[#2E7D32] text-2xl">✓</span>
                    <p className="font-body text-[12px] font-medium text-[#2E7D32]">{selfie.fileName}</p>
                  </>
                ) : (
                  <>
                    <span className="text-[#AAAAAA] text-2xl">📷</span>
                    <p className="font-body text-[13px] font-medium text-[#AAAAAA]">Tap to take selfie</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* ── Step 3 — Verify phone ── */}
          <div className={`bg-white dark:bg-[#1c1c1c] border-2 rounded-[16px] p-6 mb-6 transition-colors ${
            !step2Complete ? "opacity-50 pointer-events-none border-[#E5E5E5] dark:border-[#2a2a2a]"
            : step3Complete ? "border-[#A5D6A7]"
            : "border-[#E35336]"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={step3Complete ? "text-[#2E7D32]" : "text-[#E35336]"}>
                {step3Complete ? "✓" : "📞"}
              </span>
              <h2 className="font-display text-[15px] font-bold text-[#222222] dark:text-white">
                3. Verify your phone
              </h2>
            </div>
            <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mb-4">
              We&apos;ll send an OTP to your M-Pesa number.
            </p>

            {step3Complete ? (
              <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-[12px] px-4 py-3 flex items-center gap-2">
                <span className="text-[#2E7D32]">✓</span>
                <p className="font-display text-[13px] font-bold text-[#2E7D32]">
                  Phone number verified
                </p>
              </div>
            ) : !otpSent ? (
              <button
                onClick={sendOtp}
                className="w-full font-display text-[14px] font-bold text-white bg-[#E35336] rounded-full py-3 hover:bg-[#C03D24] transition-colors"
              >
                Send OTP to {phone}
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa]">
                  A 6-digit code was sent to <span className="font-bold text-[#222222] dark:text-white">{phone}</span> via M-Pesa.
                </p>

                {/* OTP boxes */}
                <div className="flex gap-2 justify-center">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 text-center font-display text-[20px] font-bold rounded-[10px] border-2 outline-none transition-all ${
                        digit
                          ? "border-[#E35336] text-[#E35336] bg-[#FDF1EE]"
                          : "border-[#E5E5E5] dark:border-[#2a2a2a] text-[#222222] dark:text-white bg-white dark:bg-[#242424] focus:border-[#E35336]"
                      }`}
                      style={{ height: "52px" }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa]">
                    Didn&apos;t receive it?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-[#AAAAAA]">Resend ({resendTimer}s)</span>
                    ) : (
                      <button onClick={sendOtp} className="font-display font-bold text-[#E35336] hover:underline">
                        Resend
                      </button>
                    )}
                  </p>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={!otpComplete || verifying}
                  className="w-full font-display text-[14px] font-bold text-white bg-[#E35336] rounded-full py-3 hover:bg-[#C03D24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Verifying…
                    </>
                  ) : (
                    "Verify code"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Submit verification */}
          <button
            disabled={!step1Complete || !step2Complete || !step3Complete}
            onClick={() => { window.location.href = "/"; }}
            className="w-full font-display text-[14px] font-bold text-white bg-[#222222] dark:bg-white dark:text-[#222222] rounded-full py-3.5 hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-4"
          >
            Submit verification
          </button>

          {/* Footer note */}
          <p className="text-center font-body text-[12px] font-medium text-[#AAAAAA] dark:text-[#555]">
            🔒 Encrypted · reviewed within 30 min · never shared publicly
          </p>

        </div>
      </div>

    </div>
  );
}
