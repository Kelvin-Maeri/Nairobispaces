"use client";

import { useState } from "react";

const stats = [
  {
    label: "THIS MONTH",
    value: "Ksh 87,500",
    trend: "+18% vs last",
    trendType: "up",
    icon: "📈",
  },
  {
    label: "BOOKINGS",
    value: "12",
    trend: "3 upcoming",
    trendType: "neutral",
    icon: "📅",
  },
  {
    label: "PAYOUT PENDING",
    value: "Ksh 19,500",
    trend: "Releases May 14",
    trendType: "neutral",
    icon: "💳",
  },
  {
    label: "AVG. RATING",
    value: "4.92",
    trend: "from 184 stays",
    trendType: "neutral",
    icon: "⭐",
  },
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

export default function HostPage() {
  const [activeTab, setActiveTab] = useState("Bookings");

  return (
    <div className="min-h-screen bg-dark">

      {/* Host navbar */}
      <div className="bg-dark border-b border-white/10 px-6 h-[58px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
            <span className="font-display font-bold text-lg text-white">N</span>
          </div>
          <span className="font-display font-bold text-base text-white tracking-wide">
            NAIROBI SPACES{" "}
            <span className="text-xs font-medium text-dark-4 ml-1">Host</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="font-display text-sm font-bold text-white border border-dark-6 rounded-full px-4 py-2">
            View as guest
          </button>
          <button className="font-display text-sm font-bold text-white bg-brand rounded-full px-4 py-2">
            + Add new listing
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 pt-8 pb-6">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-brand mb-2">
          Host Dashboard
        </p>
        <h1 className="font-display text-4xl font-bold text-white mb-1">
          Karibu, Mary 👋
        </h1>
        <p className="text-dark-5 text-sm">
          Westlands Skyline Loft · 1 active listing
        </p>
      </div>

      {/* Stats row */}
      <div className="px-6 grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-dark-2 rounded-lg p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-dark-5">
                {stat.label}
              </p>
              <span className="text-brand text-base">{stat.icon}</span>
            </div>
            <p className="font-display text-3xl font-bold text-white mb-1">
              {stat.value}
            </p>
            <p className={`text-xs font-medium ${stat.trendType === "up" ? "text-brand" : "text-dark-5"}`}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* My listings */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white">My listings</h2>
          <button className="font-display text-sm font-bold text-brand">+ Upload new</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div key={listing.name} className="bg-dark-2 rounded-lg border border-white/10 overflow-hidden">
              <div className="h-40 relative overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 left-3 text-xs font-display font-bold px-2 py-1 rounded-full ${
                  listing.statusType === "live"
                    ? "bg-success-bg text-success-ink"
                    : "bg-pending-bg text-pending-ink"
                }`}>
                  {listing.status}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display font-bold text-white text-sm mb-1">{listing.name}</p>
                <p className="text-dark-5 text-xs mb-2">📍 {listing.location}</p>
                {listing.price ? (
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-white text-sm">{listing.price}</p>
                    <button className="text-brand text-xs font-bold font-display">View</button>
                  </div>
                ) : (
                  <p className="text-dark-5 text-xs">{listing.sub}</p>
                )}
              </div>
            </div>
          ))}

          {/* Upload new card */}
          <div className="bg-dark-2 rounded-lg border border-dashed border-dark-5 flex flex-col items-center justify-center h-48 cursor-pointer hover:border-brand transition-colors">
            <span className="text-dark-5 text-3xl mb-2">+</span>
            <p className="font-display font-bold text-dark-5 text-sm">Upload new listing</p>
            <p className="text-dark-5 text-xs mt-1">Photos, location, rules & payout</p>
          </div>
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="px-6 mb-10">
        <h2 className="font-display text-lg font-bold text-white mb-4">Upcoming bookings</h2>
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <div key={booking.name} className="bg-dark-2 rounded-lg border border-white/10 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-3 flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
                {booking.initials}
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-white text-sm">{booking.name}</p>
                <p className="text-dark-5 text-xs">{booking.listing}</p>
                <p className="text-dark-5 text-xs">{booking.dates}</p>
                {booking.payout && (
                  <span className="inline-block mt-1 bg-success-bg text-success-ink text-xs font-bold font-display px-3 py-1 rounded-full">
                    {booking.payout}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-white text-sm">{booking.amount}</p>
                <p className="text-dark-5 text-xs">{booking.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
        <p className="text-dark-5 text-xs">© 2026 Nairobi Spaces · Mogoa Labs · Prototype simulation</p>
        <div className="flex gap-4 text-dark-5 text-xs">
          <span>About</span>
          <span>Help</span>
          <span>Trust & Safety</span>
        </div>
      </div>

    </div>
  );
}