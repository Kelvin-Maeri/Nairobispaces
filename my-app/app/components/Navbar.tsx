"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const roles = [
  { label: "Guest", href: "/" },
  { label: "Host", href: "/host" },
  { label: "Ops", href: "/ops" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-dark-7 px-6 h-[58px] flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
          <span className="font-display font-bold text-lg text-white">N</span>
        </div>
        <span className="font-display font-bold text-base text-dark tracking-wide">
          NAIROBI SPACES
        </span>
      </div>

      {/* Role tabs */}
      <div className="flex items-center gap-6">
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className={`font-body text-sm font-medium transition-colors ${
              pathname === role.href
                ? "text-brand font-semibold"
                : "text-dark-3 hover:text-dark"
            }`}
          >
            {role.label}
          </Link>
        ))}
      </div>

      {/* User avatar */}
      <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center cursor-pointer">
        <span className="font-display font-bold text-sm text-white">OP</span>
      </div>

    </nav>
  );
}