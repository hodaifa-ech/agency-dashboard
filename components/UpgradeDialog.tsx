'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Infinity } from "lucide-react";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const features = [
    {
      icon: Infinity,
      text: "Unlimited contact views per day",
    },
    {
      icon: Zap,
      text: "Priority support and faster response times",
    },
    {
      icon: Sparkles,
      text: "Advanced search and filtering options",
    },
    {
      icon: Check,
      text: "Export contacts to CSV/Excel",
    },
  ];

  const handleUpgrade = () => {
    // TODO: Implement upgrade logic
    console.log("Upgrade to Premium clicked");
    // You can redirect to a payment page or handle the upgrade flow here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-3">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You've reached your daily limit of 50 views. Upgrade to Premium to unlock unlimited access and exclusive features!
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-foreground">{feature.text}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-3xl font-bold text-foreground">$29<span className="text-lg text-muted-foreground">/month</span></p>
            <p className="text-sm text-muted-foreground mt-1">Cancel anytime</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white border-0"
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

