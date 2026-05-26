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

const stats = [
  { label: "THIS MONTH", value: "Ksh 87,500", trend: "+18% vs last", trendType: "up", icon: "📈" },
  { label: "BOOKINGS", value: "12", trend: "3 upcoming", trendType: "neutral", icon: "📅" },
  { label: "PAYOUT PENDING", value: "Ksh 19,500", trend: "Releases May 14", trendType: "neutral", icon: "💳" },
  { label: "AVG. RATING", value: "4.92", trend: "from 184 stays", trendType: "neutral", icon: "⭐" },
];

const listings = [
  {
    name: "Westlands Skyline Loft",
    location: "Westlands",
    price: "Ksh 4,200/night",
    status: "LIVE",
    statusType: "live",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    sub: "",
  },
  {
    name: "Kileleshwa Sky Apartment",
    location: "Kileleshwa",
    price: "",
    status: "PENDING REVIEW",
    statusType: "pending",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
    sub: "Submitted 2h ago · live within 24h",
  },
];

const bookings = [
  {
    initials: "W",
    name: "Wanjiku K.",
    listing: "Kilimani Sunset Studio",
    dates: "May 09 → May 12 · 3 nights",
    amount: "Ksh 8,100",
    status: "Approved Pay",
    payout: null,
  },
  {
    initials: "B",
    name: "Brian M.",
    listing: "Karen Garden Cottage",
    dates: "May 14 → May 18 · 4 nights",
    amount: "Ksh 26,400",
    status: "Paid",
    payout: "Payout Ksh 23,800 on May 18",
  },
  {
    initials: "A",
    name: "Aisha N.",
    listing: "Westlands Skyline Loft",
    dates: "Apr 22 → Apr 24 · 2 nights",
    amount: "Ksh 7,600",
    status: "Completed",
    payout: null,
  },
];

const tabs = ["Bookings", "Calendar", "Listings", "Reports", "Settings"];
const chartData = [
  { day: "M", income: 6800, payouts: 3500 },
  { day: "T", income: 7200, payouts: 4000 },
  { day: "W", income: 6500, payouts: 3200 },
  { day: "T", income: 9000, payouts: 5500 },
  { day: "F", income: 10500, payouts: 7000 },
  { day: "S", income: 14000, payouts: 9500 },
  { day: "S", income: 10000, payouts: 6800 },
];
const BOOKED: Record<string, number[]> = {
  "2026-4": [9,10,11,14,15,16,17,22,23,24,27,28,29,30],
  "2026-5": [3,4,5,11,12,13],
};

function CalendarSection() {
  const [baseMonth, setBaseMonth] = useState(4); // 0-indexed, 4 = May
  const [baseYear, setBaseYear] = useState(2026);

  const months = [
    { month: baseMonth, year: baseYear },
    { month: baseMonth + 1 > 11 ? 0 : baseMonth + 1, year: baseMonth + 1 > 11 ? baseYear + 1 : baseYear },
  ];

  const prev = () => {
    if (baseMonth === 0) { setBaseMonth(11); setBaseYear(y => y - 1); }
    else setBaseMonth(m => m - 1);
  };

  const next = () => {
    if (baseMonth === 11) { setBaseMonth(0); setBaseYear(y => y + 1); }
    else setBaseMonth(m => m + 1);
  };

  return (
    <div className="mb-8 bg-white dark:bg-dark-2 rounded-lg border border-dark-7 dark:border-white/10 p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-brand text-sm">📅</span>
          <h2 className="font-display text-base font-bold text-dark dark:text-white">
            Availability calendar
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-5">
            <span className="w-3 h-3 rounded-sm bg-[#3D1A14] inline-block" />
            Booked
          </span>
          <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-5">
            <span className="w-3 h-3 rounded-sm bg-dark-7 dark:bg-dark-4 inline-block" />
            Available
          </span>
        </div>
      </div>
      <p className="text-xs text-dark-4 dark:text-dark-5 mb-5">
        Dates blocked out are confirmed bookings approved by ops.
      </p>

      <div className="flex items-start justify-center gap-2">
        {/* Left arrow */}
        <button onClick={prev} className="mt-2 w-7 h-7 flex items-center justify-center text-dark-4 dark:text-dark-5 hover:text-dark dark:hover:text-white text-lg font-bold">
          ‹
        </button>

        {/* Two calendars */}
        <div className="flex gap-8">
          {months.map(({ month, year }) => {
            const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const prevMonthDays = new Date(year, month, 0).getDate();
            const booked = BOOKED[`${year}-${month}`] || [];
            const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
return (
              <div key={`${year}-${month}`} className="w-[220px] bg-dark-8 dark:bg-black rounded-lg p-3">
                <p className="font-display text-xs font-bold text-dark dark:text-white text-center mb-3">
                  {monthName}
                </p>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                    <div key={d} className="font-display text-[10px] font-bold text-dark-4 dark:text-dark-5 py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {Array(totalCells).fill(null).map((_, i) => {
                    const dayNum = i - firstDay + 1;
                    const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                    const isBooked = isCurrentMonth && booked.includes(dayNum);
                    const displayNum = isCurrentMonth
                      ? dayNum
                      : dayNum < 1
                      ? prevMonthDays + dayNum
                      : dayNum - daysInMonth;

                    return (
                      <div
                        key={i}
                        className={`font-display text-[11px] font-semibold py-1.5 rounded-md cursor-pointer transition-colors ${
                          !isCurrentMonth
                            ? "text-dark-6 dark:text-dark-4"
                            : isBooked
                           ? "bg-brand-light dark:bg-[#3D1A14] text-brand dark:text-[#C84B2F]"
                            : "text-dark-2 dark:text-dark-5 hover:bg-dark-8 dark:hover:bg-dark-3"
                        }`}
                      >
                        {displayNum}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button onClick={next} className="mt-2 w-7 h-7 flex items-center justify-center text-dark-4 dark:text-dark-5 hover:text-dark dark:hover:text-white text-lg font-bold">
          ›
        </button>
      </div>
    </div>
  );
}

export default function HostPage() {
  const [activeTab, setActiveTab] = useState("Bookings");

  return (
    <div className="min-h-screen bg-page dark:bg-dark">

      

     {/* Hero */}
      <div className="bg-white border-b border-dark-7 px-6 pt-6 pb-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-brand mb-2">
              Host Dashboard
            </p>
            <h1 className="font-display text-3xl font-bold text-dark mb-1">
              Karibu, Mary 👋
            </h1>
            <p className="text-dark-4 text-sm">
              Westlands Skyline Loft · 1 active listing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="font-display text-sm font-bold text-dark border border-dark-6 rounded-full px-4 py-2 flex items-center gap-2 hover:border-dark-3 transition-colors">
              👤 View as guest
            </button>
            <button className="font-display text-sm font-bold text-white bg-dark rounded-full px-4 py-2 hover:bg-dark-2 transition-colors">
              + Add new listing
            </button>
          </div>
        </div>
      </div>

     {/* Tabs */}
<div className="bg-white dark:bg-dark-2 border-b border-dark-7 dark:border-white/10 px-6">
  <div className="max-w-5xl mx-auto flex gap-6">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`font-display text-sm font-semibold py-4 border-b-2 transition-colors ${
          activeTab === tab
            ? "border-brand text-brand"
            : "border-transparent text-dark-4 hover:text-dark dark:hover:text-white"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
</div> 

      {/* Stats row */}
      <div className="bg-white dark:bg-dark-2 border-b border-dark-7 dark:border-white/10 px-6 py-5">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-dark-8 dark:bg-dark-3 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-dark-4 dark:text-dark-5">
                  {stat.label}
                </p>
                <span className="text-brand text-base">{stat.icon}</span>
              </div>
              <p className="font-display text-2xl font-bold text-dark dark:text-white mb-1">
                {stat.value}
              </p>
              <p className={`text-xs font-medium ${stat.trendType === "up" ? "text-brand" : "text-dark-4 dark:text-dark-5"}`}>
                {stat.trend}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Earnings chart */}
<div className="mb-8 bg-white dark:bg-dark-2 rounded-lg border border-dark-7 dark:border-white/10 p-6">
  <div className="flex items-center justify-between mb-1">
    <h2 className="font-display text-base font-bold text-dark dark:text-white">
      Earnings this week
    </h2>
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-5">
        <span className="w-2.5 h-2.5 rounded-sm bg-brand inline-block" />
        Income
      </span>
      <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-5">
        <span className="w-2.5 h-2.5 rounded-sm bg-brand/30 inline-block" />
        Payouts
      </span>
    </div>
  </div>
  <p className="text-xs text-dark-4 dark:text-dark-5 mb-4">Income vs payouts (KSh)</p>
  <ResponsiveContainer width="100%" height={180}>
  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
    <defs>
      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#E35336" stopOpacity={0.5} />
        <stop offset="95%" stopColor="#E35336" stopOpacity={0.05} />
      </linearGradient>
      <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#F4B3A3" stopOpacity={0.4} />
        <stop offset="95%" stopColor="#F4B3A3" stopOpacity={0.05} />
      </linearGradient>
    </defs>
    <CartesianGrid
      strokeDasharray="3 3"
     stroke="rgba(0,0,0,0.08)"
      vertical={false}
    />
    <XAxis
      dataKey="day"
      tick={{ fontSize: 11, fontFamily: "Quicksand", fill: "#777" }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      tick={{ fontSize: 10, fontFamily: "Quicksand", fill: "#777" }}
      axisLine={false}
      tickLine={false}
      tickFormatter={(v) => `${v / 1000}k`}
    />
    <Tooltip
      formatter={(value: number) => [`KSh ${value.toLocaleString()}`, ""]}
      contentStyle={{
        background: "#222",
        border: "none",
        borderRadius: 8,
        fontSize: 12,
        fontFamily: "Quicksand",
        color: "#fff",
      }}
    />
    <Area
      type="monotone"
      dataKey="income"
      stroke="#E35336"
      strokeWidth={2}
      fill="url(#incomeGrad)"
    />
    <Area
      type="monotone"
      dataKey="payouts"
      stroke="#F4B3A3"
      strokeWidth={2}
      fill="url(#payoutGrad)"
    />
  </AreaChart>
</ResponsiveContainer>
</div>
{/* Availability calendar */}
<CalendarSection />


        {/* My listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-dark dark:text-white">My listings</h2>
            <button className="font-display text-sm font-bold text-brand">+ Upload new</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.name} className="bg-white dark:bg-dark-2 rounded-lg border border-dark-7 dark:border-white/10 overflow-hidden">
                <div className="h-40 relative overflow-hidden">
                  <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-xs font-display font-bold px-2 py-1 rounded-full ${
                    listing.statusType === "live"
                      ? "bg-success-bg text-success-ink"
                      : "bg-pending-bg text-pending-ink"
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display font-bold text-dark dark:text-white text-sm mb-1">{listing.name}</p>
                  <p className="text-dark-4 dark:text-dark-5 text-xs mb-2">📍 {listing.location}</p>
                  {listing.price ? (
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-dark dark:text-white text-sm">{listing.price}</p>
                      <button className="text-brand text-xs font-bold font-display">View</button>
                    </div>
                  ) : (
                    <p className="text-dark-4 dark:text-dark-5 text-xs">{listing.sub}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Upload new card */}
            <div className="bg-white dark:bg-dark-2 rounded-lg border border-dashed border-dark-5 flex flex-col items-center justify-center h-48 cursor-pointer hover:border-brand transition-colors">
              <span className="text-dark-5 text-3xl mb-2">+</span>
              <p className="font-display font-bold text-dark-4 dark:text-dark-5 text-sm">Upload new listing</p>
              <p className="text-dark-4 dark:text-dark-5 text-xs mt-1">Photos, location, rules & payout</p>
            </div>
          </div>
        </div>

        {/* Upcoming bookings */}
        <div className="mb-10">
          <h2 className="font-display text-lg font-bold text-dark dark:text-white mb-4">Upcoming bookings</h2>
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => (
              <div key={booking.name} className="bg-white dark:bg-dark-2 rounded-lg border border-dark-7 dark:border-white/10 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-dark-7 dark:bg-dark-3 flex items-center justify-center font-display font-bold text-dark dark:text-white text-sm flex-shrink-0">
                  {booking.initials}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-dark dark:text-white text-sm">{booking.name}</p>
                  <p className="text-dark-4 dark:text-dark-5 text-xs">{booking.listing}</p>
                  <p className="text-dark-4 dark:text-dark-5 text-xs">{booking.dates}</p>
                  {booking.payout && (
                    <span className="inline-block mt-1 bg-success-bg text-success-ink text-xs font-bold font-display px-3 py-1 rounded-full">
                      {booking.payout}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-dark dark:text-white text-sm">{booking.amount}</p>
                  <p className="text-dark-4 dark:text-dark-5 text-xs">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-dark-7 dark:border-white/10 px-6 py-4 flex items-center justify-between">
        <p className="text-dark-4 dark:text-dark-5 text-xs">© 2026 Nairobi Spaces · Mogoa Labs · Prototype simulation</p>
        <div className="flex gap-4 text-dark-4 dark:text-dark-5 text-xs">
          <span>About</span>
          <span>Help</span>
          <span>Trust & Safety</span>
        </div>
      </div>

    </div>
  );
}