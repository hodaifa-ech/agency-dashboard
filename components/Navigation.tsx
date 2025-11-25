'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  mobile?: boolean;
  isCollapsed?: boolean;
}

export default function Navigation({
  mobile = false,
  isCollapsed = false,
}: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/agencies", label: "Agencies", icon: Building2 },
    { href: "/contacts", label: "Contacts", icon: Users },
  ];

  return (
    <nav className={cn("flex-1 space-y-1", mobile ? "p-4" : "px-3 py-4")}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200",
              isCollapsed ? "justify-center" : "gap-3",
              isActive
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon
              className={cn(
                "h-5 w-5 flex-shrink-0 transition",
                !isActive && "text-emerald-500/70 group-hover:text-emerald-500"
              )}
            />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

