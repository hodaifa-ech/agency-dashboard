'use client'

import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UsageCounterProps {
  initialCount: number;
}

export default function UsageCounter({ initialCount }: UsageCounterProps) {
  const count = initialCount;
  const remainingViews = 50 - count;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{count} / 50</p>
            <p className="text-xs text-muted-foreground">
              {remainingViews} remaining
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

