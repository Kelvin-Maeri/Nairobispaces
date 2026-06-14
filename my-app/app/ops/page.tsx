"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type KycStatus = "verified" | "pending" | "none";
type RequestStatus = "pending" | "approved" | "declined" | "expired";

interface OpsRequest {
  id: string;
  reqRef: string;
  listingTitle: string;
  listingLocation: string;
  listingRating: number;
  listingReviews: number;
  listingImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  amount: number;
  guestName: string;
  guestPhone: string;
  guestKyc: KycStatus;
  hostName: string;
  hostPhone: string;
  hostKycVerified: boolean;
  secondsRemaining: number;
  status: RequestStatus;
}

interface CheckinBooking {
  id: string;
  guestName: string;
  guestInitials: string;
  listingTitle: string;
  listingAddress: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  hostPhone: string;
}

interface CheckoutBooking {
  id: string;
  guestName: string;
  guestInitials: string;
  listingTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  payoutStatus: "pending" | "released";
}

interface UpcomingBooking {
  id: string;
  guestName: string;
  guestInitials: string;
  listingTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  daysAway: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const initialRequests: OpsRequest[] = [
  {
    id: "r1",
    reqRef: "REQ-7821",
    listingTitle: "Westlands Skyline Loft",
    listingLocation: "Westlands",
    listingRating: 4.9,
    listingReviews: 24,
    listingImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    checkIn: "May 09",
    checkOut: "May 12",
    nights: 3,
    adults: 2,
    amount: 14850,
    guestName: "Janet M.",
    guestPhone: "+254 712 998 765",
    guestKyc: "verified",
    hostName: "Mary Wambui",
    hostPhone: "+254 720 333 111",
    hostKycVerified: true,
    secondsRemaining: 22 * 60 + 14,
    status: "pending",
  },
  {
    id: "r2",
    reqRef: "REQ-7819",
    listingTitle: "Karen Garden Cottage",
    listingLocation: "Karen",
    listingRating: 4.7,
    listingReviews: 18,
    listingImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop",
    checkIn: "May 11",
    checkOut: "May 15",
    nights: 4,
    adults: 2,
    amount: 34320,
    guestName: "Tomás R.",
    guestPhone: "+254 799 112 233",
    guestKyc: "pending",
    hostName: "David Otieno",
    hostPhone: "+254 733 444 555",
    hostKycVerified: true,
    secondsRemaining: 6 * 60 + 30,
    status: "pending",
  },
  {
    id: "r3",
    reqRef: "REQ-7815",
    listingTitle: "Kilimani Sunset Studio",
    listingLocation: "Kilimani",
    listingRating: 4.4,
    listingReviews: 31,
    listingImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
    checkIn: "May 13",
    checkOut: "May 14",
    nights: 1,
    adults: 1,
    amount: 3520,
    guestName: "Faith W.",
    guestPhone: "+254 700 445 566",
    guestKyc: "verified",
    hostName: "Samuel Gitau",
    hostPhone: "+254 711 222 333",
    hostKycVerified: false,
    secondsRemaining: 14 * 60 + 5,
    status: "pending",
  },
];

const checkinBookings: CheckinBooking[] = [
  {
    id: "ci1",
    guestName: "James Mwangi",
    guestInitials: "JM",
    listingTitle: "Kilimani Sunset Studio",
    listingAddress: "Apt 4B, Rose Ave, Kilimani",
    checkIn: "Today",
    checkOut: "May 12",
    nights: 3,
    amount: 12000,
    hostPhone: "+254 733 444 555",
  },
];

const checkoutBookings: CheckoutBooking[] = [
  {
    id: "co1",
    guestName: "Aisha Omondi",
    guestInitials: "AO",
    listingTitle: "1BR Westlands Loft",
    checkIn: "May 05",
    checkOut: "Today",
    nights: 4,
    amount: 26000,
    payoutStatus: "pending",
  },
];

const upcomingBookings: UpcomingBooking[] = [
  {
    id: "up1",
    guestName: "Peter Kamau",
    guestInitials: "PK",
    listingTitle: "Karen Garden Cottage",
    checkIn: "May 14",
    checkOut: "May 18",
    nights: 4,
    amount: 34320,
    daysAway: 3,
  },
  {
    id: "up2",
    guestName: "Grace Njeri",
    guestInitials: "GN",
    listingTitle: "Westlands Skyline Loft",
    checkIn: "May 18",
    checkOut: "May 21",
    nights: 3,
    amount: 14850,
    daysAway: 7,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatKES(n: number) {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── KYC badge ─────────────────────────────────────────────────────────────────

function KycBadge({ status }: { status: KycStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 font-display text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
        ✓ KYC Verified
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 font-display text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#A05C00] border border-[#FFE082]">
        ⏳ KYC Pending review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-display text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#777777] border border-[#E5E5E5]">
      KYC None
    </span>
  );
}

// ── Countdown timer ───────────────────────────────────────────────────────────

function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const isUrgent = seconds < 10 * 60; // red under 10 minutes
  const isExpired = seconds === 0;

  return (
    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 flex-shrink-0 ${
      isExpired
        ? "border-[#E5E5E5] bg-[#F2F2F2]"
        : isUrgent
        ? "border-[#E35336] bg-[#FDF1EE]"
        : "border-[#E5E5E5] bg-[#F5F4F2]"
    }`}>
      <span className={`font-display text-[16px] font-bold leading-none ${
        isExpired ? "text-[#AAAAAA]" : isUrgent ? "text-[#E35336]" : "text-[#222222]"
      }`}>
        {isExpired ? "—" : formatTime(seconds)}
      </span>
      <span className={`font-body text-[9px] font-medium mt-0.5 ${
        isExpired ? "text-[#AAAAAA]" : isUrgent ? "text-[#E35336]" : "text-[#777777]"
      }`}>
        {isExpired ? "expired" : "remaining"}
      </span>
    </div>
  );
}

// ── Request card ──────────────────────────────────────────────────────────────

function RequestCard({
  request,
  onApprove,
  onDecline,
}: {
  request: OpsRequest;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  if (request.status !== "pending") return null;

  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] overflow-hidden">
      {/* Top row — image + details + timer */}
      <div className="flex gap-4 p-5">
        {/* Listing image */}
        <div className="w-24 h-24 rounded-[12px] overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={request.listingImage}
            alt={request.listingTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Ref + title */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="font-display text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest">
                {request.reqRef}
              </span>
              <p className="font-display text-[15px] font-bold text-[#222222] dark:text-white leading-tight">
                {request.listingTitle}
              </p>
            </div>
          </div>

          {/* Dates + amount */}
          <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mb-2">
            📅 {request.checkIn} → {request.checkOut} · {request.nights} nights · {request.adults} adult{request.adults > 1 ? "s" : ""} ·{" "}
            <span className="font-display font-bold text-[#222222] dark:text-white">
              {formatKES(request.amount)}
            </span>
          </p>

          {/* Guest row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-body text-[12px] font-medium text-[#555555] dark:text-[#ccc]">
              👤 {request.guestName}
            </span>
            <a
              href={`tel:${request.guestPhone.replace(/\s/g, "")}`}
              className="font-display text-[11px] font-bold text-[#E35336] hover:underline"
            >
              📞 {request.guestPhone}
            </a>
            <KycBadge status={request.guestKyc} />
          </div>

          {/* Host row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-[12px] font-medium text-[#555555] dark:text-[#ccc]">
              🏠 Host: {request.hostName}
            </span>
            <a
              href={`tel:${request.hostPhone.replace(/\s/g, "")}`}
              className="font-display text-[11px] font-bold text-[#E35336] hover:underline"
            >
              📞 {request.hostPhone}
            </a>
            {request.hostKycVerified && (
              <span className="font-display text-[10px] font-bold text-[#2E7D32]">
                ✓ Host KYC verified
              </span>
            )}
          </div>
        </div>

        {/* Countdown timer */}
        <CountdownTimer initialSeconds={request.secondsRemaining} />
      </div>

      {/* Listing meta row */}
      <div className="px-5 pb-3 flex items-center gap-4 text-[11px] font-body text-[#777777] dark:text-[#aaa]">
        <span>📍 {request.listingLocation}</span>
        <span>⭐ {request.listingRating} · {request.listingReviews} reviews</span>
      </div>

      {/* Divider */}
      <div className="border-t border-[#F2F2F2] dark:border-[#2a2a2a]" />

      {/* Action buttons */}
      <div className="flex gap-3 p-4">
        <button
          onClick={() => onApprove(request.id)}
          className="flex-1 font-display text-[13px] font-bold text-white bg-[#2E7D32] rounded-full py-2.5 hover:bg-[#1B5E20] transition-colors flex items-center justify-center gap-2"
        >
          ✓ Approve request
        </button>
        <button
          onClick={() => onDecline(request.id)}
          className="flex-1 font-display text-[13px] font-bold text-white bg-[#C62828] rounded-full py-2.5 hover:bg-[#B71C1C] transition-colors flex items-center justify-center gap-2"
        >
          ✕ Decline request
        </button>
      </div>
    </div>
  );
}

// ── Check-in card ─────────────────────────────────────────────────────────────

function CheckinCard({ booking }: { booking: CheckinBooking }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#E35336] flex items-center justify-center flex-shrink-0">
          <span className="font-display text-[12px] font-bold text-white">
            {booking.guestInitials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-[#222222] dark:text-white text-[14px]">
            {booking.guestName}
          </p>
          <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa]">
            {booking.listingTitle} · {booking.nights} nights
          </p>
          <p className="font-body text-[12px] font-medium text-[#AAAAAA]">
            {booking.checkIn} → {booking.checkOut}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-[#222222] dark:text-white text-[14px]">
            {formatKES(booking.amount)}
          </p>
          <button
            onClick={() => setExpanded(e => !e)}
            className="font-display text-[11px] font-bold text-[#E35336] hover:underline mt-1"
          >
            {expanded ? "Hide details ↑" : "Check-in details ↓"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#F2F2F2] dark:border-[#2a2a2a] space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">📍</span>
            <p className="font-body text-[12px] font-medium text-[#555555] dark:text-[#ccc]">
              {booking.listingAddress}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">📞</span>
            <a
              href={`tel:${booking.hostPhone.replace(/\s/g, "")}`}
              className="font-display text-[12px] font-bold text-[#E35336] hover:underline"
            >
              {booking.hostPhone}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Checkout card ─────────────────────────────────────────────────────────────

function CheckoutCard({ booking }: { booking: CheckoutBooking }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#E35336] flex items-center justify-center flex-shrink-0">
        <span className="font-display text-[12px] font-bold text-white">
          {booking.guestInitials}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[#222222] dark:text-white text-[14px]">
          {booking.guestName}
        </p>
        <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa]">
          {booking.listingTitle} · {booking.nights} nights
        </p>
        <p className="font-body text-[12px] font-medium text-[#AAAAAA]">
          {booking.checkIn} → {booking.checkOut}
        </p>
      </div>
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
        <p className="font-display font-bold text-[#222222] dark:text-white text-[14px]">
          {formatKES(booking.amount)}
        </p>
        <span className={`font-display text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
          booking.payoutStatus === "released"
            ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
            : "bg-[#FFF8E1] text-[#A05C00] border border-[#FFE082]"
        }`}>
          {booking.payoutStatus === "released" ? "✓ Payout released" : "⏳ Payout pending"}
        </span>
      </div>
    </div>
  );
}

// ── Upcoming card ─────────────────────────────────────────────────────────────

function UpcomingCard({ booking }: { booking: UpcomingBooking }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#E35336] flex items-center justify-center flex-shrink-0">
        <span className="font-display text-[12px] font-bold text-white">
          {booking.guestInitials}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[#222222] dark:text-white text-[14px]">
          {booking.guestName}
        </p>
        <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa]">
          {booking.listingTitle} · {booking.nights} nights
        </p>
        <p className="font-body text-[12px] font-medium text-[#AAAAAA]">
          {booking.checkIn} → {booking.checkOut}
        </p>
      </div>
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
        <p className="font-display font-bold text-[#222222] dark:text-white text-[14px]">
          {formatKES(booking.amount)}
        </p>
        <span className="font-display text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]">
          {booking.daysAway} days away
        </span>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-14">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-body text-[13px] font-medium text-[#AAAAAA]">{message}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "pending" | "checkins" | "checkouts" | "upcoming";

export default function OpsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [requests, setRequests] = useState<OpsRequest[]>(initialRequests);
  const [showBanner, setShowBanner] = useState(true);

  const pendingRequests = requests.filter(r => r.status === "pending");

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "approved" as RequestStatus } : r)
    );
  };

  const handleDecline = (id: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "declined" as RequestStatus } : r)
    );
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "pending",   label: "Pending",    count: pendingRequests.length },
    { key: "checkins",  label: "Check-ins",  count: checkinBookings.length },
    { key: "checkouts", label: "Check-outs", count: checkoutBookings.length },
    { key: "upcoming",  label: "Upcoming",   count: upcomingBookings.length },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F2] dark:bg-[#0f0f0f]">

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-8 pt-8 pb-5">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[#E35336] mb-2">
          Operations
        </p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-[32px] font-bold text-[#222222] dark:text-white mb-1 leading-tight">
              Pending · {pendingRequests.length} · Today&apos;s bookings · {checkinBookings.length}
            </h1>
            <p className="font-body text-[13px] font-medium text-[#777777] dark:text-[#aaa]">
              14 today · 2 declined
            </p>
          </div>
          {/* Ops avatar */}
          <div className="mt-2 w-10 h-10 rounded-full bg-[#222222] dark:bg-white flex items-center justify-center flex-shrink-0">
            <span className="font-display text-[12px] font-bold text-white dark:text-[#222222]">
              OP
            </span>
          </div>
        </div>
      </div>

      {/* ── Notification banner ── */}
      {showBanner && pendingRequests.length > 0 && (
        <div className="max-w-6xl mx-auto px-8 mb-4">
          <div className="bg-[#FDF1EE] dark:bg-[#3D1A14] border border-[#F4B3A3] dark:border-[#C84B2F] rounded-[12px] px-4 py-3 flex items-center justify-between">
            <p className="font-body text-[12px] font-medium text-[#C03D24] dark:text-[#F4B3A3]">
              🔔 <span className="font-display font-bold">{pendingRequests.length} pending requests</span> · Notifying ops via:{" "}
              <span className="font-display font-bold">Email</span>{" "}
              <span className="font-display font-bold">WhatsApp</span>
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="font-display text-[11px] font-bold text-[#C03D24] dark:text-[#F4B3A3] hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="flex gap-1 bg-[#F2F2F2] dark:bg-[#2a2a2a] rounded-full p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-display text-[12px] font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-white dark:bg-[#1c1c1c] text-[#222222] dark:text-white shadow-sm"
                  : "text-[#777777] dark:text-[#aaa] hover:text-[#222222] dark:hover:text-white"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  activeTab === tab.key && tab.key === "pending"
                    ? "bg-[#E35336] text-white"
                    : activeTab === tab.key
                    ? "bg-[#F2F2F2] dark:bg-[#2a2a2a] text-[#555555]"
                    : "bg-[#E5E5E5] dark:bg-[#333] text-[#555555] dark:text-[#aaa]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-6xl mx-auto px-8 pb-14">

        {/* Pending */}
        {activeTab === "pending" && (
          <div className="flex flex-col gap-4">
            {pendingRequests.length === 0 ? (
              <EmptyState icon="✅" message="All caught up — no pending requests right now." />
            ) : (
              pendingRequests.map(r => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              ))
            )}
          </div>
        )}

        {/* Today check-ins */}
        {activeTab === "checkins" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-display text-[16px] font-bold text-[#222222] dark:text-white">
                  Today&apos;s check-ins
                </h2>
                <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mt-0.5">
                  {checkinBookings.length} guest{checkinBookings.length !== 1 ? "s" : ""} arriving today
                </p>
              </div>
            </div>
            {checkinBookings.length === 0 ? (
              <EmptyState icon="🏨" message="No check-ins scheduled for today." />
            ) : (
              checkinBookings.map(b => <CheckinCard key={b.id} booking={b} />)
            )}
          </div>
        )}

        {/* Today check-outs */}
        {activeTab === "checkouts" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-display text-[16px] font-bold text-[#222222] dark:text-white">
                  Today&apos;s check-outs
                </h2>
                <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mt-0.5">
                  {checkoutBookings.length} guest{checkoutBookings.length !== 1 ? "s" : ""} departing today
                </p>
              </div>
            </div>
            {checkoutBookings.length === 0 ? (
              <EmptyState icon="🧳" message="No check-outs scheduled for today." />
            ) : (
              checkoutBookings.map(b => <CheckoutCard key={b.id} booking={b} />)
            )}
          </div>
        )}

        {/* Upcoming */}
        {activeTab === "upcoming" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-display text-[16px] font-bold text-[#222222] dark:text-white">
                  Upcoming bookings
                </h2>
                <p className="font-body text-[12px] font-medium text-[#777777] dark:text-[#aaa] mt-0.5">
                  Next 7 days
                </p>
              </div>
            </div>
            {upcomingBookings.length === 0 ? (
              <EmptyState icon="📅" message="No upcoming bookings in the next 7 days." />
            ) : (
              upcomingBookings.map(b => <UpcomingCard key={b.id} booking={b} />)
            )}
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#E5E5E5] dark:border-[#2a2a2a] py-5">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex gap-6 font-display text-[11px] font-bold text-[#AAAAAA] dark:text-[#555]">
            <span>Guest</span><span>Host</span><span>Ops</span><span>Admin</span>
          </div>
          <p className="font-body text-[11px] font-medium text-[#AAAAAA] dark:text-[#555]">
            © 2026 Nairobi Spaces · Mogoa Labs · Prototype simulation
          </p>
          <div className="flex gap-5 font-display text-[11px] font-bold text-[#AAAAAA] dark:text-[#555]">
            <span className="cursor-pointer hover:text-[#777] transition-colors">About</span>
            <span className="cursor-pointer hover:text-[#777] transition-colors">Help</span>
            <span className="cursor-pointer hover:text-[#777] transition-colors">Trust & Safety</span>
          </div>
        </div>
      </div>

    </div>
  );
}
