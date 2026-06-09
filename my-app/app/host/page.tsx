"use client";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ListingStatus = "active" | "pending_review" | "draft" | "inactive";
type BookingStatus = "approved_pay" | "paid" | "completed" | "cancelled" | "confirmed" | "kyc_verified";

interface Listing {
  id: string;
  name: string;
  location: string;
  price: string;
  status: ListingStatus;
  rating: number;
  reviews: number;
  image: string;
}

interface Booking {
  initials: string;
  name: string;
  listing: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  payoutAmount?: number;
  payoutDate?: string;
  status: BookingStatus;
  avatarColor: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Revenue this month", value: "KSh 54,200", trend: "↑ +18% vs last month", trendUp: true,  icon: "📈" },
  { label: "Bookings",           value: "12",          trend: "3 upcoming",            trendUp: false, icon: "📅" },
  { label: "Payout pending",     value: "KSh 28,350",  trend: "Releases May 14",       trendUp: false, icon: "💳" },
  { label: "Avg. rating",        value: "4.92 ★",      trend: "from 184 stays",        trendUp: true,  icon: "⭐" },
];

const chartData = [
  { day: "M", income: 6800,  payouts: 3500 },
  { day: "T", income: 7200,  payouts: 4000 },
  { day: "W", income: 6500,  payouts: 3200 },
  { day: "T", income: 9000,  payouts: 5500 },
  { day: "F", income: 10500, payouts: 7000 },
  { day: "S", income: 14000, payouts: 9500 },
  { day: "S", income: 10000, payouts: 6800 },
];

const BOOKED: Record<string, number[]> = {
  "2026-4": [9,10,11,14,15,16,17,22,23,24,27,28,29,30],
  "2026-5": [3,4,5,11,12,13],
};

const listings: Listing[] = [
  {
    id: "1",
    name: "Westlands Skyline Loft",
    location: "Westlands",
    price: "KSh 4,500/night",
    status: "active",
    rating: 4.9,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
  },
  {
    id: "2",
    name: "Kileleshwa Sky Apartment",
    location: "Kileleshwa",
    price: "KSh 3,800/night",
    status: "pending_review",
    rating: 0,
    reviews: 0,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
  },
  {
    id: "3",
    name: "Karen Garden Cottage",
    location: "Karen",
    price: "KSh 6,200/night",
    status: "draft",
    rating: 0,
    reviews: 0,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop",
  },
];

const bookings: Booking[] = [
  {
    initials: "WK",
    name: "Wanjiku K.",
    listing: "Kilimani Sunset Studio",
    checkIn: "May 09",
    checkOut: "May 12",
    nights: 3,
    amount: 10560,
    status: "approved_pay",
    avatarColor: "ga1",
  },
  {
    initials: "BM",
    name: "Brian M.",
    listing: "Karen Garden Cottage",
    checkIn: "May 14",
    checkOut: "May 18",
    nights: 4,
    amount: 34320,
    payoutAmount: 30888,
    payoutDate: "May 18",
    status: "paid",
    avatarColor: "ga2",
  },
  {
    initials: "AN",
    name: "Aisha N.",
    listing: "Westlands Skyline Loft",
    checkIn: "Apr 22",
    checkOut: "Apr 24",
    nights: 2,
    amount: 9900,
    status: "completed",
    avatarColor: "ga3",
  },
];

// ── Status badge configs ───────────────────────────────────────────────────────

const listingStatusConfig: Record<ListingStatus, { label: string; classes: string }> = {
  active:         { label: "● Active",         classes: "bg-[#E8F5E9] text-[#2E7D32]" },
  pending_review: { label: "⏳ Pending Review", classes: "bg-[#FFF8E1] text-[#A05C00]" },
  draft:          { label: "○ Draft",           classes: "bg-[#F2F2F2] text-[#555]" },
  inactive:       { label: "✕ Inactive",        classes: "bg-[#FDEAEA] text-[#C62828]" },
};

const bookingStatusConfig: Record<BookingStatus, { label: string; classes: string }> = {
  approved_pay: { label: "approved · pay",  classes: "bg-[#FFF8E1] text-[#A05C00] border border-[#FFE082]" },
  paid:         { label: "paid",            classes: "bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]" },
  completed:    { label: "completed",       classes: "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]" },
  cancelled:    { label: "cancelled",       classes: "bg-[#FDEAEA] text-[#C62828] border border-[#EF9A9A]" },
  confirmed:    { label: "confirmed",       classes: "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]" },
  kyc_verified: { label: "KYC verified",    classes: "bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]" },
};

// ── Avatar colors ─────────────────────────────────────────────────────────────

const avatarColors: Record<string, string> = {
  ga1: "bg-[#E35336] text-white",
  ga2: "bg-[#E35336] text-white",
  ga3: "bg-[#E35336] text-white",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatKES(n: number) {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

// ── Calendar ──────────────────────────────────────────────────────────────────

function CalendarSection() {
  const [baseMonth, setBaseMonth] = useState(4);
  const [baseYear,  setBaseYear]  = useState(2026);

  const months = [
    { month: baseMonth,          year: baseYear },
    { month: (baseMonth+1) % 12, year: baseMonth === 11 ? baseYear+1 : baseYear },
  ];

  const prev = () => baseMonth === 0  ? (setBaseMonth(11), setBaseYear(y => y-1)) : setBaseMonth(m => m-1);
  const next = () => baseMonth === 11 ? (setBaseMonth(0),  setBaseYear(y => y+1)) : setBaseMonth(m => m+1);

  return (
    <div className="mb-4 bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-brand text-sm">📅</span>
          <h2 className="font-display text-[14px] font-bold text-[#222] dark:text-white tracking-[-0.3px]">
            Availability calendar
          </h2>
        </div>
        <div className="flex items-center gap-5 text-[11px] font-display font-bold text-[#777] dark:text-[#aaa]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand/20 dark:bg-[#3D1A14] inline-block" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#E5E5E5] dark:bg-[#333] inline-block" />
            Available
          </span>
        </div>
      </div>
      <p className="font-body text-[12px] font-medium text-[#777] dark:text-[#aaa] mb-6">
        Dates blocked out are confirmed bookings approved by ops.
      </p>

      <div className="flex items-start justify-center gap-3">
        <button onClick={prev} className="mt-1 w-7 h-7 flex items-center justify-center text-[#777] hover:text-[#222] dark:hover:text-white text-lg font-display font-bold">‹</button>

        <div className="flex gap-8">
          {months.map(({ month, year }) => {
            const label    = new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
            const firstDay = new Date(year, month, 1).getDay();
            const daysIn   = new Date(year, month+1, 0).getDate();
            const prevDays = new Date(year, month, 0).getDate();
            const booked   = BOOKED[`${year}-${month}`] || [];
            const totalCells = Math.ceil((firstDay + daysIn) / 7) * 7;

            return (
              <div key={`${year}-${month}`} className="w-[220px]">
                <p className="font-display text-[11px] font-bold text-[#222] dark:text-white text-center mb-3 uppercase tracking-[0.06em]">
                  {label}
                </p>
                <div className="grid grid-cols-7 text-center mb-1">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                    <div key={d} className="font-display text-[10px] font-bold text-[#AAAAAA] py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 text-center gap-y-0.5">
                  {Array(totalCells).fill(null).map((_, i) => {
                    const n   = i - firstDay + 1;
                    const cur = n >= 1 && n <= daysIn;
                    const bkd = cur && booked.includes(n);
                    const num = cur ? n : n < 1 ? prevDays+n : n-daysIn;
                    return (
                      <div
                        key={i}
                        className={`font-display text-[11px] font-semibold py-1.5 rounded-[6px] cursor-pointer transition-colors ${
                          !cur ? "text-[#CCCCCC] dark:text-[#444]"
                          : bkd ? "bg-brand/10 dark:bg-[#3D1A14] text-brand dark:text-[#C84B2F]"
                          : "text-[#222] dark:text-[#ccc] hover:bg-[#F2F2F2] dark:hover:bg-[#2a2a2a]"
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={next} className="mt-1 w-7 h-7 flex items-center justify-center text-[#777] hover:text-[#222] dark:hover:text-white text-lg font-display font-bold">›</button>
      </div>
    </div>
  );
}

// ── Listing card ──────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  const { label, classes } = listingStatusConfig[listing.status];

  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] overflow-hidden">
      <div className="h-40 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={listing.image} alt={listing.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        <span className={`absolute top-3 left-3 font-display text-[10px] font-bold px-2.5 py-1 rounded-full ${classes}`}>
          {label}
        </span>
        {listing.status === "active" && (
          <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 font-display text-[11px] font-bold text-[#222] dark:text-white px-2 py-1 rounded-full flex items-center gap-1">
            ★ {listing.rating} <span className="font-body font-normal text-[#777]">({listing.reviews})</span>
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-display font-bold text-[#222] dark:text-white text-[14px] mb-0.5 leading-tight">{listing.name}</p>
        <p className="font-body text-[12px] font-medium text-[#777] dark:text-[#aaa] mb-3">📍 {listing.location}</p>

        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-bold text-[#222] dark:text-white text-[13px]">{listing.price}</p>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-[#E5E5E5] dark:border-[#2a2a2a]">
          {listing.status === "draft" && (
            <button className="flex-1 font-display text-[11px] font-bold bg-brand text-white rounded-full py-1.5 hover:bg-[#C03D24] transition-colors">
              Submit for review
            </button>
          )}
          {listing.status === "pending_review" && (
            <span className="flex-1 font-display text-[11px] font-bold text-[#A05C00] text-center bg-[#FFF8E1] rounded-full py-1.5">
              Under review · ~24hrs
            </span>
          )}
          {listing.status === "active" && (
            <button className="flex-1 font-display text-[11px] font-bold text-[#222] dark:text-white border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-full py-1.5 hover:border-[#888] transition-colors">
              View listing
            </button>
          )}
          {listing.status === "inactive" && (
            <button className="flex-1 font-display text-[11px] font-bold text-brand border border-brand rounded-full py-1.5 hover:bg-[#FDF1EE] transition-colors">
              Re-activate
            </button>
          )}
          <button className="font-display text-[11px] font-bold text-[#777] dark:text-[#aaa] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-full px-3 py-1.5 hover:border-[#888] transition-colors">
            Edit
          </button>
          <button className="font-display text-[11px] font-bold text-[#777] dark:text-[#aaa] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-full px-3 py-1.5 hover:border-[#888] transition-colors">
            📅
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Booking row ───────────────────────────────────────────────────────────────

function BookingRow({ booking }: { booking: Booking }) {
  const { label, classes } = bookingStatusConfig[booking.status];

  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-4 flex items-center gap-4">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-[13px] flex-shrink-0 ${avatarColors[booking.avatarColor]}`}>
        {booking.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[#222] dark:text-white text-[14px] leading-tight">
          {booking.name}
        </p>
        <p className="font-body text-[12px] font-medium text-[#777] dark:text-[#aaa]">
          {booking.listing}
        </p>
        <p className="font-body text-[12px] font-medium text-[#AAAAAA]">
          {booking.checkIn} → {booking.checkOut} · {booking.nights} nights
        </p>
        {booking.status === "paid" && booking.payoutAmount && (
          <p className="font-body text-[11px] font-medium text-[#2E7D32] mt-0.5">
            Payout {formatKES(booking.payoutAmount)} on {booking.payoutDate}
          </p>
        )}
      </div>

      {/* Amount + status badge */}
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
        <p className="font-display font-bold text-[#222] dark:text-white text-[14px]">
          {formatKES(booking.amount)}
        </p>
        <span className={`font-display text-[10px] font-bold px-2.5 py-0.5 rounded-full ${classes}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HostPage() {
  const [activeTab, setActiveTab] = useState<"checkins" | "upcoming">("checkins");

  return (
    <div className="min-h-screen bg-[#F5F4F2] dark:bg-[#0f0f0f]">

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-8 pt-8 pb-5">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-brand mb-2">
          Host Dashboard
        </p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-[32px] font-bold text-[#222] dark:text-white mb-1 leading-tight">
              Karibu, Mary 👋
            </h1>
            <p className="font-body text-[13px] font-medium text-[#777] dark:text-[#aaa]">
              Westlands Skyline Loft · 1 active listing
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button className="font-display text-[13px] font-bold text-[#222] dark:text-white border border-[#CCCCCC] dark:border-white/20 rounded-full px-5 py-2.5 hover:border-[#888] transition-colors flex items-center gap-2">
              👤 View as guest
            </button>
            <button className="font-display text-[13px] font-bold text-white bg-[#222] dark:bg-white dark:text-[#222] rounded-full px-5 py-2.5 hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors flex items-center gap-2">
              + Add listing
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="max-w-6xl mx-auto px-8 mb-2">
        <div className="flex gap-6 border-b border-[#E5E5E5] dark:border-[#2a2a2a]">
          {[
            { key: "checkins", label: "Bookings"  },
            { key: "calendar", label: "Calendar"  },
            { key: "listings", label: "Listings"  },
            { key: "reports",  label: "Reports"   },
            { key: "settings", label: "Settings"  },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "checkins" | "upcoming")}
              className={`font-display text-[13px] font-bold pb-3 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-brand text-brand"
                  : "border-transparent text-[#777] dark:text-[#aaa] hover:text-[#222] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.07em] text-[#777] dark:text-[#aaa]">
                  {s.label}
                </p>
                <span className="text-base">{s.icon}</span>
              </div>
              <p className="font-display text-[22px] font-bold text-[#222] dark:text-white mb-1 leading-tight">
                {s.value}
              </p>
              <p className={`font-body text-[12px] font-medium ${s.trendUp ? "text-[#2E7D32]" : "text-[#777] dark:text-[#aaa]"}`}>
                {s.trend}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-8 pb-14">

        {/* Earnings chart */}
        <div className="mb-4 bg-white dark:bg-[#1c1c1c] border border-[#E5E5E5] dark:border-[#2a2a2a] rounded-[16px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-[14px] font-bold text-[#222] dark:text-white tracking-[-0.3px]">
                Earnings this week
              </h2>
              <p className="font-body text-[12px] font-medium text-[#777] dark:text-[#aaa] mt-0.5">
                Income vs payouts (KSh)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-display text-[11px] font-bold text-[#777] dark:text-[#aaa]">
                <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block" />Income
              </span>
              <span className="flex items-center gap-1.5 font-display text-[11px] font-bold text-[#777] dark:text-[#aaa]">
                <span className="w-2.5 h-2.5 rounded-full bg-brand/40 inline-block" />Payouts
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E35336" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#E35336" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F4B3A3" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F4B3A3" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:11, fontFamily:"Quicksand", fontWeight:700, fill:"#AAAAAA" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fontFamily:"Quicksand", fill:"#AAAAAA" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip
                formatter={(value: number) => [`KSh ${value.toLocaleString()}`, ""]}
                contentStyle={{ background:"#1c1c1c", border:"1px solid #2a2a2a", borderRadius:10, fontSize:12, fontFamily:"Quicksand", color:"#fff" }}
              />
              <Area type="monotone" dataKey="income"  stroke="#E35336" strokeWidth={2} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="payouts" stroke="#F4B3A3" strokeWidth={2} fill="url(#payoutGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Calendar */}
        <CalendarSection />

        {/* ── My Listings ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-[16px] font-bold text-[#222] dark:text-white tracking-[-0.3px]">
                My listings
              </h2>
              <p className="font-body text-[12px] font-medium text-[#777] dark:text-[#aaa] mt-0.5">
                {listings.filter(l => l.status === "active").length} active ·{" "}
                {listings.filter(l => l.status === "pending_review").length} under review ·{" "}
                {listings.filter(l => l.status === "draft").length} draft
              </p>
            </div>
            <button className="font-display text-[13px] font-bold text-white bg-brand rounded-full px-4 py-2 hover:bg-[#C03D24] transition-colors flex items-center gap-1.5">
              + Add new listing
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}

            {/* Upload card */}
            <div className="bg-white dark:bg-[#1c1c1c] border-2 border-dashed border-[#CCCCCC] dark:border-[#333] rounded-[16px] flex flex-col items-center justify-center h-[220px] cursor-pointer hover:border-brand dark:hover:border-brand transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#F2F2F2] dark:bg-[#2a2a2a] flex items-center justify-center group-hover:bg-[#FDF1EE] dark:group-hover:bg-[#3D1A14] transition-colors mb-3">
                <span className="text-[#CCCCCC] dark:text-[#444] group-hover:text-brand text-xl transition-colors">+</span>
              </div>
              <p className="font-display font-bold text-[#AAAAAA] dark:text-[#555] text-[13px]">Add new listing</p>
              <p className="font-body text-[11px] font-medium text-[#AAAAAA] dark:text-[#555] mt-1">Photos, location, rules & payout</p>
            </div>
          </div>
        </div>

        {/* ── Upcoming Bookings ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-[16px] font-bold text-[#222] dark:text-white tracking-[-0.3px]">
                Upcoming bookings
              </h2>
              <p className="font-body text-[12px] font-medium text-[#777] dark:text-[#aaa] mt-0.5">
                {bookings.length} bookings
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F2F2F2] dark:bg-[#2a2a2a] rounded-full p-1">
              {[
                { key: "checkins", label: "Today's check-ins" },
                { key: "upcoming", label: "Upcoming" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as "checkins" | "upcoming")}
                  className={`font-display text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                    activeTab === t.key
                      ? "bg-white dark:bg-[#1c1c1c] text-[#222] dark:text-white shadow-sm"
                      : "text-[#777] dark:text-[#aaa] hover:text-[#222] dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {bookings.map(b => (
              <BookingRow key={b.name} booking={b} />
            ))}
          </div>
        </div>

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
