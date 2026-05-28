"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Browse",    href: "/browse"    },
  { label: "Top areas", href: "/top-areas" },
  { label: "Wishlist",  href: "/wishlist"  },
  { label: "My trips",  href: "/my-trips"  },
  { label: "KYC",       href: "/kyc"       },
];

const roles = [
  { label: "Guest", href: "/"      },
  { label: "Host",  href: "/host"  },
  { label: "Ops",   href: "/ops"   },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setDark(false);
    } else {
      html.classList.add("dark");
      setDark(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1c1c1c] border-b border-[#e5e5e5] dark:border-[#2a2a2a] px-6 h-[58px] flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-brand rounded-[6px] flex items-center justify-center">
          <span className="font-display font-bold text-[18px] text-white leading-none">N</span>
        </div>
        <div>
          <p className="font-display font-bold text-[16px] text-[#222] dark:text-white tracking-[0.5px] leading-tight">
            NAIROBI SPACES
          </p>
          <p className="font-display text-[9px] font-700 text-[#777] dark:text-[#aaa] tracking-[0.1em] uppercase leading-tight">
            Verified · Escrow · M-Pesa
          </p>
        </div>
      </div>

      {/* Main nav links */}
      <div className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-body text-[13px] font-medium transition-colors ${
              pathname === link.href
                ? "text-[#222] dark:text-white font-semibold"
                : "text-[#555] dark:text-[#aaa] hover:text-[#222] dark:hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5 flex-shrink-0">

        {/* View as guest button */}
        <button className="font-display text-[12px] font-bold text-[#222] dark:text-white border border-[#ccc] dark:border-white/20 rounded-full px-3 py-1.5 hover:border-[#888] dark:hover:border-white/40 transition-colors">
          View as guest
        </button>

        {/* Role switcher */}
        <div className="flex items-center bg-[#f2f2f2] dark:bg-[#2a2a2a] rounded-full p-1 gap-0.5">
          {roles.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className={`font-display text-[11px] font-bold px-3 py-1 rounded-full transition-colors ${
                pathname === role.href || (role.href !== "/" && pathname.startsWith(role.href))
                  ? "bg-brand text-white"
                  : "text-[#555] dark:text-[#aaa] hover:text-[#222] dark:hover:text-white"
              }`}
            >
              {role.label}
            </Link>
          ))}
        </div>

        {/* Currency */}
        <button className="font-display text-[12px] font-bold text-[#222] dark:text-white flex items-center gap-1.5 hover:text-brand transition-colors">
          🌐 <span>KES</span>
        </button>

        {/* Settings */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f2f2f2] dark:bg-[#2a2a2a] hover:bg-[#e5e5e5] dark:hover:bg-[#333] transition-colors"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] dark:text-[#aaa]">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f2f2f2] dark:bg-[#2a2a2a] hover:bg-[#e5e5e5] dark:hover:bg-[#333] transition-colors"
          title="Toggle theme"
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] dark:text-[#aaa]">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] dark:text-[#aaa]">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Sign in */}
        <button className="font-display text-[13px] font-bold text-white bg-brand rounded-full px-4 py-2 hover:bg-brand-dark transition-colors tracking-[0.3px]">
          Sign in
        </button>

      </div>
    </nav>
  );
}
