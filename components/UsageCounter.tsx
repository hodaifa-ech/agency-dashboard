'use client'

import { Eye } from "lucide-react";

import { cn } from "@/lib/utils";

interface UsageCounterProps {
  initialCount: number;
  variant?: "compact" | "dashboard";
}

export default function UsageCounter({
  initialCount,
  variant = "compact",
}: UsageCounterProps) {
  const count = Math.max(0, initialCount);
  const remainingViews = Math.max(0, 50 - count);
  const progress = Math.min(100, (count / 50) * 100);

  const containerClasses = cn(
    "relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-lg",
    variant === "dashboard" ? "p-6 min-h-[200px]" : "p-4"
  );

  const counterClasses =
    variant === "dashboard"
      ? "text-5xl font-semibold leading-tight"
      : "text-3xl font-semibold";

  return (
    <div className={containerClasses}>
      <div className="absolute inset-0 opacity-40">
        <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-6 h-32 w-32 rounded-full bg-emerald-400/40 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm uppercase tracking-wide text-white/80">
          <span className="inline-flex items-center gap-2 text-xs font-medium">
            <Eye className="h-4 w-4" />
            Views today
          </span>
          <span>{progress.toFixed(0)}% used</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={counterClasses}>{count}</p>
            <p className="text-sm uppercase text-white/70">of 50</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{remainingViews} left</p>
            <p className="text-xs uppercase tracking-wider text-white/70">
              remaining views
            </p>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        {variant === "dashboard" && (
          <p className="text-xs text-white/80">
            Keep discovering agencies and contacts. Upgrade to premium for
            unlimited daily reveals.
          </p>
        )}
      </div>
    </div>
  );
}

