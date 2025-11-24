'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  mobile?: boolean;
  isCollapsed?: boolean;
}

export default function Navigation({ mobile = false, isCollapsed = false }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/agencies", label: "Agencies", icon: Building2 },
    { href: "/contacts", label: "Contacts", icon: Users },
  ];

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
              isCollapsed ? "justify-center" : "gap-3",
              isActive
                ? "bg-slate-700 text-white font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

