"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site";

// On the home page these are plain hash links, so MotionScope can scroll to
// the section's layout position; elsewhere they navigate home first.
export function FooterNav() {
  const isHome = usePathname() === "/";
  const className = "text-fg-muted transition-colors hover:text-fg";

  return (
    <ul className="space-y-2">
      {navItems.map((item) => (
        <li key={item.id}>
          {isHome ? (
            <a href={`#${item.id}`} className={className}>
              {item.label}
            </a>
          ) : (
            <Link href={`/#${item.id}`} className={className}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
