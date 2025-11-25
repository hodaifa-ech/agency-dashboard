'use client'

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Use resolvedTheme to get the actual theme (handles "system" theme)
  const isDark = resolvedTheme === "dark" || theme === "dark";

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            const newTheme = isDark ? "light" : "dark";
            setTheme(newTheme);
          }}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <Moon className="h-4 w-4 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Dark Mode</span>
      </div>
      <button
        onClick={() => {
          const newTheme = isDark ? "light" : "dark";
          setTheme(newTheme);
        }}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out",
          isDark ? "bg-emerald-600" : "bg-slate-300"
        )}
        role="switch"
        aria-checked={isDark}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md",
            isDark ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

