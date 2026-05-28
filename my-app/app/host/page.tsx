"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { label: "This month",     value: "KSh 54,200",  trend: "+18% vs last",   trendUp: true,  icon: "📈" },
  { label: "Bookings",       value: "12",           trend: "3 upcoming",     trendUp: false, icon: "📅" },
  { label: "Payout pending", value: "KSh 28,350",  trend: "Releases May 14",trendUp: false, icon: "💳" },
  { label: "Avg. rating",    value: "4.92",         trend: "from 184 stays", trendUp: false, icon: "⭐" },
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

const listings = [
  {
    name: "Westlands Skyline Loft",
    location: "Westlands",
    price: "KSh 4,500/night",
    status: "LIVE",
    live: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
  },
  {
    name: "Kileleshwa Sky Apartment",
    location: "Kileleshwa",
    price: "",
    status: "PENDING REVIEW",
    live: false,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
  },
];

const bookings = [
  { initials: "W", name: "Wanjiku K.",  listing: "Kilimani Sunset Studio",  dates: "May 09 → May 12 · 3 nights", amount: "KSh 10,560", status: "approved pay",  payout: null },
  { initials: "B", name: "Brian M.",    listing: "Karen Garden Cottage",    dates: "May 14 → May 18 · 4 nights", amount: "KSh 34,320", status: "paid",           payout: "Payout KSh 30,888 on May 18" },
  { initials: "A", name: "Aisha N.",    listing: "Westlands Skyline Loft",  dates: "Apr 22 → Apr 24 · 2 nights", amount: "KSh 9,900",  status: "completed",      payout: null },
];

// ── Calendar ──────────────────────────────────────────────────────────────────

function CalendarSection() {
  const [baseMonth, setBaseMonth] = useState(4);
  const [baseYear,  setBaseYear]  = useState(2026);

  const months = [
    { month: baseMonth,               year: baseYear },
    { month: (baseMonth+1) % 12,      year: baseMonth === 11 ? baseYear+1 : baseYear },
  ];

  const prev = () => baseMonth === 0 ? (setBaseMonth(11), setBaseYear(y=>y-1)) : setBaseMonth(m=>m-1);
  const next = () => baseMonth === 11? (setBaseMonth(0),  setBaseYear(y=>y+1)) : setBaseMonth(m=>m+1);

  return (
    <div className="mb-4 bg-white dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-brand text-sm">📅</span>
          <h2 className="font-display text-base font-bold text-dark dark:text-white">Availability calendar</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#777] dark:text-[#aaa]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand/30 dark:bg-[#3D1A14] inline-block" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#e5e5e5] dark:bg-[#333] inline-block" />
            Available
          </span>
        </div>
      </div>
      <p className="text-xs text-[#777] dark:text-[#aaa] mb-6">
        Dates blocked out are confirmed bookings approved by ops.
      </p>

      {/* Calendars */}
      <div className="flex items-start justify-center gap-3">
        <button onClick={prev} className="mt-1 w-7 h-7 flex items-center justify-center text-[#777] hover:text-dark dark:hover:text-white text-lg">‹</button>

        <div className="flex gap-8">
          {months.map(({ month, year }) => {
            const label      = new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
            const firstDay   = new Date(year, month, 1).getDay();
            const daysIn     = new Date(year, month+1, 0).getDate();
            const prevDays   = new Date(year, month,   0).getDate();
            const booked     = BOOKED[`${year}-${month}`] || [];
            const totalCells = Math.ceil((firstDay + daysIn) / 7) * 7;

            return (
              <div key={`${year}-${month}`} className="w-[220px]">
                <p className="font-display text-xs font-bold text-dark dark:text-white text-center mb-3">{label}</p>
                <div className="grid grid-cols-7 text-center mb-1">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
                    <div key={d} className="font-display text-[10px] font-bold text-[#aaa] py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 text-center gap-y-0.5">
                  {Array(totalCells).fill(null).map((_,i) => {
                    const n  = i - firstDay + 1;
                    const cur = n >= 1 && n <= daysIn;
                    const bkd = cur && booked.includes(n);
                    const num = cur ? n : n < 1 ? prevDays+n : n-daysIn;
                    return (
                      <div key={i} className={`font-display text-[11px] font-semibold py-1.5 rounded-md cursor-pointer transition-colors
                        ${!cur  ? "text-[#ccc] dark:text-[#444]"
                        : bkd  ? "bg-brand/10 dark:bg-[#3D1A14] text-brand dark:text-[#C84B2F]"
                        :        "text-dark dark:text-[#ccc] hover:bg-[#f2f2f2] dark:hover:bg-[#2a2a2a]"}`}>
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={next} className="mt-1 w-7 h-7 flex items-center justify-center text-[#777] hover:text-dark dark:hover:text-white text-lg">›</button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HostPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F2] dark:bg-[#0f0f0f]">

      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-8 pt-8 pb-4">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-brand mb-2">Host dashboard</p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#222] dark:text-white mb-1">Karibu, Mary 👋</h1>
            <p className="text-[#777] dark:text-[#aaa] text-sm">Westlands Skyline Loft · 1 active listing</p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button className="font-display text-sm font-bold text-[#222] dark:text-white border border-[#ccc] dark:border-white/20 rounded-full px-5 py-2 hover:border-[#888] transition-colors flex items-center gap-2">
              👤 View as guest
            </button>
            <button className="font-display text-sm font-bold text-white bg-[#222] dark:bg-white dark:text-[#222] rounded-full px-5 py-2 hover:bg-[#333] dark:hover:bg-[#e5e5e5] transition-colors flex items-center gap-2">
              + Add new listing
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-7xl mx-auto px-8 py-4">

        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-[#777] dark:text-[#aaa]">{s.label}</p>
                <span className="text-brand text-base">{s.icon}</span>
              </div>
              <p className="font-display text-2xl font-bold text-[#222] dark:text-white mb-1">{s.value}</p>
              <p className={`text-xs font-medium ${s.trendUp ? "text-brand" : "text-[#777] dark:text-[#aaa]"}`}>{s.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
     <div className="max-w-7xl mx-auto px-8 pb-12">

        {/* Earnings chart */}
        <div className="mb-4 bg-white dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-display text-base font-bold text-[#222] dark:text-white">Earnings this week</h2>
              <p className="text-xs text-[#777] dark:text-[#aaa] mt-0.5">Income vs payouts (KSh)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#777] dark:text-[#aaa]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand inline-block"/>Income</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand/40 inline-block"/>Payouts</span>
            </div>
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E35336" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#E35336" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F4B3A3" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#F4B3A3" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize:11, fontFamily:"Quicksand", fill:"#777" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fontFamily:"Quicksand", fill:"#777" }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`KSh ${value.toLocaleString()}`, ""]}
                  contentStyle={{ background:"#1c1c1c", border:"1px solid #2a2a2a", borderRadius:10, fontSize:12, fontFamily:"Quicksand", color:"#fff" }}
                />
                <Area type="monotone" dataKey="income"  stroke="#E35336" strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="payouts" stroke="#F4B3A3" strokeWidth={2} fill="url(#payoutGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar */}
        <CalendarSection />

        {/* My listings */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-[#222] dark:text-white">My listings</h2>
            <button className="font-display text-sm font-bold text-brand hover:text-brand-dark transition-colors">+ Upload new</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {listings.map(l => (
              <div key={l.name} className="bg-white dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
                <div className="h-40 relative overflow-hidden">
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-xs font-display font-bold px-2.5 py-1 rounded-full ${l.live ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFF8E1] text-[#A05C00]"}`}>
                    {l.status}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display font-bold text-[#222] dark:text-white text-sm mb-1">{l.name}</p>
                  <p className="text-[#777] dark:text-[#aaa] text-xs mb-2">📍 {l.location}</p>
                  {l.price ? (
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-[#222] dark:text-white text-sm">{l.price}</p>
                      <button className="font-display text-xs font-bold text-brand">View</button>
                    </div>
                  ) : (
                    <p className="text-[#777] dark:text-[#aaa] text-xs">Submitted 2h ago · live within 24h</p>
                  )}
                </div>
              </div>
            ))}

            {/* Upload card */}
            <div className="bg-white dark:bg-[#1c1c1c] border-2 border-dashed border-[#ccc] dark:border-[#333] rounded-2xl flex flex-col items-center justify-center h-48 cursor-pointer hover:border-brand dark:hover:border-brand transition-colors group">
              <span className="text-[#ccc] dark:text-[#444] group-hover:text-brand text-3xl mb-2 transition-colors">+</span>
              <p className="font-display font-bold text-[#aaa] dark:text-[#555] text-sm">Upload new listing</p>
              <p className="text-[#aaa] dark:text-[#555] text-xs mt-1">Photos, location, rules & payout</p>
            </div>
          </div>
        </div>

        {/* Upcoming bookings */}
        <div className="mb-6">
          <h2 className="font-display text-lg font-bold text-[#222] dark:text-white mb-4">Upcoming bookings</h2>
          <div className="flex flex-col gap-3">
            {bookings.map(b => (
              <div key={b.name} className="bg-white dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e5e5e5] dark:bg-[#2a2a2a] flex items-center justify-center font-display font-bold text-[#222] dark:text-white text-sm flex-shrink-0">
                  {b.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[#222] dark:text-white text-sm">{b.name}</p>
                  <p className="text-[#777] dark:text-[#aaa] text-xs">{b.listing}</p>
                  <p className="text-[#777] dark:text-[#aaa] text-xs">{b.dates}</p>
                  {b.payout && (
                    <span className="inline-block mt-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold font-display px-3 py-1 rounded-full">
                      {b.payout}
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-bold text-[#222] dark:text-white text-sm">{b.amount}</p>
                  <p className="text-[#777] dark:text-[#aaa] text-xs capitalize">{b.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#e5e5e5] dark:border-[#2a2a2a] py-5">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex gap-6 text-xs text-[#777] dark:text-[#aaa]">
            <span>Guest</span><span>Host</span><span>Ops</span><span>Admin</span>
          </div>
          <p className="text-xs text-[#777] dark:text-[#aaa]">© 2026 Nairobi Spaces · Mogoa Labs · Prototype simulation</p>
          <div className="flex gap-4 text-xs text-[#777] dark:text-[#aaa]">
            <span>About</span><span>Help</span><span>Trust & Safety</span>
          </div>
        </div>
      </div>

    </div>
  );
}
