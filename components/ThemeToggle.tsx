'use client'

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <Moon className="h-4 w-4 text-slate-300" />
        <span className="text-sm font-medium text-slate-300">Dark Mode</span>
      </div>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out
          ${isDark ? "bg-blue-600" : "bg-slate-700"}
        `}
        role="switch"
        aria-checked={isDark}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md
            ${isDark ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}

